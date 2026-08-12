import { InterviewAttempt, RecruiterReport } from "@/types/interviewReport";

export type ObserverKey = "content" | "language" | "professional";
export type ObserverScoreMap = Record<ObserverKey, Array<number | null>>;
export interface ObserverNote {
  strength: string;
  improvement: string;
}
export type ObserverNoteMap = Record<ObserverKey, ObserverNote>;

export type TeacherDecision =
  | "Ready for further practice"
  | "Needs targeted improvement"
  | "Ready for a full mock interview";

export type PriorityArea =
  | "Content"
  | "Evidence"
  | "Language"
  | "Fluency"
  | "Professional performance";

export interface IntegratedTeacherFeedback {
  agreements: string[];
  differences: string[];
  confirmedStrength: string;
  priorityArea: PriorityArea;
  priorityAction: string;
  suggestedDecision: TeacherDecision;
  finalFeedback: string;
}

function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function observerScore(values: Array<number | null>): number | null {
  if (values.some((value) => value === null)) return null;
  return values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}

function cleanSentence(text: string) {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  return /[.!?]$/.test(cleaned) ? cleaned : `${cleaned}.`;
}

function getAvailableAttempts(attempts: InterviewAttempt[]) {
  return attempts.filter((attempt) => attempt.evaluation.evaluationStatus !== "unavailable");
}

function getAssessmentIndexes(attempts: InterviewAttempt[]) {
  const available = getAvailableAttempts(attempts);
  if (!available.length) {
    return { content: null, language: null, fluency: null } as const;
  }

  const content = average(
    available.map((attempt) => {
      const focus = attempt.evaluation.focusAnalysis;
      return average([
        focus.coverageScore / 10,
        focus.evidenceQualityScore / 10,
        attempt.evaluation.relevance.score,
      ]);
    }),
  );

  const language = average(
    available.map((attempt) =>
      average([
        attempt.evaluation.grammar.score,
        attempt.evaluation.vocabulary.score,
        attempt.evaluation.fluency.score,
      ]),
    ),
  );

  const fluency = average(available.map((attempt) => attempt.evaluation.fluency.score));

  return { content, language, fluency } as const;
}

function assessmentSourceLabel(attempts: InterviewAttempt[]) {
  const available = getAvailableAttempts(attempts);
  const live = available.filter((attempt) => attempt.evaluation.evaluationSource !== "backup_rubric").length;
  const backup = available.filter((attempt) => attempt.evaluation.evaluationSource === "backup_rubric").length;

  if (live && backup) return "the live AI/backup assessment";
  if (live) return "the live AI assessment";
  if (backup) return "the backup rubric";
  return "the available transcript evidence";
}

function pickPriority(
  contentScore: number | null,
  languageScore: number | null,
  professionalScore: number | null,
  attempts: InterviewAttempt[],
): PriorityArea {
  const available = getAvailableAttempts(attempts);
  const evidence = available.length
    ? average(available.map((attempt) => attempt.evaluation.focusAnalysis.evidenceQualityScore / 10))
    : 10;
  const fluency = available.length
    ? average(available.map((attempt) => attempt.evaluation.fluency.score))
    : 10;

  const candidates: Array<{ area: PriorityArea; value: number }> = [];
  if (contentScore !== null) candidates.push({ area: "Content", value: contentScore });
  if (languageScore !== null) candidates.push({ area: "Language", value: languageScore });
  if (professionalScore !== null) candidates.push({ area: "Professional performance", value: professionalScore });
  if (available.length) {
    candidates.push({ area: "Evidence", value: evidence });
    candidates.push({ area: "Fluency", value: fluency });
  }

  if (!candidates.length) return "Content";
  return candidates.sort((a, b) => a.value - b.value)[0].area;
}

function priorityActionFor(area: PriorityArea, notes: ObserverNoteMap, report: RecruiterReport) {
  const noteByArea: Partial<Record<PriorityArea, string>> = {
    Content: notes.content.improvement,
    Evidence: notes.content.improvement,
    Language: notes.language.improvement,
    Fluency: notes.language.improvement,
    "Professional performance": notes.professional.improvement,
  };

  const note = noteByArea[area]?.trim();
  if (note) return cleanSentence(note);

  const reportImprovement = report.improvements.find(Boolean);
  if (area === "Evidence") return "Use one specific example and make the action and result explicit.";
  if (area === "Professional performance") return "Maintain consistent eye contact, calm posture, and a steady speaking pace.";
  if (area === "Fluency") return "Use a steady pace, shorter idea groups, and fewer fillers or repeated phrases.";
  if (area === "Language") return "Use clear sentence structures and precise professional vocabulary throughout the answer.";
  return cleanSentence(reportImprovement || "Make each answer more specific and connect it clearly to the target job.");
}

