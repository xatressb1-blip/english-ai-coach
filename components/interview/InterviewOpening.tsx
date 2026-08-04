"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import { enqueueSpeech } from "@/services/speechQueueService";

interface Props {
  onBegin: () => void;
}

export default function InterviewOpening({ onBegin }: Props) {
  const { candidateName, selectedRecruiter, selectedCompany, selectedJobRole, totalQuestions } = useInterviewContext();
  const [speaking, setSpeaking] = useState(true);
  const startedRef = useRef(false);

  const greeting = `Good day, ${candidateName}. I am ${selectedRecruiter.shortName}, your interviewer today. You are applying for the ${selectedJobRole.title} position at ${selectedCompany.name}. I will ask you ${totalQuestions} interview questions about your background, strengths, goals, and working style. Please answer naturally and use examples from your own experience whenever possible. Take your time, and let us begin when you are ready.`;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    enqueueSpeech(greeting, () => setSpeaking(false));
  }, [greeting]);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-2xl">
      <div className="relative overflow-hidden px-5 py-8 sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.30),transparent_42%),linear-gradient(135deg,#020617,#0f172a_55%,#172554)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">
            Interview briefing
          </span>

          <div className={`mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/10 bg-gradient-to-br ${selectedRecruiter.gradient} text-5xl shadow-2xl transition sm:h-32 sm:w-32 sm:text-7xl ${speaking ? "ring-8 ring-blue-400/20" : ""}`}>
            {selectedRecruiter.emoji}
          </div>

          <h1 className="mt-5 text-2xl font-bold sm:text-4xl">Welcome, {candidateName}</h1>
          <p className="mt-2 text-sm text-blue-200 sm:text-base">{selectedRecruiter.name} • {selectedRecruiter.title}</p>

          <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 text-left text-sm leading-7 text-slate-200 backdrop-blur sm:p-7 sm:text-base">
            <p>{greeting}</p>
          </div>

          <div className="mt-5 grid gap-3 text-left text-sm text-slate-200 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4"><strong className="block text-white">Company</strong>{selectedCompany.name}</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4"><strong className="block text-white">Position</strong>{selectedJobRole.title}</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4"><strong className="block text-white">Format</strong>{totalQuestions} questions</div>
          </div>

          <button
            type="button"
            onClick={onBegin}
            disabled={speaking}
            className="mt-7 min-h-14 w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-500 active:scale-[.98] disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-72"
          >
            {speaking ? "Recruiter is speaking..." : "Begin Interview"}
          </button>
        </div>
      </div>
    </section>
  );
}
