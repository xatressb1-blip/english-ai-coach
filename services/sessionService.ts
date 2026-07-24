import {
  InterviewSession,
  QuestionResult,
} from "@/types/InterviewSession";

export function createSession(
  totalQuestions: number
): InterviewSession {
  return {
    startedAt: new Date(),
    duration: 0,
    totalQuestions,
    completedQuestions: 0,
    results: [],
  };
}

export function addQuestionResult(
  session: InterviewSession,
  result: QuestionResult
): InterviewSession {
  return {
    ...session,
    completedQuestions:
      session.completedQuestions + 1,
    results: [...session.results, result],
  };
}

export function finishSession(
  session: InterviewSession
): InterviewSession {
  const finishedAt = new Date();

  const duration =
    Math.floor(
      (finishedAt.getTime() -
        session.startedAt.getTime()) /
        1000
    );

  return {
    ...session,
    finishedAt,
    duration,
  };
}