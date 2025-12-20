"use server";

import { env } from "@/env";
import { sendEmail } from "./mail-sender";

export const sendContactEmail = async (emailData: {
  name: string;
  email: string;
  message: string;
}) => {
  // Design tokens matching project's globals.css
  const colors = {
    // Light mode colors
    light: {
      background: "#f2f2f2", // oklch(0.9551 0 0)
      foreground: "#4a4a4a", // oklch(0.3211 0 0)
      card: "#f8f8f8", // oklch(0.9702 0 0)
      primary: "#22c55e", // oklch(0.7227 0.1920 149.5793) - green
      muted: "#6b7280", // oklch(0.5103 0 0)
      border: "#d4d4d4", // oklch(0.8576 0 0)
      accent: "#e5e5e5", // lighter muted for backgrounds
    },
    // Dark mode colors
    dark: {
      background: "#1a1a2e", // oklch(0.1738 0.0084 274.3863)
      foreground: "#f8f9fa", // oklch(0.9842 0.0034 247.8575)
      card: "#252542", // oklch(0.2034 0.0400 265.6927)
      primary: "#22c55e", // same green primary
      muted: "#9ca3af", // oklch(0.7137 0.0192 261.3246)
      border: "#374151", // oklch(0.2963 0.0358 261.8966)
      accent: "#1f1f3a", // darker for message bg
    },
  };

  // Use light mode for email (most email clients)
  const c = colors.light;

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: ${
      c.background
    }; color: ${c.foreground};">
      <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
          <td align="center" style="padding: 40px 20px;">
            <table role="presentation" style="max-width: 600px; width: 100%; background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, ${
              c.card
            } 50%, ${
    c.card
  } 100%); border-radius: 16px; overflow: hidden; border: 1px solid ${
    c.border
  }; box-shadow: 0 8px 30px -10px rgba(0, 0, 0, 0.15);">
              <!-- Header -->
              <tr>
                <td style="padding: 32px 24px 24px 24px;">
                  <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; color: ${
                    c.muted
                  }; letter-spacing: 0.1em;">
                    Contact
                  </p>
                  <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: ${
                    c.foreground
                  }; letter-spacing: -0.025em;">
                    New Portfolio Message
                  </h1>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: ${
                    c.muted
                  };">
                    Someone reached out through your portfolio contact form
                  </p>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 24px 24px 24px;">
                  <!-- Sender Info Row -->
                  <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                      <!-- Name Section -->
                      <td style="width: 50%; vertical-align: top; padding-right: 12px;">
                        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; color: ${
                          c.muted
                        }; letter-spacing: 0.1em;">
                          From
                        </p>
                        <p style="margin: 0; font-size: 15px; font-weight: 600; color: ${
                          c.foreground
                        };">
                          ${emailData.name}
                        </p>
                      </td>
                      <!-- Email Section -->
                      <td style="width: 50%; vertical-align: top; padding-left: 12px;">
                        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; color: ${
                          c.muted
                        }; letter-spacing: 0.1em;">
                          Email
                        </p>
                        <a href="mailto:${
                          emailData.email
                        }" style="font-size: 15px; color: ${
    c.primary
  }; text-decoration: none; font-weight: 500;">
                          ${emailData.email}
                        </a>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Divider with dot -->
                  <div style="display: flex; align-items: center; margin: 20px 0;">
                    <div style="flex: 1; height: 1px; background-color: ${
                      c.border
                    };"></div>
                    <div style="width: 4px; height: 4px; background-color: ${
                      c.muted
                    }; border-radius: 50%; margin: 0 12px;"></div>
                    <div style="flex: 1; height: 1px; background-color: ${
                      c.border
                    };"></div>
                  </div>
                  
                  <!-- Message Section -->
                  <div>
                    <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; color: ${
                      c.muted
                    }; letter-spacing: 0.1em;">
                      Message
                    </p>
                    <div style="background-color: ${
                      c.accent
                    }; border-left: 3px solid ${
    c.primary
  }; padding: 16px 20px; border-radius: 0 12px 12px 0;">
                      <p style="margin: 0; font-size: 14px; line-height: 1.7; color: ${
                        c.foreground
                      }; white-space: pre-wrap;">
${emailData.message}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 24px; text-align: center; border-top: 1px solid ${
                  c.border
                };">
                  <p style="margin: 0; font-size: 12px; color: ${c.muted};">
                    Sent from your portfolio contact form
                  </p>
                  <p style="margin: 6px 0 0 0; font-size: 11px; color: ${
                    c.muted
                  }; opacity: 0.7;">
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

  await sendEmail({
    to: env.CONTACT_EMAIL!,
    subject: `Portfolio Contact: ${emailData.name}`,
    html: htmlTemplate,
  });
};
