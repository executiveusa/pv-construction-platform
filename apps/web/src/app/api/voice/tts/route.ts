import { NextRequest, NextResponse } from "next/server";
import { generateSpeech } from "@/lib/elevenlabs";

/**
 * POST /api/voice/tts
 * Generates TTS audio using ElevenLabs.
 * Supports both Spanish and English.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const { text, language, format } = body;

    if (!text || typeof text !== "string" || text.length > 5000) {
      return NextResponse.json(
        { error: "text is required and must be under 5000 chars" },
        { status: 400 }
      );
    }

    const audio = await generateSpeech(text, {
      language: language === "en" ? "en" : "es",
      format: format || "mp3_44100_128",
    });

    if (!audio) {
      return NextResponse.json(
        { error: "TTS generation failed" },
        { status: 503 }
      );
    }

    const contentType =
      format === "ulaw_8000"
        ? "audio/basic"
        : format === "pcm_16000"
          ? "audio/L16;rate=16000"
          : "audio/mpeg";

    return new NextResponse(audio, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": audio.length.toString(),
      },
    });
  } catch (err) {
    console.error("POST /api/voice/tts error:", err);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
