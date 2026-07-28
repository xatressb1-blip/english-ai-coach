"use client";

import { useInterviewContext } from "@/context/InterviewContext";

export default function InterviewHeader() {
  const {
    currentQuestionIndex,
    totalQuestions,
    completedQuestions,
    interviewFinished,
  } = useInterviewContext();

  const progress =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

  return (
    <header className="mb-6 sm:mb-8">

      {/* Title */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1
            className="
              text-2xl
              font-bold

              leading-tight

              text-slate-800

              sm:text-3xl

              lg:text-4xl
            "
          >
            🤖 AI English Interview Coach
          </h1>

          <p
            className="
              mt-2

              text-sm

              text-slate-500

              sm:text-base
            "
          >
            Practice your interview with AI and receive instant feedback.
          </p>

        </div>

        {!interviewFinished && (

          <div
            className="
              self-start

              rounded-xl

              bg-blue-50

              px-4
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
              Current Question
            </div>

            <div
              className="
                mt-1

                text-2xl

                font-bold

                text-blue-700
              "
            >
              {currentQuestionIndex + 1}
              <span className="text-slate-400">
                {" / "}
                {totalQuestions}
              </span>
            </div>

          </div>

        )}

      </div>

      {!interviewFinished ? (

        <>

          {/* Progress */}

          <div className="mt-6">

            <div className="mb-2 flex justify-between text-sm">

              <span className="font-medium text-slate-700">
                Progress
              </span>

              <span className="text-slate-500">
                {progress}%
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-slate-200">

              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

          {/* Stats */}

          <div
            className="
              mt-5

              grid

              grid-cols-2

              gap-3

              sm:grid-cols-3
            "
          >

            <div className="rounded-xl bg-green-50 p-4 shadow-sm">

              <p className="text-xs uppercase text-slate-500">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-green-700">
                {completedQuestions}
              </p>

            </div>

            <div className="rounded-xl bg-blue-50 p-4 shadow-sm">

              <p className="text-xs uppercase text-slate-500">
                Total
              </p>

              <p className="mt-2 text-2xl font-bold text-blue-700">
                {totalQuestions}
              </p>

            </div>

            <div className="rounded-xl bg-orange-50 p-4 shadow-sm col-span-2 sm:col-span-1">

              <p className="text-xs uppercase text-slate-500">
                Remaining
              </p>

              <p className="mt-2 text-2xl font-bold text-orange-700">
                {totalQuestions - completedQuestions}
              </p>

            </div>

          </div>

        </>

      ) : (

        <div className="mt-6 rounded-2xl border border-green-300 bg-green-50 p-6">

          <h2 className="text-2xl font-bold text-green-700">
            🎉 Interview Completed
          </h2>

          <p className="mt-3 text-slate-600">
            Excellent work! You have successfully completed all interview questions.
          </p>

        </div>

      )}

    </header>
  );
}