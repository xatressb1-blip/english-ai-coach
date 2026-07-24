"use client";

import { useLiveCoach } from "@/context/LiveCoachContext";

export default function LiveCoachPanel() {

  const { coach } = useLiveCoach();

  const color = {

    success:
      "border-green-300 bg-green-50 text-green-700",

    warning:
      "border-yellow-300 bg-yellow-50 text-yellow-700",

    error:
      "border-red-300 bg-red-50 text-red-700",

  }[coach.level];

  return (

    <div
      className={`rounded-2xl border p-5 shadow-sm transition-all ${color}`}
    >

      <div className="flex items-center gap-3">

        <span className="text-3xl">

          🎙

        </span>

        <div>

          <h3 className="text-xl font-bold">

            Live AI Coach

          </h3>

          <p className="mt-1">

            {coach.message}

          </p>

        </div>

      </div>

    </div>

  );

}