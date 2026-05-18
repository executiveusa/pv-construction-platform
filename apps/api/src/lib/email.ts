import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail({ to, subject, text, html }: EmailOptions) {
  if (!process.env.SMTP_USER) {
    console.warn("SMTP credentials not configured — Email disabled");
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || "PV Construction"}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    return null;
  }
}

export function generateLeadEmailHtml(lead: any, tenant: any) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
      <h2 style="color: #2563eb;">Nuevo Lead: ${lead.full_name}</h2>
      <p><strong>Proyecto:</strong> ${lead.project_type}</p>
      <p><strong>Presupuesto:</strong> ${lead.budget_range || 'No especificado'}</p>
      <p><strong>Zona:</strong> ${lead.location_zone || 'No especificada'}</p>
      <p><strong>Teléfono:</strong> ${lead.phone || 'N/A'}</p>
      <p><strong>Email:</strong> ${lead.email || 'N/A'}</p>
      <hr />
      <p><strong>Notas:</strong> ${lead.notes || 'Ninguna'}</p>
      <p style="font-size: 12px; color: #666; margin-top: 20px;">
        Este lead fue generado para ${tenant.name}.
      </p>
    </div>
  `;
}
