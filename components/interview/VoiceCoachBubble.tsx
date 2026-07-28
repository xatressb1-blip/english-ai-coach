"use client";

import { useEffect, useState } from "react";
import { useVoiceCoach } from "@/context/VoiceCoachContext";

export default function VoiceCoachBubble() {

  const {

    visible,

    message,

  } = useVoiceCoach();

  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {

    if (!visible) {

      setShowBubble(false);

      return;

    }

    setShowBubble(true);

    const timer = setTimeout(() => {

      setShowBubble(false);

    }, 4000);

    return () => clearTimeout(timer);

  }, [visible]);

  if (!showBubble) {

    return null;

  }

  return (

    <section
      className="
        mb-6

        animate-in
        fade-in
        slide-in-from-top-2

        duration-500
      "
    >

      <div
        className="
          rounded-2xl

          border
          border-blue-200

          bg-gradient-to-r
          from-blue-50
          to-indigo-50

          p-5

          shadow-md
        "
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

              bg-blue-600

              text-3xl

              text-white

              shadow-md

              shrink-0
            "
          >
            🤖
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
                className="
                  text-lg

                  font-bold

                  text-blue-700
                "
              >
                AI Recruiter
              </h3>

              <span
                className="
                  rounded-full

                  bg-blue-100

                  px-3
                  py-1

                  text-xs

                  font-semibold

                  uppercase

                  tracking-wide

                  text-blue-700
                "
              >
                Speaking
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
              {message}
            </p>

          </div>

        </div>

      </div>

    </section>

  );

}