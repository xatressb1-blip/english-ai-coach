"use client";

import { useInterviewContext } from "@/context/InterviewContext";

import {
  InterviewState,
} from "@/services/interviewFlowService";

export default function InterviewStatusBar() {

  const {
    currentQuestionIndex,
    totalQuestions,
    remainingQuestions,
    flow,
  } = useInterviewContext();

  function getStatusColor() {

    switch (flow.state) {

      case InterviewState.IDLE:
        return "text-gray-600";

      case InterviewState.ASKING:
        return "text-blue-600";

      case InterviewState.LISTENING:
        return "text-red-600";

      case InterviewState.EVALUATING:
        return "text-yellow-600";

      case InterviewState.READY_NEXT:
        return "text-green-600";

      case InterviewState.FINISHED:
        return "text-green-700";

      default:
        return "text-gray-600";

    }

  }

  return (

    <div className="rounded-xl border bg-slate-50 p-6">

      <div className="grid gap-6 md:grid-cols-3">

        <div>

          <p className="text-sm text-gray-500">
            Current Question
          </p>

          <p className="text-xl font-bold text-blue-600">
            {currentQuestionIndex + 1} / {totalQuestions}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            Remaining Questions
          </p>

          <p className="text-xl font-bold text-orange-600">
            {remainingQuestions}
          </p>

        </div>

        <div>

          <p className="text-sm text-gray-500">
            AI Interview Status
          </p>

          <p
            className={`text-lg font-bold ${getStatusColor()}`}
          >
            {flow.message}
          </p>

        </div>

      </div>

    </div>

  );

}