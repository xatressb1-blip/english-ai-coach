import { interviewQuestions } from "@/data/interviewQuestions";

export const personalQuestions = interviewQuestions.filter(
  (question) => question.category === "Personal"
);
