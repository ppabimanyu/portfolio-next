"use server";

import { env } from "@/env";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export const sendEmail = async (emailData: {
  subject: string;
  html: string;
}) => {
  try {
    const response = await resend.emails.send({
      from: env.RESEND_EMAIL_FROM!,
      to: env.RESEND_EMAIL_TO!,
      subject: emailData.subject,
      html: emailData.html,
    });
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export const sendContactEmail = async (emailData: {
  name: string;
  email: string;
  message: string;
}) => {
  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5; color: #18181b;">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.025em;">
                    📬 New Contact Message
                  </h1>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: #e4e4e7;">
                    Someone reached out through your portfolio
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 32px 24px;">
                  <!-- Name Section -->
                  <div style="margin-bottom: 24px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em;">
                      From
                    </p>
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #18181b;">
                      ${emailData.name}
                    </p>
                  </div>
                  
                  <!-- Email Section -->
                  <div style="margin-bottom: 24px;">
                    <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em;">
                      Email
                    </p>
                    <p style="margin: 0;">
                      <a href="mailto:${
                        emailData.email
                      }" style="font-size: 16px; color: #667eea; text-decoration: none; font-weight: 500;">
                        ${emailData.email}
                      </a>
                    </p>
                  </div>
                  
                  <!-- Divider -->
                  <div style="height: 1px; background-color: #e4e4e7; margin: 24px 0;"></div>
                  
                  <!-- Message Section -->
                  <div>
                    <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; letter-spacing: 0.05em;">
                      Message
                    </p>
                    <div style="background-color: #f4f4f5; border-left: 4px solid #667eea; padding: 16px; border-radius: 6px;">
                      <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #3f3f46; white-space: pre-wrap;">
${emailData.message}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #e4e4e7;">
                  <p style="margin: 0; font-size: 13px; color: #71717a;">
                    This email was sent from your portfolio contact form
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 12px; color: #a1a1aa;">
                    ${new Date().toLocaleString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
  sendEmail({
    subject: `💼 Portfolio Contact: ${emailData.name}`,
    html: htmlTemplate,
  });
};
