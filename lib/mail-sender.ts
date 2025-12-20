import { env } from "@/env";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

// Create transporter lazily to avoid errors when SMTP is not configured
let transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

function getTransporter(): Transporter<SMTPTransport.SentMessageInfo> {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASSWORD,
      },
    });
  }

  return transporter;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId: string;
}

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<SendEmailResult> {
  const mailTransporter = getTransporter();

  const mailOptions = {
    from: `"${env.SMTP_FROM_NAME ?? "App"}" <${env.SMTP_FROM_EMAIL}>`,
    to: Array.isArray(to) ? to.join(", ") : to,
    subject,
    text,
    html,
  };

  try {
    const info = await mailTransporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// Verify connection configuration
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const mailTransporter = getTransporter();
    await mailTransporter.verify();
    console.log("SMTP connection verified successfully");
    return true;
  } catch (error) {
    console.error("SMTP connection verification failed:", error);
    return false;
  }
}
