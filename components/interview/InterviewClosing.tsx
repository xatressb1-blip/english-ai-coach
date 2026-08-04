"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import { enqueueSpeech } from "@/services/speechQueueService";

interface Props { onViewReport: () => void; }

export default function InterviewClosing({ onViewReport }: Props) {
  const { candidateName, selectedRecruiter, selectedCompany, selectedJobRole, totalQuestions } = useInterviewContext();
  const [speaking, setSpeaking] = useState(true);
  const startedRef = useRef(false);
  const closing = `Thank you, ${candidateName}. That concludes your interview for the ${selectedJobRole.title} position at ${selectedCompany.name}. I appreciate the time you took to answer all ${totalQuestions} questions. Your recruiter report is now ready. Please review it carefully and use the recommendations to prepare for your next interview.`;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    enqueueSpeech(closing, () => setSpeaking(false));
  }, [closing]);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-2xl">
      <div className="relative overflow-hidden px-5 py-9 sm:px-10 sm:py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,.22),transparent_40%),linear-gradient(135deg,#020617,#0f172a_55%,#052e2b)]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-white/10 bg-gradient-to-br ${selectedRecruiter.gradient} text-5xl shadow-2xl sm:h-32 sm:w-32 sm:text-7xl ${speaking ? "ring-8 ring-emerald-400/20" : ""}`}>{selectedRecruiter.emoji}</div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">Interview complete</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Thank you, {candidateName}</h1>
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/10 p-5 text-left text-sm leading-7 text-slate-200 backdrop-blur sm:p-7 sm:text-base">{closing}</div>
          <button type="button" onClick={onViewReport} disabled={speaking} className="mt-7 min-h-14 w-full rounded-xl bg-emerald-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-72">
            {speaking ? "Recruiter is concluding..." : "View Recruiter Report"}
          </button>
        </div>
      </div>
    </section>
  );
}
