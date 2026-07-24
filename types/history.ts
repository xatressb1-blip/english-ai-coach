import { EvaluationResult } from "./evaluation";

export interface InterviewHistory {

  id: string;

  questionId: number;

  questionTitle: string;

  transcript: string;

  evaluation: EvaluationResult;

  createdAt: string;

}