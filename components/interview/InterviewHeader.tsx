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

    <header
      className="
        mb-5
        sm:mb-6
        lg:mb-8
      "
    >

      <h1
        className="
          text-2xl
          sm:text-3xl
          lg:text-4xl

          font-bold

          text-slate-800

          leading-tight
        "
      >
        🤖 AI English Interview Coach
      </h1>

      {!interviewFinished ? (

        <>

          <p
            className="
              mt-3

              text-base
              sm:text-lg

              text-gray-600
            "
          >

            Question {currentQuestionIndex + 1}

            {" / "}

            {totalQuestions}

          </p>

          <p
            className="
              mt-1

              text-xs
              sm:text-sm

              text-blue-600
            "
          >

            Completed

            {" "}

            {completedQuestions}

            {" / "}

            {totalQuestions}

            {" "}

            Questions

          </p>

        </>

      ) : (

        <>

          <p
            className="
              mt-3

              text-lg
              sm:text-xl

              font-semibold

              text-green-600
            "
          >

            🎉 Interview Completed

          </p>

          <p
            className="
              mt-2

              text-sm
              sm:text-base

              text-gray-600
            "
          >

            Great job!

            {" "}

            You have completed all interview questions.

          </p>

        </>

      )}

    </header>

  );

}