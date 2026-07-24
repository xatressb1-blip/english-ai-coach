// ======================================================
// File: types/evaluation.ts
// English AI Coach
// Evaluation Data Model
// ======================================================

/**
 * Score with AI feedback
 */
export interface ScoreDetail {

  score: number;

  comment: string;

}

export interface GrammarResult
  extends ScoreDetail {

  mistakes: string[];

}

/**
 * Focus Analyzer
 */
export interface FocusAnalysis {

  sentenceCount: number;

  isTooShort: boolean;

  isTooLong: boolean;

  isFocused: boolean;

  feedback: string;

}
export interface CoachResult {

  good: boolean;

  feedback: string[];

}
export interface EvaluationResult {

  overall: number;

  overallFeedback: string;

  grammar: GrammarResult;

  vocabulary: ScoreDetail;

  pronunciation: ScoreDetail;

  fluency: ScoreDetail;

  relevance: ScoreDetail;

  confidence: ScoreDetail;

  suggestions: string[];

 focusAnalysis: FocusAnalysis;

coach: CoachResult;

improvedAnswer: string;

}

export function calculateOverall(

  result: Omit<

    EvaluationResult,

    "overall" | "overallFeedback"

  >

): number {

  const average = (

    result.grammar.score +

    result.vocabulary.score +

    result.pronunciation.score +

    result.fluency.score +

    result.relevance.score +

    result.confidence.score

  ) / 6;

  return Number(

    average.toFixed(1)

  );

}