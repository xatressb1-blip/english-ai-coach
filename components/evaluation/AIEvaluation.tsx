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
  const { transcript, setTranscript } = useSpeechContext();

  const {
    result,
    loading,
    error,
    evaluate,
  } = useEvaluation();

  return (
    <section className="mt-8 rounded-xl border bg-white p-4 shadow-md sm:mt-10 sm:p-6 lg:rounded-2xl lg:p-8 lg:shadow-lg">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            🤖 AI Evaluation
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Type your answer below or use the microphone. You can edit the transcript before asking AI to evaluate it.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label
            htmlFor="candidate-answer"
            className="text-base font-bold text-gray-800 sm:text-lg"
          >
            Your Answer
          </label>

          <span className="text-xs text-gray-500 sm:text-sm">
            {transcript.trim().length} characters
          </span>
        </div>

        <textarea
          id="candidate-answer"
          value={transcript}
          onChange={(event) => setTranscript(event.target.value)}
          disabled={loading}
          rows={9}
          placeholder="Type your interview answer here, or use Start Recording and edit the transcript afterward..."
          className="mt-3 w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-4 text-sm leading-7 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-gray-100 sm:text-base"
        />

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-gray-500">
            Speak naturally in your own words. The sample answer is only a guide, not a script that must be copied.
          </p>

          <button
            type="button"
            onClick={() => setTranscript("")}
            disabled={loading || !transcript}
            className="w-full shrink-0 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Clear Answer
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={evaluate}
        disabled={loading || !transcript.trim()}
        className="mt-6 w-full rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:w-auto"
      >
        {loading ? "Evaluating..." : "✨ Evaluate Answer"}
      </button>

      {error && (
        <div className="mt-6 rounded-xl border border-red-300 bg-red-50 p-4 sm:p-5">
          <h3 className="font-bold text-red-700">Error</h3>
          <p className="mt-2 text-sm text-red-600 sm:text-base">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mt-8 flex flex-col items-center sm:mt-10">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent sm:h-14 sm:w-14" />
          <p className="mt-5 text-center text-base text-gray-600 sm:text-lg">
            🤖 AI Recruiter is analysing your interview...
          </p>
        </div>
      )}

      {!loading && result && (
        <>
          <div className="mt-8">
            <OverallBadge result={result} />
          </div>

          <ScoreGrid result={result} />
          <FocusAnalysisCard analysis={result.focusAnalysis} />
          <CoachFeedbackCard coach={result.coach} />
          <MistakesCard result={result} />
          <SuggestionsCard suggestions={result.suggestions} />
          <ImprovedAnswerCard improvedAnswer={result.improvedAnswer} />
          <TranscriptCard transcript={transcript} />
        </>
      )}

      {!loading && !result && !error && (
        <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center sm:mt-10 sm:p-8 lg:p-10">
          <div className="text-5xl sm:text-6xl">🤖</div>
          <h3 className="mt-4 text-xl font-bold text-gray-700 sm:text-2xl">
            AI Interview Coach
          </h3>
          <p className="mt-3 text-sm leading-7 text-gray-500 sm:text-base sm:leading-8">
            Enter your answer above or record your voice, then click <strong>Evaluate Answer</strong> to receive detailed feedback.
          </p>
        </div>
      )}
    </section>
  );
}
