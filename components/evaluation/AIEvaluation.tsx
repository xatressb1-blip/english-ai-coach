"use client";

import { useEvaluation } from "@/hooks/useEvaluation";
import { useSpeechContext } from "@/context/SpeechContext";

import OverallBadge from "./OverallBadge";
import ScoreGrid from "./ScoreGrid";
import MistakesCard from "./MistakesCard";
import SuggestionsCard from "./SuggestionsCard";
import ImprovedAnswerCard from "./ImprovedAnswerCard";
import TranscriptCard from "./TranscriptCard";
import FocusAnalysisCard from "./FocusAnalysisCard";
import CoachFeedbackCard from "./CoachFeedbackCard";

export default function AIEvaluation() {

  const { transcript } = useSpeechContext();

  const {
    result,
    loading,
    error,
    evaluate,
  } = useEvaluation();

  return (

    <section
      className="
        mt-8
        sm:mt-10

        rounded-xl
        lg:rounded-2xl

        border

        bg-white

        p-4
        sm:p-6
        lg:p-8

        shadow-md
        lg:shadow-lg
      "
    >

      {/* Header */}

      <div
        className="
          flex
          flex-col

          gap-5

          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >

        <div>

          <h2
            className="
              text-2xl
              sm:text-3xl

              font-bold
            "
          >
            🤖 AI Evaluation
          </h2>

          <p
            className="
              mt-2

              text-sm
              sm:text-base

              text-gray-500
            "
          >
            Let Gemini evaluate your interview answer.
          </p>

        </div>

        <button

          onClick={evaluate}

          disabled={loading}

          className="
            w-full
            sm:w-auto

            rounded-xl

            bg-green-600

            px-6
            py-3

            font-semibold

            text-white

            transition

            hover:bg-green-700

            disabled:bg-gray-400
          "

        >

          {loading ? "Evaluating..." : "✨ Evaluate"}

        </button>

      </div>

      {/* Error */}

      {error && (

        <div
          className="
            mt-6

            rounded-xl

            border
            border-red-300

            bg-red-50

            p-4
            sm:p-5
          "
        >

          <h3 className="font-bold text-red-700">
            Error
          </h3>

          <p
            className="
              mt-2

              text-sm
              sm:text-base

              text-red-600
            "
          >
            {error}
          </p>

        </div>

      )}

      {/* Loading */}

      {loading && (

        <div
          className="
            mt-8
            sm:mt-10

            flex
            flex-col

            items-center
          "
        >

          <div
            className="
              h-12
              w-12
              sm:h-14
              sm:w-14

              animate-spin

              rounded-full

              border-4

              border-blue-500

              border-t-transparent
            "
          />

          <p
            className="
              mt-5

              text-base
              sm:text-lg

              text-center

              text-gray-600
            "
          >
            Gemini is evaluating your answer...
          </p>

        </div>

      )}

      {/* Result */}

      {!loading && result && (

        <>

          <div className="mt-8">

            <OverallBadge result={result} />

          </div>

          <ScoreGrid result={result} />

          <FocusAnalysisCard
            analysis={result.focusAnalysis}
          />

          <CoachFeedbackCard
            coach={result.coach}
          />

          <MistakesCard result={result} />

          <SuggestionsCard
            suggestions={result.suggestions}
          />

          <ImprovedAnswerCard
            improvedAnswer={result.improvedAnswer}
          />

          <TranscriptCard
            transcript={transcript}
          />

        </>

      )}

      {/* Empty */}

      {!loading && !result && !error && (

        <div
          className="
            mt-8
            sm:mt-10

            rounded-xl

            border
            border-dashed
            border-gray-300

            bg-gray-50

            p-6
            sm:p-8
            lg:p-10

            text-center
          "
        >

          <div
            className="
              text-5xl
              sm:text-6xl
            "
          >
            🤖
          </div>

          <h3
            className="
              mt-4

              text-xl
              sm:text-2xl

              font-bold

              text-gray-700
            "
          >
            AI Interview Coach
          </h3>

          <p
            className="
              mt-3

              text-sm
              sm:text-base

              leading-7
              sm:leading-8

              text-gray-500
            "
          >
            Record your answer using the microphone,
            then click <strong>Evaluate</strong>
            to receive detailed AI feedback.
          </p>

        </div>

      )}

    </section>

  );

}