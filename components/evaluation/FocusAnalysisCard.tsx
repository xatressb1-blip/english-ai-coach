"use client";

import { FocusAnalysis } from "@/types/evaluation";

interface Props {
  analysis: FocusAnalysis;
}

export default function FocusAnalysisCard({
  analysis,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">
        🎯 Focus Analysis
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-4">

        <div className="rounded-xl bg-blue-50 p-4">
          <p className="text-sm text-gray-500">
            Overall
          </p>

          <p className="text-3xl font-bold text-blue-600">
            {analysis.overallScore}%
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-4">
          <p className="text-sm text-gray-500">
            Coverage
          </p>

          <p className="text-3xl font-bold text-green-600">
            {analysis.coverageScore}%
          </p>
        </div>

        <div className="rounded-xl bg-yellow-50 p-4">
          <p className="text-sm text-gray-500">
            Structure
          </p>

          <p className="text-3xl font-bold text-yellow-600">
            {analysis.structureScore}%
          </p>
        </div>

        <div className="rounded-xl bg-purple-50 p-4">
          <p className="text-sm text-gray-500">
            Length
          </p>

          <p className="text-3xl font-bold text-purple-600">
            {analysis.lengthScore}%
          </p>
        </div>

      </div>

      <div className="mt-8">

        <h3 className="font-semibold">
          📊 Statistics
        </h3>

        <div className="mt-4 space-y-2">

          <div className="flex justify-between">

            <span>Estimated Words</span>

            <strong>
              {analysis.estimatedWords}
            </strong>

          </div>

          <div className="flex justify-between">

            <span>Estimated Sentences</span>

            <strong>
              {analysis.estimatedSentences}
            </strong>

          </div>

          <div className="flex justify-between">

            <span>Detected Ideas</span>

            <strong>
              {analysis.totalIdeas}
            </strong>

          </div>

        </div>

      </div>

      <div className="mt-8">

        <h3 className="font-semibold">
          ✅ Covered Topics
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">

          {analysis.coveredTopics.map(topic => (

            <span
              key={topic}
              className="rounded-full bg-green-100 px-3 py-1 text-sm"
            >
              ✓ {topic}
            </span>

          ))}

        </div>

      </div>

      <div className="mt-8">

        <h3 className="font-semibold">
          ⚠️ Missing Topics
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">

          {analysis.missingTopics.map(topic => (

            <span
              key={topic}
              className="rounded-full bg-red-100 px-3 py-1 text-sm"
            >
              {topic}
            </span>

          ))}

        </div>

      </div>

      <div className="mt-8 rounded-xl bg-blue-50 p-5">

        <h3 className="font-bold">
          🤖 AI Coach
        </h3>

        <p className="mt-3 text-gray-700 leading-7">
          {analysis.feedback}
        </p>

      </div>

    </div>
  );
}