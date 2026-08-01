"use client";

import Link from "next/link";
import { useInterviewContext } from "@/context/InterviewContext";
import { buildRecruiterReport } from "@/services/interviewReportService";

export default function FinalRecruiterReport() {
  const { attempts, selectedLevel, resetInterview } = useInterviewContext();
  const report = buildRecruiterReport(attempts);
  const levelName = selectedLevel === "basic" ? "Level 1 – Cơ bản" : "Level 2 – Nâng cao";

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-blue-200">Final Recruiter Report</p>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><h1 className="text-3xl font-bold sm:text-4xl">{levelName} completed</h1><p className="mt-2 text-slate-300">Based on {attempts.length} evaluated answer{attempts.length === 1 ? "" : "s"}.</p></div>
          <div className="rounded-2xl bg-white/10 px-6 py-4 text-center"><p className="text-4xl font-black">{report.overallScore}</p><p className="text-sm text-blue-100">Overall / 10</p></div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5"><p className="text-sm font-bold uppercase text-blue-700">Interview Readiness</p><h2 className="mt-2 text-2xl font-bold text-slate-900">{report.readiness}</h2><p className="mt-3 leading-7 text-slate-700">{report.recruiterImpression}</p></div>
        <div className="rounded-2xl border border-slate-200 p-5"><h2 className="text-xl font-bold">Score Breakdown</h2><div className="mt-4 grid grid-cols-2 gap-3 text-sm">{Object.entries(report.scoreBreakdown).map(([name, value]) => <div key={name} className="rounded-xl bg-slate-50 p-3"><p className="capitalize text-slate-500">{name}</p><p className="mt-1 text-xl font-bold">{value}/10</p></div>)}</div></div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="text-xl font-bold text-emerald-900">Top Strengths</h2><ol className="mt-4 space-y-3 text-sm text-emerald-900">{report.strengths.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}</ol></div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5"><h2 className="text-xl font-bold text-amber-900">Areas to Improve</h2><ol className="mt-4 space-y-3 text-sm text-amber-900">{report.improvements.map((item, index) => <li key={item}>{index + 1}. {item}</li>)}</ol></div>
        {report.bestAttempt && <div className="rounded-2xl border border-slate-200 p-5"><p className="text-sm font-bold uppercase text-emerald-700">Best Answer</p><h3 className="mt-2 font-bold text-slate-900">{report.bestAttempt.questionTitle}</h3><p className="mt-2 text-2xl font-black text-emerald-600">{report.bestAttempt.evaluation.overall}/10</p></div>}
        {report.weakestAttempt && <div className="rounded-2xl border border-slate-200 p-5"><p className="text-sm font-bold uppercase text-rose-700">Question to Review</p><h3 className="mt-2 font-bold text-slate-900">{report.weakestAttempt.questionTitle}</h3><p className="mt-2 text-2xl font-black text-rose-600">{report.weakestAttempt.evaluation.overall}/10</p><Link href={`/question/${report.weakestAttempt.questionId}`} className="mt-4 inline-block rounded-xl bg-rose-600 px-4 py-2 font-bold text-white">Practice This Question Again</Link></div>}
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-center"><button onClick={resetInterview} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">Repeat This Level</button><Link href="/" className="rounded-xl border border-slate-300 px-6 py-3 text-center font-bold text-slate-700">Return Home</Link></div>
    </section>
  );
}
