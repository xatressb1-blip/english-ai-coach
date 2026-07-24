import {
  EvaluationResult,
  calculateOverall,
} from "@/types/evaluation";

import {
  analyzeFocus,
} from "./focusAnalyzer";
import {
  coachQuestion,
} from "./questionCoach";

export async function evaluateInterview(

  question: string,

  transcript: string

): Promise<EvaluationResult> {

  if (!transcript.trim()) {

    throw new Error(
      "Please record your answer first."
    );

  }

  // Phân tích độ đúng trọng tâm
  const focusAnalysis = analyzeFocus(

    question,

    transcript

  );
const coach = coachQuestion(

  question,

  transcript

);
  const response = await fetch("/api/evaluate", {

    method: "POST",

    headers: {

      "Content-Type": "application/json",

    },

    body: JSON.stringify({

      prompt: transcript,

    }),

  });

  const data = await response.json();

  if (!response.ok) {

    throw new Error(

      data.message ??

      "Failed to evaluate interview."

    );

  }

  if (!data.success) {

    throw new Error(

      data.message ??

      "Evaluation failed."

    );

  }

  const result = data.result;

  if (!result) {

    throw new Error(

      "No evaluation result received."

    );

  }

  const evaluation: EvaluationResult = {

    overall: 0,

    overallFeedback:

      result.overallFeedback ?? "",

    grammar: {

      score: Number(result.grammar ?? 0),

      comment:

        result.grammarComment ?? "",

      mistakes: Array.isArray(result.mistakes)

        ? result.mistakes

        : [],

    },

    vocabulary: {

      score: Number(

        result.vocabulary ?? 0

      ),

      comment:

        result.vocabularyComment ?? "",

    },

    pronunciation: {

      score: Number(

        result.pronunciation ?? 0

      ),

      comment:

        result.pronunciationComment ?? "",

    },

    fluency: {

      score: Number(

        result.fluency ?? 0

      ),

      comment:

        result.fluencyComment ?? "",

    },

    relevance: {

      score: Number(

        result.relevance ?? 0

      ),

      comment:

        result.relevanceComment ?? "",

    },

    confidence: {

      score: Number(

        result.confidence ?? 0

      ),

      comment:

        result.confidenceComment ?? "",

    },

    suggestions: Array.isArray(

      result.suggestions

    )

      ? result.suggestions

      : [],

    focusAnalysis,

coach,

improvedAnswer:

      result.improvedAnswer ?? "",

  };

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

  return evaluation;

}