import nodemailer from "nodemailer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

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

const CID_SUN   = "logo-sun@sun-senssion";
const CID_PLACE = "logo-place@sun-senssion";

function logoAttachments() {
  const pub = path.join(process.cwd(), "public");
  return [
    {
      filename:    "logo-sun-senssion.png",
      content:     fs.readFileSync(path.join(pub, "logo-sun-senssion.png")),
      cid:         CID_SUN,
      contentType: "image/png",
    },
    {
      filename:    "logo-paradise-lake.jpeg",
      content:     fs.readFileSync(path.join(pub, "logo-paradise-lake.jpeg")),
      cid:         CID_PLACE,
      contentType: "image/jpeg",
    },
  ];
}

const FONT = `-apple-system,BlinkMacSystemFont,'SF Pro Display',Helvetica,Arial,sans-serif`;
const fmt  = (n: number) => `$${n.toLocaleString("es-CO")}`;

// ─── Shared shell ─────────────────────────────────────────────────────────────
// Every email starts with the same golden-accented dark card wrapper.
function shell(innerHtml: string) {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SUN-SENSSION</title></head>
<body style="margin:0;padding:0;background:#080504;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#080504;padding:48px 16px;">
<tr><td align="center">
<table width="500" cellpadding="0" cellspacing="0" style="max-width:500px;width:100%;">

  <!-- Brand header -->
  <tr><td align="center" style="padding-bottom:28px;">
    <img src="cid:${CID_SUN}" width="200" alt="SUN-SENSSION"
      style="display:block;margin:0 auto;max-width:200px;"/>
    <p style="margin:10px 0 0;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;
      color:rgba(232,160,32,0.65);font-family:${FONT};">
      1 y 2 de Mayo &nbsp;·&nbsp; Guatapé, Antioquia
    </p>
  </td></tr>

  <!-- Main card -->
  <tr><td style="border-radius:20px;overflow:hidden;
    background:#0f0b09;
    box-shadow:0 0 0 1px rgba(232,160,32,0.18), 0 32px 64px rgba(0,0,0,0.6);">

    <!-- Golden top accent bar -->
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="height:3px;background:linear-gradient(90deg,#C17000 0%,#E8A020 50%,#C17000 100%);"></td></tr>
    </table>

    <!-- Content slot -->
    ${innerHtml}

  </td></tr>

  <!-- Footer -->
  <tr><td align="center" style="padding:24px 0 8px;">
    <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.18);font-family:${FONT};">
      SUN-SENSSION &nbsp;·&nbsp; Paradise Lake &nbsp;·&nbsp; La Agencia
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

// ─── Golden CTA button ────────────────────────────────────────────────────────
function ctaButton(href: string, label: string) {
  return `<table cellpadding="0" cellspacing="0"><tr><td>
    <a href="${href}"
      style="display:inline-block;padding:14px 32px;
        background:linear-gradient(135deg,#E8A020 0%,#C17000 100%);
        color:#000000;font-size:14px;font-weight:700;letter-spacing:0.04em;
        text-decoration:none;border-radius:12px;font-family:${FONT};">
      ${label}
    </a>
  </td></tr></table>`;
}

// ─── Divider ──────────────────────────────────────────────────────────────────
const divider = `<tr><td style="height:1px;background:rgba(232,160,32,0.1);"></td></tr>`;

