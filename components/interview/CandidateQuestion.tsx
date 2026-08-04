"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SpeechRecorder from "@/components/SpeechRecorder";
import { useInterviewContext } from "@/context/InterviewContext";
import { useSpeechContext } from "@/context/SpeechContext";
import { enqueueSpeech } from "@/services/speechQueueService";
import { CandidateQuestionResult, CandidateQuestionRating } from "@/types/candidateQuestion";

interface Props {
  onComplete: () => void;
}

const usefulTopicPatterns = [
  /training|learning|development|onboarding/i,
  /team|department|manager|colleague/i,
  /success|expectation|responsibilit|priority/i,
  /career|growth|progression|promotion/i,
  /project|technology|tool|challenge/i,
  /next step|hiring process|timeline/i,
  /company|culture|work environment/i,
];

function assessQuestion(transcript: string): Pick<CandidateQuestionResult, "professionalRelevance" | "companyInterest" | "feedback"> {
  const normalized = transcript.trim();
  const wordCount = normalized.split(/\s+/).filter(Boolean).length;
  const relevantTopics = usefulTopicPatterns.filter((pattern) => pattern.test(normalized)).length;
  const looksLikeQuestion = /\?|\b(what|how|could|can|would|may|when|who|which|is|are|do|does)\b/i.test(normalized);

  let professionalRelevance: CandidateQuestionRating = "Needs preparation";
  let companyInterest: CandidateQuestionRating = "Needs preparation";

  if (looksLikeQuestion && relevantTopics >= 1 && wordCount >= 6) professionalRelevance = "Appropriate";
  if (looksLikeQuestion && relevantTopics >= 2 && wordCount >= 9) professionalRelevance = "Strong";
  if (relevantTopics >= 1) companyInterest = "Appropriate";
  if (relevantTopics >= 2) companyInterest = "Strong";

  const feedback = professionalRelevance === "Strong"
    ? "This is a focused, professional question that shows genuine interest in the role and organization."
    : professionalRelevance === "Appropriate"
      ? "This is a suitable closing question. You can make it stronger by connecting it more specifically to the position or team."
      : "Prepare one clear question about the role, team, training, success expectations, or next steps before your next interview.";

  return { professionalRelevance, companyInterest, feedback };
}

export default function CandidateQuestion({ onComplete }: Props) {
  const { candidateName, selectedRecruiter, selectedCompany, selectedJobRole, setCandidateQuestion } = useInterviewContext();
  const { transcript, status, speechMetrics, resetSpeech } = useSpeechContext();
  const [stage, setStage] = useState<"asking" | "answering" | "responding">("asking");
  const [responseText, setResponseText] = useState("");
  const startedRef = useRef(false);

  const recruiterPrompt = useMemo(
    () => `Before we conclude, ${candidateName}, do you have any questions for us about the ${selectedJobRole.title} position, the team, or ${selectedCompany.name}?`,
    [candidateName, selectedCompany.name, selectedJobRole.title]
  );

  useEffect(() => {
    resetSpeech();
    if (startedRef.current) return;
    startedRef.current = true;
    enqueueSpeech(recruiterPrompt, () => setStage("answering"));
    // Run once for this closing-stage prompt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruiterPrompt]);

  const busy = status === "recording" || status === "processing";
  const canSubmit = stage === "answering" && transcript.trim().length > 0 && !busy;

  const finishWithResponse = (result: CandidateQuestionResult, spokenResponse: string) => {
    setCandidateQuestion(result);
    setResponseText(spokenResponse);
    setStage("responding");
    resetSpeech();
    enqueueSpeech(spokenResponse, onComplete);
  };

  const submitQuestion = () => {
    if (!canSubmit) return;
    const question = transcript.trim();
    const assessment = assessQuestion(question);
    const result: CandidateQuestionResult = {
      transcript: question,
      skipped: false,
      speechMetrics: speechMetrics ?? undefined,
      ...assessment,
    };
    finishWithResponse(
      result,
      "Thank you. That is a helpful question. Your interest in the role has been noted, and we will now conclude the interview."
    );
  };

  const skipQuestion = () => {
    const result: CandidateQuestionResult = {
      transcript: "",
      skipped: true,
      professionalRelevance: "Not asked",
      companyInterest: "Not asked",
      feedback: "Prepare at least one professional question about the role, team, training, success expectations, or next steps for future interviews.",
    };
    finishWithResponse(
      result,
      "That is perfectly fine. Thank you for your time. For future interviews, preparing one thoughtful question can help demonstrate your interest in the position."
    );
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-2xl">
      <div className="relative overflow-hidden px-4 py-7 sm:px-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,.22),transparent_42%),linear-gradient(135deg,#020617,#0f172a_55%,#172554)]" />
        <div className="relative mx-auto max-w-3xl">
          <div className="flex items-center gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${selectedRecruiter.gradient} text-3xl shadow-xl sm:h-20 sm:w-20 sm:text-4xl`}>
              {selectedRecruiter.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">Final interview stage</p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">Your question for the recruiter</h1>
              <p className="mt-1 text-sm text-slate-300">This does not count as an additional scored interview question.</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 text-base leading-7 text-slate-100 backdrop-blur sm:p-6 sm:text-lg">
            {recruiterPrompt}
          </div>

          {stage === "asking" && (
            <div className="mt-5 rounded-xl bg-blue-500/15 p-4 text-sm text-blue-100">Recruiter is speaking. Please listen before recording your question.</div>
          )}

          {stage === "answering" && (
            <div className="mt-5 rounded-2xl bg-white p-4 text-slate-900 sm:p-6">
              <SpeechRecorder allowManualInput={false} compact hideTranscript title="Record your question" />
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={submitQuestion} disabled={!canSubmit} className="min-h-12 flex-1 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                  {busy ? "Processing your question..." : "Submit My Question"}
                </button>
                <button type="button" onClick={skipQuestion} disabled={busy} className="min-h-12 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50">
                  I don’t have a question
                </button>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-500">Good topics include training, team expectations, success in the role, company culture, or the next hiring steps.</p>
            </div>
          )}

          {stage === "responding" && (
            <div className="mt-5 rounded-2xl border border-emerald-300/25 bg-emerald-400/10 p-5 text-sm leading-7 text-emerald-50">
              <p className="font-bold">Recruiter response</p>
              <p className="mt-2">{responseText}</p>
              <p className="mt-3 text-emerald-200">The interview will close automatically after the recruiter finishes speaking.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
