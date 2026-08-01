import { interviewQuestions } from "@/data/interviewQuestions";

// Compatibility export generated from the single question source.
export const lessons = interviewQuestions.map((question) => ({
  id: question.id,
  questionId: question.id,
  title: question.shortTitle,
  description: question.description,
  level: question.level,
  duration: question.practiceDuration,
}));
