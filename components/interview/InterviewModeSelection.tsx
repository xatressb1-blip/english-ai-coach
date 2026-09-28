"use client";

import Link from "next/link";
import SceneBackdrop from "./SceneBackdrop";

interface Props {
  onIndividual: () => void;
}

export default function InterviewModeSelection({ onIndividual }: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
      <SceneBackdrop scene="corridor" overlay="dark" className="px-5 py-9 text-white sm:px-9 sm:py-11">
        <span className="inline-flex rounded-full border border-white/20 bg-slate-950/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
          Enter Mock Interview
        </span>
        <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-4xl">
          Choose your interview mode
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-100 sm:text-base">
          Practice independently with a virtual recruiter, or enter the classroom rapid interview used for live peer observation and teacher feedback.
        </p>
      </SceneBackdrop>

      <div className="grid gap-5 p-4 sm:p-7 lg:grid-cols-2 lg:p-9">
        <article className="rounded-3xl border-2 border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">🎙️</div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-blue-700">Individual practice</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Individual Mock Interview</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Complete an individual AI recruiter interview with level selection, company and position setup, voice answers, and a final recruiter report.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
            <li>✓ Level 1 or Level 2 interview</li>
            <li>✓ Full recruiter flow and final report</li>
            <li>✓ Designed for independent practice</li>
          </ul>
          <button type="button" onClick={onIndividual} className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-4 font-black text-white shadow-lg transition hover:bg-blue-700">
            Start Individual Interview →
          </button>
        </article>

        <article className="rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-5 shadow-sm sm:p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">👥</div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Teaching demonstration</p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Classroom Rapid Mode</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            MrHuy completes one authentic three-question interview while MrLong, MrKhánh, and MrHoàng observe Content, English, and Professional Performance.
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
            <li>✓ Professional greeting and interview opening</li>
            <li>✓ Q1 → Q2 → Q3 with AI in the background</li>
            <li>✓ Three fixed peer-observer rubrics</li>
          </ul>
          <Link href="/classroom" className="mt-6 block w-full rounded-xl bg-emerald-600 px-5 py-4 text-center font-black text-white shadow-lg transition hover:bg-emerald-700">
            Enter Classroom Rapid Mode →
          </Link>
        </article>
      </div>
    </section>
  );
}
