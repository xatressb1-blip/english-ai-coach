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
      className={`
        rounded-xl
        lg:rounded-2xl

        border

        p-4
        sm:p-5

        shadow-sm

        transition-all

        ${color}
      `}
    >

      <div
        className="
          flex
          items-start
          gap-3
        "
      >

        <div
          className="
            text-2xl
            sm:text-3xl

            shrink-0
          "
        >
          🎙
        </div>

        <div className="flex-1">

          <h3
            className="
              text-lg
              sm:text-xl

              font-bold
            "
          >
            Live AI Coach
          </h3>

          <p
            className="
              mt-1

              text-sm
              sm:text-base

              leading-7
            "
          >
            {coach.message}
          </p>

        </div>

      </div>

    </div>

  );

}