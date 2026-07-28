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

    <div
      className="
        mb-5
        sm:mb-6

        rounded-xl

        border-l-4
        border-blue-500

        bg-blue-50

        p-4
        sm:p-5

        shadow-sm

        transition-all
        duration-500
        ease-in-out
      "
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

            shrink-0
          "
        >
          🤖
        </div>

        <div className="flex-1">

          <h3
            className="
              text-base
              sm:text-lg

              font-semibold

              text-blue-700
            "
          >
            AI Recruiter
          </h3>

          <p
            className="
              mt-1

              text-sm
              sm:text-base

              leading-7

              text-gray-700
            "
          >
            {message}
          </p>

        </div>

      </div>

    </div>

  );

}