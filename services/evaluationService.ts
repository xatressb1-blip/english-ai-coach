import {
  EvaluationResult,
  ScoreDetail,
  GrammarResult,
  calculateOverall,
} from "@/types/evaluation";
import { InterviewQuestion } from "@/types/InterviewQuestion";
import { analyzeFocus } from "./focusAnalyzer";
import { EVALUATION_VERSION } from "./evaluationReliability";
import { AiEvaluationError, type AiErrorCode } from "./aiError";

const REQUEST_TIMEOUT = 25000;
const MAX_ATTEMPTS = 2;

function validateTranscript(transcript: string) {
  if (!transcript.trim()) {
    throw new Error("Please record your answer first.");
  }
}

async function requestEvaluationOnce(
  question: InterviewQuestion,
  transcript: string
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript,
        fastEvaluation: question.id >= 1 && question.id <= 3,
        question: {
          id: question.id,
          title: question.title,
          description: question.description,
          level: question.level,
          keywords: question.keywords,
          grammarFocus: question.grammarFocus,
          vocabularyLevel: question.vocabularyLevel,
          sampleAnswer: question.sampleAnswer,
          commonMistakes: question.commonMistakes,
          expectedIdeas: question.expectedIdeas ?? [],
        },
      }),
      signal: controller.signal,
    });

    let data: any = {};
    try {
      data = await response.json();
    } catch {
      throw new AiEvaluationError({
        code: "AI_INVALID_RESPONSE",
        message: "AI returned an invalid response. Your answer has been saved.",
        retryable: false,
      });
    }

    if (!response.ok || !data.success) {
      throw new AiEvaluationError({
        code: (data.code ?? "AI_UNKNOWN") as AiErrorCode,
        message: data.message ?? "AI evaluation is temporarily unavailable. Your answer has been saved.",
        retryable: data.retryable === true,
        retryAfterSeconds:
          Number.isFinite(Number(data.retryAfterSeconds))
            ? Number(data.retryAfterSeconds)
            : undefined,
      });
    }

    if (!data.result) {
      throw new AiEvaluationError({
        code: "AI_INVALID_RESPONSE",
        message: "No AI evaluation was returned. Your answer has been saved.",
        retryable: false,
      });
    }

    return data.result;
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new AiEvaluationError({
        code: "AI_TIMEOUT",
        message: "AI is taking longer than expected. Your answer has been saved.",
        retryable: true,
      });
    }

    if (error instanceof AiEvaluationError) {
      throw error;
    }

    throw new AiEvaluationError({
      code: "AI_NETWORK",
      message: "The AI service could not be reached. Your answer has been saved.",
      retryable: true,
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function requestEvaluation(question: InterviewQuestion, transcript: string) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      return await requestEvaluationOnce(question, transcript);
    } catch (error) {
      lastError = error;

      if (!(error instanceof AiEvaluationError)) {
        break;
      }

      // Never retry daily quota or other non-retryable failures.
      if (!error.retryable || error.code === "AI_DAILY_QUOTA") {
        break;
      }

      if (attempt < MAX_ATTEMPTS) {
        const delayMs = Math.min(
          Math.max((error.retryAfterSeconds ?? 2) * 1000, 1200),
          5000
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}

function clampScore(value: unknown): number {
  const score = Number(value ?? 0);

  if (!Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(10, score));
}

function buildGrammar(result: any): GrammarResult {
  return {
    score: clampScore(result.grammar),
    comment: result.grammarComment ?? "",
    mistakes: Array.isArray(result.mistakes) ? result.mistakes : [],
  };
}

function buildScore(
  score: unknown,
  comment: unknown
): ScoreDetail {
  return {
    score: clampScore(score),
    comment: typeof comment === "string" ? comment : "",
  };
}

function buildEvaluation(
  result: any,
  focusAnalysis: ReturnType<typeof analyzeFocus>,
  coach: EvaluationResult["coach"]
): EvaluationResult {
  return {
    evaluationVersion: EVALUATION_VERSION,
    evaluationStatus: "available",
    evaluationSource: "live_ai",
    overall: 0,
    overallFeedback: result.overallFeedback ?? "",
    grammar: buildGrammar(result),
    vocabulary: buildScore(result.vocabulary, result.vocabularyComment),
    pronunciation: buildScore(
      result.pronunciation,
      result.pronunciationComment
    ),
    fluency: buildScore(result.fluency, result.fluencyComment),
    relevance: buildScore(result.relevance, result.relevanceComment),
    confidence: buildScore(result.confidence, result.confidenceComment),
    suggestions: Array.isArray(result.suggestions)
      ? result.suggestions
      : [],
    focusAnalysis,
    coach,
    improvedAnswer: result.improvedAnswer ?? "",
  };
}

export async function evaluateInterview(
  question: InterviewQuestion,
  transcript: string
): Promise<EvaluationResult> {
  validateTranscript(transcript);

  const result = await requestEvaluation(question, transcript);
  const focusAnalysis = analyzeFocus(
    question,
    transcript,
    result.contentAssessment
  );

  // Build the initial result first. The coach message is finalized only
  // after the same AI scores used by the overall badge are available.
  const evaluation = buildEvaluation(result, focusAnalysis, {
    good: false,
    feedback: [],
  });

  evaluation.overall = calculateOverall({
    grammar: evaluation.grammar,
    vocabulary: evaluation.vocabulary,
    pronunciation: evaluation.pronunciation,
    fluency: evaluation.fluency,
    relevance: evaluation.relevance,
    confidence: evaluation.confidence,
  });

  // Keep the coaching verdict consistent with the displayed score.
  // "Excellent" is shown only when both overall quality and relevance
  // are strong. Otherwise, show concrete improvement guidance.
  const isStrongAnswer =
    evaluation.overall >= 7 &&
    evaluation.relevance.score >= 7;

  if (isStrongAnswer) {
    evaluation.coach = {
      good: true,
      feedback: [],
    };
  } else {
    const feedback = [
      evaluation.overallFeedback,
      evaluation.relevance.comment,
      ...evaluation.suggestions,
    ]
      .filter((item): item is string =>
        typeof item === "string" && item.trim().length > 0
      )
      .map((item) => item.trim())
      .filter((item, index, items) =>
        items.indexOf(item) === index
      )
      .slice(0, 4);

    evaluation.coach = {
      good: false,
      feedback:
        feedback.length > 0
          ? feedback
          : [
              "Your answer needs more relevant details, clearer structure, and stronger supporting examples.",
            ],
    };
  }

  return evaluation;
}


export function buildUnavailableEvaluation(
  question: InterviewQuestion,
  transcript: string,
  reason = "AI evaluation unavailable"
): EvaluationResult {
  const focusAnalysis = analyzeFocus(question, transcript, undefined);
  const unavailable = { score: 0, comment: "Not evaluated by AI." };
  return {
    evaluationVersion: EVALUATION_VERSION,
    evaluationStatus: "unavailable",
    evaluationSource: "unavailable",
    evaluationError: reason,
    overall: 0,
    overallFeedback: "AI evaluation was unavailable. Use observer evidence and teacher judgement.",
    grammar: { ...unavailable, mistakes: [] },
    vocabulary: unavailable, pronunciation: unavailable, fluency: unavailable,
    relevance: unavailable, confidence: unavailable, suggestions: [],
    focusAnalysis, coach: { good: false, feedback: ["Teacher review required."] },
    improvedAnswer: "",
  };
}
