"use client";

import { useMemo, useState } from "react";
import { InterviewAttempt } from "@/types/interviewReport";
import { RecruiterReport } from "@/types/interviewReport";

interface Props {
  attempts: InterviewAttempt[];
  report: RecruiterReport;
  candidateName: string;
}

const observerCards = [
  {
    title: "Observer 1 · Content",
    subtitle: "Content & Response Structure",
    prompt: "Use the paper assessment form to report one clear strength and one area for improvement in relevance, completeness, examples, and answer structure.",
  },
  {
    title: "Observer 2 · English",
    subtitle: "English Language Performance",
    prompt: "Use the paper assessment form to report one clear strength and one area for improvement in vocabulary, grammar, linking, clarity, fluency, pronunciation, and pace.",
  },
  {
    title: "Observer 3 · Professional",
    subtitle: "Professional Interview Performance",
    prompt: "Use the paper assessment form to report one clear strength and one area for improvement in posture, eye contact, confidence, voice, listening, and professional attitude.",
  },
];

export default function PaperObserverTeacherSummary({ attempts, report, candidateName }: Props) {
  const [open, setOpen] = useState(false);

  const evaluatedAttempts = useMemo(
    () => attempts.filter((attempt) => attempt.evaluation),
    [attempts],
  );

  const aiEvidence = useMemo(() => {
    return evaluatedAttempts.map((attempt) => ({
      question: attempt.questionTitle,
      score: attempt.evaluation.overall,
      source: attempt.evaluation.evaluationSource === "backup_rubric" ? "Backup Rubric" : "Live AI",
    }));
  }, [evaluatedAttempts]);

  if (attempts.length < 3) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-center font-bold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Teaching Demo Summary · AI + Peer + Teacher
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 p-2 sm:p-5 print:static print:bg-white print:p-0">
          <section className="mx-auto min-h-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl print:shadow-none">
            <header className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-5 text-white sm:p-8 print:bg-white print:text-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200 print:text-slate-500">Teaching demonstration · Fix 43</p>
                  <h1 className="mt-2 text-2xl font-black sm:text-4xl">AI Evidence + Paper Observer Feedback + Teacher Synthesis</h1>
                  <p className="mt-2 text-sm text-slate-300 print:text-slate-600">Candidate: {candidateName}</p>
                </div>
                <div className="flex gap-2 print:hidden">
                  <button type="button" onClick={() => window.print()} className="rounded-xl bg-white/10 px-4 py-2 font-bold hover:bg-white/20">Print / PDF</button>
                  <button type="button" onClick={() => setOpen(false)} className="rounded-xl bg-white px-4 py-2 font-bold text-slate-950">Close</button>
                </div>
              </div>
            </header>

            <div className="space-y-6 p-4 sm:p-8">
              <section className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">1 · Virtual assistant evidence</p>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {aiEvidence.map((item) => (
                    <div key={item.question} className="rounded-xl border border-blue-100 bg-white p-4">
                      <p className="text-sm font-bold text-slate-900">{item.question}</p>
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <span className="text-3xl font-black text-blue-700">{item.score}/10</span>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">{item.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-emerald-700">AI-identified strengths</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                      {report.strengths.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-black uppercase tracking-wide text-amber-700">AI-identified improvements</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
                      {report.improvements.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <p className="text-xs font-black uppercase tracking-[.18em] text-indigo-700">2 · Peer observer feedback · paper forms</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Observers do not enter scores into the app. Each observer presents feedback from the assigned paper assessment form after the three interview questions.</p>
                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                  {observerCards.map((observer) => (
                    <article key={observer.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-xs font-black uppercase tracking-wide text-indigo-700">{observer.title}</p>
                      <h2 className="mt-2 text-lg font-black text-slate-950">{observer.subtitle}</h2>
                      <p className="mt-3 text-sm leading-6 text-slate-600">{observer.prompt}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[.18em] text-emerald-700">3 · Teacher synthesis · final authority</p>
                <h2 className="mt-2 text-xl font-black text-emerald-950">Combine AI evidence with the three observer comments.</h2>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-white p-4"><strong className="text-emerald-900">Strength</strong><p className="mt-1 text-sm leading-6 text-slate-600">Identify the strongest demonstrated performance and cite evidence.</p></div>
                  <div className="rounded-xl bg-white p-4"><strong className="text-amber-900">Priority improvement</strong><p className="mt-1 text-sm leading-6 text-slate-600">Choose one high-value weakness to improve first.</p></div>
                  <div className="rounded-xl bg-white p-4"><strong className="text-blue-900">Next step</strong><p className="mt-1 text-sm leading-6 text-slate-600">Give one practical action the candidate can use in the next interview attempt.</p></div>
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-emerald-950">The AI result supports the discussion; the teacher makes the final instructional judgment.</p>
              </section>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
