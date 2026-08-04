import type { EvaluationResult } from "@/types/evaluation";

export const EVALUATION_VERSION = "fix37-v1" as const;

export type ReliabilitySeverity = "pass" | "warning" | "fail";

export interface ReliabilityCheck {
  id: string;
  label: string;
  severity: ReliabilitySeverity;
  message: string;
}

function includesOverlyPositiveLanguage(text: string): boolean {
  return /\b(excellent|outstanding|exceptional|perfect|very strong)\b/i.test(text);
}

export function runEvaluationReliabilityChecks(
  result: EvaluationResult
): ReliabilityCheck[] {
  const checks: ReliabilityCheck[] = [];
  const focus = result.focusAnalysis;

  checks.push({
    id: "overall-range",
    label: "Overall score range",
    severity: result.overall >= 0 && result.overall <= 10 ? "pass" : "fail",
    message:
      result.overall >= 0 && result.overall <= 10
        ? `Overall score ${result.overall} is within 0–10.`
        : `Overall score ${result.overall} is outside 0–10.`,
  });

  const positiveMismatch =
    result.overall < 6.5 && includesOverlyPositiveLanguage(result.overallFeedback);
  checks.push({
    id: "feedback-score-consistency",
    label: "Feedback matches score",
    severity: positiveMismatch ? "fail" : "pass",
    message: positiveMismatch
      ? "Overall feedback is overly positive for the displayed score."
      : "Overall feedback does not contradict the displayed score.",
  });

  const coverageRelevanceGap = result.relevance.score * 10 - focus.coverageScore;
  checks.push({
    id: "coverage-relevance-consistency",
    label: "Coverage and relevance consistency",
    severity:
      focus.totalIdeas > 0 && coverageRelevanceGap >= 45
        ? "fail"
        : focus.totalIdeas > 0 && coverageRelevanceGap >= 30
          ? "warning"
          : "pass",
    message:
      focus.totalIdeas === 0
        ? "No question-specific criteria are configured for this question."
        : `Coverage is ${focus.coverageScore}% and relevance is ${result.relevance.score}/10.`,
  });

  const hasEvidenceSignals = focus.ideaAssessments.some(
    (idea) =>
      idea.status === "covered" &&
      idea.evidence.trim().length >= 8
  );

  checks.push({
    id: "evidence-quality-consistency",
    label: "Evidence score is supported",
    severity:
      focus.evidenceQualityScore >= 70 && !hasEvidenceSignals
        ? "warning"
        : "pass",
    message:
      focus.evidenceQualityScore >= 70 && !hasEvidenceSignals
        ? "Evidence Quality is high but clear supporting evidence was not detected."
        : `Evidence Quality is ${focus.evidenceQualityScore}%.`,
  });

  const countedIdeas =
    focus.coveredTopics.length +
    focus.partialTopics.length +
    focus.missingTopics.length;
  checks.push({
    id: "criteria-count",
    label: "Criteria totals agree",
    severity:
      focus.totalIdeas === 0 || countedIdeas === focus.totalIdeas ? "pass" : "fail",
    message:
      focus.totalIdeas === 0
        ? "No criteria totals to compare."
        : `${countedIdeas} classified criteria out of ${focus.totalIdeas}.`,
  });

  checks.push({
    id: "coach-verdict",
    label: "Coach verdict consistency",
    severity:
      result.coach.good &&
      (result.overall < 7 || result.relevance.score < 7)
        ? "fail"
        : "pass",
    message:
      result.coach.good &&
      (result.overall < 7 || result.relevance.score < 7)
        ? "The answer is marked good although Overall or Relevance is below 7."
        : "Coach verdict follows the current score threshold.",
  });

  return checks;
}
