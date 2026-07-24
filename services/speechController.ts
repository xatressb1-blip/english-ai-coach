// ======================================================
// Speech Controller
// English AI Coach
// ======================================================

import {
  getRecognition,
  pauseRecognition,
  resumeRecognition,
} from "./speechRecognitionManager";

let pausedByAI = false;

/**
 * AI tạm dừng microphone
 */
export function pauseForCoach() {

  if (pausedByAI) {
    return;
  }

  pausedByAI = true;

  pauseRecognition();

}

/**
 * AI mở lại microphone
 */
export function resumeAfterCoach() {

  if (!pausedByAI) {
    return;
  }

  pausedByAI = false;

  resumeRecognition();

}

/**
 * AI đang giữ microphone?
 */
export function isPausedByCoach() {

  return pausedByAI;

}
//------------------------------------------------------
// Manual Recording Control
//------------------------------------------------------

export function startRecording() {

  const recognition =
    getRecognition();

  if (!recognition) {
    return;
  }

  try {

    recognition.start();

  } catch {

    // ignore

  }

}

export function stopRecording() {

  const recognition =
    getRecognition();

  if (!recognition) {
    return;
  }

  try {

    recognition.stop();

  } catch {

    // ignore

  }

}