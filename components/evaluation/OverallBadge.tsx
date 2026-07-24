"use client";

import { EvaluationResult } from "@/types/evaluation";

interface Props {
  result: EvaluationResult;
}

function getPerformanceLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 8) return "Very Good";
  if (score >= 7) return "Good";
  if (score >= 6) return "Fair";

  return "Needs Improvement";
}

function getPerformanceColor(score: number): string {
  if (score >= 9) return "bg-green-600";
  if (score >= 8) return "bg-blue-600";
  if (score >= 7) return "bg-yellow-500";
  if (score >= 6) return "bg-orange-500";

  return "bg-red-600";
}

export default function OverallBadge({
  result,
}: Props) {

  const overall = result.overall;

  return (

    <div
      className={`rounded-2xl p-8 text-center text-white ${getPerformanceColor(
        overall
      )}`}
    >

      <p className="text-lg">

        Overall Score

      </p>

      <h2 className="mt-3 text-6xl font-bold">

        {overall.toFixed(1)}

      </h2>

      <p className="mt-4 text-xl">

        {getPerformanceLabel(overall)}

      </p>

    </div>

  );

}