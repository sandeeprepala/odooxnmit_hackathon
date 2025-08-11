import { getEmailTransporter } from '../config/email.js';
import { env } from '../config/env.js';

export async function sendEmail({ to, subject, html, text }) {
  const transporter = getEmailTransporter();
  if (!transporter) return { skipped: true };
  const info = await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html, text });
  return info;
}


