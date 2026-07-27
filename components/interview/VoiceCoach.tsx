"use client";

import { useEffect, useRef } from "react";

import { useSpeechActivity } from "@/context/SpeechActivityContext";

import { SpeechActivity } from "@/services/speechActivityService";

import {
  coachContinueSpeaking,
} from "@/services/voiceCoachService";

export default function VoiceCoach() {

  const { activity } =
    useSpeechActivity();

  //--------------------------------------------------------
  // Remember previous activity
  //--------------------------------------------------------

  const previousActivity =
    useRef<SpeechActivity>(
      SpeechActivity.IDLE
    );

  //--------------------------------------------------------
  // Prevent speaking multiple times
  //--------------------------------------------------------

  const coachSpeaking =
    useRef(false);

  //--------------------------------------------------------
  // Voice Coach
  //--------------------------------------------------------

  useEffect(() => {

    //------------------------------------------------------
    // Ignore if activity has not changed
    //------------------------------------------------------

    if (
      previousActivity.current ===
      activity.activity
    ) {
      return;
    }

    console.log(
      "Speech Activity:",
      previousActivity.current,
      "→",
      activity.activity
    );

    //------------------------------------------------------
    // Update previous activity
    //------------------------------------------------------

    previousActivity.current =
      activity.activity;

    //------------------------------------------------------
    // User paused
    //------------------------------------------------------

    if (
      activity.activity ===
      SpeechActivity.PAUSED
    ) {

      if (coachSpeaking.current) {
        return;
      }

      coachSpeaking.current = true;

      console.log(
        "Coach started"
      );

    coachContinueSpeaking(() => {

  coachSpeaking.current = false;

  console.log("Coach finished");

});
      return;

    }

    //------------------------------------------------------
    // Reset when user speaks again
    //------------------------------------------------------

    if (
      activity.activity ===
      SpeechActivity.SPEAKING
    ) {

      coachSpeaking.current = false;

    }

  }, [activity.activity]);

  return null;

}