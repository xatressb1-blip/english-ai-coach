"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEvaluation } from "@/hooks/useEvaluation";
import { useSpeechContext } from "@/context/SpeechContext";
import { useEvaluationContext } from "@/context/EvaluationContext";
import { useInterviewContext } from "@/context/InterviewContext";
import { enqueueSpeech } from "@/services/speechQueueService";

export default function MockInterviewEvaluation() {
  const { transcript, setTranscript, status } = useSpeechContext();
  const { result, loading, error, evaluate } = useEvaluation();
  const { resetEvaluation } = useEvaluationContext();
  const { selectedRecruiter, currentQuestionIndex, totalQuestions, isLastQuestion, nextQuestion, finishInterview } = useInterviewContext();
  const [acknowledging, setAcknowledging] = useState(false);
  const spokenRef = useRef(false);

  const hasAnswer = transcript.trim().length > 0;
  const canSubmit = hasAnswer && status !== "recording" && status !== "processing" && !loading;

  const acknowledgement = useMemo(() => {
    const regular = [
      "Thank you. That gives me a clear understanding of your answer. Let us continue to the next question.",
      "Thank you for explaining that. I have noted your response. We will now move to the next question.",
      "I appreciate your answer. That is helpful. Let us continue with the interview.",
    ];
    const ending = `Thank you, ${selectedRecruiter.shortName === "James" ? "that completes" : "that concludes"} the final interview question. I will now prepare your recruiter report.`;
    return isLastQuestion ? ending : regular[currentQuestionIndex % regular.length];
  }, [currentQuestionIndex, isLastQuestion, selectedRecruiter.shortName]);

  useEffect(() => {
    if (!result || spokenRef.current) return;
    spokenRef.current = true;
    setAcknowledging(true);
    enqueueSpeech(acknowledgement, () => setAcknowledging(false));
  }, [acknowledgement, result]);

  const continueInterview = () => {
    if (!result || acknowledging) return;
    setTranscript("");
    resetEvaluation();
    spokenRef.current = false;
    if (isLastQuestion) {
      finishInterview();
      return;
    }
    nextQuestion();
  };

  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      {!result && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-950 sm:text-xl">Submit your response</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Your detailed scores remain private until the interview is complete.
            </p>
          </div>
          <button
            type="button"
            onClick={evaluate}
            disabled={!canSubmit}
            className="min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            {loading ? "Recruiter is reviewing..." : "Submit Answer"}
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-5 flex items-center gap-4 rounded-xl bg-slate-50 p-4">
          <div className="h-9 w-9 shrink-0 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <div><p className="font-semibold text-slate-800">Reviewing your response</p><p className="text-sm text-slate-500">Please wait while the recruiter prepares the next step.</p></div>
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${selectedRecruiter.gradient} text-2xl text-white`}>{selectedRecruiter.emoji}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Recruiter response</p>
              <p className="mt-2 leading-7 text-slate-800">{acknowledgement}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={continueInterview}
            disabled={acknowledging}
            className="mt-5 min-h-12 w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto"
          >
            {acknowledging ? "Recruiter is speaking..." : isLastQuestion ? "Complete Interview" : `Continue to Question ${currentQuestionIndex + 2}`}
          </button>
        </div>
      )}
    </section>
  );
}
