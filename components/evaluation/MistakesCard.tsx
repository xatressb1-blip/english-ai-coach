"use client";

import { EvaluationResult } from "@/types/evaluation";

interface Props {
  result: EvaluationResult;
}

export default function MistakesCard({
  result,
}: Props) {

  const grammarScore =
    result.grammar.score;

  const mistakes =
    result.grammar.mistakes;

  // ==========================
  // CASE 1
  // Excellent
  // ==========================

  if (
    grammarScore >= 8 &&
    mistakes.length === 0
  ) {

    return (

      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">

        <h3 className="flex items-center gap-2 text-lg font-bold text-green-700">

          ✅ Excellent

        </h3>

        <p className="mt-3 leading-7 text-gray-700">

          Great job!

          AI did not detect any significant grammar mistakes.

          Your sentence structure is natural and appropriate for an interview.

        </p>

      </div>

    );

  }

  // ==========================
  // CASE 2
  // Weak but AI cannot pinpoint
  // ==========================

  if (
    grammarScore < 8 &&
    mistakes.length === 0
  ) {

    return (

      <div className="mt-8 rounded-xl border border-yellow-300 bg-yellow-50 p-6 shadow-sm">

        <h3 className="flex items-center gap-2 text-lg font-bold text-yellow-700">

          ⚠ Needs Improvement

        </h3>

        <p className="mt-3 leading-7 text-gray-700">

          AI detected weaknesses in your answer,

          but could not identify specific grammar mistakes.

        </p>

        <p className="mt-3 leading-7 text-gray-700">

          Improve your sentence structure,

          vocabulary,

          fluency

          and confidence.

        </p>

      </div>

    );

  }

  // ==========================
  // CASE 3
  // Mistakes detected
  // ==========================

  return (

    <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">

      <h3 className="flex items-center gap-2 text-lg font-bold text-red-700">

        ❌ Grammar Issues

      </h3>

      <p className="mt-2 text-sm text-gray-600">

        AI detected the following grammar problems.

      </p>

      <div className="mt-5 space-y-4">

        {mistakes.map(

          (item, index) => (

            <div
              key={index}
              className="rounded-lg border bg-white p-4 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">

                  Issue {index + 1}

                </span>

                <span>

                  ❗

                </span>

              </div>

              <p className="mt-3 leading-7 text-gray-700">

                {item}

              </p>

            </div>

          )

        )}

      </div>

    </div>

  );

}