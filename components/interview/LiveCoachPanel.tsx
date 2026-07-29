"use client";

import { useLiveCoach } from "@/context/LiveCoachContext";

export default function LiveCoachPanel() {
  const { coach } = useLiveCoach();

  const style = {
    success: {
      card: "border-green-200 bg-green-50",
      badge: "bg-green-100 text-green-700",
      title: "text-green-700",
      icon: "😊",
    },
    warning: {
      card: "border-yellow-200 bg-yellow-50",
      badge: "bg-yellow-100 text-yellow-700",
      title: "text-yellow-700",
      icon: "💡",
    },
    error: {
      card: "border-red-200 bg-red-50",
      badge: "bg-red-100 text-red-700",
      title: "text-red-700",
      icon: "⚠️",
    },
  }[coach.level];

  return (
    <section
      className={`rounded-2xl border p-4 shadow-sm transition-all duration-500 sm:p-5 ${style.card}`}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-2xl shadow-sm sm:h-12 sm:w-12">
          {style.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h3 className={`text-base font-bold sm:text-lg ${style.title}`}>
              Live AI Coach
            </h3>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide sm:text-xs ${style.badge}`}
            >
              {coach.level}
            </span>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-700 sm:text-base sm:leading-7">
            {coach.message}
          </p>
        </div>
      </div>
    </section>
  );
}
