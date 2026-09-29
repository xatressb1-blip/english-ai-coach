"use client";

import { useEffect, useRef, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import { clearSpeechQueue, enqueueRecruiterSpeech } from "@/services/speechQueueService";
import RecruiterAvatar from "./RecruiterAvatar";
import SceneBackdrop from "./SceneBackdrop";

interface Props {
  onBegin: () => void;
}

export default function InterviewOpening({ onBegin }: Props) {
  const { candidateName, selectedRecruiter, selectedCompany, selectedJobRole, totalQuestions } = useInterviewContext();
  const [speaking, setSpeaking] = useState(true);
  const [recruiterFinished, setRecruiterFinished] = useState(false);
  const startedRef = useRef(false);

  const greeting = `Hello, I’m ${selectedRecruiter.shortName}, your interviewer today. Thank you for joining us.`;

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    enqueueRecruiterSpeech(greeting, selectedRecruiter, () => {
      setSpeaking(false);
      setRecruiterFinished(true);
    });

    return () => clearSpeechQueue();
  }, [greeting, selectedRecruiter]);

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-700 bg-slate-950 text-white shadow-2xl">
      <SceneBackdrop scene="room" overlay="dark" className="px-5 py-8 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-white/15 bg-slate-950/35 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
            Interview Opening
          </span>

          <div className="mt-6 flex justify-center">
            <RecruiterAvatar recruiter={selectedRecruiter} state={speaking ? "speaking" : "idle"} size="xl" priority showStatusDot showWaveform />
          </div>

          <h1 className="mt-5 text-2xl font-bold sm:text-4xl">Greeting & Welcome</h1>
          <p className="mt-2 text-sm text-blue-100 sm:text-base">{selectedRecruiter.name} • {selectedRecruiter.title}</p>

          <div className="mt-6 rounded-2xl border border-white/15 bg-slate-950/50 p-5 text-left text-base leading-7 text-slate-100 backdrop-blur-md sm:p-7 sm:text-lg">
            <p>{greeting}</p>
          </div>

          <div className="mt-5 grid gap-3 text-left text-sm text-slate-100 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur"><strong className="block text-white">Candidate</strong>{candidateName}</div>
            <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur"><strong className="block text-white">Position</strong>{selectedJobRole.title}</div>
            <div className="rounded-xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur"><strong className="block text-white">Format</strong>{totalQuestions} questions</div>
          </div>

          {speaking && (
            <p className="mt-6 text-sm font-semibold text-blue-100">Please listen until the recruiter finishes speaking.</p>
          )}

          {recruiterFinished && (
            <div className="mt-6">
              <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 p-4 text-left text-sm leading-6 text-emerald-50">
                <p className="font-bold">Candidate response</p>
                <p className="mt-1">Reply to the recruiter naturally. When you are ready, begin the three-question interview.</p>
              </div>
              <button
                type="button"
                onClick={onBegin}
                className="mt-5 min-h-14 w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-500 active:scale-[.98] sm:w-auto sm:min-w-72"
              >
                Candidate Ready · Begin Q1 →
              </button>
            </div>
          )}

          <p className="mt-5 text-xs leading-5 text-slate-400">
            {selectedCompany.name} • This opening is not scored by AI. AI evaluation begins with Q1.
          </p>
        </div>
      </SceneBackdrop>
    </section>
  );
}
