// ======================================================
// File: types/evaluation.ts
// English AI Coach
// Evaluation Data Model
// ======================================================

export interface ScoreDetail {
  score: number;
  comment: string;
}

export interface GrammarResult extends ScoreDetail {
  mistakes: string[];
}

export type IdeaCoverageStatus = "covered" | "partial" | "missing";

export interface IdeaAssessment {
  id: string;
  label: string;
  status: IdeaCoverageStatus;
  evidence: string;
  coachingTip: string;
}

export interface FocusAnalysis {
  overallScore: number;
  coverageScore: number;
  structureScore: number;
  lengthScore: number;
  evidenceQualityScore: number;
  estimatedWords: number;
  estimatedSentences: number;
  totalIdeas: number;
  coveredTopics: string[];
  partialTopics: string[];
  missingTopics: string[];
  extraTopics: string[];
  ideaAssessments: IdeaAssessment[];
  feedback: string;
}

export interface CoachResult {
  good: boolean;
  feedback: string[];
}

export interface EvaluationResult {
  evaluationVersion: string;
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
  result: Pick<
    EvaluationResult,
    "grammar" | "vocabulary" | "pronunciation" | "fluency" | "relevance" | "confidence"
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

  return Number(average.toFixed(1));
}
