import type { InterviewAttempt, RecruiterReport } from "@/types/interviewReport";
import type {
  ClassroomEvaluationMode,
  ClassroomQuestionResult,
} from "@/types/classroomResults";

export function normalizeSessionCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24);
}

export function candidateKeyFromName(name: string) {
  const normalized = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

  return normalized || "candidate";
}

export function getEvaluationMode(attempts: InterviewAttempt[]): ClassroomEvaluationMode {
  const available = attempts.filter((attempt) => attempt.evaluation.evaluationStatus !== "unavailable");
  if (!available.length) return "unavailable";

  const liveCount = available.filter((attempt) => attempt.evaluation.evaluationSource === "live_ai").length;
  const backupCount = available.filter((attempt) => attempt.evaluation.evaluationSource === "backup_rubric").length;

  if (liveCount && backupCount) return "mixed";
  if (liveCount) return "live_ai";
  if (backupCount) return "backup_rubric";
  return "unavailable";
}

function firstSentence(value: string) {
  const clean = value.trim().replace(/\s+/g, " ");
  if (!clean) return "";
  const match = clean.match(/^.*?[.!?](?:\s|$)/);
  return (match?.[0] ?? clean).trim().slice(0, 260);
}

export function buildQuestionResult(attempt: InterviewAttempt | undefined): ClassroomQuestionResult | null {
  if (!attempt) return null;
  const evaluation = attempt.evaluation;
  const unavailable = evaluation.evaluationStatus === "unavailable";
  const source = unavailable
    ? "unavailable"
    : evaluation.evaluationSource === "backup_rubric"
      ? "backup_rubric"
      : "live_ai";

  const strength = evaluation.focusAnalysis?.coveredTopics?.[0]
    ? `Covered: ${evaluation.focusAnalysis.coveredTopics[0]}`
    : firstSentence(evaluation.overallFeedback);
  const improvement = evaluation.suggestions?.[0]
    ?? evaluation.focusAnalysis?.feedback
    ?? evaluation.overallFeedback;

  return {
    questionId: attempt.questionId,
    questionTitle: attempt.questionTitle,
    transcript: attempt.transcript,
    score: unavailable ? null : evaluation.overall,
    source,
    strength: firstSentence(strength),
    improvement: firstSentence(improvement),
    coverageScore: unavailable ? null : evaluation.focusAnalysis?.coverageScore ?? null,
    evidenceQualityScore: unavailable ? null : evaluation.focusAnalysis?.evidenceQualityScore ?? null,
    structureScore: unavailable ? null : evaluation.focusAnalysis?.structureScore ?? null,
    evaluationVersion: evaluation.evaluationVersion,
    evaluationNotice: source !== "live_ai" ? (
      /quota|limit|429/i.test(evaluation.evaluationError ?? "") ? "AI không khả dụng do giới hạn lượt hoặc hạn mức; đang dùng rubric dự phòng." :
      /timeout|timed out/i.test(evaluation.evaluationError ?? "") ? "AI quá thời gian phản hồi; đang dùng rubric dự phòng." :
      /network|fetch|connection/i.test(evaluation.evaluationError ?? "") ? "Kết nối AI gặp lỗi; đang dùng rubric dự phòng." :
      "Live AI chưa khả dụng trong lượt này; giáo viên kiểm chứng phản hồi rubric."
    ) : "",
    grammar: source === "live_ai" && Number.isFinite(evaluation.grammar?.score) && typeof evaluation.grammar?.comment === "string" ? {
      score: evaluation.grammar.score,
      comment: evaluation.grammar.comment,
      mistakes: Array.isArray(evaluation.grammar.mistakes) ? evaluation.grammar.mistakes.filter((v): v is string => typeof v === "string").slice(0, 5) : [],
    } : null,
    vocabulary: source === "live_ai" && Number.isFinite(evaluation.vocabulary?.score) && typeof evaluation.vocabulary?.comment === "string" ? {
      score: evaluation.vocabulary.score, comment: evaluation.vocabulary.comment,
    } : null,
    criteria: unavailable ? [] : (evaluation.focusAnalysis?.ideaAssessments ?? []).filter(item =>
      typeof item.id === "string" && typeof item.label === "string" &&
      ["covered", "partial", "missing"].includes(item.status)
    ).map(item => ({ id: item.id, label: item.label, status: item.status,
      evidence: typeof item.evidence === "string" ? item.evidence : "",
      coachingTip: typeof item.coachingTip === "string" ? item.coachingTip : "" })),
  };
}

export function buildClassroomResultRecord(input: {
  sessionId: string;
  candidateKey: string;
  candidateName: string;
  companyName: string;
  jobTitle: string;
  recruiterName: string;
  report: RecruiterReport;
  attempts: InterviewAttempt[];
}) {
  const byQuestion = new Map(input.attempts.map((attempt) => [attempt.questionId, attempt]));
  return {
    session_id: input.sessionId,
    candidate_key: input.candidateKey,
    candidate_name: input.candidateName.trim().slice(0, 80),
    company_name: input.companyName.trim().slice(0, 120),
    job_title: input.jobTitle.trim().slice(0, 120),
    recruiter_name: input.recruiterName.trim().slice(0, 80),
    overall_score: Number(input.report.overallScore.toFixed(1)),
    evaluation_mode: getEvaluationMode(input.attempts),
    q1_result: buildQuestionResult(byQuestion.get(1)),
    q2_result: buildQuestionResult(byQuestion.get(2)),
    q3_result: buildQuestionResult(byQuestion.get(3)),
    strengths: input.report.strengths.slice(0, 3),
    improvements: input.report.improvements.slice(0, 3),
    recommended_next_practice: input.report.recommendedNextPractice.slice(0, 3),
    score_breakdown: input.report.scoreBreakdown,
    completed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
