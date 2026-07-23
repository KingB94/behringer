import nodemailer from "nodemailer";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMail({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const useTls = ["true", "on", "1"].includes(
    (process.env.MAIL_USE_TLS ?? "").toLowerCase()
  );

  const transport = nodemailer.createTransport({
    host: process.env.MAIL_SERVER,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    requireTLS: useTls,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessageHtml = escapeHtml(message).replace(/\n/g, "<br>");

  const text = `
        Du hast eine neue Nachricht über das Kontaktformular erhalten:
        -----------------------------------
        Name: ${name}
        E-Mail: ${email}
        Datenschutz akzeptiert: Ja
        -----------------------------------
        Nachricht:
        ${message}
        -----------------------------------
        `;

  const html = `
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 20px;
                }
                .container {
                    background-color: #ffffff;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 30px;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                }
                h2 {
                    color: #005a9c;
                    margin-top: 0;
                    border-bottom: 2px solid #e0e0e0;
                    padding-bottom: 10px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: 100px 1fr;
                    gap: 10px;
                    margin-bottom: 20px;
                }
                .info-grid strong {
                    color: #333;
                }
                blockquote {
                    background-color: #f4f4f4;
                    border-left: 4px solid #005a9c;
                    margin: 20px 0;
                    padding: 15px;
                    font-style: italic;
                    color: #555;
                    line-height: 1.5;
                }
                a {
                    color: #007bff;
                    text-decoration: none;
                }
                .footer {
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                    margin-top: 30px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Neue Kontaktanfrage</h2>
                <div class="info-grid">
                    <strong>Von:</strong>
                    <span>${safeName}</span>

                    <strong>E-Mail:</strong>
                    <span><a href="mailto:${safeEmail}">${safeEmail}</a></span>

                    <strong>Datenschutz:</strong>
                    <span style="color: green;">✔ Akzeptiert</span>
                </div>

                <h3>Nachricht:</h3>
                <blockquote>
                    <p>${safeMessageHtml}</p>
                </blockquote>
            </div>
            <div class="footer">
                <p>Diese E-Mail wurde automatisch vom Kontaktformular der Webseite gesendet.</p>
            </div>
        </body>
        </html>
        `;

  await transport.sendMail({
    from: {
      name: "Kontaktformular Webseite",
      address: process.env.MAIL_USERNAME ?? "",
    },
    to: "info@ib-behringer.de",
    subject: `Neue Kontaktanfrage von ${safeName}`,
    text,
    html,
  });
}
