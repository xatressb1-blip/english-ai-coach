/**
 * ============================================================
 * English AI Coach Platform
 * ------------------------------------------------------------
 * Module:
 * Evaluation Service
 *
 * File:
 * services/evaluationService.ts
 *
 * Version:
 * 2.0 Stable
 *
 * Status:
 * Development
 *
 * Description
 * ------------------------------------------------------------
 * Main orchestrator of interview evaluation.
 *
 * Responsibilities
 *
 * ✓ Validate transcript
 * ✓ Analyse answer focus
 * ✓ Generate coaching advice
 * ✓ Request Gemini evaluation
 * ✓ Merge all evaluation modules
 * ✓ Calculate overall score
 *
 * ============================================================
 */

import {
  EvaluationResult,
  ScoreDetail,
  GrammarResult,
  calculateOverall,
} from "@/types/evaluation";

import {

  analyzeFocus,

} from "./focusAnalyzer";

import {

  coachQuestion,

} from "./questionCoach";

/* ============================================================
 * Timeout
 * ============================================================
 */

const REQUEST_TIMEOUT = 20000;

/* ============================================================
 * Validation
 * ============================================================
 */

function validateTranscript(

  transcript: string

) {

  if (!transcript.trim()) {

    throw new Error(

      "Please record your answer first."

    );

  }

}

/* ============================================================
 * Safe Fetch
 * ============================================================
 */

async function requestEvaluation(

  transcript: string

) {

  const controller =

    new AbortController();

  const timeout =

    setTimeout(() => {

      controller.abort();

    }, REQUEST_TIMEOUT);

  try {

    const response =

      await fetch("/api/evaluate", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          prompt: transcript,

        }),

        signal: controller.signal,

      });

    let data: any = {};

    try {

      data = await response.json();

    }

    catch {

      throw new Error(

        "Invalid server response."

      );

    }

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

    if (!data.result) {

      throw new Error(

        "No evaluation result received."

      );

    }

    return data.result;

  }

  catch (error: any) {

    if (

      error.name === "AbortError"

    ) {

      throw new Error(

        "Gemini request timeout. Please try again."

      );

    }

    throw error;

  }

  finally {

    clearTimeout(timeout);

  }

}

/* ============================================================
 * Builders
 * ============================================================
 */

function buildGrammar(
  result: any
): GrammarResult {

  return {

    score:

      Number(result.grammar ?? 0),

    comment:

      result.grammarComment ?? "",

    mistakes:

      Array.isArray(result.mistakes)

        ? result.mistakes

        : [],

  };

}

function buildVocabulary(

  result: any

): ScoreDetail {

  return {

    score:

      Number(result.vocabulary ?? 0),

    comment:

      result.vocabularyComment ?? "",

  };

}

function buildPronunciation(

  result: any

): ScoreDetail {

  return {

    score:

      Number(result.pronunciation ?? 0),

    comment:

      result.pronunciationComment ?? "",

  };

}
function buildFluency(
  result: any
): ScoreDetail {

  return {
    score:
      Number(result.fluency ?? 0),

    comment:
      result.fluencyComment ?? "",
  };

}

function buildRelevance(
  result: any
): ScoreDetail {

  return {
    score:
      Number(result.relevance ?? 0),

    comment:
      result.relevanceComment ?? "",
  };

}

function buildConfidence(
  result: any
): ScoreDetail {

  return {
    score:
      Number(result.confidence ?? 0),

    comment:
      result.confidenceComment ?? "",
  };

}

/* ============================================================
 * Evaluation Builder
 * ============================================================
 */

function buildEvaluation(

  result: any,

  focusAnalysis: ReturnType<typeof analyzeFocus>,

  coach: ReturnType<typeof coachQuestion>

): EvaluationResult {

  return {

    overall: 0,

    overallFeedback:

      result.overallFeedback ?? "",

    grammar:

      buildGrammar(result),

    vocabulary:

      buildVocabulary(result),

    pronunciation:

      buildPronunciation(result),

    fluency:

      buildFluency(result),

    relevance:

      buildRelevance(result),

    confidence:

      buildConfidence(result),

    suggestions:

      Array.isArray(result.suggestions)

        ? result.suggestions

        : [],

    focusAnalysis,

    coach,

    improvedAnswer:

      result.improvedAnswer ?? "",

  };

}

/* ============================================================
 * Public API
 * ============================================================
 */

export async function evaluateInterview(

  question: string,

  transcript: string

): Promise<EvaluationResult> {

  validateTranscript(transcript);

  const focusAnalysis =
    analyzeFocus(
      question,
      transcript
    );

  const coach =
    coachQuestion(
      question,
      transcript
    );

  const result =
    await requestEvaluation(
      transcript
    );

  const evaluation =
    buildEvaluation(

      result,

      focusAnalysis,

      coach

    );

  evaluation.overall =
    calculateOverall({

      grammar:
        evaluation.grammar,

      vocabulary:
        evaluation.vocabulary,

      pronunciation:
        evaluation.pronunciation,

      fluency:
        evaluation.fluency,

      relevance:
        evaluation.relevance,

      confidence:
        evaluation.confidence,

      suggestions:
        evaluation.suggestions,

      focusAnalysis:
        evaluation.focusAnalysis,

      coach:
        evaluation.coach,

      improvedAnswer:
        evaluation.improvedAnswer,

    });

  return evaluation;

}

/* ============================================================
 * End of File
 * ============================================================
 */