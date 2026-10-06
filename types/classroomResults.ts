import type { InterviewAttempt, RecruiterReport } from "@/types/interviewReport";

export type ClassroomEvaluationMode = "live_ai" | "mixed" | "backup_rubric" | "unavailable";
export type ClassroomSessionStatus = "open" | "completed" | "closed";

export interface ClassroomCloudSession {
  id: string;
  session_code: string;
  session_name: string;
  expected_candidates: number;
  status: ClassroomSessionStatus;
  created_at: string;
  completed_at: string | null;
}

export interface ClassroomQuestionResult {
  questionId: number;
  questionTitle: string;
  transcript: string;
  score: number | null;
  source: "live_ai" | "backup_rubric" | "unavailable";
  strength: string;
  improvement: string;
  coverageScore: number | null;
  evidenceQualityScore: number | null;
  structureScore: number | null;
}

export interface ClassroomCandidateResult {
  id: string;
  session_id: string;
  candidate_key: string;
  candidate_name: string;
  company_name: string;
  job_title: string;
  recruiter_name: string;
  overall_score: number;
  evaluation_mode: ClassroomEvaluationMode;
  q1_result: ClassroomQuestionResult | null;
  q2_result: ClassroomQuestionResult | null;
  q3_result: ClassroomQuestionResult | null;
  strengths: string[];
  improvements: string[];
  recommended_next_practice: string[];
  score_breakdown: RecruiterReport["scoreBreakdown"];
  completed_at: string;
  updated_at: string;
}

export interface ClassroomSyncPayload {
  sessionCode: string;
  candidateKey: string;
  candidateName: string;
  companyName: string;
  jobTitle: string;
  recruiterName: string;
  report: RecruiterReport;
  attempts: InterviewAttempt[];
}

export type ClassroomSyncStatus = "idle" | "pending" | "synced" | "error";

export interface ClassroomLocalSyncRecord {
  sessionCode: string;
  candidateKey: string;
  candidateName: string;
  status: ClassroomSyncStatus;
  lastAttemptAt: string;
  lastSuccessAt?: string;
  error?: string;
  payload: ClassroomSyncPayload;
}
