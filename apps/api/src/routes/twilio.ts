import { Router, Response } from "express";
import { TenantRequest } from "../middleware/tenant";
import { query } from "../db";

const router = Router();

/**
 * POST /sms-webhook
 * Handles incoming SMS messages from Twilio
 */
router.post("/sms-webhook", async (req: TenantRequest, res: Response) => {
  try {
    const from = req.body.From as string;
    const body = (req.body.Body as string)?.trim().toLowerCase();
    const tenantId = req.tenantId!;

    console.log(`Incoming SMS to tenant ${req.tenantConfig?.name} from ${from}: ${body}`);

    // Check if this is a review verification
    if (body?.startsWith("verificar") || body?.startsWith("verify")) {
      const code = body.replace(/^(verificar|verify)\s*/, "").trim();
      if (code) {
        // Verification code should ideally be tenant-scoped but since it's from SMS 
        // we might not know the tenant unless the URL is tenant-specific.
        // Our tenantMiddleware handles the URL-based tenant resolution.
        const updated = await query(
          `UPDATE reviews SET verified = true, verified_at = NOW(), published = true, updated_at = NOW()
           WHERE verification_code = $1 AND reviewer_phone = $2 AND tenant_id = $3
           RETURNING id`,
          [code, from, tenantId]
        );
        
        if (updated.length > 0) {
          res.type("text/xml");
          return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>¡Gracias! Tu reseña ha sido verificada. / Thank you! Your review has been verified.</Message>
</Response>`);
        }
      }
    }

    // Check if there's a lead with this phone in this tenant
    const leads = await query(
      "SELECT id, full_name FROM leads WHERE phone = $1 AND tenant_id = $2 ORDER BY created_at DESC LIMIT 1",
      [from, tenantId]
    );

    let responseMsg: string;
    if (leads.length > 0) {
      responseMsg =
        "Gracias por tu mensaje. Un especialista de PV Construcción te contactará pronto. " +
        "Thank you for your message. A PV Construction specialist will contact you soon.";
    } else {
      const siteUrl = req.tenantConfig?.subdomain === 'www' ? 'pvconstruccion.com' : `${req.tenantConfig?.subdomain}.pvconstruction.com`;
      responseMsg =
        `¡Hola! Gracias por contactar PV Construcción. ` +
        `Visita ${siteUrl} para una cotización gratuita.`;
    }

    res.type("text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${responseMsg}</Message>
</Response>`);
  } catch (err) {
    console.error("POST /twilio/sms-webhook error:", err);
    res.type("text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
  }
});

/**
 * POST /voice-twiml
 * Handles incoming Voice calls from Twilio
 */
router.post("/voice-twiml", async (req: TenantRequest, res: Response) => {
    // Basic Voice TwiML
    res.type("text/xml");
    const lang = req.query.lang || "es-MX";
    const greeting = lang === "en" 
        ? "Thank you for calling PV Construction. Please leave a message after the beep." 
        : "Gracias por llamar a PV Construcción. Por favor deje su mensaje después del tono.";
    
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="${lang === "en" ? "en-US" : "es-MX"}">${greeting}</Say>
    <Record maxLength="60" action="/api/twilio/voice-callback" />
</Response>`);
});

/**
 * POST /voice-language
 * Handles language selection during voice call
 */
router.post("/voice-language", async (req: TenantRequest, res: Response) => {
  try {
    const digit = req.body.Digits as string;

    res.type("text/xml");
    if (digit === "1") {
      // English greeting
      return res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Matthew-Neural" language="en-US">Thank you for calling PV Construction. We are a referral agency connecting investors with verified contractors in Puerto Vallarta, Mexico. A specialist will return your call shortly. You can also visit us at pv construction dot com for a free quote.</Say>
  <Pause length="1"/>
  <Say voice="Polly.Matthew-Neural" language="en-US">Goodbye.</Say>
</Response>`);
    }

    // Default: repeat Spanish
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Mia-Neural" language="es-MX">Gracias por su llamada. Un especialista le contactará pronto. Hasta luego.</Say>
</Response>`);
  } catch (err) {
    console.error("voice-language error:", err);
    res.type("text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Hangup/></Response>`);
  }
});

export default router;
