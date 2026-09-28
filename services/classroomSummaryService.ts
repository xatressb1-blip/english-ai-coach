import type { EvaluationResult } from "@/types/evaluation";
import type { ClassroomObservation, ClassroomObservationRole } from "@/services/classroomSessionTypes";

export interface ClassroomSummaryCandidate {
  candidateIndex: number;
  candidateName: string;
  questionId: number;
  questionTitle: string;
  transcript: string;
  evaluation: EvaluationResult;
  aiState: "pending" | "live" | "backup";
}

export interface ObserverRoleSummary {
  role: ClassroomObservationRole;
  label: string;
  totalScore: number | null;
  completedCriteria: number;
  strength: string;
  improvement: string;
}

export interface ClassroomSummary {
  completedAnswers: number;
  liveAiCount: number;
  backupCount: number;
  pendingCount: number;
  observerCompletedCount: number;
  observerCriterionCount: number;
  observerCriterionTotal: number;
  averageOverall: number;
  averageCoverage: number;
  observerRoleSummaries: ObserverRoleSummary[];
  strengths: string[];
  improvements: string[];
}

const ROLE_LABELS: Record<ClassroomObservationRole, string> = {
  content: "Observer 1 · Content",
  language: "Observer 2 · English",
  professional: "Observer 3 · Professional",
};

function average(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function completedCriteria(observation: ClassroomObservation | undefined) {
  return observation?.scores.filter((value) => value !== null).length ?? 0;
}

function roleTotal(observation: ClassroomObservation | undefined) {
  if (!observation) return null;
  if (observation.totalScore !== null) return observation.totalScore;
  const scores = observation.scores;
  if (scores.length < 5 || scores.some((value) => value === null)) return null;
  return scores.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}

export function buildClassroomSummary(
  candidates: ClassroomSummaryCandidate[],
  observations: ClassroomObservation[],
): ClassroomSummary {
  const liveAiCount = candidates.filter((item) => item.aiState === "live").length;
  const pendingCount = candidates.filter((item) => item.aiState === "pending").length;
  const backupCount = candidates.filter((item) => item.aiState === "backup").length;
  const averageOverall = average(candidates.map((item) => item.evaluation.overall));
  const averageCoverage = average(candidates.map((item) => item.evaluation.focusAnalysis.coverageScore));

  const roles: ClassroomObservationRole[] = ["content", "language", "professional"];
  const observerRoleSummaries = roles.map((role) => {
    const observation = observations.find((item) => item.role === role);
    return {
      role,
      label: ROLE_LABELS[role],
      totalScore: roleTotal(observation),
      completedCriteria: completedCriteria(observation),
      strength: observation?.strength ?? "",
      improvement: observation?.improvement ?? "",
    };
  });

  const strengths: string[] = [];
  const improvements: string[] = [];
  const content = observerRoleSummaries.find((item) => item.role === "content")?.totalScore ?? null;
  const language = observerRoleSummaries.find((item) => item.role === "language")?.totalScore ?? null;
  const professional = observerRoleSummaries.find((item) => item.role === "professional")?.totalScore ?? null;

  if (averageCoverage >= 68 || (content !== null && content >= 7)) {
    strengths.push("The candidate generally addressed the three interview questions with relevant content and a recognizable response structure.");
  }
  if (language !== null && language >= 7) {
    strengths.push("The candidate's spoken English was generally understandable and appropriate for a job-interview context.");
  }
  if (professional !== null && professional >= 7) {
    strengths.push("The candidate demonstrated generally professional interview behavior, including confidence, voice, pace, and attitude.");
  }

  const contentImprovement = observerRoleSummaries.find((item) => item.role === "content")?.improvement;
  const languageImprovement = observerRoleSummaries.find((item) => item.role === "language")?.improvement;
  const professionalImprovement = observerRoleSummaries.find((item) => item.role === "professional")?.improvement;

  if (contentImprovement) improvements.push(contentImprovement);
  if (languageImprovement) improvements.push(languageImprovement);
  if (professionalImprovement) improvements.push(professionalImprovement);
  if (!improvements.length && averageCoverage < 68) {
    improvements.push("Use the expected response structure more consistently and include specific evidence in the three answers.");
  }
  if (!improvements.length && language !== null && language < 7) {
    improvements.push("Improve spoken clarity, fluency, linking expressions, and job-interview vocabulary.");
  }
  if (!improvements.length && professional !== null && professional < 7) {
    improvements.push("Maintain stronger eye contact, posture, calm pace, and professional interview behavior.");
  }

  if (!strengths.length) {
    strengths.push("The candidate completed all three interview questions and received evidence from both AI analysis and human observation.");
  }
  if (!improvements.length) {
    improvements.push("Continue practising with one specific improvement target and repeat the three-question interview.");
  }

  const observerCriterionCount = observations.reduce((sum, item) => sum + completedCriteria(item), 0);
  return {
    completedAnswers: candidates.length,
    liveAiCount,
    backupCount,
    pendingCount,
    observerCompletedCount: observerRoleSummaries.filter((item) => item.totalScore !== null).length,
    observerCriterionCount,
    observerCriterionTotal: 15,
    averageOverall,
    averageCoverage,
    observerRoleSummaries,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
  };
}
