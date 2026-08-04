"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  clearSavedRecruiterReports,
  deleteSavedRecruiterReport,
  getSavedRecruiterReports,
} from "@/services/interviewReportService";
import {
  SavedRecruiterReport,
  TrainingLevel,
} from "@/types/interviewReport";
import InterviewReview from "@/components/interview/InterviewReview";

type LevelFilter = "all" | TrainingLevel;

function levelLabel(level: TrainingLevel) {
  return level === "basic" ? "Level 1 – Cơ bản" : "Level 2 – Nâng cao";
}

function readinessClass(readiness: SavedRecruiterReport["readiness"]) {
  switch (readiness) {
    case "Strong Candidate":
      return "bg-emerald-100 text-emerald-800";
    case "Interview Ready":
      return "bg-blue-100 text-blue-800";
    case "Nearly Ready":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-rose-100 text-rose-800";
  }
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

export default function RecruiterReportHistory() {
  const [reports, setReports] = useState<SavedRecruiterReport[]>([]);
  const [candidateFilter, setCandidateFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState<LevelFilter>("all");

  useEffect(() => {
    setReports(getSavedRecruiterReports());
  }, []);

  const candidateNames = useMemo(
    () => Array.from(new Set(reports.map((report) => report.candidateName).filter(Boolean))).sort(),
    [reports]
  );

  const filteredReports = useMemo(
    () => reports.filter((report) => {
      const candidateMatches = candidateFilter === "all" || report.candidateName === candidateFilter;
      const levelMatches = levelFilter === "all" || report.level === levelFilter;
      return candidateMatches && levelMatches;
    }),
    [candidateFilter, levelFilter, reports]
  );

  const summary = useMemo(() => {
    const scores = filteredReports.map((report) => report.overallScore);
    const basicScores = filteredReports
      .filter((report) => report.level === "basic")
      .map((report) => report.overallScore);
    const advancedScores = filteredReports
      .filter((report) => report.level === "advanced")
      .map((report) => report.overallScore);

    return {
      total: filteredReports.length,
      average: average(scores),
      best: scores.length ? Math.max(...scores) : 0,
      basicAverage: average(basicScores),
      advancedAverage: average(advancedScores),
    };
  }, [filteredReports]);

  const handleDelete = (id: string) => {
    deleteSavedRecruiterReport(id);
    setReports((current) => current.filter((report) => report.id !== id));
  };

  const handleClear = () => {
    if (!window.confirm("Xóa toàn bộ báo cáo phỏng vấn đã lưu trên thiết bị này?")) return;
    clearSavedRecruiterReports();
    setReports([]);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-xl sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
            Progress Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Lịch sử phỏng vấn & tiến bộ</h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
            Theo dõi kết quả theo tên ứng viên và từng level, xem câu trả lời mạnh nhất,
            câu cần luyện lại và mức độ sẵn sàng trước phỏng vấn doanh nghiệp.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <SummaryCard label="Số buổi" value={summary.total.toString()} />
          <SummaryCard label="Điểm trung bình" value={summary.average.toFixed(1)} />
          <SummaryCard label="Điểm cao nhất" value={summary.best.toFixed(1)} />
          <SummaryCard label="Level 1" value={summary.basicAverage.toFixed(1)} />
          <SummaryCard label="Level 2" value={summary.advancedAverage.toFixed(1)} />
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <label className="text-sm font-semibold text-slate-700">
              Ứng viên
              <select
                value={candidateFilter}
                onChange={(event) => setCandidateFilter(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả ứng viên</option>
                {candidateNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>

            <label className="text-sm font-semibold text-slate-700">
              Level
              <select
                value={levelFilter}
                onChange={(event) => setLevelFilter(event.target.value as LevelFilter)}
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500"
              >
                <option value="all">Tất cả level</option>
                <option value="basic">Level 1 – Cơ bản</option>
                <option value="advanced">Level 2 – Nâng cao</option>
              </select>
            </label>

            <button
              type="button"
              onClick={handleClear}
              disabled={!reports.length}
              className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Xóa toàn bộ lịch sử
            </button>
          </div>
        </section>

        {!filteredReports.length ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">📂</div>
            <h2 className="mt-5 text-2xl font-bold text-slate-800">Chưa có báo cáo phù hợp</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Hoàn thành một level trong Mock Interview để hệ thống lưu báo cáo theo tên ứng viên.
            </p>
            <Link
              href="/interview"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Bắt đầu phỏng vấn
            </Link>
          </section>
        ) : (
          <section className="space-y-5">
            {filteredReports.map((report) => (
              <article key={report.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold text-slate-900">{report.candidateName}</h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {levelLabel(report.level)}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${readinessClass(report.readiness)}`}>
                        {report.readiness}
                      </span>
                    </div>
                    {report.jobTitle && (
                      <p className="mt-2 text-sm font-semibold text-blue-700">{report.jobTitle}{report.companyName ? ` • ${report.companyName}` : ""}</p>
                    )}
                    <p className="mt-2 text-sm text-slate-500">{formatDate(report.createdAt)}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-blue-600 px-5 py-3 text-center text-white">
                      <p className="text-xs uppercase tracking-wide text-blue-100">Overall</p>
                      <p className="text-3xl font-bold">{report.overallScore.toFixed(1)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(report.id)}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <h3 className="font-bold text-slate-800">Nhận xét của nhà tuyển dụng</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{report.recruiterImpression}</p>
                </div>

                {report.candidateQuestion && (
                  <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                    <h3 className="font-bold text-cyan-900">Câu hỏi dành cho nhà tuyển dụng</h3>
                    {report.candidateQuestion.skipped ? (
                      <p className="mt-2 text-sm leading-7 text-slate-600">Ứng viên không đặt câu hỏi. {report.candidateQuestion.feedback}</p>
                    ) : (
                      <>
                        <p className="mt-2 rounded-xl bg-white p-3 text-sm font-semibold leading-7 text-slate-800">“{report.candidateQuestion.transcript}”</p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-full bg-white px-3 py-1 text-cyan-800">Mức độ phù hợp: {report.candidateQuestion.professionalRelevance}</span>
                          <span className="rounded-full bg-white px-3 py-1 text-cyan-800">Mức độ quan tâm: {report.candidateQuestion.companyInterest}</span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{report.candidateQuestion.feedback}</p>
                      </>
                    )}
                  </div>
                )}

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <ResultPanel
                    title="Câu trả lời tốt nhất"
                    tone="good"
                    attempt={report.bestAttempt}
                  />
                  <ResultPanel
                    title="Câu cần luyện lại"
                    tone="review"
                    attempt={report.weakestAttempt}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  {Object.entries(report.scoreBreakdown).map(([name, score]) => (
                    <div key={name} className="rounded-xl border border-slate-200 p-3 text-center">
                      <p className="truncate text-xs capitalize text-slate-500">{name}</p>
                      <p className="mt-1 text-xl font-bold text-blue-700">{score.toFixed(1)}</p>
                    </div>
                  ))}
                </div>

                <InterviewReview
                  attempts={report.attempts ?? []}
                  compact
                  title="Xem lại từng câu trả lời"
                  description="Mở từng câu để xem transcript, câu hỏi phụ, tiêu chí nội dung và câu trả lời gợi ý."
                />

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    {report.attempts.length} câu đã hoàn thành trong buổi phỏng vấn này.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    {report.weakestAttempt && (
                      <Link
                        href={`/question/${report.weakestAttempt.questionId}`}
                        className="rounded-xl bg-amber-500 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-600"
                      >
                        Luyện lại câu yếu nhất
                      </Link>
                    )}
                    <Link
                      href="/interview"
                      className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      Phỏng vấn lại
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-blue-700 sm:text-3xl">{value}</p>
    </div>
  );
}

function ResultPanel({
  title,
  tone,
  attempt,
}: {
  title: string;
  tone: "good" | "review";
  attempt: SavedRecruiterReport["bestAttempt"];
}) {
  const className = tone === "good"
    ? "border-emerald-200 bg-emerald-50"
    : "border-amber-200 bg-amber-50";

  return (
    <div className={`rounded-2xl border p-4 ${className}`}>
      <h3 className="font-bold text-slate-800">{title}</h3>
      {attempt ? (
        <>
          <p className="mt-2 text-sm font-semibold text-slate-800">{attempt.questionTitle}</p>
          <p className="mt-1 text-sm text-slate-600">Điểm: {attempt.evaluation.overall.toFixed(1)}/10</p>
        </>
      ) : (
        <p className="mt-2 text-sm text-slate-500">Chưa có dữ liệu.</p>
      )}
    </div>
  );
}