// ─── 1. Verification email ────────────────────────────────────────────────────
export async function sendVerificationEmail(to: string, name: string, code: string) {
  const digits = code.split("").map(d =>
    `<span style="display:inline-block;width:46px;text-align:center;
      font-size:34px;font-weight:700;color:#ffffff;letter-spacing:0;
      font-family:${FONT};">${d}</span>`
  ).join(`<span style="color:rgba(255,255,255,0.1);font-size:28px;font-family:${FONT};">·</span>`);

  const inner = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;
          letter-spacing:-0.4px;font-family:${FONT};">
          Confirma tu acceso
        </p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);line-height:1.65;font-family:${FONT};">
          Hola ${name} — ingresa este código para activar tu cuenta y asegurar tu cupo.
        </p>
      </td></tr>
      ${divider}
      <tr><td align="center" style="padding:36px 40px;">
        <div style="display:inline-block;padding:22px 28px;
          background:rgba(232,160,32,0.07);
          border-radius:16px;
          box-shadow:0 0 0 1px rgba(232,160,32,0.2);">
          ${digits}
        </div>
        <p style="margin:14px 0 0;font-size:12px;color:rgba(255,255,255,0.25);font-family:${FONT};">
          Válido por 15 minutos
        </p>
      </td></tr>
      ${divider}
      <tr><td style="padding:24px 40px 32px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:24px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
              color:rgba(255,255,255,0.25);font-family:${FONT};">Evento</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:${FONT};">SUN-SENSSION</p>
          </td>
          <td>
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
              color:rgba(255,255,255,0.25);font-family:${FONT};">Lugar</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:${FONT};">Paradise Lake · Guatapé</p>
          </td>
        </tr></table>
      </td></tr>
    </table>`;

  await transporter.sendMail({
    from: '"SUN-SENSSION" <aicstudioai@gmail.com>',
    to,
    subject: `${code} — tu código de acceso a SUN-SENSSION`,
    html: shell(inner),
    attachments: logoAttachments(),
  });
}

// ─── 2. Tickets email ─────────────────────────────────────────────────────────
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
      const qrData   = `SUN-SENSSION-2026|${t.ticketId}|${t.holderName}|${t.roomType}|${t.personNumber}`;
      const qrBuffer = await QRCode.toBuffer(qrData, {
        width: 200, margin: 2,
        color: { dark: "#000000", light: "#ffffff" },
      });
      const cid = `qr-${t.ticketId.replace(/[^a-z0-9]/gi, "")}@sun-senssion`;
      return { ...t, qrBuffer, cid };
    })
  );

  const ticketRows = ticketsWithQR.map((t) => `
    <tr><td style="padding-bottom:14px;">
      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#150f09;border-radius:16px;
          box-shadow:0 0 0 1px rgba(232,160,32,0.15);overflow:hidden;">

        <!-- Ticket accent -->
        <tr><td style="height:2px;background:linear-gradient(90deg,#C17000,#E8A020,#C17000);"></td></tr>

        <!-- Ticket header -->
        <tr><td style="padding:16px 24px 14px;border-bottom:1px solid rgba(232,160,32,0.08);">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td>
              <p style="margin:0;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
                color:rgba(232,160,32,0.55);font-family:${FONT};">
                Acceso ${t.personNumber} de ${t.totalTickets}
              </p>
              <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#ffffff;
                letter-spacing:-0.3px;font-family:${FONT};">
                ${t.roomTitle}
              </p>
            </td>
            <td align="right">
              <span style="display:inline-block;padding:4px 14px;border-radius:99px;
                background:rgba(232,160,32,0.12);
                font-size:10px;font-weight:700;letter-spacing:0.14em;
                text-transform:uppercase;color:#E8A020;font-family:${FONT};">
                Válido
              </span>
            </td>
          </tr></table>
        </td></tr>

        <!-- Ticket body -->
        <tr><td style="padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:top;padding-right:20px;">
              <table cellpadding="0" cellspacing="0">
                ${[
                  ["Titular",  t.holderName],
                  ["Evento",   "SUN-SENSSION · Techno & Techno House"],
                  ["Fecha",    "1 y 2 de Mayo 2026"],
                  ["Lugar",    "Paradise Lake · Peñol, Antioquia"],
                ].map(([label, val]) => `
                  <tr><td style="padding-bottom:14px;">
                    <p style="margin:0;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
                      color:rgba(255,255,255,0.25);font-family:${FONT};">${label}</p>
                    <p style="margin:3px 0 0;font-size:13px;font-weight:600;color:#ffffff;
                      line-height:1.4;font-family:${FONT};">${val}</p>
                  </td></tr>`).join("")}
              </table>
            </td>
            <td align="center" style="vertical-align:top;">
              <div style="background:#ffffff;padding:8px;border-radius:10px;display:inline-block;">
                <img src="cid:${t.cid}" width="120" height="120" style="display:block;" alt="QR"/>
              </div>
              <p style="margin:8px 0 0;font-size:9px;color:rgba(255,255,255,0.2);
                font-family:monospace;text-align:center;letter-spacing:0.1em;">
                ${t.ticketId.substring(0, 8).toUpperCase()}
              </p>
            </td>
          </tr></table>
        </td></tr>

        <tr><td style="padding:8px 24px 10px;border-top:1px solid rgba(255,255,255,0.04);">
          <p style="margin:0;font-size:9px;color:rgba(255,255,255,0.12);font-family:monospace;letter-spacing:0.05em;">
            ${t.ticketId}
          </p>
        </td></tr>
      </table>
    </td></tr>`
  ).join("");

  const inner = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:36px 40px 28px;">
        <img src="cid:${CID_PLACE}" width="52" height="52"
          style="border-radius:12px;display:block;margin:0 auto 16px;" alt="Paradise Lake"/>
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;
          letter-spacing:-0.4px;font-family:${FONT};">
          Tus accesos están listos
        </p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);
          line-height:1.65;font-family:${FONT};">
          ${name}, presenta el QR en la entrada.<br/>Una boleta por persona — no transferible.
        </p>
      </td></tr>
      ${divider}
      <tr><td style="padding:28px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${ticketRows}
        </table>
      </td></tr>
      ${divider}
      <tr><td align="center" style="padding:24px 40px 32px;">
        <p style="margin:0 0 16px;font-size:13px;color:rgba(255,255,255,0.35);font-family:${FONT};">
          ¿Necesitas ayuda? Escríbenos por WhatsApp
        </p>
        ${ctaButton("https://wa.me/573016050818", "Contactar →")}
      </td></tr>
    </table>`;

  await transporter.sendMail({
    from: '"SUN-SENSSION" <aicstudioai@gmail.com>',
    to,
    subject: `Tus accesos para SUN-SENSSION — 1 y 2 de Mayo`,
    html: shell(inner),
    attachments: [
      ...logoAttachments(),
      ...ticketsWithQR.map((t) => ({
        filename: `acceso-${t.personNumber}.png`,
        content: t.qrBuffer,
        cid: t.cid,
        contentType: "image/png",
      })),
    ],
  });
}

