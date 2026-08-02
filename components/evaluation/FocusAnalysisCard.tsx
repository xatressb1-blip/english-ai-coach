"use client";

import { FocusAnalysis, IdeaAssessment } from "@/types/evaluation";

interface Props {
  analysis: FocusAnalysis;
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-xl p-3.5 sm:p-4 ${tone}`}>
      <p className="text-xs font-medium text-slate-600 sm:text-sm">{label}</p>
      <p className="mt-1 text-2xl font-bold sm:text-3xl">{value}%</p>
    </div>
  );
}

function statusStyle(status: IdeaAssessment["status"]) {
  if (status === "covered") {
    return {
      icon: "✓",
      label: "Covered",
      box: "border-emerald-200 bg-emerald-50",
      badge: "bg-emerald-100 text-emerald-800",
      iconTone: "bg-emerald-600 text-white",
    };
  }

  if (status === "partial") {
    return {
      icon: "◐",
      label: "Partly covered",
      box: "border-amber-200 bg-amber-50",
      badge: "bg-amber-100 text-amber-800",
      iconTone: "bg-amber-500 text-white",
    };
  }

  return {
    icon: "+",
    label: "Add this idea",
    box: "border-rose-200 bg-rose-50",
    badge: "bg-rose-100 text-rose-800",
    iconTone: "bg-rose-500 text-white",
  };
}

function IdeaRow({ item }: { item: IdeaAssessment }) {
  const style = statusStyle(item.status);

  return (
    <div className={`rounded-xl border p-4 ${style.box}`}>
      <div className="flex items-start gap-3">
        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${style.iconTone}`}>
          {style.icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="font-semibold text-slate-900">{item.label}</h4>
            <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
              {style.label}
            </span>
          </div>

          {item.evidence && (
            <p className="mt-2 text-sm leading-6 text-slate-700">
              <span className="font-semibold">Evidence:</span> “{item.evidence}”
            </p>
          )}

          {item.status !== "covered" && item.coachingTip && (
            <p className="mt-2 text-sm leading-6 text-slate-700">
              <span className="font-semibold">How to improve:</span> {item.coachingTip}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FocusAnalysisCard({ analysis }: Props) {
  const coveredCount = analysis.ideaAssessments.filter((item) => item.status === "covered").length;
  const partialCount = analysis.ideaAssessments.filter((item) => item.status === "partial").length;

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
      <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">🎯 Answer Content</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        Your answer is checked against the content criteria for this exact interview question. Different wording and personal examples are accepted.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Metric label="Content focus" value={analysis.overallScore} tone="bg-blue-50 text-blue-700" />
        <Metric label="Criteria coverage" value={analysis.coverageScore} tone="bg-emerald-50 text-emerald-700" />
        <Metric label="Evidence quality" value={analysis.evidenceQualityScore} tone="bg-cyan-50 text-cyan-700" />
        <Metric label="Structure" value={analysis.structureScore} tone="bg-amber-50 text-amber-700" />
        <Metric label="Answer length" value={analysis.lengthScore} tone="bg-violet-50 text-violet-700" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-center sm:grid-cols-4 sm:p-4">
        <div>
          <p className="text-xl font-bold text-slate-900">{analysis.estimatedWords}</p>
          <p className="mt-1 text-xs text-slate-500">Words</p>
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900">{analysis.estimatedSentences}</p>
          <p className="mt-1 text-xs text-slate-500">Estimated sentences</p>
        </div>
        <div>
          <p className="text-xl font-bold text-emerald-700">{coveredCount}/{analysis.totalIdeas}</p>
          <p className="mt-1 text-xs text-slate-500">Fully covered</p>
        </div>
        <div>
          <p className="text-xl font-bold text-amber-700">{partialCount}</p>
          <p className="mt-1 text-xs text-slate-500">Partly covered</p>
        </div>
      </div>

      {analysis.ideaAssessments.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">Question-specific criteria</h3>
              <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                A single matching word is not enough; the idea must be communicated clearly.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {analysis.ideaAssessments.map((item) => (
              <IdeaRow key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-blue-50 p-4 sm:p-5">
        <h3 className="font-bold text-blue-950">🤖 Content coaching</h3>
        <p className="mt-2 text-sm leading-7 text-blue-900 sm:text-base">{analysis.feedback}</p>
      </div>
    </div>
  );
}
