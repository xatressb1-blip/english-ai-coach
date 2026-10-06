"use client";

import { useState } from "react";
import { recruiters } from "@/data/recruiters";
import { useInterviewContext } from "@/context/InterviewContext";
import RecruiterAvatar from "./RecruiterAvatar";
import SceneBackdrop from "./SceneBackdrop";

interface Props {
  candidateName: string;
  totalQuestions: number;
  onEnter: () => void;
  recruiterPreselected?: boolean;
}

export default function VirtualInterviewLobby({ candidateName, totalQuestions, onEnter, recruiterPreselected = false }: Props) {
  const { selectedRecruiter, setSelectedRecruiterId, selectedCompany, selectedJobRole } = useInterviewContext();
  const [hasChosenRecruiter, setHasChosenRecruiter] = useState(recruiterPreselected);

  const chooseRecruiter = (id: string) => {
    setSelectedRecruiterId(id);
    setHasChosenRecruiter(true);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <SceneBackdrop scene="lobby" overlay="dark" className="px-4 py-8 text-white sm:px-8 sm:py-10 lg:px-12">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">Virtual Recruiter Interview Lobby</span>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Choose the recruiter who will meet you in the interview room.</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-100 sm:text-base">You are interviewing for <strong>{selectedJobRole.title}</strong> at <strong>{selectedCompany.name}</strong>. Choose one recruiter to enter the interview room.</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {recruiters.map((recruiter) => {
            const active = hasChosenRecruiter && recruiter.id === selectedRecruiter.id;
            return (
              <button
                key={recruiter.id}
                type="button"
                onClick={() => chooseRecruiter(recruiter.id)}
                aria-pressed={active}
                className={`min-h-48 rounded-2xl border p-4 text-left backdrop-blur-md transition active:scale-[.98] ${active ? "border-blue-300 bg-white text-slate-900 shadow-xl ring-4 ring-blue-400/20" : "border-white/20 bg-slate-950/45 text-white hover:bg-slate-950/55"}`}
              >
                <RecruiterAvatar recruiter={recruiter} state="idle" size="sm" priority={active} />
                <p className="mt-3 font-bold">{recruiter.name}</p>
                <p className={`mt-1 text-xs ${active ? "text-blue-700" : "text-blue-100"}`}>{recruiter.title}</p>
                <p className={`mt-3 text-xs leading-5 ${active ? "text-slate-600" : "text-slate-200"}`}>{recruiter.style}</p>
                <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${active ? "bg-blue-100 text-blue-700" : "bg-white/10 text-blue-100"}`}>{active ? "✓ Selected" : recruiter.accent}</span>
              </button>
            );
          })}
        </div>
      </SceneBackdrop>

      <div className="grid gap-5 p-4 sm:p-7 lg:grid-cols-[.9fr_1.1fr] lg:p-9">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            {hasChosenRecruiter ? (
              <>
                <RecruiterAvatar recruiter={selectedRecruiter} state="idle" size="sm" showStatusDot />
                <div>
                  <h2 className="font-bold text-slate-900">{selectedRecruiter.name}</h2>
                  <p className="text-xs text-slate-500">{selectedRecruiter.accent} • {totalQuestions} questions</p>
                </div>
              </>
            ) : (
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Candidate</p>
                <h2 className="mt-1 font-bold text-slate-900">{candidateName}</h2>
                <p className="mt-1 text-xs text-slate-500">Select a recruiter above to continue.</p>
              </div>
            )}
          </div>
          <div className="mt-4 rounded-xl border border-blue-100 bg-white p-4 text-sm leading-6 text-slate-600">
            <p className="font-bold text-slate-900">{selectedJobRole.title}</p>
            <p className="text-xs text-blue-700">{selectedCompany.name} • {selectedJobRole.department}</p>
            {hasChosenRecruiter && <p className="mt-3">“Hello, I’m {selectedRecruiter.shortName}, your interviewer today. Thank you for joining us.”</p>}
          </div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600"><li>✓ Level 1 · 3 core questions.</li><li>✓ Use your own experience.</li><li>✓ Sample answers stay hidden.</li><li>✓ Mock Interview accepts microphone answers only.</li></ul>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🎙️</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Microphone ready</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Microphone recording is enabled for the interview flow. If browser permission has not been granted yet, it will be requested automatically when recording begins.
              </p>
            </div>
          </div>

          {hasChosenRecruiter ? (
            <button type="button" onClick={onEnter} className="mt-5 min-h-12 w-full rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[.99]">
              Enter Interview Room →
            </button>
          ) : (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-white/70 px-4 py-3 text-sm font-semibold text-emerald-800">
              Select a virtual recruiter to continue.
            </div>
          )}

          <p className="mt-3 text-xs leading-5 text-slate-500">On iPhone/Safari, allow microphone access when the browser requests it. Do not lock the screen while recording.</p>
        </div>
      </div>
    </section>
  );
}
