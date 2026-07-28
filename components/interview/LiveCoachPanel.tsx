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
      className={`
        rounded-2xl

        border

        p-5
        sm:p-6

        shadow-md

        transition-all
        duration-500

        ${style.card}
      `}
    >

      <div
        className="
          flex

          items-start

          gap-4
        "
      >

        {/* Avatar */}

        <div
          className="
            flex

            h-14
            w-14

            items-center
            justify-center

            rounded-full

            bg-white

            text-3xl

            shadow-sm

            shrink-0
          "
        >
          {style.icon}
        </div>

        {/* Content */}

        <div className="flex-1">

          <div
            className="
              flex

              flex-wrap

              items-center

              gap-3
            "
          >

            <h3
              className={`
                text-lg
                sm:text-xl

                font-bold

                ${style.title}
              `}
            >
              Live AI Coach
            </h3>

            <span
              className={`
                rounded-full

                px-3
                py-1

                text-xs

                font-semibold

                uppercase

                tracking-wide

                ${style.badge}
              `}
            >
              {coach.level}
            </span>

          </div>

          <p
            className="
              mt-4

              text-base
              sm:text-lg

              leading-8

              text-slate-700
            "
          >
            {coach.message}
          </p>

        </div>

      </div>

    </section>

  );

}