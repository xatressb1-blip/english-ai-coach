import { CandidateQuestionResult } from "@/types/candidateQuestion";
import { EVALUATION_VERSION } from "@/services/evaluationReliability";
import {
  InterviewAttempt,
  RecruiterReport,
  SavedRecruiterReport,
  TrainingLevel,
} from "@/types/interviewReport";

const REPORT_STORAGE_KEY = "english-ai-recruiter-reports";

const average = (values: number[]) =>
  values.length
    ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1))
    : 0;

export function buildRecruiterReport(attempts: InterviewAttempt[], candidateName = "Candidate"): RecruiterReport {
  const sorted = [...attempts].sort((a, b) => a.evaluation.overall - b.evaluation.overall);
  const weakestAttempt = sorted[0] ?? null;
  const bestAttempt = sorted.at(-1) ?? null;

  const overallScore = average(attempts.map((item) => item.evaluation.overall));
  const readiness = overallScore < 5
    ? "Developing"
    : overallScore < 7
      ? "Nearly Ready"
      : overallScore < 8.5
        ? "Interview Ready"
        : "Strong Candidate";

  const scoreBreakdown = {
    grammar: average(attempts.map((item) => item.evaluation.grammar.score)),
    vocabulary: average(attempts.map((item) => item.evaluation.vocabulary.score)),
    pronunciation: average(attempts.map((item) => item.evaluation.pronunciation.score)),
    fluency: average(attempts.map((item) => item.evaluation.fluency.score)),
    relevance: average(attempts.map((item) => item.evaluation.relevance.score)),
    confidence: average(attempts.map((item) => item.evaluation.confidence.score)),
  };

  const metrics = [
    ["Grammar accuracy", scoreBreakdown.grammar],
    ["Vocabulary", scoreBreakdown.vocabulary],
    ["Pronunciation", scoreBreakdown.pronunciation],
    ["Fluency", scoreBreakdown.fluency],
    ["Answer relevance", scoreBreakdown.relevance],
    ["Confidence", scoreBreakdown.confidence],
  ] as const;

  const strengths = [...metrics]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, score]) => `${name}: ${score}/10`);

  const improvements = [...metrics]
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([name, score]) => `${name}: ${score}/10 — practise this area in your next attempt.`);

  const recruiterImpression = overallScore >= 8.5
    ? "You presented yourself as a confident, relevant, and professional candidate. Your answers would create a strong first impression in a real interview."
    : overallScore >= 7
      ? "You appear prepared and professional. Your answers are generally relevant, but stronger examples and smoother delivery would make you more convincing."
      : overallScore >= 5
        ? "You show potential and a positive attitude, but several answers need clearer structure, stronger examples, and more confident delivery."
        : "You are still developing interview readiness. Focus first on answering the question directly, using complete sentences, and giving one clear example.";

  return {
    evaluationVersion: attempts[0]?.evaluation.evaluationVersion ?? EVALUATION_VERSION,
    candidateName,
    overallScore,
    readiness,
    recruiterImpression,
    strengths,
    improvements,
    recommendedNextPractice: [
      weakestAttempt
        ? `Practise “${weakestAttempt.questionTitle}” again and add one specific example.`
        : "Complete all questions in this level.",
      "Keep each answer focused and structured with a clear beginning, supporting point, and conclusion.",
      "Repeat your answers aloud until you can speak for 60–90 seconds with fewer pauses.",
    ],
    bestAttempt,
    weakestAttempt,
    scoreBreakdown,
  };
}

export async function requestIntelligentRecruiterReport(
  attempts: InterviewAttempt[],
  level: TrainingLevel,
  candidateName: string,
  interviewContext?: { companyName: string; companyIndustry: string; jobTitle: string; jobDepartment: string; recruiterName: string },
  candidateQuestion?: CandidateQuestionResult | null
): Promise<RecruiterReport> {
  const fallback: RecruiterReport = {
    ...buildRecruiterReport(attempts, candidateName),
    candidateQuestion: candidateQuestion ?? undefined,
  };

  try {
    const response = await fetch("/api/interview-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attempts, level, candidateName, interviewContext, candidateQuestion, fallback }),
    });

    const data = await response.json();
    if (!response.ok || !data?.success || !data?.report) return fallback;

    return {
      ...fallback,
      ...interviewContext,
      candidateQuestion: candidateQuestion ?? undefined,
      recruiterImpression: data.report.recruiterImpression ?? fallback.recruiterImpression,
      strengths: Array.isArray(data.report.strengths) ? data.report.strengths.slice(0, 3) : fallback.strengths,
      improvements: Array.isArray(data.report.improvements) ? data.report.improvements.slice(0, 3) : fallback.improvements,
      recommendedNextPractice: Array.isArray(data.report.recommendedNextPractice)
        ? data.report.recommendedNextPractice.slice(0, 3)
        : fallback.recommendedNextPractice,
    };
  } catch {
    return fallback;
  }
}

export function saveRecruiterReport(
  report: RecruiterReport,
  attempts: InterviewAttempt[],
  level: TrainingLevel,
  candidateName: string,
  interviewContext?: { companyName: string; companyIndustry: string; jobTitle: string; jobDepartment: string; recruiterName: string },
  candidateQuestion?: CandidateQuestionResult | null
): SavedRecruiterReport | null {
  if (typeof window === "undefined") return null;

  const saved: SavedRecruiterReport = {
    ...report,
    ...interviewContext,
    candidateName,
    id: crypto.randomUUID(),
    level,
    createdAt: new Date().toISOString(),
    attempts,
    candidateQuestion: candidateQuestion ?? report.candidateQuestion,
  };

  try {
    const current = JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY) ?? "[]") as SavedRecruiterReport[];
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify([saved, ...current]));
    return saved;
  } catch {
    return null;
  }
}

export function getSavedRecruiterReports(): SavedRecruiterReport[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY) ?? "[]") as SavedRecruiterReport[];
  } catch {
    return [];
  }
}

export function deleteSavedRecruiterReport(id: string): void {
  if (typeof window === "undefined") return;

  try {
    const current = getSavedRecruiterReports();
    const updated = current.filter((report) => report.id !== id);
    localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Keep the UI usable even when browser storage is unavailable.
  }
}

export function clearSavedRecruiterReports(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(REPORT_STORAGE_KEY);
  } catch {
    // Keep the UI usable even when browser storage is unavailable.
  }
}
