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
 * 3.1 Stable
 *
 * Status:
 * READY FOR PUBLIC BETA
 *
 * Compatibility:
 * ✓ SpeechController v3
 * ✓ SpeechRecorder v3
 * ✓ SpeechContext v3
 * ✓ AIInterviewer v3
 * ✓ LiveCoach
 * ✓ VoiceCoach
 *
 * ============================================================
 * Change Log
 * ------------------------------------------------------------
 * v3.1
 *
 * ✓ Fixed duplicate transcript on Android Chrome
 * ✓ Optimized Samsung devices
 * ✓ Disabled continuous recognition
 * ✓ Disabled interim transcript
 * ✓ Cleaner recognition lifecycle
 * ✓ Prepared for iPhone fallback
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
 * Create Speech Recognition
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

  /**
   * IMPORTANT
   *
   * Interview application
   * does NOT require continuous dictation.
   *
   * This avoids duplicated transcript
   * on Samsung Chrome.
   */

  recognition.continuous = false;

  /**
   * Only final transcript.
   */

  recognition.interimResults = false;

  recognition.maxAlternatives = 1;

  /* ==========================================================
   * Recognition Started
   * ==========================================================
   */

  recognition.onstart = () => {

    callbacks.onStart?.();

  };
    /* ==========================================================
   * Recognition Result
   * ==========================================================
   *
   * v3.1
   * ----------------------------------------------------------
   * Android Chrome frequently returns duplicated transcripts
   * when continuous/interim recognition is enabled.
   *
   * Since this application is an Interview Coach,
   * we only need ONE final transcript.
   * ==========================================================
   */

  recognition.onresult = (

    event: BrowserSpeechRecognitionResultEvent

  ) => {

    if (!event.results.length) {

      return;

    }

    const result =

      event.results[0];

    if (!result.length) {

      return;

    }

    const transcript =

      result[0].transcript.trim();

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

    let message =

      "Unknown speech recognition error.";

    switch (event.error) {

      case "no-speech":

        message =

          "No speech detected.";

        break;

      case "audio-capture":

        message =

          "No microphone was found.";

        break;

      case "not-allowed":

        message =

          "Microphone permission denied.";

        break;

      case "network":

        message =

          "Network error occurred.";

        break;

      case "aborted":

        message =

          "Speech recognition aborted.";

        break;

      case "service-not-allowed":

        message =

          "Speech service is not allowed.";

        break;

      default:

        message =

          event.error;

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
   * Return Recognition
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

  recognition.onstart = null;

  recognition.onresult = null;

  recognition.onerror = null;

  recognition.onend = null;

  try {

    recognition.abort();

  } catch {

    // ignore browser exception

  }

  try {

    recognition.stop();

  } catch {

    // ignore browser exception

  }

}