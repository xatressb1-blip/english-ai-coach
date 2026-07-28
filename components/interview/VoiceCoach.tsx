"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useSpeechActivity } from "@/context/SpeechActivityContext";

import { SpeechActivity } from "@/services/speechActivityService";

import {
  coachContinueSpeaking,
  coachEncourage,
  coachContinue,
  coachExample,
  coachWaiting,
  decideRecruiterAction,
  RecruiterDecision,
} from "@/services/voiceCoachService";
import { useVoiceCoach } from "@/context/VoiceCoachContext";
export default function VoiceCoach() {

  const { activity } =
    useSpeechActivity();
const {
  showMessage,
  hideMessage,
} = useVoiceCoach();
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
const pauseSeconds =
  useRef(0);

const pauseTimer =
  useRef<NodeJS.Timeout | null>(null);

const [, forceUpdate] =
  useState(0);
  //--------------------------------------------------------
  // Voice Coach
  //--------------------------------------------------------
function stopPauseTimer() {

  if (pauseTimer.current) {

    clearInterval(
      pauseTimer.current
    );

    pauseTimer.current = null;

  }

  pauseSeconds.current = 0;

}
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
if (!pauseTimer.current) {

  pauseTimer.current = setInterval(() => {

    pauseSeconds.current++;

    forceUpdate(v => v + 1);

    console.log(
      "Pause:",
      pauseSeconds.current,
      "seconds"
    );

  }, 1000);

}
      if (coachSpeaking.current) {
        return;
      }
const decision =
  decideRecruiterAction(
    pauseSeconds.current
  );
let recruiterMessage = "";

switch (decision) {

  case RecruiterDecision.ENCOURAGE:
    recruiterMessage = coachEncourage();
    break;

  case RecruiterDecision.CONTINUE:
    recruiterMessage = coachContinue();
    break;

  case RecruiterDecision.EXAMPLE:
    recruiterMessage = coachExample();
    break;

  case RecruiterDecision.WAITING:
    recruiterMessage = coachWaiting();
    break;

}
if (
  decision ===
  RecruiterDecision.SILENT
) {
  return;
}
      coachSpeaking.current = true;

      console.log(
        "Coach started"
      );
console.log(
  "[Recruiter]",
  recruiterMessage
);
    showMessage(recruiterMessage);

coachContinueSpeaking(() => {

  coachSpeaking.current = false;

  setTimeout(() => {

    hideMessage();

  }, 1500);

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

  stopPauseTimer();

  coachSpeaking.current = false;

}
if (
  activity.activity ===
  SpeechActivity.FINISHED
) {

  stopPauseTimer();

}
return () => {

  stopPauseTimer();

};
  }, [activity.activity]);

  return null;

}