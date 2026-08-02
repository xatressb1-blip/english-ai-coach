import { generateEvaluation } from "@/services/geminiClient";

interface EvaluationQuestionPayload {
  id?: number;
  title?: string;
  description?: string;
  level?: string;
  keywords?: string[];
  grammarFocus?: string[];
  vocabularyLevel?: string;
  sampleAnswer?: string;
  commonMistakes?: string[];
  expectedIdeas?: Array<{
    id: string;
    label: string;
    description: string;
    weight?: number;
  }>;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const transcript =
      typeof body?.transcript === "string"
        ? body.transcript.trim()
        : "";

    const question = body?.question as EvaluationQuestionPayload | undefined;

    if (!transcript) {
      return Response.json(
        {
          success: false,
          message: "Transcript is empty.",
        },
        { status: 400 }
      );
    }

    if (!question?.title || !question?.sampleAnswer) {
      return Response.json(
        {
          success: false,
          message: "Question context or sample answer is missing.",
        },
        { status: 400 }
      );
    }

    const result = await generateEvaluation({
      transcript,
      question: {
        title: question.title,
        description: question.description ?? "",
        level: question.level ?? "",
        keywords: Array.isArray(question.keywords) ? question.keywords : [],
        grammarFocus: Array.isArray(question.grammarFocus)
          ? question.grammarFocus
          : [],
        vocabularyLevel: question.vocabularyLevel ?? "",
        sampleAnswer: question.sampleAnswer,
        commonMistakes: Array.isArray(question.commonMistakes)
          ? question.commonMistakes
          : [],
        expectedIdeas: Array.isArray(question.expectedIdeas)
          ? question.expectedIdeas
          : [],
      },
    });

    return Response.json({
      success: true,
      result,
    });
  } catch (error: any) {
    console.error("[Evaluate API]", error);

    return Response.json(
      {
        success: false,
        message: error?.message ?? "Unknown Server Error",
      },
      { status: 500 }
    );
  }
}
