"use client";

import { useInterviewContext } from "@/context/InterviewContext";
import { InterviewState } from "@/services/interviewFlowService";
import RecruiterAvatar, { RecruiterAvatarState } from "./RecruiterAvatar";
import SceneBackdrop from "./SceneBackdrop";

const stateCopy: Record<InterviewState, { label: string; message: string; pulse: string }> = {
  [InterviewState.IDLE]: { label: "Waiting", message: "The interview will begin shortly.", pulse: "bg-slate-400" },
  [InterviewState.READY]: { label: "Get ready", message: "Take a breath and prepare for the next question.", pulse: "bg-amber-400" },
  [InterviewState.ASKING]: { label: "Recruiter speaking", message: "Listen carefully to the full question.", pulse: "bg-blue-500 animate-pulse" },
  [InterviewState.LISTENING]: { label: "Your turn", message: "Tap Start Recording, pause briefly, then answer naturally.", pulse: "bg-red-500 animate-pulse" },
  [InterviewState.EVALUATING]: { label: "Reviewing answer", message: "Your response is being reviewed.", pulse: "bg-violet-500 animate-pulse" },
  [InterviewState.READY_NEXT]: { label: "Answer reviewed", message: "Continue when you are ready for the next question.", pulse: "bg-emerald-500" },
  [InterviewState.FINISHED]: { label: "Interview complete", message: "Your recruiter report is ready.", pulse: "bg-emerald-500" },
};

function avatarStateForFlow(state: InterviewState): RecruiterAvatarState {
  if (state === InterviewState.ASKING) return "speaking";
  if (state === InterviewState.LISTENING) return "listening";
  return "idle";
}

export default function RecruiterStage() {
  const { currentQuestion, currentQuestionIndex, totalQuestions, flow, selectedRecruiter, selectedCompany, selectedJobRole } = useInterviewContext();
  const view = stateCopy[flow.state];
  const avatarState = avatarStateForFlow(flow.state);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
      <SceneBackdrop scene="room" overlay="dark" className="px-4 py-5 sm:px-7 sm:py-7 lg:px-9">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100 sm:text-xs">{selectedCompany.name}</p><p className="mt-1 text-xs text-slate-200 sm:text-sm">{selectedJobRole.title} • Question {currentQuestionIndex + 1} of {totalQuestions}</p></div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/45 px-3 py-2 text-[11px] font-semibold backdrop-blur sm:px-4 sm:text-xs"><span className={`h-2.5 w-2.5 rounded-full ${view.pulse}`} />{view.label}</div>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center lg:gap-8">
          <div className="flex items-center gap-3 sm:block sm:text-center">
            <RecruiterAvatar recruiter={selectedRecruiter} state={avatarState} size="xl" priority showStatusDot showWaveform />
            <div><h2 className="font-bold sm:mt-4 sm:text-xl">{selectedRecruiter.name}</h2><p className="text-xs text-blue-100 sm:text-sm">{selectedRecruiter.title}</p></div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-slate-950/55 p-5 shadow-xl backdrop-blur-md sm:rounded-3xl sm:p-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100 sm:text-xs">Recruiter asks</p>
            <h1 className="mt-3 text-xl font-bold leading-snug sm:text-3xl lg:text-4xl">“{currentQuestion.title}”</h1>
            <p className="mt-3 text-sm leading-6 text-slate-200 sm:text-base">{view.message}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] sm:text-xs"><span className="rounded-full bg-white/10 px-3 py-1.5">{currentQuestion.category}</span><span className="rounded-full bg-white/10 px-3 py-1.5">{currentQuestion.level}</span><span className="rounded-full bg-white/10 px-3 py-1.5">{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% complete</span></div>
          </div>
        </div>
      </SceneBackdrop>
    </section>
  );
}