// ─── 3. Welcome / reservation confirmed ──────────────────────────────────────
export type ReservationSummary = {
  room_title: string;
  quantity: number;
  total_price: number;
};

export async function sendWelcomeEmail(
  to: string, name: string, reservations: ReservationSummary[], totalOwed: number
) {
  const rows = reservations.map(r => `
    <tr>
      <td style="padding:11px 0;font-size:13px;color:rgba(255,255,255,0.8);
        border-bottom:1px solid rgba(255,255,255,0.05);font-family:${FONT};">
        ${r.room_title}
        <span style="color:rgba(255,255,255,0.35);"> ×${r.quantity}</span>
      </td>
      <td align="right" style="padding:11px 0;font-size:13px;font-weight:600;
        color:#ffffff;border-bottom:1px solid rgba(255,255,255,0.05);font-family:${FONT};">
        ${fmt(r.total_price)}
      </td>
    </tr>`).join("");

  const inner = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;
          letter-spacing:-0.4px;font-family:${FONT};">
          Reserva confirmada
        </p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);
          line-height:1.65;font-family:${FONT};">
          Hola ${name}, tu cuenta está activa y tu cupo está reservado en SUN-SENSSION.
        </p>
      </td></tr>
      ${divider}
      <tr><td style="padding:28px 40px;">
        <p style="margin:0 0 16px;font-size:10px;letter-spacing:0.22em;
          text-transform:uppercase;color:rgba(232,160,32,0.6);font-family:${FONT};">
          Tu reserva
        </p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${rows}
          <tr>
            <td style="padding:14px 0 0;font-size:12px;font-weight:600;text-transform:uppercase;
              letter-spacing:0.12em;color:rgba(255,255,255,0.4);font-family:${FONT};">Total</td>
            <td align="right" style="padding:14px 0 0;font-size:20px;font-weight:700;
              color:#E8A020;font-family:${FONT};">${fmt(totalOwed)}</td>
          </tr>
        </table>
      </td></tr>
      ${divider}
      <tr><td style="padding:28px 40px 36px;">
        <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,0.4);
          line-height:1.65;font-family:${FONT};">
          Completa el pago desde tu cuenta para recibir tus accesos con QR. Los cupos se asignan en orden de pago.
        </p>
        ${ctaButton(`${BASE_URL}/paradise-lake`, "Ir a mi cuenta →")}
      </td></tr>
      ${divider}
      <tr><td style="padding:24px 40px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:24px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
              color:rgba(255,255,255,0.25);font-family:${FONT};">Evento</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:${FONT};">SUN-SENSSION</p>
          </td>
          <td style="padding-right:24px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
              color:rgba(255,255,255,0.25);font-family:${FONT};">Fecha</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:${FONT};">1 y 2 de Mayo</p>
          </td>
          <td>
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
              color:rgba(255,255,255,0.25);font-family:${FONT};">Lugar</p>
            <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:${FONT};">Paradise Lake</p>
          </td>
        </tr></table>
      </td></tr>
    </table>`;

  await transporter.sendMail({
    from: '"SUN-SENSSION" <aicstudioai@gmail.com>',
    to,
    subject: `Reserva confirmada — SUN-SENSSION 1 y 2 de Mayo`,
    html: shell(inner),
    attachments: logoAttachments(),
  });
}

// ─── 4. Reminder emails ───────────────────────────────────────────────────────
export type ReminderType = "8d" | "4d" | "3d";

const REMINDER_CONFIG: Record<ReminderType, { subject: string; tag: string; headline: string; body: string }> = {
  "8d": {
    subject:  "Tu cupo en SUN-SENSSION tiene pago pendiente",
    tag:      "Faltan 8 días",
    headline: "No pierdas tu cupo",
    body:     "Tienes una reserva confirmada pero el pago aún está pendiente. Los cupos son limitados y se asignan en orden de pago.",
  },
  "4d": {
    subject:  "Quedan 4 días para asegurar tu entrada — SUN-SENSSION",
    tag:      "Faltan 4 días",
    headline: "Último aviso de pago",
    body:     "En 4 días vence el plazo para confirmar tu cupo. Después de esa fecha no podemos garantizar disponibilidad.",
  },
  "3d": {
    subject:  "Hoy vence el plazo de pago — SUN-SENSSION",
    tag:      "Último día",
    headline: "Hoy vence el plazo",
    body:     "Es el último día para completar tu pago y asegurar tu entrada a SUN-SENSSION en Paradise Lake.",
  },
};

export async function sendReminderEmail(
  to: string, name: string, totalOwed: number, totalPaid: number, type: ReminderType
) {
  const remaining = totalOwed - totalPaid;
  const cfg       = REMINDER_CONFIG[type];

  const inner = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td style="padding:36px 40px 28px;">
        <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;
          color:rgba(232,160,32,0.65);font-family:${FONT};">${cfg.tag}</p>
        <p style="margin:0 0 10px;font-size:22px;font-weight:700;color:#ffffff;
          letter-spacing:-0.4px;font-family:${FONT};">${cfg.headline}</p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);
          line-height:1.65;font-family:${FONT};">
          Hola ${name} — ${cfg.body}
        </p>
      </td></tr>
      ${divider}
      <tr><td style="padding:28px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:20px;">
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
              color:rgba(255,255,255,0.25);font-family:${FONT};">Pagado</p>
            <p style="margin:0;font-size:22px;font-weight:700;
              color:rgba(37,211,102,0.85);font-family:${FONT};">${fmt(totalPaid)}</p>
          </td>
          <td>
            <p style="margin:0 0 4px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
              color:rgba(255,255,255,0.25);font-family:${FONT};">Pendiente</p>
            <p style="margin:0;font-size:22px;font-weight:700;
              color:#E8A020;font-family:${FONT};">${fmt(remaining)}</p>
          </td>
        </tr></table>
      </td></tr>
      ${divider}
      <tr><td style="padding:28px 40px 36px;">
        ${ctaButton(`${BASE_URL}/paradise-lake`, "Completar pago →")}
      </td></tr>
    </table>`;

  await transporter.sendMail({
    from: '"SUN-SENSSION" <aicstudioai@gmail.com>',
    to,
    subject: cfg.subject,
    html: shell(inner),
    attachments: logoAttachments(),
  });
}

