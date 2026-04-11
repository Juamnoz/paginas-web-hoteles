import nodemailer from "nodemailer";
import QRCode from "qrcode";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "aicstudioai@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://fiesta-1y2-mayo-guatape.vercel.app").trim();
const LOGO_URL = `${BASE_URL}/logo-paradise-lake.jpeg`;

// ─── Verification email — Apple style ───────────────────────────────────────

export async function sendVerificationEmail(to: string, name: string, code: string) {
  const digits = code.split("").map(d =>
    `<span style="display:inline-block;width:44px;text-align:center;font-size:32px;font-weight:700;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;">${d}</span>`
  ).join("");

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:48px 16px;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

      <!-- Logo -->
      <tr><td align="center" style="padding-bottom:32px;">
        <img src="${LOGO_URL}" width="56" height="56"
          style="border-radius:14px;display:block;margin:0 auto;"
          alt="Paradise Lake"/>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#111111;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

        <!-- Card body -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:40px 40px 32px;">
            <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;
              font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;
              letter-spacing:-0.5px;">
              Confirma tu email
            </p>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.45);
              font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;
              line-height:1.6;">
              Hola ${name}, usa este código para activar tu cuenta en Paradise Lake.
            </p>
          </td></tr>

          <!-- Divider -->
          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>

          <!-- Code -->
          <tr><td align="center" style="padding:36px 40px;">
            <table cellpadding="0" cellspacing="0">
              <tr><td style="padding:20px 32px;background:#1a1a1a;border-radius:14px;border:1px solid rgba(255,255,255,0.1);">
                ${digits}
              </td></tr>
            </table>
            <p style="margin:16px 0 0;font-size:13px;color:rgba(255,255,255,0.3);
              font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
              Expira en 15 minutos
            </p>
          </td></tr>

          <!-- Divider -->
          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>

          <!-- Event info -->
          <tr><td style="padding:28px 40px 36px;">
            <table cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td style="padding-right:24px;">
                  <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;
                    color:rgba(255,255,255,0.25);
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Evento</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                    Paradise Lake
                  </p>
                </td>
                <td>
                  <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;
                    color:rgba(255,255,255,0.25);
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Fecha</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                    1 y 2 de Mayo
                  </p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding:28px 0 0;">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);
          font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
          Si no creaste esta cuenta, ignora este mensaje.
        </p>
        <p style="margin:8px 0 0;font-size:12px;color:rgba(255,255,255,0.15);
          font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
          La Agencia · AIC Studio
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

  await transporter.sendMail({
    from: '"Paradise Lake" <aicstudioai@gmail.com>',
    to,
    subject: `${code} es tu código de Paradise Lake`,
    html,
  });
}

// ─── Tickets email — Apple style ────────────────────────────────────────────

export type TicketData = {
  ticketId: string;
  personNumber: number;
  totalTickets: number;
  roomType: string;
  roomTitle: string;
  holderName: string;
};

