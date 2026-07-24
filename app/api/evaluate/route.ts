import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function GET() {
  return Response.json({
    success: true,
    message: "Gemini API is ready.",
  });
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || !prompt.trim()) {
      return Response.json(
        {
          success: false,
          message: "Transcript is empty.",
        },
        {
          status: 400,
        }
      );
    }

    const evaluationPrompt = `
You are an English Interview Examiner.

Evaluate the candidate's interview answer.

Candidate Answer:
"${prompt}"

IMPORTANT:

Return ONLY valid JSON.

Do NOT use markdown.

Do NOT explain.

Do NOT add extra text.

The JSON format MUST be:

{
  "grammar": number,
  "vocabulary": number,
  "pronunciation": number,
  "fluency": number,
  "relevance": number,
  "confidence": number,
  "mistakes": [
    "..."
  ],
  "suggestions": [
    "..."
  ],
  "improvedAnswer": "..."
}

Rules:

- Scores are between 0 and 10.
- mistakes: maximum 3 items.
- suggestions: maximum 3 items.
- improvedAnswer:
  around 40~80 words.
`;

    const response = await ai.models.generateContent({
  model: "gemini-2.5-flash-lite",
  contents: evaluationPrompt,
});

    const rawText = response.text;

    if (!rawText) {
      throw new Error("Gemini returned empty response.");
    }

    //--------------------------------------------------------
    // Remove markdown if Gemini returns ```json
    //--------------------------------------------------------

    const cleaned = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    //--------------------------------------------------------
    // Parse JSON
    //--------------------------------------------------------

    const result = JSON.parse(cleaned);

    //--------------------------------------------------------
    // Validation
    //--------------------------------------------------------

    const evaluation = {
      grammar: Number(result.grammar ?? 0),
      vocabulary: Number(result.vocabulary ?? 0),
      pronunciation: Number(result.pronunciation ?? 0),
      fluency: Number(result.fluency ?? 0),
      relevance: Number(result.relevance ?? 0),
      confidence: Number(result.confidence ?? 0),

      mistakes: Array.isArray(result.mistakes)
        ? result.mistakes
        : [],

      suggestions: Array.isArray(result.suggestions)
        ? result.suggestions
        : [],

      improvedAnswer:
        result.improvedAnswer ?? "",
    };

    return Response.json({
      success: true,
      result: evaluation,
    });

  } catch (error: any) {

    console.error("Gemini API Error:", error);

    return Response.json(
      {
        success: false,
        message:
          error?.message ??
          "Failed to evaluate interview.",
      },
      {
        status: 500,
      }
    );

  }
}