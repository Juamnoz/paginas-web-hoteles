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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://fiesta-1y2-mayo-guatape.vercel.app";
const LOGO_URL = `${BASE_URL}/logo-paradise-lake.jpeg`;

// ─── Verification email ─────────────────────────────────────────────────────

export async function sendVerificationEmail(to: string, name: string, code: string) {
  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#050f1e;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050f1e;padding:40px 0;">
    <tr><td align="center">
      <table width="420" cellpadding="0" cellspacing="0" style="background:#0d1b2e;border-radius:20px;border:1px solid rgba(247,148,29,0.25);overflow:hidden;">
        <!-- Header -->
        <tr><td align="center" style="padding:32px 32px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
          <img src="${LOGO_URL}" width="80" height="80" style="border-radius:16px;display:block;margin:0 auto 16px;" alt="Paradise Lake"/>
          <p style="margin:0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#F7941D;">1 y 2 de Mayo · Guatapé</p>
          <h1 style="margin:6px 0 0;font-size:26px;font-weight:900;color:#ffffff;font-family:Georgia,serif;">Paradise Lake</h1>
          <p style="margin:4px 0 0;font-size:13px;color:#2BAF9E;">Techno & Techno House · Peñol, Antioquia</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:15px;color:rgba(255,255,255,0.7);">Hola, <strong style="color:#ffffff;">${name}</strong> 👋</p>
          <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.5);line-height:1.6;">Ingresa este código para confirmar tu email y activar tu cuenta:</p>
          <!-- Code box -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:24px;background:rgba(247,148,29,0.08);border:1px solid rgba(247,148,29,0.3);border-radius:16px;">
              <span style="font-size:40px;font-weight:900;letter-spacing:10px;color:#F7941D;font-family:monospace;">${code}</span>
            </td></tr>
          </table>
          <p style="margin:20px 0 0;font-size:12px;color:rgba(255,255,255,0.3);text-align:center;">Este código expira en 15 minutos</p>
        </td></tr>
        <!-- Footer -->
        <tr><td align="center" style="padding:16px 32px 24px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);">Desarrollado por <strong style="color:#F7941D;">La Agencia</strong> · AIC Studio</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  await transporter.sendMail({
    from: '"Paradise Lake 🎵" <aicstudioai@gmail.com>',
    to,
    subject: `${code} — Código de verificación Paradise Lake`,
    html,
  });
}

// ─── Tickets email ──────────────────────────────────────────────────────────

export type TicketData = {
  ticketId: string;
  personNumber: number;
  totalTickets: number;
  roomType: string;
  roomTitle: string;
  holderName: string;
};

