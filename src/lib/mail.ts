import nodemailer from "nodemailer";

/**
 * Envoie un email si la configuration SMTP est présente (sinon no-op logué).
 */
export async function sendMailSafe(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn("[VENTURE] SMTP non configuré — email non envoyé.");
    return { sent: false as const };
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: Number(SMTP_PORT || 587) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });

  await transporter.sendMail({
    from: SMTP_FROM || "VENTURE <noreply@localhost>",
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html ?? options.text.replace(/\n/g, "<br/>"),
  });

  return { sent: true as const };
}
