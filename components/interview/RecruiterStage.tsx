"use client";

import { useSpeechContext } from "@/context/SpeechContext";
import { useInterviewContext } from "@/context/InterviewContext";
import { InterviewState } from "@/services/interviewFlowService";
import RecruiterAvatar, { RecruiterAvatarState } from "./RecruiterAvatar";
import InterviewAudioVisual from "./InterviewAudioVisual";
import SceneBackdrop from "./SceneBackdrop";

const stateCopy: Record<InterviewState, { label: string; message: string; pulse: string }> = {
  [InterviewState.IDLE]: { label: "Waiting", message: "The interview will begin shortly.", pulse: "bg-slate-400" },
  [InterviewState.READY]: { label: "Get ready", message: "Take a breath and prepare for the next question.", pulse: "bg-amber-400" },
  [InterviewState.ASKING]: { label: "Interview question", message: "Listen to the question. If audio is unavailable, read the question below.", pulse: "bg-blue-400" },
  [InterviewState.LISTENING]: { label: "Your turn", message: "Tap Start Recording, pause briefly, then answer naturally.", pulse: "bg-emerald-400" },
  [InterviewState.EVALUATING]: { label: "Reviewing answer", message: "Your response is being reviewed.", pulse: "bg-violet-400" },
  [InterviewState.READY_NEXT]: { label: "Answer reviewed", message: "Continue when you are ready for the next question.", pulse: "bg-emerald-500" },
  [InterviewState.FINISHED]: { label: "Interview complete", message: "Your recruiter report is ready.", pulse: "bg-emerald-500" },
};

function avatarStateForFlow(state: InterviewState): RecruiterAvatarState {
  // Flow ASKING can include queued or unavailable audio; never imply actual playback.
  if (state === InterviewState.LISTENING) return "idle";
  return "idle";
}

export default function RecruiterStage() {
  const { currentQuestion, currentQuestionIndex, totalQuestions, flow, selectedRecruiter, selectedCompany, selectedJobRole } = useInterviewContext();
  const { status, transcript } = useSpeechContext();
  // Read the existing recorder state only; this view never starts/stops capture.
  const inAnswerTurn = flow.state === InterviewState.LISTENING;
  const view = inAnswerTurn && status === "recording"
    ? { label: "Recording your answer", message: "Answer in your own words. Tap Stop Recording when you finish.", pulse: "bg-red-400" }
    : inAnswerTurn && status === "processing"
    ? { label: "Preparing transcript", message: "Please wait while your audio is converted to text.", pulse: "bg-violet-400" }
    : inAnswerTurn && transcript.trim()
    ? { label: "Answer captured", message: "Submit your answer when you are ready.", pulse: "bg-teal-400" }
    : stateCopy[flow.state];
  const avatarState = inAnswerTurn && status === "recording" ? "listening" : avatarStateForFlow(flow.state);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
      <SceneBackdrop scene="room" overlay="dark" className="px-4 py-5 sm:px-7 sm:py-7 lg:px-9">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100 sm:text-xs">{selectedCompany.name}</p><p className="mt-1 text-xs text-slate-200 sm:text-sm">{selectedJobRole.title} • Question {currentQuestionIndex + 1} of {totalQuestions}</p></div>
          <div role="status" aria-live="polite" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-2 text-[11px] font-semibold backdrop-blur sm:px-4 sm:text-xs"><span className={`h-2.5 w-2.5 rounded-full ${view.pulse}`} />{view.label}</div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center lg:gap-8">
          <div className="flex items-center gap-3 sm:block sm:text-center">
            <RecruiterAvatar recruiter={selectedRecruiter} state={avatarState} size="stage" priority showStatusDot />
            <div><h2 className="font-bold sm:mt-4 sm:text-xl">{selectedRecruiter.name}</h2><p className="text-xs text-blue-100 sm:text-sm">{selectedRecruiter.title}</p><p className="mt-1 text-[11px] text-slate-300">AI interview practice partner</p></div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-slate-950/55 p-5 shadow-xl backdrop-blur-md sm:rounded-3xl sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100 sm:text-xs">Recruiter asks</p>
            <h1 className="mt-3 text-xl font-bold leading-snug sm:text-3xl lg:text-4xl">“{currentQuestion.title}”</h1>
            <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">{view.message}</p>
            <InterviewAudioVisual asking={flow.state === InterviewState.ASKING} recording={inAnswerTurn && status === "recording"} />
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] sm:text-xs"><span className="rounded-full bg-white/10 px-3 py-1.5">{currentQuestion.category}</span><span className="rounded-full bg-white/10 px-3 py-1.5">{currentQuestion.level}</span><span className="rounded-full bg-white/10 px-3 py-1.5">Question {currentQuestionIndex + 1} / {totalQuestions}</span></div>
          </div>
        </div>
      </SceneBackdrop>
    </section>
  );
}
