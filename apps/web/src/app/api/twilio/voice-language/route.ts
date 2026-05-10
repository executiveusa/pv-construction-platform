import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/twilio/voice-language
 * Handles language selection during voice call
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const digit = formData.get("Digits") as string;

    if (digit === "1") {
      // English greeting
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew-Neural" language="en-US">Thank you for calling PV Construction. We are a referral agency connecting investors with verified contractors in Puerto Vallarta, Mexico. A specialist will return your call shortly. You can also visit us at pv construction dot com for a free quote.</Say>
  <Pause length="1"/>
  <Say voice="Polly.Matthew-Neural" language="en-US">Goodbye.</Say>
</Response>`;
      return new NextResponse(twiml, {
        headers: { "Content-Type": "application/xml" },
      });
    }

    // Default: repeat Spanish
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Mia-Neural" language="es-MX">Gracias por su llamada. Un especialista le contactará pronto. Hasta luego.</Say>
</Response>`;
    return new NextResponse(twiml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("voice-language error:", err);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`,
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
