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

  function getStatusStyle() {

    switch (flow.state) {

      case InterviewState.IDLE:

        return {
          icon: "⚪",
          color: "text-gray-700",
          badge: "bg-gray-100 text-gray-700",
        };

      case InterviewState.ASKING:

        return {
          icon: "🤖",
          color: "text-blue-700",
          badge: "bg-blue-100 text-blue-700",
        };

      case InterviewState.LISTENING:

        return {
          icon: "🎤",
          color: "text-red-700",
          badge: "bg-red-100 text-red-700",
        };

      case InterviewState.EVALUATING:

        return {
          icon: "🧠",
          color: "text-yellow-700",
          badge: "bg-yellow-100 text-yellow-700",
        };

      case InterviewState.READY_NEXT:

        return {
          icon: "✅",
          color: "text-green-700",
          badge: "bg-green-100 text-green-700",
        };

      case InterviewState.FINISHED:

        return {
          icon: "🎉",
          color: "text-green-700",
          badge: "bg-green-100 text-green-700",
        };

      default:

        return {
          icon: "⚪",
          color: "text-gray-700",
          badge: "bg-gray-100 text-gray-700",
        };

    }

  }

  const status = getStatusStyle();

  return (

    <section
      className="
        rounded-2xl

        border
        border-slate-200

        bg-white

        p-5
        sm:p-6

        shadow-md
      "
    >

      <div
        className="
          grid

          gap-4

          sm:grid-cols-2

          lg:grid-cols-3
        "
      >

        {/* Current */}

        <div
          className="
            rounded-xl

            bg-blue-50

            p-4

            shadow-sm
          "
        >

          <p
            className="
              text-xs

              uppercase

              tracking-wide

              text-slate-500
            "
          >
            Current Question
          </p>

          <p
            className="
              mt-2

              text-3xl

              font-bold

              text-blue-700
            "
          >
            {currentQuestionIndex + 1}

            <span className="text-slate-400">

              {" / "}

              {totalQuestions}

            </span>

          </p>

        </div>

        {/* Remaining */}

        <div
          className="
            rounded-xl

            bg-orange-50

            p-4

            shadow-sm
          "
        >

          <p
            className="
              text-xs

              uppercase

              tracking-wide

              text-slate-500
            "
          >
            Remaining
          </p>

          <p
            className="
              mt-2

              text-3xl

              font-bold

              text-orange-700
            "
          >
            {remainingQuestions}
          </p>

        </div>

        {/* Status */}

        <div
          className="
            rounded-xl

            bg-slate-50

            p-4

            shadow-sm
          "
        >

          <p
            className="
              text-xs

              uppercase

              tracking-wide

              text-slate-500
            "
          >
            AI Status
          </p>

          <div
            className="
              mt-3

              flex

              items-center

              gap-3
            "
          >

            <span className="text-3xl">

              {status.icon}

            </span>

            <div>

              <span
                className={`
                  rounded-full

                  px-3
                  py-1

                  text-xs

                  font-semibold

                  ${status.badge}
                `}
              >
                {flow.state}
              </span>

              <p
                className={`
                  mt-2

                  font-semibold

                  ${status.color}
                `}
              >
                {flow.message}
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

  );

}