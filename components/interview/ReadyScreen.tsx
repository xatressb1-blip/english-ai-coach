"use client";

import { useInterviewContext } from "@/context/InterviewContext";

interface Props { current: number; total: number; onReady: () => void; }

export default function ReadyScreen({ current, total, onReady }: Props) {
  const { selectedRecruiter } = useInterviewContext();
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-5 py-9 text-center text-white sm:px-10 sm:py-12">
        <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/15 bg-gradient-to-br ${selectedRecruiter.gradient} text-5xl shadow-xl sm:h-28 sm:w-28 sm:text-6xl`}>{selectedRecruiter.emoji}</div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">{selectedRecruiter.name} • AI Recruiter</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Question {current} of {total}</h1>
        <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-white/10 bg-white/10 p-4 text-sm leading-7 text-slate-200 backdrop-blur sm:p-5 sm:text-base">“Take a breath. When you press Ready, I will ask the question aloud. Listen to the end before starting your microphone.”</div>
      </div>
      <div className="p-5 text-center sm:p-8">
        <div className="mx-auto grid max-w-2xl gap-2 text-left text-sm text-slate-600 sm:grid-cols-3"><div className="rounded-xl bg-slate-50 p-3">1. Listen fully</div><div className="rounded-xl bg-slate-50 p-3">2. Organize one idea</div><div className="rounded-xl bg-slate-50 p-3">3. Record naturally</div></div>
        <button type="button" onClick={onReady} className="mt-6 min-h-14 w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[.98] sm:w-auto sm:min-w-72">I’m Ready — Ask Me</button>
      </div>
    </section>
  );
}
