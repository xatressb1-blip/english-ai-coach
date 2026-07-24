"use client";

import { InterviewHistory } from "@/types/history";

interface Props {
  histories: InterviewHistory[];
}

export default function DashboardSummary({
  histories,
}: Props) {

  const totalInterviews = histories.length;

  const averageScore =
    totalInterviews === 0
      ? 0
      : Math.round(
          histories.reduce(
            (sum, item) =>
              sum + (item.evaluation?.overall ?? 0),
            0
          ) / totalInterviews
        );

  const highestScore =
    totalInterviews === 0
      ? 0
      : Math.max(
          ...histories.map(
            item => item.evaluation?.overall ?? 0
          )
        );

  return (

    <div className="grid gap-6 md:grid-cols-3">

      <SummaryCard
        title="📚 Total Interviews"
        value={totalInterviews}
      />

      <SummaryCard
        title="⭐ Average Score"
        value={averageScore}
      />

      <SummaryCard
        title="🏆 Highest Score"
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

    <div className="rounded-2xl border bg-white p-8 text-center shadow-sm transition hover:shadow-md">

      <h3 className="text-lg font-semibold text-gray-600">

        {title}

      </h3>

      <p className="mt-4 text-5xl font-bold text-blue-600">

        {value}

      </p>

    </div>

  );

}