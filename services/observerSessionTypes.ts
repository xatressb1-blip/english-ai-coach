import type { ObserverKey, ObserverNote, ObserverScoreMap } from "@/services/teacherFeedbackService";

export interface ObserverSubmission {
  role: ObserverKey;
  scores: ObserverScoreMap[ObserverKey];
  note: ObserverNote;
  submittedAt: string;
}

export interface ObserverSessionSnapshot {
  id: string;
  candidateName: string;
  companyName: string;
  jobTitle: string;
  createdAt: string;
  expiresAt: string;
  submissions: Partial<Record<ObserverKey, ObserverSubmission>>;
}

export const OBSERVER_ROLE_LABELS: Record<ObserverKey, string> = {
  content: "Observer 1 · Content & Response Structure",
  language: "Observer 2 · English Language Performance",
  professional: "Observer 3 · Professional Interview Performance",
};
