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

        🎯 Answer Focus Analysis

      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">

          <span>Sentence Count</span>

          <strong>

            {analysis.sentenceCount}

          </strong>

        </div>

        <div>

          {

            analysis.isTooShort

            ? "❌ Too Short"

            : "✅ Good Length"

          }

        </div>

        <div>

          {

            analysis.isTooLong

            ? "❌ Too Long"

            : "✅ Not Too Long"

          }

        </div>

        <div>

          {

            analysis.isFocused

            ? "✅ Focused Answer"

            : "❌ Not Focused"

          }

        </div>

      </div>

      <div className="mt-8 rounded-xl bg-blue-50 p-5">

        <h3 className="font-bold">

          🤖 AI Coach

        </h3>

        <p className="mt-3 text-gray-700">

          {analysis.feedback}

        </p>

      </div>

    </div>

  );

}