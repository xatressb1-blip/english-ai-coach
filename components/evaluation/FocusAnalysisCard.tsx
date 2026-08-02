"use client";

import { FocusAnalysis } from "@/types/evaluation";

interface Props {
  analysis: FocusAnalysis;
}

function Metric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={`rounded-xl p-4 ${tone}`}>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold sm:text-3xl">{value}%</p>
    </div>
  );
}

export default function FocusAnalysisCard({ analysis }: Props) {
  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">🎯 Answer Focus</h2>
      <p className="mt-1 text-sm leading-6 text-slate-500">
        This section measures content coverage, answer structure, and response length. It is separate from the English score above.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
        <Metric label="Focus" value={analysis.overallScore} tone="bg-blue-50 text-blue-700" />
        <Metric label="Key ideas covered" value={analysis.coverageScore} tone="bg-emerald-50 text-emerald-700" />
        <Metric label="Structure" value={analysis.structureScore} tone="bg-amber-50 text-amber-700" />
        <Metric label="Answer length" value={analysis.lengthScore} tone="bg-violet-50 text-violet-700" />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-4 text-center">
        <div>
          <p className="text-xl font-bold text-slate-900">{analysis.estimatedWords}</p>
          <p className="mt-1 text-xs text-slate-500">Words</p>
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900">{analysis.estimatedSentences}</p>
          <p className="mt-1 text-xs text-slate-500">Sentences</p>
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900">{analysis.totalIdeas}</p>
          <p className="mt-1 text-xs text-slate-500">Key ideas</p>
        </div>
      </div>

      {analysis.coveredTopics.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-slate-800">✅ Covered ideas</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.coveredTopics.map((topic) => (
              <span key={topic} className="rounded-full bg-emerald-100 px-3 py-1 text-sm text-emerald-800">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.missingTopics.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-slate-800">⚠️ Ideas to add</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {analysis.missingTopics.map((topic) => (
              <span key={topic} className="rounded-full bg-red-100 px-3 py-1 text-sm text-red-800">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 rounded-xl bg-blue-50 p-4 sm:p-5">
        <h3 className="font-bold text-blue-950">🤖 Focus coaching</h3>
        <p className="mt-2 text-sm leading-7 text-blue-900 sm:text-base">
          {analysis.feedback}
        </p>
      </div>
    </div>
  );
}
