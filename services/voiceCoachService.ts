// =====================================================
// Voice Coach Service
// English AI Coach
// =====================================================
import {
  pauseForCoach,
  resumeAfterCoach,
} from "./speechController";
let lastMessage = "";

let lastSpeakTime = 0;

export function speakCoachMessage(
  message: string
) {

  console.log("VoiceCoach:", message);

  if (typeof window === "undefined") {
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }

  if (message === lastMessage) {
    return;
  }

  const now = Date.now();

  if (now - lastSpeakTime < 5000) {
    return;
  }

  lastSpeakTime = now;

  lastMessage = message;

  //------------------------------------------------
  // AI giữ microphone
  //------------------------------------------------

 pauseForCoach();

window.speechSynthesis.cancel();

setTimeout(() => {

  const utterance =
    new SpeechSynthesisUtterance(message);

  utterance.lang = "en-US";

  utterance.rate = 0.95;

  utterance.pitch = 1;

  utterance.volume = 1;

  utterance.onstart = () => {

    console.log("Coach started");

  };

  utterance.onend = () => {

    console.log("Coach finished");

    setTimeout(() => {

      resumeAfterCoach();

    }, 300);

  };

  utterance.onerror = () => {

    resumeAfterCoach();

  };

  window.speechSynthesis.speak(
    utterance
  );

}, 400);
}