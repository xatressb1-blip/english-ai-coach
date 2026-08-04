"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEvaluation } from "@/hooks/useEvaluation";
import { useSpeechContext } from "@/context/SpeechContext";
import { useEvaluationContext } from "@/context/EvaluationContext";
import { useInterviewContext } from "@/context/InterviewContext";
import { enqueueSpeech } from "@/services/speechQueueService";
import { requestFollowUp } from "@/services/followUpService";
import { SpeechMetrics } from "@/types/speechMetrics";

type InterviewStep =
  | "main-answer"
  | "deciding"
  | "follow-up-speaking"
  | "follow-up-answer"
  | "acknowledging";

export default function MockInterviewEvaluation() {
  const { transcript, setTranscript, status, speechMetrics } = useSpeechContext();
  const { result, loading, error, evaluate } = useEvaluation();
  const { resetEvaluation } = useEvaluationContext();
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

    if (!allowFollowUp) {
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
            disabled={!canSubmitMain}
            className="min-h-12 w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
          >
            {loading ? "Recruiter is reviewing..." : "Submit Answer"}
          </button>
        </div>
      )}

      {(loading || step === "deciding") && (
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
          <div className="h-9 w-9 shrink-0 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <div>
            <p className="font-semibold text-slate-800">Recruiter is reviewing your response</p>
            <p className="text-sm leading-6 text-slate-500">
              {allowFollowUp
                ? "The recruiter may ask one short follow-up when clarification would be useful."
                : "The recruiter is recording your answer and will continue to the next question."}
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">{error}</div>
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
