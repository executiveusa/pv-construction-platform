import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

function getClient() {
  if (!accountSid || !authToken) {
    console.warn("Twilio credentials not configured — SMS disabled");
    return null;
  }
  return twilio(accountSid, authToken);
}

export interface LeadNotification {
  full_name: string;
  phone?: string;
  project_type: string;
  budget_range?: string;
  location_zone?: string;
  is_high_value: boolean;
  leadId: string;
}

/**
 * Notify the primary contractor (and admin) about a new lead
 */
export async function notifyContractor(lead: LeadNotification) {
  const client = getClient();
  if (!client || !fromNumber) return;

  const contractorPhone = process.env.PRIMARY_CONTRACTOR_PHONE;
  const adminPhone = process.env.ADMIN_PHONE;

  const emoji = lead.is_high_value ? "🔥 ALTO VALOR" : "📋 Nuevo";
  const body = `${emoji} — Lead: ${lead.full_name}
Proyecto: ${lead.project_type}
Presupuesto: ${lead.budget_range || "No especificado"}
Zona: ${lead.location_zone || "No especificada"}
Tel: ${lead.phone || "N/A"}
ID: ${lead.leadId}`;

  const promises: Promise<unknown>[] = [];

  if (lead.is_high_value && contractorPhone) {
    promises.push(
      client.messages.create({
        body,
        from: fromNumber,
        to: contractorPhone,
      })
    );
  }

  if (adminPhone) {
    promises.push(
      client.messages.create({
        body,
        from: fromNumber,
        to: adminPhone,
      })
    );
  }

  await Promise.allSettled(promises);
}

/**
 * Send confirmation SMS to the lead
 */
export async function confirmLeadSMS(
  phone: string,
  name: string,
  language: string
) {
  const client = getClient();
  if (!client || !fromNumber) return;

  const body =
    language === "en"
      ? `Hi ${name}! Thank you for your interest in PV Construction. A specialist will contact you within the next 2 hours. 🏗️`
      : `¡Hola ${name}! Gracias por tu interés en PV Construcción. Un especialista te contactará dentro de las próximas 2 horas. 🏗️`;

  await client.messages.create({
    body,
    from: fromNumber,
    to: phone,
  });
}

/**
 * Send a verification code to a reviewer
 */
export async function sendReviewVerificationSMS(
  phone: string,
  code: string,
  language: string = "es-MX"
) {
  const client = getClient();
  if (!client || !fromNumber) return;

  const body =
    language === "en"
      ? `Your PV Construction verification code is: ${code}`
      : `Tu código de verificación de PV Construcción es: ${code}`;

  await client.messages.create({
    body,
    from: fromNumber,
    to: phone,
  });
}
