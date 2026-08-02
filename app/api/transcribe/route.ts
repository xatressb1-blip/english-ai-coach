import { getGeminiClient } from "@/services/geminiClient";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_AUDIO_BYTES = 18 * 1024 * 1024;
const DEFAULT_AUDIO_MODEL = "gemini-3.6-flash";

function cleanTranscript(value: string): string {
  return value
    .replace(/^```(?:text)?/i, "")
    .replace(/```$/i, "")
    .replace(/^transcript\s*:\s*/i, "")
    .trim();
}

function uniqueModels(models: Array<string | undefined>): string[] {
  return [...new Set(models.map((model) => model?.trim()).filter(Boolean))] as string[];
}

function isUnavailableModelError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);

  return (
    /\b404\b/i.test(message) ||
    /not[_\s-]?found/i.test(message) ||
    /no longer available/i.test(message) ||
    /model.*unavailable/i.test(message) ||
    /model.*not found/i.test(message)
  );
}

function publicTranscriptionError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (/api[_\s-]?key|permission|unauthenticated|forbidden|403/i.test(message)) {
    return "The transcription service is not configured correctly. Please contact the administrator.";
  }

  if (/quota|rate limit|resource[_\s-]?exhausted|429/i.test(message)) {
    return "The transcription service is busy. Please wait a moment and try again.";
  }

  if (/timeout|deadline|timed out/i.test(message)) {
    return "Transcription took too long. Please record a shorter answer and try again.";
  }

  return "The server could not convert this recording to text. Please record again in a quiet place.";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");

    if (!(audio instanceof File)) {
      return Response.json(
        { success: false, message: "Audio file is missing." },
        { status: 400 }
      );
    }

    if (audio.size === 0) {
      return Response.json(
        { success: false, message: "The recorded audio is empty." },
        { status: 400 }
      );
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      return Response.json(
        {
          success: false,
          message: "The recording is too large. Please keep one answer under about three minutes.",
        },
        { status: 413 }
      );
    }

    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    const base64Audio = audioBuffer.toString("base64");
    const mimeType = audio.type || "audio/mp4";

    // GEMINI_AUDIO_MODEL is optional. The global GEMINI_MODEL is intentionally
    // not reused here because text and audio model availability may differ.
    // The stable audio-capable model remains the automatic fallback.
    const models = uniqueModels([
      process.env.GEMINI_AUDIO_MODEL,
      DEFAULT_AUDIO_MODEL,
    ]);

    const ai = getGeminiClient();
    let lastError: unknown = null;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              text: [
                "Transcribe the spoken English in this interview recording.",
                "Return only the transcript, with natural capitalization and punctuation.",
                "Do not translate it.",
                "Do not correct grammar, vocabulary, names, or meaning.",
                "Preserve exactly what the speaker said as closely as possible.",
                "If there is no intelligible speech, return an empty string.",
              ].join(" "),
            },
            {
              inlineData: {
                mimeType,
                data: base64Audio,
              },
            },
          ],
        });

        const transcript = cleanTranscript(response.text ?? "");

        if (!transcript) {
          return Response.json(
            {
              success: false,
              message: "No clear English speech was detected. Please record again closer to the microphone.",
            },
            { status: 422 }
          );
        }

        return Response.json({ success: true, transcript });
      } catch (error: unknown) {
        lastError = error;
        console.error(`[Transcribe API] Model ${model} failed.`, error);

        if (!isUnavailableModelError(error)) {
          break;
        }
      }
    }

    return Response.json(
      {
        success: false,
        message: publicTranscriptionError(lastError),
      },
      { status: 503 }
    );
  } catch (error: unknown) {
    console.error("[Transcribe API]", error);

    return Response.json(
      {
        success: false,
        message: publicTranscriptionError(error),
      },
      { status: 500 }
    );
  }
}
