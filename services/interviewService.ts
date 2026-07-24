import { interviewQuestions } from "@/data/interview";
import { InterviewQuestion } from "@/types/InterviewQuestion";

/**
 * Lấy toàn bộ danh sách câu hỏi
 */
export function getAllQuestions(): InterviewQuestion[] {
  return interviewQuestions;
}

/**
 * Lấy câu hỏi theo ID
 */
export function getQuestionById(
  id: number
): InterviewQuestion | undefined {
  return interviewQuestions.find(
    (question) => question.id === id
  );
}

/**
 * Lấy danh sách câu hỏi theo chủ đề
 */
export function getQuestionsByCategory(
  category: string
): InterviewQuestion[] {
  return interviewQuestions.filter(
    (question) =>
      question.category.toLowerCase() ===
      category.toLowerCase()
  );
}

/**
 * Lấy danh sách câu hỏi theo mức độ
 */
export function getQuestionsByLevel(
  level: InterviewQuestion["level"]
): InterviewQuestion[] {
  return interviewQuestions.filter(
    (question) => question.level === level
  );
}

/**
 * Lấy câu hỏi tiếp theo
 */
export function getNextQuestion(
  currentIndex: number
): InterviewQuestion | null {

  if (
    currentIndex + 1 >=
    interviewQuestions.length
  ) {
    return null;
  }

  return interviewQuestions[
    currentIndex + 1
  ];
}

/**
 * Lấy câu hỏi trước đó
 */
export function getPreviousQuestion(
  currentIndex: number
): InterviewQuestion | null {

  if (currentIndex <= 0) {
    return null;
  }

  return interviewQuestions[
    currentIndex - 1
  ];
}

/**
 * Tổng số câu hỏi
 */
export function getTotalQuestions(): number {
  return interviewQuestions.length;
}