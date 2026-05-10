import { NextRequest, NextResponse } from "next/server";
import { generateSpeech } from "@/lib/elevenlabs";

/**
 * POST /api/twilio/voice-twiml
 * Returns TwiML for Twilio voice calls.
 * Optionally streams ElevenLabs TTS audio.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const callerNumber = formData.get("From") as string;
    const called = formData.get("To") as string;

    console.log(`Incoming call: ${callerNumber} → ${called}`);

    // Greeting in Spanish
    const greeting =
      "Gracias por llamar a PV Construcción. " +
      "Somos una agencia de referencia que conecta inversionistas con contratistas verificados en Puerto Vallarta. " +
      "Un especialista le devolverá la llamada en breve. " +
      "También puede visitarnos en pvconstruccion punto com para una cotización gratuita.";

    // Try ElevenLabs TTS for higher quality
    const audioBuffer = await generateSpeech(greeting, {
      format: "ulaw_8000",
      language: "es",
    });

    if (audioBuffer) {
      // Serve TTS audio via TwiML <Play>
      // We'd need to host the audio — for now use Twilio's native <Say>
    }

    // Fallback to Twilio native TTS
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Mia-Neural" language="es-MX">${greeting}</Say>
  <Pause length="1"/>
  <Say voice="Polly.Mia-Neural" language="es-MX">Si prefiere hablar en inglés, presione uno.</Say>
  <Gather numDigits="1" action="/api/twilio/voice-language" method="POST">
    <Pause length="5"/>
  </Gather>
  <Say voice="Polly.Mia-Neural" language="es-MX">Gracias. Hasta luego.</Say>
</Response>`;

    return new NextResponse(twiml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (err) {
    console.error("POST /api/twilio/voice-twiml error:", err);
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Mia-Neural" language="es-MX">Disculpe, estamos experimentando dificultades técnicas. Por favor intente más tarde.</Say>
</Response>`;
    return new NextResponse(fallback, {
      headers: { "Content-Type": "application/xml" },
    });
  }
}
