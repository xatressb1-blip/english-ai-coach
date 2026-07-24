"use client";

import { useInterviewContext } from "@/context/InterviewContext";

export default function InterviewHeader() {
  const {
    currentQuestionIndex,
    totalQuestions,
    completedQuestions,
    interviewFinished,
  } = useInterviewContext();

  return (
    <div className="mb-8">

      <h1 className="text-4xl font-bold text-slate-800">
        🤖 AI English Interview Coach
      </h1>

      {!interviewFinished ? (
        <>
          <p className="mt-3 text-lg text-gray-600">
            Question {currentQuestionIndex + 1} / {totalQuestions}
          </p>

          <p className="mt-1 text-sm text-blue-600">
            Completed: {completedQuestions} / {totalQuestions} Questions
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 text-lg font-semibold text-green-600">
            🎉 Interview Completed
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Great job! You have completed all interview questions.
          </p>
        </>
      )}
    </div>
  );
}