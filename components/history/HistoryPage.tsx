"use client";

import { useHistoryContext } from "@/context/HistoryContext";

import HistoryToolbar from "./HistoryToolbar";
import HistorySummary from "./HistorySummary";
import HistoryList from "./HistoryList";

export default function HistoryPage() {

  const {

    histories,

  } = useHistoryContext();

  return (

    <div className="mx-auto max-w-6xl space-y-8 rounded-2xl bg-white p-10 shadow-xl">

      {/* Header */}

      <div>

        <h1 className="text-4xl font-bold">

          📚 Interview History

        </h1>

        <p className="mt-3 text-gray-500">

          Review your previous interview sessions and monitor your progress.

        </p>

      </div>

      <HistoryToolbar />

      <HistorySummary
        histories={histories}
      />

      <HistoryList
        histories={histories}
      />

    </div>

  );

}