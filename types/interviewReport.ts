import { EvaluationResult } from "@/types/evaluation";
import { SpeechMetrics } from "@/types/speechMetrics";

export type TrainingLevel = "basic" | "advanced";

export interface InterviewAttempt {
  questionId: number;
  questionTitle: string;
  transcript: string;
  evaluation: EvaluationResult;
  speechMetrics?: SpeechMetrics;
  followUpSpeechMetrics?: SpeechMetrics;
}

export interface RecruiterReport {
  candidateName: string;
  companyName?: string;
  companyIndustry?: string;
  jobTitle?: string;
  jobDepartment?: string;
  recruiterName?: string;
  overallScore: number;
  readiness: "Developing" | "Nearly Ready" | "Interview Ready" | "Strong Candidate";
  recruiterImpression: string;
  strengths: string[];
  improvements: string[];
  recommendedNextPractice: string[];
  bestAttempt: InterviewAttempt | null;
  weakestAttempt: InterviewAttempt | null;
  scoreBreakdown: {
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    fluency: number;
    relevance: number;
    confidence: number;
  };
}

export interface SavedRecruiterReport extends RecruiterReport {
  id: string;
  level: TrainingLevel;
  createdAt: string;
  attempts: InterviewAttempt[];
}
