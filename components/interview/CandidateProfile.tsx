"use client";

import { FormEvent, useEffect, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import SceneBackdrop from "./SceneBackdrop";

interface Props {
  onContinue: () => void;
}

export default function CandidateProfile({ onContinue }: Props) {
  const { candidateName, setCandidateName, setSelectedLevel } = useInterviewContext();
  const [nameInput, setNameInput] = useState(candidateName);

  useEffect(() => {
    setNameInput(candidateName);
  }, [candidateName]);

  const normalizedName = nameInput.trim().replace(/\s+/g, " ");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!normalizedName) return;

    // Fix 43.1: the teaching demonstration always uses Level 1 (basic).
    // Pressing Enter confirms the name and moves directly to company setup.
    setSelectedLevel("basic");
    setCandidateName(normalizedName);
    onContinue();
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <SceneBackdrop
        scene="lobby"
        overlay="dark"
        className="px-4 py-7 text-white sm:px-7 sm:py-9 lg:px-10"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-blue-100 sm:text-xs">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">
                Candidate check-in
              </span>
              <span>Level 1 · Basic</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
              Enter your name for the interview
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-100 sm:text-base">
              Press Enter after typing your name. You will go directly to company and position selection.
            </p>
          </div>
          <div className="hidden rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-right text-xs text-blue-100 backdrop-blur lg:block">
            <p className="font-bold text-white">Teaching demo interview</p>
            <p>Level 1 • 3 core questions • AI recruiter</p>
          </div>
        </div>
      </SceneBackdrop>

      <div className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Candidate</p>
            <h2 className="mt-1 text-xl font-bold text-slate-950">Your interview name</h2>
          </div>

          <label htmlFor="candidate-name" className="sr-only">Candidate name</label>
          <input
            id="candidate-name"
            type="text"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Example: Huy"
            maxLength={60}
            autoComplete="name"
            autoFocus
            className="mt-5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Level 1 – Cơ bản is selected automatically. Press Enter to continue.
          </p>
        </form>
      </div>
    </section>
  );
}
