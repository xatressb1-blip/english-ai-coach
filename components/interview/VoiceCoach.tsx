"use client";

import { useEffect } from "react";

import { useSpeechActivity } from "@/context/SpeechActivityContext";

import { SpeechActivity } from "@/services/speechActivityService";

import { speakCoachMessage } from "@/services/voiceCoachService";

export default function VoiceCoach() {

  const { activity } =
    useSpeechActivity();

  useEffect(() => {

    switch (activity.activity) {

      case SpeechActivity.PAUSED:

        speakCoachMessage(
          "Please continue speaking."
        );

        break;

      case SpeechActivity.SPEAKING:

        // Chưa đọc gì
        break;

      case SpeechActivity.IDLE:

        // Chưa đọc gì
        break;

      case SpeechActivity.FINISHED:

        // Chưa dùng
        break;

    }

  }, [activity]);

  return null;

}