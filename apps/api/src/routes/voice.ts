import { Router, Response, Request } from "express";
import { generateSpeech } from "../lib/elevenlabs";

const router = Router();

/**
 * POST /tts
 * Generates TTS audio using ElevenLabs.
 */
router.post("/tts", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || authHeader !== `Bearer ${expected}`) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const { text, language, format } = req.body;

    if (!text || typeof text !== "string" || text.length > 5000) {
      return res.status(400).json({ error: "text is required and must be under 5000 chars" });
    }

    const audio = await generateSpeech(text, {
      language: language === "en" ? "en" : "es",
      format: format || "mp3_44100_128",
    });

    if (!audio) {
      return res.status(503).json({ error: "TTS generation failed" });
    }

    const contentType =
      format === "ulaw_8000"
        ? "audio/basic"
        : format === "pcm_16000"
          ? "audio/L16;rate=16000"
          : "audio/mpeg";

    res.set({
      "Content-Type": contentType,
      "Content-Length": audio.length.toString(),
    });
    
    res.send(audio);
  } catch (err) {
    console.error("POST /voice/tts error:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
