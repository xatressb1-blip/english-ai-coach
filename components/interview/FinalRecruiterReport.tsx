"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import {
  buildRecruiterReport,
  requestIntelligentRecruiterReport,
  saveRecruiterReport,
} from "@/services/interviewReportService";
import { candidateKeyFromName } from "@/services/classroomResultUtils";
import {
  getClassroomSyncRecord,
  retryClassroomSync,
  savePendingClassroomSync,
  syncClassroomResult,
} from "@/services/classroomCloudSync";
import type { ClassroomLocalSyncRecord, ClassroomSyncPayload } from "@/types/classroomResults";
import { RecruiterReport } from "@/types/interviewReport";
import InterviewReview from "./InterviewReview";
import PaperObserverTeacherSummary from "./PaperObserverTeacherSummary";

interface Props {
  onStartNextCandidate?: () => void;
}

export default function FinalRecruiterReport({ onStartNextCandidate }: Props) {
  const {
    attempts,
    candidateName,
    selectedLevel,
    resetInterview,
    selectedCompany,
    selectedJobRole,
    selectedRecruiter,
    candidateQuestion,
    classSessionCode,
  } = useInterviewContext();
  const fallback = useMemo(() => buildRecruiterReport(attempts, candidateName), [attempts, candidateName]);
  const [report, setReport] = useState<RecruiterReport>(fallback);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [syncRecord, setSyncRecord] = useState<ClassroomLocalSyncRecord | null>(null);
  const finalizedRef = useRef(false);
  const levelName = selectedLevel === "basic" ? "Level 1 – Cơ bản" : "Level 2 – Nâng cao";
  const classroomMode = Boolean(classSessionCode);
  const candidateKey = useMemo(() => candidateKeyFromName(candidateName), [candidateName]);

  useEffect(() => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;
    let active = true;

    const interviewContext = {
      companyName: selectedCompany.name,
      companyIndustry: selectedCompany.industry,
      jobTitle: selectedJobRole.title,
      jobDepartment: selectedJobRole.department,
      recruiterName: selectedRecruiter.name,
    };

    const finalize = async () => {
      // Fix 43.3: classroom mode does not make an extra Gemini request here.
      // The three question evaluations already contain the AI evidence needed
      // by the teacher dashboard, so the local deterministic report is enough.
      const result = classroomMode
        ? fallback
        : await requestIntelligentRecruiterReport(
            attempts,
            selectedLevel,
            candidateName,
            interviewContext,
            candidateQuestion,
          );

      if (!active) return;
      setReport(result);
      const localSaved = saveRecruiterReport(
        result,
        attempts,
        selectedLevel,
        candidateName,
        interviewContext,
        candidateQuestion,
      );
      setSaved(Boolean(localSaved));
      setLoading(false);

      if (!classSessionCode) return;

      const payload: ClassroomSyncPayload = {
        sessionCode: classSessionCode,
        candidateKey,
        candidateName,
        companyName: selectedCompany.name,
        jobTitle: selectedJobRole.title,
        recruiterName: selectedRecruiter.name,
        report: result,
        attempts,
      };

      const pending = savePendingClassroomSync(payload);
      if (active) setSyncRecord(pending);
      const synced = await syncClassroomResult(payload);
      if (active) setSyncRecord(synced);
    };

    void finalize();

    return () => {
      active = false;
    };
  }, [
    attempts,
    candidateKey,
    candidateName,
    candidateQuestion,
    classSessionCode,
    classroomMode,
    fallback,
    selectedCompany,
    selectedJobRole,
    selectedLevel,
    selectedRecruiter,
  ]);

  useEffect(() => {
    if (!classSessionCode) return;
    const existing = getClassroomSyncRecord(classSessionCode, candidateKey);
    if (existing) setSyncRecord(existing);
  }, [candidateKey, classSessionCode]);

  const retrySync = async () => {
    if (!classSessionCode) return;
    const current = getClassroomSyncRecord(classSessionCode, candidateKey);
    if (current) setSyncRecord({ ...current, status: "pending", error: undefined });
    try {
      const next = await retryClassroomSync(classSessionCode, candidateKey);
      setSyncRecord(next);
    } catch (error) {
      setSyncRecord((previous) => previous ? {
        ...previous,
        status: "error",
        error: error instanceof Error ? error.message : "Retry failed.",
      } : previous);
    }
  };

  const breakdown = [
    ["Grammar", report.scoreBreakdown.grammar],
    ["Vocabulary", report.scoreBreakdown.vocabulary],
    ["Pronunciation", report.scoreBreakdown.pronunciation],
    ["Fluency", report.scoreBreakdown.fluency],
    ["Relevance", report.scoreBreakdown.relevance],
    ["Spoken confidence", report.scoreBreakdown.confidence],
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
              Interviewed by {selectedRecruiter.name} • {loading ? "Preparing the final report..." : `Based on ${attempts.length} evaluated answers.`}
            </p>
            {saved && <p className="mt-2 text-sm text-emerald-300">✓ Report saved locally on this device.</p>}
            {classroomMode && (
              <div className="mt-3 text-sm">
                {syncRecord?.status === "synced" && <p className="font-semibold text-emerald-300">✓ Synced to teacher · Session {classSessionCode}</p>}
                {(!syncRecord || syncRecord.status === "pending") && <p className="font-semibold text-amber-200">↻ Synchronizing to teacher · Session {classSessionCode}...</p>}
                {syncRecord?.status === "error" && (
                  <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-3 text-amber-100">
                    <p className="font-semibold">Saved locally ✓ · Teacher sync pending</p>
                    <p className="mt-1 text-xs leading-5">{syncRecord.error}</p>
                    <button type="button" onClick={retrySync} className="mt-2 rounded-lg bg-white px-3 py-2 text-xs font-black text-slate-950">
                      Retry Sync
                    </button>
                  </div>
                )}
              </div>
            )}
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
              <div key={String(name)} className="rounded-xl bg-slate-50 p-4">
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

      <div className="flex flex-col gap-3 border-t border-slate-200 p-6 sm:flex-row sm:flex-wrap sm:justify-center">
        {!classroomMode && (
          <PaperObserverTeacherSummary
            attempts={attempts}
            report={report}
            candidateName={candidateName}
          />
        )}
        {classroomMode && onStartNextCandidate && (
          <button
            type="button"
            onClick={onStartNextCandidate}
            disabled={syncRecord?.status === "pending"}
            className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white disabled:cursor-wait disabled:bg-slate-400"
          >
            Start Next Candidate →
          </button>
        )}
        {!classroomMode && <button onClick={resetInterview} className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white">Repeat This Level</button>}
        <Link href="/history" className="rounded-xl border border-blue-300 px-6 py-3 text-center font-bold text-blue-700">View Practice History</Link>
        <Link href="/" className="rounded-xl border border-slate-300 px-6 py-3 text-center font-bold text-slate-700">Return Home</Link>
      </div>
    </section>
  );
}