function strongestArea(
  contentScore: number | null,
  languageScore: number | null,
  professionalScore: number | null,
) {
  const candidates = [
    { label: "content and response structure", value: contentScore },
    { label: "English language performance", value: languageScore },
    { label: "professional interview performance", value: professionalScore },
  ].filter((item): item is { label: string; value: number } => item.value !== null);

  return candidates.sort((a, b) => b.value - a.value)[0]?.label ?? "overall interview performance";
}

export function buildIntegratedTeacherFeedback(
  attempts: InterviewAttempt[],
  report: RecruiterReport,
  scores: ObserverScoreMap,
  notes: ObserverNoteMap,
): IntegratedTeacherFeedback {
  const contentScore = observerScore(scores.content);
  const languageScore = observerScore(scores.language);
  const professionalScore = observerScore(scores.professional);
  const indexes = getAssessmentIndexes(attempts);
  const source = assessmentSourceLabel(attempts);

  const agreements: string[] = [];
  const differences: string[] = [];

  if (contentScore !== null && indexes.content !== null) {
    if (Math.abs(contentScore - indexes.content) <= 2) {
      agreements.push(`Observer 1 and ${source} show a similar view of the candidate's content and response structure.`);
    } else {
      differences.push(`Observer 1 and ${source} differ on content quality; the teacher should check the transcript evidence before concluding.`);
    }
  }

  if (languageScore !== null && indexes.language !== null) {
    if (Math.abs(languageScore - indexes.language) <= 2) {
      agreements.push(`Observer 2 and ${source} broadly agree on the clarity and effectiveness of the candidate's English.`);
    } else {
      differences.push(`Observer 2 and ${source} differ on language performance; the teacher should prioritize what was actually understandable in the live response.`);
    }
  }

  if (professionalScore !== null) {
    differences.push(
      "Professional presence is confirmed by Observer 3 and the teacher because eye contact, posture, facial expression, and live professional manner cannot be reliably judged from transcript-based AI evidence.",
    );
  }

  if (!agreements.length) {
    agreements.push("The teacher can use the transcript, observer notes, and available assessment evidence together to confirm the candidate's strongest performance points.");
  }

  const priorityArea = pickPriority(contentScore, languageScore, professionalScore, attempts);
  const priorityAction = priorityActionFor(priorityArea, notes, report);
  const strongest = strongestArea(contentScore, languageScore, professionalScore);

  const explicitStrength =
    notes.content.strength.trim() ||
    notes.language.strength.trim() ||
    notes.professional.strength.trim() ||
    report.strengths[0] ||
    `The candidate showed good ${strongest}.`;
  const confirmedStrength = cleanSentence(explicitStrength);

  const completedObserverScores = [contentScore, languageScore, professionalScore].filter(
    (value): value is number => value !== null,
  );
  const observerAverage = completedObserverScores.length ? average(completedObserverScores) : null;
  const combinedReference = observerAverage === null
    ? report.overallScore
    : average([observerAverage, report.overallScore]);

  const suggestedDecision: TeacherDecision = combinedReference >= 8
    ? "Ready for a full mock interview"
    : combinedReference >= 6.5
      ? "Ready for further practice"
      : "Needs targeted improvement";

  const finalFeedback = [
    `The candidate completed all three interview questions and showed ${strongest}.`,
    confirmedStrength,
    `The available observer evidence and ${source} should be considered together rather than treated as a single automatic score.`,
    `The priority for the next practice is ${priorityArea.toLowerCase()}: ${priorityAction.charAt(0).toLowerCase()}${priorityAction.slice(1)}`,
  ].join(" ");

  return {
    agreements,
    differences,
    confirmedStrength,
    priorityArea,
    priorityAction,
    suggestedDecision,
    finalFeedback,
  };
}
