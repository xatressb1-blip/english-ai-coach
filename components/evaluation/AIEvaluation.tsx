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

  const { transcript } =
    useSpeechContext();

  const {
    result,
    loading,
    error,
    evaluate,
  } = useEvaluation();

  return (

    <section className="mt-10 rounded-2xl border bg-white p-8 shadow-lg">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-3xl font-bold">

            🤖 AI Evaluation

          </h2>

          <p className="mt-2 text-gray-500">

            Let Gemini evaluate your interview answer.

          </p>

        </div>

        <button

          onClick={evaluate}

          disabled={loading}

          className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-400"

        >

          {loading

            ? "Evaluating..."

            : "✨ Evaluate"}

        </button>

      </div>

      {/* Error */}

      {error && (

        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-5">

          <h3 className="font-bold text-red-700">

            Error

          </h3>

          <p className="mt-2 text-red-600">

            {error}

          </p>

        </div>

      )}

      {/* Loading */}

      {loading && (

        <div className="mt-10 flex flex-col items-center">

          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />

          <p className="mt-5 text-lg text-gray-600">

            Gemini is evaluating your answer...

          </p>

        </div>

      )}

      {/* Result */}

      {!loading && result && (

        <>

          <div className="mt-8">

            <OverallBadge
              result={result}
            />

          </div>

          <ScoreGrid
  result={result}
/>

<FocusAnalysisCard
  analysis={result.focusAnalysis}
/>

<CoachFeedbackCard
  coach={result.coach}
/>

<MistakesCard
  result={result}
/>

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

      {!loading &&
        !result &&
        !error && (

          <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">

            <div className="text-6xl">

              🤖

            </div>

            <h3 className="mt-4 text-2xl font-bold text-gray-700">

              AI Interview Coach

            </h3>

            <p className="mt-3 leading-8 text-gray-500">

              Record your answer using the microphone,
              then click <strong>Evaluate</strong>
              to receive detailed AI feedback.

            </p>

          </div>

        )}

    </section>

  );

}