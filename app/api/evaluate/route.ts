import { generateEvaluation } from "@/services/geminiClient";
import type { AiErrorCode } from "@/services/aiError";

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

function extractRetryAfterSeconds(error: any): number | undefined {
  const raw = JSON.stringify(error ?? {});
  const retryMatch = raw.match(/retry(?:Delay| in)[^0-9]*(\d+(?:\.\d+)?)s?/i);
  if (!retryMatch) return undefined;
  const value = Math.ceil(Number(retryMatch[1]));
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function classifyGeminiError(error: any): {
  status: number;
  code: AiErrorCode;
  message: string;
  retryable: boolean;
  retryAfterSeconds?: number;
} {
  const status = Number(error?.status ?? error?.error?.code ?? 500);
  const rawMessage = String(error?.message ?? "");
  const serialized = `${rawMessage} ${JSON.stringify(error ?? {})}`.toLowerCase();
  const retryAfterSeconds = extractRetryAfterSeconds(error);

  if (status === 503 || serialized.includes("high demand") || serialized.includes("unavailable")) {
    return {
      status: 503,
      code: "AI_HIGH_DEMAND",
      message: "AI is temporarily busy. Your answer has been saved.",
      retryable: true,
      retryAfterSeconds: retryAfterSeconds ?? 3,
    };
  }

  if (status === 429) {
    const dailyQuota =
      serialized.includes("perday") ||
      serialized.includes("per_day") ||
      serialized.includes("requestsperday") ||
      serialized.includes("free_tier_requests") ||
      serialized.includes("quota exceeded for metric") && serialized.includes("permodel-freetier");

    if (dailyQuota) {
      return {
        status: 429,
        code: "AI_DAILY_QUOTA",
        message: "AI evaluation is unavailable for this session. Your answer has been saved. Please continue with observer and teacher assessment.",
        retryable: false,
      };
    }

    return {
      status: 429,
      code: "AI_RATE_LIMIT",
      message: "AI is temporarily receiving too many requests. Your answer has been saved.",
      retryable: true,
      retryAfterSeconds,
    };
  }

  return {
    status: status >= 400 && status < 600 ? status : 500,
    code: "AI_UNKNOWN",
    message: "AI evaluation is temporarily unavailable. Your answer has been saved.",
    retryable: false,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const transcript =
      typeof body?.transcript === "string"
        ? body.transcript.trim()
        : "";

    const question = body?.question as EvaluationQuestionPayload | undefined;
    const fastEvaluation = body?.fastEvaluation === true;

    if (!transcript) {
      return Response.json(
        { success: false, code: "AI_INVALID_RESPONSE", message: "Transcript is empty.", retryable: false },
        { status: 400 }
      );
    }

    if (!question?.title || !question?.sampleAnswer) {
      return Response.json(
        { success: false, code: "AI_INVALID_RESPONSE", message: "Question context or sample answer is missing.", retryable: false },
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
        grammarFocus: Array.isArray(question.grammarFocus) ? question.grammarFocus : [],
        vocabularyLevel: question.vocabularyLevel ?? "",
        sampleAnswer: question.sampleAnswer,
        commonMistakes: Array.isArray(question.commonMistakes) ? question.commonMistakes : [],
        expectedIdeas: Array.isArray(question.expectedIdeas) ? question.expectedIdeas : [],
      },
      fastEvaluation,
    });

    return Response.json({ success: true, result });
  } catch (error: any) {
    console.error("[Evaluate API]", error);
    const classified = classifyGeminiError(error);

    return Response.json(
      {
        success: false,
        code: classified.code,
        message: classified.message,
        retryable: classified.retryable,
        retryAfterSeconds: classified.retryAfterSeconds,
      },
      { status: classified.status }
    );
  }
}
