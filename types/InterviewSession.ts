export interface QuestionResult {
  questionId: number;

  transcript: string;

  grammar: number;

  vocabulary: number;

  fluency: number;

  coherence: number;

  confidence: number;

  overall: number;

  feedback: string;
}

export interface InterviewSession {
  startedAt: Date;

  finishedAt?: Date;

  duration: number;

  totalQuestions: number;

  completedQuestions: number;

  results: QuestionResult[];
}