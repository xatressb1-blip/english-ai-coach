export interface FollowUpDecision {
  shouldAsk: boolean;
  question: string;
  reason: string;
}

export interface FollowUpRequest {
  candidateName: string;
  companyName: string;
  jobTitle: string;
  recruiterName: string;
  mainQuestion: string;
  mainAnswer: string;
  relevanceScore: number;
  contentCoverageScore: number;
  missingIdeas: string[];
  partialIdeas: string[];
}
