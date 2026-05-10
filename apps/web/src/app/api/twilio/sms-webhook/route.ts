import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

/**
 * POST /api/twilio/sms-webhook
 * Handles incoming SMS messages from Twilio
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const from = formData.get("From") as string;
    const body = (formData.get("Body") as string)?.trim().toLowerCase();

    console.log(`Incoming SMS from ${from}: ${body}`);

    // Check if this is a review verification
    if (body?.startsWith("verificar") || body?.startsWith("verify")) {
      const code = body.replace(/^(verificar|verify)\s*/, "").trim();
      if (code) {
        const updated = await query(
          `UPDATE reviews SET verified = true, verified_at = NOW(), published = true, updated_at = NOW()
           WHERE verification_code = $1 AND reviewer_phone = $2
           RETURNING id`,
          [code, from]
        );
        if (updated.length > 0) {
          const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>¡Gracias! Tu reseña ha sido verificada. / Thank you! Your review has been verified.</Message>
</Response>`;
          return new NextResponse(twiml, {
            headers: { "Content-Type": "application/xml" },
          });
        }
      }
    }

    // Check if there's a lead with this phone  
    const leads = await query(
      "SELECT id, full_name FROM leads WHERE phone = $1 ORDER BY created_at DESC LIMIT 1",
      [from]
    );

    let responseMsg: string;
    if (leads.length > 0) {
      responseMsg =
        "Gracias por tu mensaje. Un especialista de PV Construcción te contactará pronto. " +
        "Thank you for your message. A PV Construction specialist will contact you soon.";
    } else {
      responseMsg =
        "¡Hola! Gracias por contactar PV Construcción. " +
        "Visita pvconstruccion.com para una cotización gratuita. " +
        "Visit pvconstruction.com for a free quote.";
    }

    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMsg}</Message>
</Response>`;

    return new NextResponse(twiml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("POST /api/twilio/sms-webhook error:", err);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
