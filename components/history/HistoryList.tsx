"use client";

import { InterviewHistory } from "@/types/history";

import HistoryCard from "./HistoryCard";

interface Props {
  histories: InterviewHistory[];
}

export default function HistoryList({
  histories,
}: Props) {

  if (histories.length === 0) {

    return (

      <div className="rounded-2xl border border-dashed bg-gray-50 p-16 text-center">

        <div className="text-6xl">
          📂
        </div>

        <h2 className="mt-6 text-2xl font-bold text-gray-700">
          No Interview History
        </h2>

        <p className="mt-3 text-gray-500">
          Complete your first AI interview to start building your history.
        </p>

      </div>

    );

  }

  return (

    <div className="space-y-6">

      {histories.map((history) => (

        <HistoryCard
          key={history.id}
          history={history}
        />

      ))}

    </div>

  );

}