export interface EvaluationCriteria {
  grammar: number;
  vocabulary: number;
  fluency: number;
  coherence: number;
  confidence: number;
}

export type TrainingLevel = "basic" | "advanced";

export interface ExpectedIdea {
  id: string;
  label: string;
  description: string;
  weight?: number;
}

export interface InterviewQuestion {
  id: number;
  trainingLevel: TrainingLevel;
  shortTitle: string;
  practiceDuration: number;
  category: string;
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: number;
  keywords: string[];
  expectedIdeas?: ExpectedIdea[];
  grammarFocus: string[];
  vocabularyLevel: string;
  sampleAnswer: string;
  commonMistakes: string[];
  evaluationCriteria: EvaluationCriteria;
}
