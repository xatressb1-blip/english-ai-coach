"use client";

import { useInterviewContext } from "@/context/InterviewContext";
import { InterviewState } from "@/services/interviewFlowService";

const stateCopy: Record<InterviewState, { label: string; message: string; pulse: string }> = {
  [InterviewState.IDLE]: {
    label: "Waiting",
    message: "The interview will begin shortly.",
    pulse: "bg-slate-400",
  },
  [InterviewState.READY]: {
    label: "Get ready",
    message: "Take a breath and prepare for the next question.",
    pulse: "bg-amber-400",
  },
  [InterviewState.ASKING]: {
    label: "Recruiter speaking",
    message: "Listen carefully to the question.",
    pulse: "bg-blue-500 animate-pulse",
  },
  [InterviewState.LISTENING]: {
    label: "Your turn",
    message: "Answer naturally. The recruiter is listening.",
    pulse: "bg-red-500 animate-pulse",
  },
  [InterviewState.EVALUATING]: {
    label: "Reviewing answer",
    message: "The recruiter is reviewing your response.",
    pulse: "bg-violet-500 animate-pulse",
  },
  [InterviewState.READY_NEXT]: {
    label: "Answer reviewed",
    message: "Continue when you are ready for the next question.",
    pulse: "bg-emerald-500",
  },
  [InterviewState.FINISHED]: {
    label: "Interview complete",
    message: "Your recruiter report is ready.",
    pulse: "bg-emerald-500",
  },
};

export default function RecruiterStage() {
  const { currentQuestion, currentQuestionIndex, totalQuestions, flow } = useInterviewContext();
  const view = stateCopy[flow.state];
  const recruiterSpeaking = flow.state === InterviewState.ASKING;

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-700 bg-slate-900 text-white shadow-2xl">
      <div className="relative min-h-[430px] overflow-hidden px-5 py-6 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.28),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,.4),transparent_45%),linear-gradient(135deg,#0f172a,#1e293b_55%,#172554)]" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-950/50 to-transparent" />

        <div className="relative flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Live mock interview</p>
            <p className="mt-1 text-sm text-slate-300">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur">
            <span className={`h-2.5 w-2.5 rounded-full ${view.pulse}`} />
            {view.label}
          </div>
        </div>

        <div className="relative mt-8 grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div className="text-center">
            <div className={`mx-auto flex h-40 w-40 items-center justify-center rounded-full border-8 border-white/10 bg-gradient-to-br from-blue-500 to-indigo-700 text-8xl shadow-2xl transition ${recruiterSpeaking ? "scale-[1.03] ring-8 ring-blue-400/20" : ""}`}>
              👩‍💼
            </div>
            <h2 className="mt-5 text-2xl font-bold">Ms. Emma</h2>
            <p className="mt-1 text-sm text-blue-200">AI Recruiter</p>
            <div className="mt-4 flex justify-center gap-1.5" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((bar) => (
                <span
                  key={bar}
                  className={`w-1.5 rounded-full bg-blue-300 transition-all ${recruiterSpeaking ? (bar % 2 === 0 ? "h-7 animate-pulse" : "h-4 animate-pulse") : "h-2"}`}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl backdrop-blur sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Recruiter asks</p>
              <h1 className="mt-4 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
                “{currentQuestion.title}”
              </h1>
              <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
                {view.message}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs sm:text-sm">
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <p className="text-slate-400">Category</p>
                <p className="mt-1 font-semibold text-white">{currentQuestion.category}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <p className="text-slate-400">Level</p>
                <p className="mt-1 font-semibold text-white">{currentQuestion.level}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur">
                <p className="text-slate-400">Progress</p>
                <p className="mt-1 font-semibold text-white">{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
