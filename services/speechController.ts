/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * Speech Controller
 *
 * File:
 * services/speechController.ts
 *
 * Version:
 * 3.0 Stable
 *
 * Status:
 * READY FOR FREEZE
 *
 * Description
 * ------------------------------------------------------------
 * Business Logic Layer.
 *
 * This service NEVER owns UI state.
 *
 * UI state belongs ONLY to:
 *
 * SpeechContext
 *
 * ============================================================
 */

import {

  getRecognition,

  pauseRecognition,

  resumeRecognition,

} from "./speechRecognitionManager";

import type {

  BrowserSpeechRecognition,

} from "./speechRecognitionService";

/* ============================================================
 * Internal State
 * ============================================================
 */

let coachSpeaking = false;

/* ============================================================
 * Helpers
 * ============================================================
 */

function getInstance():

  BrowserSpeechRecognition | null {

  return getRecognition();

}

function safeStart(

  recognition: BrowserSpeechRecognition

): boolean {

  try {

    recognition.start();

    return true;

  } catch {

    return false;

  }

}

function safeStop(

  recognition: BrowserSpeechRecognition

): boolean {

  try {

    recognition.stop();

    return true;

  } catch {

    return false;

  }

}
/* ============================================================
 * Recording Control
 * ============================================================
 */

export function startRecording(): boolean {

  if (coachSpeaking) {

    console.warn(
      "[SpeechController] AI Coach is speaking."
    );

    return false;

  }

  const recognition =
    getInstance();

  if (!recognition) {

    console.warn(
      "[SpeechController] No SpeechRecognition instance."
    );

    return false;

  }

  return safeStart(
    recognition
  );

}

export function stopRecording(): boolean {

  const recognition =
    getInstance();

  if (!recognition) {

    return false;

  }

  return safeStop(
    recognition
  );

}

export function toggleRecording(

  recording: boolean

): boolean {

  if (recording) {

    return stopRecording();

  }

  return startRecording();

}
/* ============================================================
 * Coach Control
 * ============================================================
 */

export function pauseForCoach(): void {

  if (coachSpeaking) {

    return;

  }

  coachSpeaking = true;

  pauseRecognition();

}

export function resumeAfterCoach(): void {

  if (!coachSpeaking) {

    return;

  }

  coachSpeaking = false;

  resumeRecognition();

}

/* ============================================================
 * Query State
 * ============================================================
 */

export function isCoachSpeaking(): boolean {

  return coachSpeaking;

}

/* ============================================================
 * Reset
 * ============================================================
 */

export function resetControllerState(): void {

  coachSpeaking = false;

}