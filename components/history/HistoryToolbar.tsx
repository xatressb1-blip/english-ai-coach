"use client";

import { useHistoryContext } from "@/context/HistoryContext";

export default function HistoryToolbar() {

  const {

    histories,

    clearHistories,

  } = useHistoryContext();

  return (

    <div className="flex flex-col gap-4 rounded-2xl border bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">

      <div>

        <h2 className="text-xl font-bold">

          Interview Records

        </h2>

        <p className="mt-1 text-sm text-gray-500">

          Total Interviews: {histories.length}

        </p>

      </div>

      <button

        onClick={clearHistories}

        disabled={histories.length === 0}

        className="
          rounded-xl
          bg-red-600
          px-6
          py-3
          font-semibold
          text-white
          transition
          hover:bg-red-700
          disabled:cursor-not-allowed
          disabled:bg-gray-400
        "

      >

        🗑 Clear History

      </button>

    </div>

  );

}