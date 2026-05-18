const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "JBFqnCBsd6RMkjVDRZzb"; // Default multilingual voice
const MODEL_ID = "eleven_multilingual_v2";

/**
 * Generate speech audio from text using ElevenLabs
 * Returns audio buffer in the specified format
 */
export async function generateSpeech(
  text: string,
  options: {
    format?: "mp3_44100_128" | "ulaw_8000" | "pcm_16000";
    language?: "es" | "en";
  } = {}
): Promise<Buffer | null> {
  if (!ELEVENLABS_API_KEY) {
    console.warn("ElevenLabs API key not configured — TTS disabled");
    return null;
  }

  const format = options.format ?? "ulaw_8000"; // Twilio-compatible default

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${format}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        language_code: options.language ?? "es",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("ElevenLabs error:", response.status, errorText);
    return null;
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
