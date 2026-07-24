export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
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

Evaluate the following interview answer.

Candidate Answer:
"${prompt}"

Return ONLY valid JSON.

{
  "grammar": 0,
  "vocabulary": 0,
  "pronunciation": 0,
  "fluency": 0,
  "relevance": 0,
  "confidence": 0,
  "mistakes": [],
  "suggestions": [],
  "improvedAnswer": ""
}
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!,
        },

        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: evaluationPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);

      return Response.json(
        {
          success: false,
          message: data.error?.message ?? "Gemini Error",
        },
        {
          status: 500,
        }
      );
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty AI response");
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const result = JSON.parse(cleaned);

    return Response.json({
      success: true,
      result,
    });

  } catch (error: any) {

    console.error(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );

  }
}