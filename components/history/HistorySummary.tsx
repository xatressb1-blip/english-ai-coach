"use client";

import { InterviewHistory } from "@/types/history";

interface Props {
  histories: InterviewHistory[];
}

export default function HistorySummary({
  histories,
}: Props) {

  const totalInterviews = histories.length;

  const averageScore =
    totalInterviews === 0
      ? 0
      : Math.round(
          histories.reduce(
            (sum, item) =>
              sum + item.evaluation.overall,
            0
          ) / totalInterviews
        );

  const highestScore =
    totalInterviews === 0
      ? 0
      : Math.max(
          ...histories.map(
            item => item.evaluation.overall
          )
        );

  return (

    <div className="grid gap-6 md:grid-cols-3">

      <SummaryCard
        title="Total Interviews"
        value={totalInterviews}
      />

      <SummaryCard
        title="Average Score"
        value={averageScore}
      />

      <SummaryCard
        title="Highest Score"
        value={highestScore}
      />

    </div>

  );

}

interface SummaryCardProps {

  title: string;

  value: number;

}

function SummaryCard({

  title,

  value,

}: SummaryCardProps) {

  return (

    <div className="rounded-2xl border bg-white p-6 text-center shadow-sm">

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <p className="mt-3 text-4xl font-bold text-blue-600">

        {value}

      </p>

    </div>

  );

}