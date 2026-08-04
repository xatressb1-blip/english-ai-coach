import { SpeechMetrics } from "@/types/speechMetrics";

export type CandidateQuestionRating = "Strong" | "Appropriate" | "Needs preparation" | "Not asked";

export interface CandidateQuestionResult {
  transcript: string;
  skipped: boolean;
  professionalRelevance: CandidateQuestionRating;
  companyInterest: CandidateQuestionRating;
  feedback: string;
  speechMetrics?: SpeechMetrics;
}
