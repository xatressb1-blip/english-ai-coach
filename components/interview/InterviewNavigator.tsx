"use client";

import { useInterviewContext } from "@/context/InterviewContext";
import { useSpeechContext } from "@/context/SpeechContext";
import { useEvaluationContext } from "@/context/EvaluationContext";

import {
  readyInterview,
} from "@/services/interviewFlowService";

export default function InterviewNavigator() {

  const {

    currentQuestionIndex,

    totalQuestions,

    isFirstQuestion,

    isLastQuestion,

    previousQuestion,

    nextQuestion,

    finishInterview,

    setFlow,

  } = useInterviewContext();

  const {

    setTranscript,

  } = useSpeechContext();

  const {

    result,

    resetEvaluation,

  } = useEvaluationContext();

  const canGoNext = result !== null;

  const handleNext = () => {

    if (!canGoNext) return;

    setTranscript("");

    resetEvaluation();

    if (isLastQuestion) {

      finishInterview();

      return;

    }

    nextQuestion();

    setFlow(
      readyInterview()
    );

  };

  return (

    <div className="mt-10 space-y-4">

      <div className="flex items-center justify-between">

        <button

          onClick={previousQuestion}

          disabled={isFirstQuestion}

          className="
            rounded-lg
            bg-gray-300
            px-6
            py-3
            font-medium
            transition
            hover:bg-gray-400
            disabled:cursor-not-allowed
            disabled:opacity-50
          "

        >

          ⬅ Previous

        </button>

        <div className="text-center text-sm text-gray-500">

          Question {currentQuestionIndex + 1} of {totalQuestions}

        </div>

        <button

          onClick={handleNext}

          disabled={!canGoNext}

          className="
            rounded-lg
            bg-blue-600
            px-6
            py-3
            font-medium
            text-white
            transition
            hover:bg-blue-700
            disabled:bg-gray-400
            disabled:cursor-not-allowed
            disabled:opacity-60
          "

        >

          {isLastQuestion

            ? "✅ Finish Interview"

            : "Next ➜"}

        </button>

      </div>

      {!canGoNext && (

        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-center text-sm text-yellow-700">

          ⚠ Please click <strong>Evaluate</strong> and wait until the AI finishes evaluating your answer before moving to the next question.

        </div>

      )}

    </div>

  );

}