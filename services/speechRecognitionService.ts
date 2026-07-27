/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * Speech Recognition Service
 *
 * File:
 * services/speechRecognitionService.ts
 *
 * Version:
 * 3.0 Stable
 *
 * Status:
 * READY FOR TEST
 *
 * Compatibility:
 * ✓ SpeechController v3
 * ✓ SpeechRecorder v3
 * ✓ SpeechContext v3
 * ✓ AIInterviewer v3
 *
 * Change Log
 * ------------------------------------------------------------
 * ✓ Refactored browser interfaces
 * ✓ Fixed transcript overwrite foundation
 * ✓ Prepared continuous recognition pipeline
 * ✓ Ready for Speech Core Freeze
 * ============================================================
 */

export interface SpeechRecognitionCallbacks {
  onStart?: () => void;
  onResult?: (transcript: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}

/* ============================================================
 * Browser Types
 * ============================================================
 */

export interface BrowserSpeechRecognitionAlternative {
  transcript: string;
}

export interface BrowserSpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: BrowserSpeechRecognitionAlternative;
}

export interface BrowserSpeechRecognitionResultList {
  length: number;
  [index: number]: BrowserSpeechRecognitionResult;
}

export interface BrowserSpeechRecognitionResultEvent {
  resultIndex: number;
  results: BrowserSpeechRecognitionResultList;
}

export interface BrowserSpeechRecognitionErrorEvent {
  error: string;
}
export interface BrowserSpeechRecognition {

  lang: string;

  continuous: boolean;

  interimResults: boolean;

  maxAlternatives: number;

  onstart: (() => void) | null;

  onresult:
    | ((event: BrowserSpeechRecognitionResultEvent) => void)
    | null;

  onerror:
    | ((event: BrowserSpeechRecognitionErrorEvent) => void)
    | null;

  onend: (() => void) | null;

  start(): void;

  stop(): void;

  abort(): void;

}

export interface BrowserSpeechRecognitionConstructor {

  new (): BrowserSpeechRecognition;

}

/* ============================================================
 * Window Declaration
 * ============================================================
 */

declare global {

  interface Window {

    SpeechRecognition?: BrowserSpeechRecognitionConstructor;

    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;

  }

}

/* ============================================================
 * Browser Support
 * ============================================================
 */

export function isSpeechRecognitionSupported(): boolean {

  if (typeof window === "undefined") {

    return false;

  }

  return Boolean(

    window.SpeechRecognition ||

    window.webkitSpeechRecognition

  );

}

/* ============================================================
 * Constructor
 * ============================================================
 */

function getSpeechRecognitionConstructor():

  BrowserSpeechRecognitionConstructor | null {

  if (typeof window === "undefined") {

    return null;

  }

  return (

    window.SpeechRecognition ??

    window.webkitSpeechRecognition ??

    null

  );

}
/* ============================================================
 * Create SpeechRecognition
 * ============================================================
 */

export function createSpeechRecognition(

  callbacks: SpeechRecognitionCallbacks

): BrowserSpeechRecognition {

  const Constructor =

    getSpeechRecognitionConstructor();

  if (!Constructor) {

    throw new Error(

      "Speech Recognition is not supported by this browser."

    );

  }

  const recognition =

    new Constructor();

  /* ==========================================================
   * Default Configuration
   * ==========================================================
   */

  recognition.lang = "en-US";

  recognition.continuous = true;

  recognition.interimResults = true;

  recognition.maxAlternatives = 1;

  /* ==========================================================
   * Transcript Buffer
   * ==========================================================
   */

  let finalTranscript = "";

  /* ==========================================================
   * Recognition Started
   * ==========================================================
   */

  recognition.onstart = () => {

    finalTranscript = "";

    callbacks.onStart?.();

  };

  /* ==========================================================
   * Recognition Result
   * ==========================================================
   *
   * Part 2 starts here.
   */
    recognition.onresult = (

    event: BrowserSpeechRecognitionResultEvent

  ) => {

    let interimTranscript = "";

    for (

      let i = event.resultIndex;

      i < event.results.length;

      i++

    ) {

      const result = event.results[i];

      const piece = result[0].transcript;

      if (result.isFinal) {

        finalTranscript += piece + " ";

      } else {

        interimTranscript += piece;

      }

    }

    const transcript = (

      finalTranscript +

      interimTranscript

    ).trim();

    callbacks.onResult?.(

      transcript

    );

  };

  /* ==========================================================
   * Recognition Error
   * ==========================================================
   */
    recognition.onerror = (

    event: BrowserSpeechRecognitionErrorEvent

  ) => {

    let message = "Unknown error.";

    switch (event.error) {

      case "no-speech":

        message = "No speech detected.";

        break;

      case "audio-capture":

        message = "No microphone was found.";

        break;

      case "not-allowed":

        message = "Microphone permission denied.";

        break;

      case "network":

        message = "Network error occurred.";

        break;

      case "aborted":

        message = "Speech recognition aborted.";

        break;

      default:

        message = event.error;

    }

    callbacks.onError?.(

      message

    );

  };

  /* ==========================================================
   * Recognition End
   * ==========================================================
   */

  recognition.onend = () => {

    callbacks.onEnd?.();

  };

  /* ==========================================================
   * Return Recognition Instance
   * ==========================================================
   */

  return recognition;

}
/* ============================================================
 * Destroy Recognition
 * ============================================================
 */

export function destroySpeechRecognition(

  recognition:

    | BrowserSpeechRecognition

    | null

    | undefined

): void {

  if (!recognition) {

    return;

  }

  /* ==========================================================
   * Remove Event Handlers
   * ==========================================================
   */

  recognition.onstart = null;

  recognition.onresult = null;

  recognition.onerror = null;

  recognition.onend = null;

  /* ==========================================================
   * Abort Recognition
   * ==========================================================
   */

  try {

    recognition.abort();

  } catch {

    // Ignore browser exception

  }

  /* ==========================================================
   * Stop Recognition
   * ==========================================================
   */

  try {

    recognition.stop();

  } catch {

    // Ignore browser exception

  }

}