export async function sendTicketsEmail(to: string, name: string, tickets: TicketData[]) {
  const ticketsWithQR = await Promise.all(
    tickets.map(async (t) => {
      const qrData = `PARADISE-LAKE-2025|${t.ticketId}|${t.holderName}|${t.roomType}|${t.personNumber}`;
      const qrBuffer = await QRCode.toBuffer(qrData, {
        width: 200,
        margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      const cid = `qr-${t.ticketId.replace(/[^a-z0-9]/gi, "")}@paradise-lake`;
      return { ...t, qrBuffer, cid };
    })
  );

  const ticketRows = ticketsWithQR.map((t) => `
    <tr><td style="padding-bottom:16px;">
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#111111;border-radius:16px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

        <!-- Ticket header -->
        <tr><td style="padding:16px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <p style="margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;
                color:rgba(255,255,255,0.3);
                font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                Boleta ${t.personNumber} de ${t.totalTickets}
              </p>
              <p style="margin:3px 0 0;font-size:16px;font-weight:700;color:#ffffff;
                font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;
                letter-spacing:-0.3px;">
                ${t.roomTitle}
              </p>
            </td>
            <td align="right">
              <span style="display:inline-block;padding:4px 12px;border-radius:20px;
                background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);
                font-size:11px;font-weight:600;color:rgba(255,255,255,0.7);letter-spacing:0.5px;
                font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                VÁLIDO
              </span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Ticket body -->
        <tr><td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <!-- Info -->
            <td style="vertical-align:top;padding-right:20px;">
              <table cellpadding="0" cellspacing="0">
                <tr><td style="padding-bottom:14px;">
                  <p style="margin:0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
                    color:rgba(255,255,255,0.25);
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Titular</p>
                  <p style="margin:3px 0 0;font-size:14px;font-weight:600;color:#ffffff;
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                    ${t.holderName}
                  </p>
                </td></tr>
                <tr><td style="padding-bottom:14px;">
                  <p style="margin:0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
                    color:rgba(255,255,255,0.25);
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Evento</p>
                  <p style="margin:3px 0 0;font-size:13px;font-weight:500;color:#ffffff;
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                    Techno & Techno House
                  </p>
                </td></tr>
                <tr><td style="padding-bottom:14px;">
                  <p style="margin:0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
                    color:rgba(255,255,255,0.25);
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Fecha</p>
                  <p style="margin:3px 0 0;font-size:13px;font-weight:500;color:#ffffff;
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                    1 y 2 de Mayo 2025
                  </p>
                </td></tr>
                <tr><td>
                  <p style="margin:0;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;
                    color:rgba(255,255,255,0.25);
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Lugar</p>
                  <p style="margin:3px 0 0;font-size:13px;font-weight:500;color:#ffffff;
                    font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                    Paradise Lake · Peñol, Antioquia
                  </p>
                </td></tr>
              </table>
            </td>
            <!-- QR -->
            <td align="center" style="vertical-align:top;">
              <div style="background:#ffffff;padding:8px;border-radius:10px;display:inline-block;">
                <img src="cid:${t.cid}" width="120" height="120" style="display:block;" alt="QR"/>
              </div>
              <p style="margin:8px 0 0;font-size:9px;color:rgba(255,255,255,0.2);
                font-family:monospace;text-align:center;">
                ${t.ticketId.substring(0, 8).toUpperCase()}
              </p>
            </td>
          </tr></table>
        </td></tr>

        <!-- Ticket ID footer -->
        <tr><td style="padding:10px 24px;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="margin:0;font-size:9px;color:rgba(255,255,255,0.15);font-family:monospace;">
            ${t.ticketId}
          </p>
        </td></tr>
      </table>
    </td></tr>`
  ).join("");

  const html = `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:48px 16px;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

      <!-- Logo + header -->
      <tr><td style="padding-bottom:24px;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="background:#111111;border-radius:20px;border:1px solid rgba(255,255,255,0.08);">
          <tr><td align="center" style="padding:36px 40px 32px;">
            <img src="${LOGO_URL}" width="56" height="56"
              style="border-radius:14px;display:block;margin:0 auto 20px;" alt="Paradise Lake"/>
            <p style="margin:0;font-size:11px;letter-spacing:3px;text-transform:uppercase;
              color:rgba(255,255,255,0.35);
              font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
              1 y 2 de Mayo · Guatapé
            </p>
            <h1 style="margin:8px 0 4px;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;
              font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;">
              Paradise Lake
            </h1>
            <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.5);
              font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
              Techno & Techno House · Peñol, Antioquia
            </p>
          </td></tr>
          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>
          <tr><td style="padding:24px 40px 32px;">
            <p style="margin:0;font-size:17px;font-weight:600;color:#ffffff;
              font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;
              letter-spacing:-0.3px;">
              Tus boletas están listas, ${name}.
            </p>
            <p style="margin:6px 0 0;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.6;
              font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
              Presenta el código QR en la entrada. Una boleta por persona, no transferible.
            </p>
          </td></tr>
        </table>
      </td></tr>

      <!-- Tickets -->
      ${ticketRows}

      <!-- Footer -->
      <tr><td align="center" style="padding:20px 0 32px;">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);
          font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
          La Agencia · AIC Studio
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

  await transporter.sendMail({
    from: '"Paradise Lake" <aicstudioai@gmail.com>',
    to,
    subject: `Tus boletas para Paradise Lake — 1 y 2 de Mayo`,
    html,
    attachments: ticketsWithQR.map((t) => ({
      filename: `qr-${t.personNumber}.png`,
      content: t.qrBuffer,
      cid: t.cid,
      contentType: "image/png",
    })),
  });
}

// ─── Welcome / reservation confirmed email ───────────────────────────────────

const fmt = (n: number) => `$${n.toLocaleString("es-CO")}`;

export type ReservationSummary = {
  room_title: string;
  quantity: number;
  total_price: number;
};

export async function sendWelcomeEmail(to: string, name: string, reservations: ReservationSummary[], totalOwed: number) {
  const rows = reservations.map(r => `
    <tr>
      <td style="padding:10px 0;font-size:14px;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;border-bottom:1px solid rgba(255,255,255,0.06);">
        ${r.room_title} <span style="color:rgba(255,255,255,0.4);">×${r.quantity}</span>
      </td>
      <td align="right" style="padding:10px 0;font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;border-bottom:1px solid rgba(255,255,255,0.06);">
        ${fmt(r.total_price)}
      </td>
    </tr>`).join("");

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:48px 16px;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

      <!-- Logo -->
      <tr><td align="center" style="padding-bottom:32px;">
        <img src="${LOGO_URL}" width="56" height="56" style="border-radius:14px;display:block;margin:0 auto;" alt="Paradise Lake"/>
      </td></tr>

      <!-- Card -->
      <tr><td style="background:#111111;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:40px 40px 32px;">
            <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;letter-spacing:-0.5px;">
              ¡Reserva confirmada!
            </p>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.45);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;line-height:1.6;">
              Hola ${name}, tu cuenta está activa y tu reserva quedó guardada.
            </p>
          </td></tr>

          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>

          <!-- Reservation summary -->
          <tr><td style="padding:28px 40px;">
            <p style="margin:0 0 16px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
              Tu reserva
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${rows}
              <tr>
                <td style="padding:14px 0 0;font-size:13px;font-weight:700;color:rgba(255,255,255,0.5);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;">Total</td>
                <td align="right" style="padding:14px 0 0;font-size:18px;font-weight:700;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;">${fmt(totalOwed)}</td>
              </tr>
            </table>
          </td></tr>

          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>

          <!-- CTA -->
          <tr><td style="padding:28px 40px 36px;">
            <p style="margin:0 0 20px;font-size:14px;color:rgba(255,255,255,0.5);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;line-height:1.6;">
              Completa el pago desde tu cuenta para recibir tus boletas con QR.
            </p>
            <table cellpadding="0" cellspacing="0"><tr><td>
              <a href="${BASE_URL}/paradise-lake" style="display:inline-block;padding:14px 28px;background:#ffffff;color:#000000;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                Ir a mi cuenta →
              </a>
            </td></tr></table>
          </td></tr>

          <!-- Event info -->
          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>
          <tr><td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:24px;">
                <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Evento</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Paradise Lake</p>
              </td>
              <td>
                <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Fecha</p>
                <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">1 y 2 de Mayo</p>
              </td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding:28px 0 0;">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">La Agencia · AIC Studio</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

  await transporter.sendMail({
    from: '"Paradise Lake" <aicstudioai@gmail.com>',
    to,
    subject: `¡Reserva confirmada! Paradise Lake — 1 y 2 de Mayo`,
    html,
  });
}

// ─── Reminder email ───────────────────────────────────────────────────────────

export type ReminderType = "8d" | "4d" | "3d";

const REMINDER_CONFIG: Record<ReminderType, { subject: string; headline: string; body: string; urgency: string }> = {
  "8d": {
    subject: "Tu reserva en Paradise Lake está pendiente de pago",
    headline: "Faltan 8 días · No pierdas tu cupo",
    body: "Tienes una reserva confirmada pero el pago aún está pendiente. Los cupos son limitados y se asignan a quienes completen el pago primero.",
    urgency: "Completa tu pago antes del 28 de abril",
  },
  "4d": {
    subject: "⏳ Mañana es el último día para pagar · Paradise Lake",
    headline: "Último aviso de pago",
    body: "Mañana vence el plazo para confirmar tu cupo. Después de esa fecha no podemos garantizar disponibilidad.",
    urgency: "Paga hoy o mañana — vence el 28 de abril",
  },
  "3d": {
    subject: "🚨 Hoy es el último día para pagar · Paradise Lake",
    headline: "Hoy vence el plazo",
    body: "Es el último día para completar tu pago y asegurar tu entrada a Paradise Lake. No dejes pasar esta oportunidad.",
    urgency: "Paga hoy — último día",
  },
};

export async function sendReminderEmail(
  to: string, name: string, totalOwed: number, totalPaid: number, type: ReminderType
) {
  const remaining = totalOwed - totalPaid;
  const cfg = REMINDER_CONFIG[type];

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:48px 16px;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

      <tr><td align="center" style="padding-bottom:32px;">
        <img src="${LOGO_URL}" width="56" height="56" style="border-radius:14px;display:block;margin:0 auto;" alt="Paradise Lake"/>
      </td></tr>

      <tr><td style="background:#111111;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="padding:40px 40px 32px;">
            <p style="margin:0 0 6px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">${cfg.urgency}</p>
            <p style="margin:0 0 12px;font-size:22px;font-weight:700;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;letter-spacing:-0.5px;">${cfg.headline}</p>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.45);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;line-height:1.6;">
              Hola ${name}, ${cfg.body}
            </p>
          </td></tr>

          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>

          <!-- Balance -->
          <tr><td style="padding:28px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="padding-right:20px;">
                <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Pagado</p>
                <p style="margin:0;font-size:20px;font-weight:700;color:rgba(37,211,102,0.9);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;">${fmt(totalPaid)}</p>
              </td>
              <td>
                <p style="margin:0 0 4px;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Saldo pendiente</p>
                <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;">${fmt(remaining)}</p>
              </td>
            </tr></table>
          </td></tr>

          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>

          <tr><td style="padding:28px 40px 36px;">
            <table cellpadding="0" cellspacing="0"><tr><td>
              <a href="${BASE_URL}/paradise-lake" style="display:inline-block;padding:14px 28px;background:#ffffff;color:#000000;font-size:15px;font-weight:700;text-decoration:none;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">
                Completar pago →
              </a>
            </td></tr></table>
          </td></tr>
        </table>
      </td></tr>

      <tr><td align="center" style="padding:28px 0 0;">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">La Agencia · AIC Studio</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

  await transporter.sendMail({
    from: '"Paradise Lake" <aicstudioai@gmail.com>',
    to,
    subject: cfg.subject,
    html,
  });
}

// ─── Event day email ──────────────────────────────────────────────────────────

export async function sendEventDayEmail(to: string, name: string) {
  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000000;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#000000;padding:48px 16px;">
  <tr><td align="center">
    <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

      <tr><td align="center" style="padding-bottom:32px;">
        <img src="${LOGO_URL}" width="56" height="56" style="border-radius:14px;display:block;margin:0 auto;" alt="Paradise Lake"/>
      </td></tr>

      <tr><td style="background:#111111;border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:40px 40px 32px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.35);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Hoy es el día</p>
            <h1 style="margin:8px 0 4px;font-size:32px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;">Paradise Lake</h1>
            <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.5);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Techno & Techno House · 1 y 2 de Mayo</p>
          </td></tr>

          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>

          <tr><td style="padding:32px 40px;">
            <p style="margin:0 0 6px;font-size:18px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif;">¡Hoy es Paradise Lake, ${name}!</p>
            <p style="margin:6px 0 24px;font-size:14px;color:rgba(255,255,255,0.45);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;line-height:1.6;">
              Recuerda presentar tu boleta QR en la entrada. Te esperamos con todo listo para un fin de semana increíble.
            </p>

            <!-- Info grid -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:14px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 3px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Apertura</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">12:00 PM — Puertas abiertas</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 3px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Barra libre</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">1:00 PM – 3:00 PM</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0 0 3px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Música</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">6 DJs · 24h non-stop · Techno & Techno House</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 20px;">
                  <p style="margin:0 0 3px;font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.25);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Lugar</p>
                  <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">Paradise Lake · Peñol, Antioquia</p>
                </td>
              </tr>
            </table>
          </td></tr>

          <tr><td style="height:1px;background:rgba(255,255,255,0.06);"></td></tr>

          <!-- Contacto -->
          <tr><td style="padding:24px 40px 36px;">
            <p style="margin:0 0 12px;font-size:13px;color:rgba(255,255,255,0.4);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">¿Tienes dudas? Contáctanos:</p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-right:24px;">
                  <a href="https://wa.me/573016050818" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;">
                    <span style="font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">301 605 0818</span>
                  </a>
                </td>
                <td>
                  <a href="https://wa.me/573146273905" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;">
                    <span style="font-size:14px;font-weight:600;color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">314 627 3905</span>
                  </a>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <tr><td align="center" style="padding:28px 0 0;">
        <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.2);font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text',Helvetica,Arial,sans-serif;">La Agencia · AIC Studio</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body></html>`;

  await transporter.sendMail({
    from: '"Paradise Lake" <aicstudioai@gmail.com>',
    to,
    subject: `¡Hoy es Paradise Lake! · 1 de Mayo · Guatapé`,
    html,
  });
}
