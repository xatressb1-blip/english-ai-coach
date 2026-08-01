import { interviewQuestions } from "@/data/interviewQuestions";
import { InterviewQuestion } from "@/types/InterviewQuestion";

export function getAllQuestions(): InterviewQuestion[] {
  return interviewQuestions;
}

export function getQuestionById(id: number): InterviewQuestion | undefined {
  return interviewQuestions.find((question) => question.id === id);
}

export function getQuestionsByCategory(category: string): InterviewQuestion[] {
  return interviewQuestions.filter(
    (question) => question.category.toLowerCase() === category.toLowerCase()
  );
}

export function getQuestionsByLevel(
  level: InterviewQuestion["level"]
): InterviewQuestion[] {
  return interviewQuestions.filter((question) => question.level === level);
}

export function getNextQuestion(currentIndex: number): InterviewQuestion | null {
  if (currentIndex + 1 >= interviewQuestions.length) return null;
  return interviewQuestions[currentIndex + 1];
}

export function getPreviousQuestion(currentIndex: number): InterviewQuestion | null {
  if (currentIndex <= 0) return null;
  return interviewQuestions[currentIndex - 1];
}

export function getTotalQuestions(): number {
  return interviewQuestions.length;
}
