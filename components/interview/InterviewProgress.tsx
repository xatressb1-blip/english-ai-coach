"use client";

import { useInterviewContext } from "@/context/InterviewContext";

export default function InterviewProgress() {
  const {
    progress,
    completedQuestions,
    totalQuestions,
  } = useInterviewContext();

  return (
    <div className="mb-8 rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-lg font-semibold">
            Interview Progress
          </h2>

          <p className="text-sm text-gray-500">
            Completed: {completedQuestions} / {totalQuestions} Questions
          </p>

        </div>

        <div className="text-lg font-bold text-blue-600">
          {progress}%
        </div>

      </div>

      <div className="mt-4 h-4 overflow-hidden rounded-full bg-gray-200">

        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

    </div>
  );
}