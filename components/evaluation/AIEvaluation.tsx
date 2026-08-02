"use client";

import { useEvaluation } from "@/hooks/useEvaluation";
import { useSpeechContext } from "@/context/SpeechContext";
import { InterviewQuestion } from "@/types/InterviewQuestion";

import OverallBadge from "./OverallBadge";
import ScoreGrid from "./ScoreGrid";
import MistakesCard from "./MistakesCard";
import SuggestionsCard from "./SuggestionsCard";
import ImprovedAnswerCard from "./ImprovedAnswerCard";
import TranscriptCard from "./TranscriptCard";
import FocusAnalysisCard from "./FocusAnalysisCard";
import CoachFeedbackCard from "./CoachFeedbackCard";

interface AIEvaluationProps {
  question: InterviewQuestion;
}

export default function AIEvaluation({ question }: AIEvaluationProps) {
  const { transcript } = useSpeechContext();
  const { result, loading, error, evaluate } = useEvaluation(question);
  const hasAnswer = transcript.trim().length > 0;

  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">🤖 AI Feedback</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Complete your recording, review the transcript above, then ask AI for detailed feedback.
          </p>
        </div>

        <button
          type="button"
          onClick={evaluate}
          disabled={loading || !hasAnswer}
          className="min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
        >
          {loading ? "Evaluating..." : "✨ Evaluate Answer"}
        </button>
      </div>

      {!hasAnswer && !loading && !result && !error && (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
          <p className="font-semibold text-slate-700">Your feedback will appear here.</p>
          <p className="mt-1 text-sm text-slate-500">Record or type your practice answer first.</p>
        </div>
      )}

      {hasAnswer && !loading && !result && !error && (
        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
          Your answer is ready. Select <strong>Evaluate Answer</strong> when you are satisfied with the transcript.
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4">
          <h3 className="font-bold text-red-700">Unable to evaluate</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading && (
        <div className="mt-6 flex flex-col items-center rounded-xl bg-slate-50 p-6">
          <div className="h-11 w-11 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="mt-4 text-center text-sm font-semibold text-slate-600 sm:text-base">
            AI recruiter is analysing your answer...
          </p>
        </div>
      )}

      {!loading && result && (
        <div className="mt-6">
          <OverallBadge result={result} />
          <ScoreGrid result={result} />
          <FocusAnalysisCard analysis={result.focusAnalysis} />
          <CoachFeedbackCard coach={result.coach} />
          <MistakesCard result={result} />
          <SuggestionsCard suggestions={result.suggestions} />
          <ImprovedAnswerCard improvedAnswer={result.improvedAnswer} />
          <TranscriptCard transcript={transcript} />
        </div>
      )}
    </section>
  );
}