// ─── 5. Event day email ───────────────────────────────────────────────────────
export async function sendEventDayEmail(to: string, name: string) {
  const schedule = [
    ["Apertura de puertas",  "12:00 PM"],
    ["Barra libre",          "1:00 PM – 3:00 PM"],
    ["Música non-stop",      "6 DJs · Techno & Techno House · 24h"],
    ["Lugar",                "Paradise Lake · Peñol, Antioquia"],
  ];

  const scheduleRows = schedule.map(([label, val]) => `
    <tr><td style="padding:14px 20px;border-bottom:1px solid rgba(232,160,32,0.07);">
      <p style="margin:0 0 3px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
        color:rgba(232,160,32,0.5);font-family:${FONT};">${label}</p>
      <p style="margin:0;font-size:14px;font-weight:600;color:#ffffff;font-family:${FONT};">${val}</p>
    </td></tr>`).join("");

  const inner = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr><td align="center" style="padding:40px 40px 28px;">
        <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;
          color:rgba(232,160,32,0.65);font-family:${FONT};">Hoy es el día</p>
        <p style="margin:0 0 8px;font-size:28px;font-weight:700;color:#ffffff;
          letter-spacing:-0.5px;font-family:${FONT};">SUN-SENSSION</p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);font-family:${FONT};">
          Techno & Techno House · 1 y 2 de Mayo
        </p>
      </td></tr>
      ${divider}
      <tr><td style="padding:28px 40px 20px;">
        <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#ffffff;
          letter-spacing:-0.3px;font-family:${FONT};">
          Todo listo, ${name}.
        </p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.45);
          line-height:1.65;font-family:${FONT};">
          Presenta tu boleta QR en la entrada y prepárate para 24 horas de techno en Paradise Lake.
        </p>
      </td></tr>
      <tr><td style="padding:0 24px 28px;">
        <table width="100%" cellpadding="0" cellspacing="0"
          style="border-radius:14px;overflow:hidden;
            box-shadow:0 0 0 1px rgba(232,160,32,0.15);">
          ${scheduleRows}
        </table>
      </td></tr>
      ${divider}
      <tr><td style="padding:24px 40px 36px;">
        <p style="margin:0 0 16px;font-size:12px;color:rgba(255,255,255,0.3);font-family:${FONT};">
          Contacto el día del evento
        </p>
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="padding-right:32px;">
            <a href="https://wa.me/573016050818"
              style="font-size:14px;font-weight:600;color:#E8A020;
                text-decoration:none;font-family:${FONT};">
              301 605 0818
            </a>
          </td>
          <td>
            <a href="https://wa.me/573146273905"
              style="font-size:14px;font-weight:600;color:#E8A020;
                text-decoration:none;font-family:${FONT};">
              314 627 3905
            </a>
          </td>
        </tr></table>
      </td></tr>
    </table>`;

  await transporter.sendMail({
    from: '"SUN-SENSSION" <aicstudioai@gmail.com>',
    to,
    subject: `Hoy es SUN-SENSSION — Paradise Lake, Guatapé`,
    html: shell(inner),
    attachments: logoAttachments(),
  });
}
