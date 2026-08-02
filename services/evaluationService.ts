import {
  EvaluationResult,
  ScoreDetail,
  GrammarResult,
  calculateOverall,
} from "@/types/evaluation";
import { InterviewQuestion } from "@/types/InterviewQuestion";
import { analyzeFocus } from "./focusAnalyzer";

const REQUEST_TIMEOUT = 30000;

function validateTranscript(transcript: string) {
  if (!transcript.trim()) {
    throw new Error("Please record your answer first.");
  }
}

async function requestEvaluation(
  question: InterviewQuestion,
  transcript: string
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch("/api/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript,
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
      throw new Error("Invalid server response.");
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message ?? "Failed to evaluate interview.");
    }

    if (!data.result) {
      throw new Error("No evaluation result received.");
    }

    return data.result;
  } catch (error: any) {
    if (error?.name === "AbortError") {
      throw new Error("Gemini request timeout. Please try again.");
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
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
    suggestions: evaluation.suggestions,
    focusAnalysis: evaluation.focusAnalysis,
    coach: evaluation.coach,
    improvedAnswer: evaluation.improvedAnswer,
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
