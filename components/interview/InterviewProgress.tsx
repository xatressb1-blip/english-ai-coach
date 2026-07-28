"use client";

import { useInterviewContext } from "@/context/InterviewContext";

export default function InterviewProgress() {

  const {

    progress,

    completedQuestions,

    totalQuestions,

  } = useInterviewContext();

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
          flex

          flex-col

          gap-4

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h2
            className="
              flex
              items-center

              gap-2

              text-xl

              font-bold

              text-slate-800
            "
          >
            📈 Interview Progress
          </h2>

          <p
            className="
              mt-2

              text-sm

              text-slate-500
            "
          >
            You are making great progress.
            Keep going!
          </p>

        </div>

        <div
          className="
            rounded-xl

            bg-blue-50

            px-5
            py-3

            text-center

            shadow-sm
          "
        >

          <div
            className="
              text-xs

              uppercase

              tracking-wide

              text-slate-500
            "
          >
            Progress
          </div>

          <div
            className="
              mt-1

              text-3xl

              font-bold

              text-blue-700
            "
          >
            {progress}%
          </div>

        </div>

      </div>

      {/* Progress Bar */}

      <div className="mt-6">

        <div className="mb-2 flex justify-between text-sm">

          <span className="font-medium text-slate-600">

            Completed

          </span>

          <span className="font-semibold text-blue-700">

            {completedQuestions} / {totalQuestions}

          </span>

        </div>

        <div
          className="
            h-4

            overflow-hidden

            rounded-full

            bg-slate-200
          "
        >

          <div
            className="
              h-full

              rounded-full

              bg-gradient-to-r

              from-blue-500
              to-indigo-600

              transition-all

              duration-700

              ease-out
            "
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* Footer */}

      <div
        className="
          mt-5

          flex

          flex-wrap

          gap-3
        "
      >

        <span
          className="
            rounded-full

            bg-green-100

            px-3
            py-1.5

            text-sm

            font-semibold

            text-green-700
          "
        >
          ✅ {completedQuestions} Finished
        </span>

        <span
          className="
            rounded-full

            bg-orange-100

            px-3
            py-1.5

            text-sm

            font-semibold

            text-orange-700
          "
        >
          ⏳ {totalQuestions - completedQuestions} Remaining
        </span>

      </div>

    </section>

  );

}