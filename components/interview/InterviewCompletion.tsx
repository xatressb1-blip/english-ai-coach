"use client";

import Link from "next/link";
import { useInterviewContext } from "@/context/InterviewContext";

export default function InterviewCompletion() {
  const { totalQuestions, resetInterview } = useInterviewContext();

  return (
    <section className="overflow-hidden rounded-[28px] border border-emerald-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 py-12 text-center text-white sm:px-10">
        <div className="text-7xl">🏆</div>
        <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Mock Interview Completed</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-emerald-50 sm:text-lg">
          You completed all {totalQuestions} recruiter questions. Finishing the full session is an important confidence milestone.
        </p>
      </div>

      <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-3 lg:p-10">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-500">Recruiter impression</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Committed candidate</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">You stayed through the complete interview and practiced answering under realistic pressure.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-500">Next focus</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Review weaker answers</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">Open Learning Path to improve individual questions before your next full interview.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-500">Confidence action</p>
          <h2 className="mt-2 text-xl font-bold text-slate-900">Repeat the session</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">A second attempt helps your answers become more natural and professional.</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-center sm:p-8">
        <button
          type="button"
          onClick={resetInterview}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Practice Interview Again
        </button>
        <Link
          href="/"
          className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-center font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Return to Learning Path
        </Link>
      </div>
    </section>
  );
}
