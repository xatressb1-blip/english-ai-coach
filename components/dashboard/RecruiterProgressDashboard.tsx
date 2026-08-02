"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { getSavedRecruiterReports } from "@/services/interviewReportService";
import { SavedRecruiterReport } from "@/types/interviewReport";

const skillLabels = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  pronunciation: "Pronunciation",
  fluency: "Fluency",
  relevance: "Relevance",
  confidence: "Confidence",
} as const;

type SkillKey = keyof typeof skillLabels;

function average(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
}

function readinessLabel(score: number) {
  if (score >= 8.5) return "Strong Candidate";
  if (score >= 7) return "Interview Ready";
  if (score >= 5) return "Nearly Ready";
  return "Developing";
}

function readinessTone(score: number) {
  if (score >= 8.5) return "bg-emerald-100 text-emerald-800";
  if (score >= 7) return "bg-blue-100 text-blue-800";
  if (score >= 5) return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-800";
}

export default function RecruiterProgressDashboard() {
  const [reports, setReports] = useState<SavedRecruiterReport[]>([]);
  const [candidate, setCandidate] = useState("all");

  useEffect(() => {
    setReports(getSavedRecruiterReports());
  }, []);

  const candidates = useMemo(
    () => Array.from(new Set(reports.map((report) => report.candidateName).filter(Boolean))).sort(),
    [reports]
  );

  const filtered = useMemo(
    () => reports
      .filter((report) => candidate === "all" || report.candidateName === candidate)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [candidate, reports]
  );

  const latest = filtered.at(-1) ?? null;

  const summary = useMemo(() => {
    const overallScores = filtered.map((report) => report.overallScore);
    const basicScores = filtered.filter((report) => report.level === "basic").map((report) => report.overallScore);
    const advancedScores = filtered.filter((report) => report.level === "advanced").map((report) => report.overallScore);
    const recent = overallScores.at(-1) ?? 0;
    const previous = overallScores.at(-2) ?? recent;

    return {
      total: filtered.length,
      average: average(overallScores),
      latest: recent,
      change: Number((recent - previous).toFixed(1)),
      basic: average(basicScores),
      advanced: average(advancedScores),
    };
  }, [filtered]);

  const skills = useMemo(() => {
    const entries = (Object.keys(skillLabels) as SkillKey[]).map((key) => ({
      key,
      label: skillLabels[key],
      score: average(filtered.map((report) => report.scoreBreakdown[key])),
    }));

    return entries.sort((a, b) => b.score - a.score);
  }, [filtered]);

  const strongest = skills[0] ?? null;
  const weakest = skills.at(-1) ?? null;

  const nextQuestion = latest?.weakestAttempt ?? null;
  const maxChartScore = 10;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
                Recruiter Progress Dashboard
              </p>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Theo dõi mức độ sẵn sàng phỏng vấn</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">
                Dashboard sử dụng các báo cáo Mock Interview đã lưu để theo dõi xu hướng điểm,
                kỹ năng mạnh và nội dung cần luyện tiếp theo.
              </p>
            </div>

            <label className="text-sm font-semibold text-slate-200">
              Ứng viên
              <select
                value={candidate}
                onChange={(event) => setCandidate(event.target.value)}
                className="mt-2 w-full min-w-56 rounded-xl border border-white/20 bg-white px-4 py-3 font-normal text-slate-900 outline-none"
              >
                <option value="all">Tất cả ứng viên</option>
                {candidates.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </label>
          </div>
        </header>

        {!filtered.length ? (
          <section className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">📈</div>
            <h2 className="mt-5 text-2xl font-bold text-slate-800">Chưa có dữ liệu tiến bộ</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
              Hoàn thành một Level trong Mock Interview để tạo báo cáo và bắt đầu theo dõi tiến bộ.
            </p>
            <Link href="/interview" className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700">
              Bắt đầu phỏng vấn
            </Link>
          </section>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <MetricCard label="Số buổi" value={summary.total.toString()} />
              <MetricCard label="Điểm trung bình" value={summary.average.toFixed(1)} />
              <MetricCard label="Điểm gần nhất" value={summary.latest.toFixed(1)} />
              <MetricCard
                label="Thay đổi"
                value={`${summary.change > 0 ? "+" : ""}${summary.change.toFixed(1)}`}
                helper={summary.change > 0 ? "Đang tiến bộ" : summary.change < 0 ? "Cần luyện thêm" : "Ổn định"}
              />
              <MetricCard label="Level 1" value={summary.basic.toFixed(1)} />
              <MetricCard label="Level 2" value={summary.advanced.toFixed(1)} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Xu hướng điểm phỏng vấn</h2>
                    <p className="mt-1 text-sm text-slate-500">Các buổi được sắp xếp theo thời gian.</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${readinessTone(summary.latest)}`}>
                    {readinessLabel(summary.latest)}
                  </span>
                </div>

                <div className="mt-6 flex min-h-64 items-end gap-3 overflow-x-auto rounded-2xl bg-slate-50 p-4 sm:gap-4">
                  {filtered.map((report, index) => {
                    const height = Math.max(8, (report.overallScore / maxChartScore) * 190);
                    return (
                      <div key={report.id} className="flex min-w-16 flex-1 flex-col items-center justify-end">
                        <span className="mb-2 text-sm font-bold text-slate-700">{report.overallScore.toFixed(1)}</span>
                        <div
                          className="w-full max-w-16 rounded-t-xl bg-gradient-to-t from-blue-700 to-cyan-400 shadow-sm"
                          style={{ height }}
                          title={`Buổi ${index + 1}: ${report.overallScore.toFixed(1)}/10`}
                        />
                        <span className="mt-2 text-xs font-medium text-slate-500">{formatDate(report.createdAt)}</span>
                        <span className="mt-1 text-[10px] uppercase tracking-wide text-slate-400">
                          {report.level === "basic" ? "L1" : "L2"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold text-slate-900">Nhận định hiện tại</h2>
                <div className="mt-5 space-y-4">
                  <InsightCard
                    icon="💪"
                    title="Kỹ năng mạnh nhất"
                    value={strongest ? `${strongest.label}: ${strongest.score.toFixed(1)}/10` : "Chưa có dữ liệu"}
                    tone="good"
                  />
                  <InsightCard
                    icon="🎯"
                    title="Kỹ năng cần ưu tiên"
                    value={weakest ? `${weakest.label}: ${weakest.score.toFixed(1)}/10` : "Chưa có dữ liệu"}
                    tone="review"
                  />
                  <InsightCard
                    icon="🧑‍💼"
                    title="Mức độ sẵn sàng"
                    value={readinessLabel(summary.latest)}
                    tone="neutral"
                  />
                </div>
              </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <h2 className="text-xl font-bold text-slate-900">Phân tích kỹ năng</h2>
                <p className="mt-1 text-sm text-slate-500">Điểm trung bình từ tất cả báo cáo đang được lọc.</p>

                <div className="mt-6 space-y-5">
                  {skills.map((skill) => (
                    <div key={skill.key}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">{skill.label}</span>
                        <span className="font-bold text-slate-900">{skill.score.toFixed(1)}/10</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all"
                          style={{ width: `${Math.max(2, skill.score * 10)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">Recommended Next Step</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">Bài luyện tiếp theo</h2>

                {nextQuestion ? (
                  <>
                    <p className="mt-4 text-sm font-semibold leading-7 text-slate-800">{nextQuestion.questionTitle}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Đây là câu có điểm thấp nhất trong báo cáo gần nhất. Hãy luyện lại, bổ sung một ví dụ cụ thể và trả lời theo cấu trúc rõ ràng.
                    </p>
                    <Link
                      href={`/question/${nextQuestion.questionId}`}
                      className="mt-5 inline-flex w-full justify-center rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      Luyện lại câu này
                    </Link>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-slate-600">Hoàn thành thêm một buổi phỏng vấn để nhận đề xuất cá nhân hóa.</p>
                )}

                <Link
                  href="/history"
                  className="mt-3 inline-flex w-full justify-center rounded-xl border border-blue-300 bg-white px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Xem toàn bộ báo cáo
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {helper ? <p className="mt-1 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

function InsightCard({
  icon,
  title,
  value,
  tone,
}: {
  icon: string;
  title: string;
  value: string;
  tone: "good" | "review" | "neutral";
}) {
  const toneClass = tone === "good"
    ? "border-emerald-200 bg-emerald-50"
    : tone === "review"
      ? "border-amber-200 bg-amber-50"
      : "border-blue-200 bg-blue-50";

  return (
    <div className={`rounded-2xl border p-4 ${toneClass}`}>
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-slate-600">{title}</p>
          <p className="mt-1 font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
