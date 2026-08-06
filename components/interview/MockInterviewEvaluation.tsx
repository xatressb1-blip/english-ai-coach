"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEvaluation } from "@/hooks/useEvaluation";
import { useSpeechContext } from "@/context/SpeechContext";
import { useEvaluationContext } from "@/context/EvaluationContext";
import { useInterviewContext } from "@/context/InterviewContext";
import { enqueueSpeech } from "@/services/speechQueueService";
import { requestFollowUp } from "@/services/followUpService";
import { SpeechMetrics } from "@/types/speechMetrics";
import { buildUnavailableEvaluation } from "@/services/evaluationService";

type InterviewStep =
  | "main-answer"
  | "deciding"
  | "follow-up-speaking"
  | "follow-up-answer"
  | "acknowledging";

export default function MockInterviewEvaluation() {
  const { transcript, setTranscript, status, speechMetrics } = useSpeechContext();
  const { result, loading, error, evaluate } = useEvaluation();
  const { resetEvaluation, setResult, setError } = useEvaluationContext();
  const {
    candidateName,
    selectedRecruiter,
    selectedCompany,
    selectedJobRole,
    currentQuestion,
    currentQuestionIndex,
    isLastQuestion,
    nextQuestion,
    finishInterview,
    saveAttempt,
  } = useInterviewContext();

  const [step, setStep] = useState<InterviewStep>("main-answer");
  const [followUpQuestion, setFollowUpQuestion] = useState("");
  const [mainAnswer, setMainAnswer] = useState("");
  const [acknowledging, setAcknowledging] = useState(false);
  const [evaluationSeconds, setEvaluationSeconds] = useState(0);
  const [activeWaitingStarted, setActiveWaitingStarted] = useState(false);
  const decisionStartedRef = useRef(false);
  const mainSpeechMetricsRef = useRef<SpeechMetrics | null>(null);

  const hasAnswer = transcript.trim().length > 0;
  const recorderBusy = status === "recording" || status === "processing";
  const canSubmitMain = step === "main-answer" && hasAnswer && !recorderBusy && !loading;
  const canSubmitFollowUp = step === "follow-up-answer" && hasAnswer && !recorderBusy;
  const allowFollowUp = currentQuestion.id >= 4;

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
    if (!loading) {
      setEvaluationSeconds(0);
      return;
    }

    const timer = window.setInterval(() => {
      setEvaluationSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [loading]);

  const speakAcknowledgement = () => {
    setStep("acknowledging");
    setAcknowledging(true);
    enqueueSpeech(acknowledgement, () => setAcknowledging(false));
  };

  useEffect(() => {
    if (!result || decisionStartedRef.current) return;
    decisionStartedRef.current = true;

    const capturedMainAnswer = transcript.trim();
    mainSpeechMetricsRef.current = speechMetrics;
    setMainAnswer(capturedMainAnswer);

    if (!allowFollowUp || result.evaluationStatus === "unavailable") {
      saveAttempt({
        questionId: currentQuestion.id,
        questionTitle: currentQuestion.title,
        transcript: capturedMainAnswer,
        evaluation: result,
        speechMetrics: mainSpeechMetricsRef.current ?? undefined,
      });
      speakAcknowledgement();
      return;
    }

    setStep("deciding");

    void requestFollowUp({
      candidateName,
      companyName: selectedCompany.name,
      jobTitle: selectedJobRole.title,
      recruiterName: selectedRecruiter.name,
      mainQuestion: currentQuestion.title,
      mainAnswer: capturedMainAnswer,
      relevanceScore: result.relevance.score,
      contentCoverageScore: result.focusAnalysis.coverageScore,
      missingIdeas: result.focusAnalysis.missingTopics,
      partialIdeas: result.focusAnalysis.partialTopics,
    }).then((decision) => {
      if (!decision.shouldAsk || !decision.question) {
        saveAttempt({
          questionId: currentQuestion.id,
          questionTitle: currentQuestion.title,
          transcript: capturedMainAnswer,
          evaluation: result,
          speechMetrics: mainSpeechMetricsRef.current ?? undefined,
        });
        speakAcknowledgement();
        return;
      }

      setFollowUpQuestion(decision.question);
      setTranscript("");
      setStep("follow-up-speaking");
      enqueueSpeech(decision.question, () => setStep("follow-up-answer"));
    });
    // The decision must run exactly once for the submitted answer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  useEffect(() => {
    setStep("main-answer");
    setFollowUpQuestion("");
    setMainAnswer("");
    setAcknowledging(false);
    setActiveWaitingStarted(false);
    setEvaluationSeconds(0);
    decisionStartedRef.current = false;
    mainSpeechMetricsRef.current = null;
  }, [currentQuestionIndex]);

  const submitFollowUp = () => {
    if (!result || !canSubmitFollowUp) return;
    const followUpAnswer = transcript.trim();
    const combinedTranscript = `${mainAnswer}\n\nFollow-up question: ${followUpQuestion}\nFollow-up answer: ${followUpAnswer}`;

    saveAttempt({
      questionId: currentQuestion.id,
      questionTitle: currentQuestion.title,
      transcript: combinedTranscript,
      evaluation: result,
      speechMetrics: mainSpeechMetricsRef.current ?? undefined,
      followUpSpeechMetrics: speechMetrics ?? undefined,
    });
    speakAcknowledgement();
  };

  const continueInterview = () => {
    if (!result || acknowledging || step !== "acknowledging") return;
    setTranscript("");
    resetEvaluation();
    decisionStartedRef.current = false;
    setFollowUpQuestion("");
    setMainAnswer("");
    setStep("main-answer");
    mainSpeechMetricsRef.current = null;

    if (isLastQuestion) {
      finishInterview();
      return;
    }
    nextQuestion();
  };

  const submitMainAnswer = () => {
    if (!canSubmitMain) return;

    setActiveWaitingStarted(true);
    enqueueSpeech(
      "Thank you. Your answer has been recorded. While I review it, the observers can complete their notes."
    );
    void evaluate();
  };

  const continueWithTeacherReview = () => {
    if (!hasAnswer || loading || recorderBusy) return;
    const safeTranscript = transcript.trim();
    const unavailable = buildUnavailableEvaluation(
      currentQuestion,
      safeTranscript,
      error ?? "AI evaluation unavailable"
    );
    setError(null);
    setResult(unavailable);
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
            onClick={submitMainAnswer}
            disabled={!canSubmitMain}
            className="min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            {loading ? "AI is evaluating..." : "Submit Answer"}
          </button>
        </div>
      )}

      {(loading || step === "deciding") && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="h-9 w-9 shrink-0 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-slate-800">Recruiter is reviewing your response</p>
                {loading && (
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-700 shadow-sm">
                    {evaluationSeconds}s
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Your answer is saved. The classroom activity continues while AI prepares concise evidence for the final comparison.
              </p>
            </div>
          </div>

          {activeWaitingStarted && loading && (
            <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-4 sm:p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-700">Active observer time</p>
                  <h3 className="mt-1 text-lg font-black text-slate-950">Observers, record one clear piece of evidence now.</h3>
                </div>
                <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">No silent waiting</span>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-emerald-200 bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-emerald-700">Observer 1</p>
                  <p className="mt-1 font-bold text-slate-900">Content & structure</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Check required ideas, logical order, examples, results and job connection.</p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-blue-700">Observer 2</p>
                  <p className="mt-1 font-bold text-slate-900">English performance</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Check grammar, vocabulary, linking, clarity, fluency and repetition.</p>
                </div>
                <div className="rounded-xl border border-violet-200 bg-white p-3">
                  <p className="text-xs font-black uppercase tracking-wide text-violet-700">Observer 3</p>
                  <p className="mt-1 font-bold text-slate-900">Professional performance</p>
                  <p className="mt-1 text-sm leading-5 text-slate-600">Check eye contact, posture, voice, pace, confidence and professional attitude.</p>
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold text-indigo-900">
                Teacher prompt: “Identify one strength and one priority improvement before the AI result appears.”
              </p>
            </div>
          )}
        </div>
      )}

      {error && !result && (
        <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          <p className="font-bold">Your answer is safe.</p>
          <p className="mt-1">{error}</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button type="button" onClick={evaluate} disabled={!canSubmitMain} className="min-h-11 rounded-xl bg-amber-600 px-4 py-2 font-bold text-white disabled:bg-slate-300">Try AI Evaluation Again</button>
            <button type="button" onClick={continueWithTeacherReview} disabled={!hasAnswer || recorderBusy || loading} className="min-h-11 rounded-xl border border-amber-600 bg-white px-4 py-2 font-bold text-amber-800 disabled:opacity-50">Continue with Teacher Review</button>
          </div>
        </div>
      )}

      {result && (step === "follow-up-speaking" || step === "follow-up-answer") && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${selectedRecruiter.gradient} text-2xl text-white`}>
              {selectedRecruiter.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">One follow-up question</p>
              <p className="mt-2 text-lg font-semibold leading-7 text-slate-900">{followUpQuestion}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {step === "follow-up-speaking"
                  ? "Please listen. Recording will be available after the recruiter finishes speaking."
                  : "Use the microphone above to answer briefly, then submit your follow-up response."}
              </p>
            </div>
          </div>

          {step === "follow-up-answer" && (
            <button
              type="button"
              onClick={submitFollowUp}
              disabled={!canSubmitFollowUp}
              className="mt-5 min-h-12 w-full rounded-xl bg-amber-600 px-6 py-3 font-bold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
            >
              Submit Follow-up Answer
            </button>
          )}
        </div>
      )}

      {result && step === "acknowledging" && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${selectedRecruiter.gradient} text-2xl text-white`}>
              {selectedRecruiter.emoji}
            </div>
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
