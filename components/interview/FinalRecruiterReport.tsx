"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import {
  buildRecruiterReport,
  requestIntelligentRecruiterReport,
  saveRecruiterReport,
} from "@/services/interviewReportService";
import { RecruiterReport } from "@/types/interviewReport";
import InterviewReview from "./InterviewReview";
import TeacherProjectionSummary from "./TeacherProjectionSummary";

export default function FinalRecruiterReport() {
  const { attempts, candidateName, selectedLevel, resetInterview, selectedCompany, selectedJobRole, selectedRecruiter, candidateQuestion } = useInterviewContext();
  const fallback = useMemo(() => buildRecruiterReport(attempts, candidateName), [attempts, candidateName]);
  const [report, setReport] = useState<RecruiterReport>(fallback);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const levelName = selectedLevel === "basic" ? "Level 1 – Cơ bản" : "Level 2 – Nâng cao";

  useEffect(() => {
    let active = true;

    const interviewContext = {
      companyName: selectedCompany.name,
      companyIndustry: selectedCompany.industry,
      jobTitle: selectedJobRole.title,
      jobDepartment: selectedJobRole.department,
      recruiterName: selectedRecruiter.name,
    };

    requestIntelligentRecruiterReport(attempts, selectedLevel, candidateName, interviewContext, candidateQuestion).then((result) => {
      if (!active) return;
      setReport(result);
      saveRecruiterReport(result, attempts, selectedLevel, candidateName, interviewContext, candidateQuestion);
      setSaved(true);
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [attempts, candidateName, candidateQuestion, selectedCompany, selectedJobRole, selectedLevel, selectedRecruiter]);

  const breakdown = [
    ["Grammar", report.scoreBreakdown.grammar],
    ["Vocabulary", report.scoreBreakdown.vocabulary],
    ["Pronunciation", report.scoreBreakdown.pronunciation],
    ["Fluency", report.scoreBreakdown.fluency],
    ["Relevance", report.scoreBreakdown.relevance],
    ["Confidence", report.scoreBreakdown.confidence],
  ];

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-6 py-10 text-white sm:px-10">
        <p className="text-sm font-bold uppercase tracking-[.2em] text-blue-200">Final Recruiter Report</p>
        <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">{candidateName}, you completed {levelName}</h1>
            <p className="mt-2 text-slate-300">
              {selectedJobRole.title} at {selectedCompany.name}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              Interviewed by {selectedRecruiter.name} • {loading ? "Reviewing the complete interview..." : `Based on ${attempts.length} evaluated answers.`}
            </p>
            {saved && <p className="mt-2 text-sm text-emerald-300">Report saved to this device.</p>}
          </div>
          <div className="rounded-2xl bg-white/10 px-6 py-4 text-center">
            <p className="text-4xl font-black">{report.overallScore}</p>
            <p className="text-sm text-blue-100">Overall / 10</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <p className="text-sm font-bold uppercase text-blue-700">Interview Readiness</p>
          <p className="mt-2 text-2xl font-black text-blue-950">{report.readiness}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5">
          <p className="text-sm font-bold uppercase text-slate-500">Recruiter Impression for {candidateName}</p>
          <p className="mt-3 leading-7 text-slate-700">{report.recruiterImpression}</p>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
          <p className="text-sm font-bold uppercase text-emerald-700">Top Strengths</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-emerald-950">
            {report.strengths.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="text-sm font-bold uppercase text-amber-700">Areas to Improve</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-amber-950">
            {report.improvements.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>

        <div className="rounded-2xl border border-slate-200 p-5 lg:col-span-2">
          <p className="text-sm font-bold uppercase text-slate-500">Score Breakdown</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {breakdown.map(([name, score]) => (
              <div key={name} className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold text-slate-700">{name}</span>
                  <span className="font-black text-slate-900">{score}/10</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Number(score) * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {report.bestAttempt && (
          <div className="rounded-2xl border border-emerald-200 p-5">
            <p className="text-sm font-bold uppercase text-emerald-700">Best Answer</p>
            <h3 className="mt-2 font-bold text-slate-900">{report.bestAttempt.questionTitle}</h3>
            <p className="mt-2 text-2xl font-black text-emerald-600">{report.bestAttempt.evaluation.overall}/10</p>
          </div>
        )}

        {report.weakestAttempt && (
          <div className="rounded-2xl border border-rose-200 p-5">
            <p className="text-sm font-bold uppercase text-rose-700">Question to Review</p>
            <h3 className="mt-2 font-bold text-slate-900">{report.weakestAttempt.questionTitle}</h3>
            <p className="mt-2 text-2xl font-black text-rose-600">{report.weakestAttempt.evaluation.overall}/10</p>
            <Link href={`/question/${report.weakestAttempt.questionId}`} className="mt-4 inline-block rounded-xl bg-rose-600 px-4 py-2 font-bold text-white">
              Practice This Question Again
            </Link>
          </div>
        )}


        {candidateQuestion && (
          <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5 lg:col-span-2">
            <p className="text-sm font-bold uppercase text-cyan-700">Candidate Question</p>
            {candidateQuestion.skipped ? (
              <>
                <p className="mt-3 font-semibold text-slate-800">No question was asked.</p>
                <p className="mt-2 text-sm leading-7 text-slate-600">{candidateQuestion.feedback}</p>
              </>
            ) : (
              <>
                <p className="mt-3 rounded-xl bg-white p-4 font-semibold leading-7 text-slate-900">“{candidateQuestion.transcript}”</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Professional relevance</p>
                    <p className="mt-1 text-lg font-black text-cyan-800">{candidateQuestion.professionalRelevance}</p>
                  </div>
                  <div className="rounded-xl bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Company interest</p>
                    <p className="mt-1 text-lg font-black text-cyan-800">{candidateQuestion.companyInterest}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-slate-700">{candidateQuestion.feedback}</p>
              </>
            )}
          </div>
        )}

        <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5 lg:col-span-2">
          <p className="text-sm font-bold uppercase text-violet-700">Recommended Next Practice</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-violet-950">
            {report.recommendedNextPractice.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </div>
      </div>

      <InterviewReview attempts={attempts} />

      <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row sm:justify-center">
        <TeacherProjectionSummary
          attempts={attempts}
          report={report}
          candidateName={candidateName}
          companyName={selectedCompany.name}
          jobTitle={selectedJobRole.title}
          recruiterName={selectedRecruiter.name}
        />
        <button onClick={resetInterview} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">Repeat This Level</button>
        <Link href="/history" className="rounded-xl border border-blue-300 px-6 py-3 text-center font-bold text-blue-700">View Practice History</Link>
        <Link href="/" className="rounded-xl border border-slate-300 px-6 py-3 text-center font-bold text-slate-700">Return Home</Link>
      </div>
    </section>
  );
}
