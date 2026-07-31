import { getGeminiClient } from "@/services/geminiClient";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_AUDIO_BYTES = 18 * 1024 * 1024;

function cleanTranscript(value: string): string {
  return value
    .replace(/^```(?:text)?/i, "")
    .replace(/```$/i, "")
    .replace(/^transcript\s*:\s*/i, "")
    .trim();
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
    const model =
      process.env.GEMINI_AUDIO_MODEL ??
      process.env.GEMINI_MODEL ??
      "gemini-2.5-flash";

    const ai = getGeminiClient();
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
    console.error("[Transcribe API]", error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "The server could not transcribe the audio.",
      },
      { status: 500 }
    );
  }
}