export async function sendTicketsEmail(to: string, name: string, tickets: TicketData[]) {
  // Generate QR codes
  const ticketsWithQR = await Promise.all(
    tickets.map(async (t) => {
      const qrData = `PARADISE-LAKE-2025|${t.ticketId}|${t.holderName}|${t.roomType}|${t.personNumber}`;
      const qrDataUrl = await QRCode.toDataURL(qrData, {
        width: 180,
        margin: 2,
        color: { dark: "#F7941D", light: "#0d1b2e" },
      });
      return { ...t, qrDataUrl, qrData };
    })
  );

  const ticketsHtml = ticketsWithQR.map((t) => `
    <tr><td style="padding:0 0 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.03);border:1px solid rgba(247,148,29,0.3);border-radius:16px;overflow:hidden;">
        <!-- Ticket header -->
        <tr style="background:linear-gradient(135deg,rgba(247,148,29,0.15),rgba(43,175,158,0.08));">
          <td style="padding:14px 20px;">
            <p style="margin:0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Boleta ${t.personNumber} de ${t.totalTickets}</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:900;color:#ffffff;">${t.roomTitle}</p>
          </td>
          <td align="right" style="padding:14px 20px;">
            <span style="background:rgba(247,148,29,0.2);border:1px solid rgba(247,148,29,0.4);border-radius:20px;padding:4px 10px;font-size:10px;font-weight:700;color:#F7941D;">VÁLIDO</span>
          </td>
        </tr>
        <!-- Ticket body -->
        <tr><td colspan="2" style="padding:20px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:top;padding-right:20px;">
                <table cellpadding="0" cellspacing="0">
                  <tr><td style="padding-bottom:12px;">
                    <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.35);">Titular</p>
                    <p style="margin:3px 0 0;font-size:14px;font-weight:700;color:#ffffff;">${t.holderName}</p>
                  </td></tr>
                  <tr><td style="padding-bottom:12px;">
                    <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.35);">Evento</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#2BAF9E;font-weight:600;">Techno & Techno House</p>
                  </td></tr>
                  <tr><td style="padding-bottom:12px;">
                    <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.35);">Fechas</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#ffffff;">1 y 2 de Mayo 2025</p>
                  </td></tr>
                  <tr><td>
                    <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:rgba(255,255,255,0.35);">Lugar</p>
                    <p style="margin:3px 0 0;font-size:13px;color:#ffffff;">Paradise Lake · Peñol, Antioquia</p>
                  </td></tr>
                </table>
              </td>
              <td align="center" style="vertical-align:top;">
                <img src="${t.qrDataUrl}" width="130" height="130" style="display:block;border-radius:8px;" alt="QR Ticket"/>
                <p style="margin:6px 0 0;font-size:9px;color:rgba(255,255,255,0.25);font-family:monospace;">${t.ticketId.split("-")[0].toUpperCase()}</p>
              </td>
            </tr>
          </table>
        </td></tr>
        <!-- Ticket footer -->
        <tr><td colspan="2" style="padding:10px 20px;border-top:1px solid rgba(255,255,255,0.05);">
          <p style="margin:0;font-size:9px;color:rgba(255,255,255,0.2);font-family:monospace;">ID: ${t.ticketId}</p>
        </td></tr>
      </table>
    </td></tr>`
  ).join("");

  const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#050f1e;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#050f1e;padding:40px 0;">
    <tr><td align="center">
      <table width="460" cellpadding="0" cellspacing="0">
        <!-- Header card -->
        <tr><td style="padding-bottom:20px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1b2e;border-radius:20px;border:1px solid rgba(247,148,29,0.25);overflow:hidden;">
            <tr><td align="center" style="padding:28px 32px;">
              <img src="${LOGO_URL}" width="72" height="72" style="border-radius:14px;display:block;margin:0 auto 14px;" alt="Paradise Lake"/>
              <p style="margin:0;font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#F7941D;">1 y 2 de Mayo · Guatapé</p>
              <h1 style="margin:6px 0 4px;font-size:24px;font-weight:900;color:#ffffff;font-family:Georgia,serif;">Paradise Lake</h1>
              <p style="margin:0;font-size:12px;color:#2BAF9E;">Techno & Techno House · Peñol, Antioquia</p>
            </td></tr>
            <tr><td style="padding:0 32px 28px;">
              <p style="margin:0;font-size:15px;color:rgba(255,255,255,0.7);">¡Todo listo, <strong style="color:#ffffff;">${name}</strong>! 🎉</p>
              <p style="margin:8px 0 0;font-size:13px;color:rgba(255,255,255,0.45);line-height:1.6;">Aquí están tus boletas para Paradise Lake. Presenta el QR en la entrada. <strong style="color:#F7941D;">Una boleta por persona.</strong></p>
            </td></tr>
          </table>
        </td></tr>
        <!-- Tickets -->
        ${ticketsHtml}
        <!-- Footer -->
        <tr><td align="center" style="padding:8px 0 32px;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.2);">Desarrollado por <strong style="color:#F7941D;">La Agencia</strong> · AIC Studio</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  await transporter.sendMail({
    from: '"Paradise Lake 🎵" <aicstudioai@gmail.com>',
    to,
    subject: `🎟️ Tus boletas — Paradise Lake Guatapé 1 y 2 de Mayo`,
    html,
  });
}
