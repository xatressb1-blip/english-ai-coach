"use client";

/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * Speech Recorder
 *
 * File:
 * components/SpeechRecorder.tsx
 *
 * Version:
 * 3.0 Stable
 *
 * Description
 * ------------------------------------------------------------
 * UI Layer of Speech Module.
 *
 * Responsibilities
 * ------------------------------------------------------------
 * • Display transcript
 * • Display recording status
 * • Receive user interaction
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * This component NEVER talks directly to Browser APIs.
 *
 * Browser API
 *      ↓
 * SpeechRecognitionService
 *      ↓
 * SpeechRecognitionManager
 *      ↓
 * SpeechController
 *      ↓
 * SpeechContext
 *      ↓
 * SpeechRecorder (UI)
 * ============================================================
 */

import {
  useEffect,
  useRef,
} from "react";

import {
  useSpeechContext,
} from "@/context/SpeechContext";

import {
  createSpeechRecognition,
  destroySpeechRecognition,
  type BrowserSpeechRecognition,
} from "@/services/speechRecognitionService";

import {
  registerRecognition,
  unregisterRecognition,
} from "@/services/speechRecognitionManager";

import {
  startRecording,
  stopRecording,
} from "@/services/speechController";

/* ============================================================
 * Component
 * ============================================================
 */

export default function SpeechRecorder() {

  /* ==========================================================
   * Speech Context
   * ==========================================================
   */

  const {

    transcript,

    setTranscript,

    status,

    setStatus,

    resetSpeech,

  } = useSpeechContext();

  /* ==========================================================
   * Recognition Reference
   * ==========================================================
   */

  const recognitionRef =
    useRef<BrowserSpeechRecognition | null>(
      null
    );
      /* ==========================================================
   * Initialize Speech Recognition
   * ==========================================================
   */

  useEffect(() => {

    const recognition =
      createSpeechRecognition({

        /* ----------------------------------------------
         * Recognition Started
         * ---------------------------------------------- */

        onStart: () => {

          console.log(
            "[SpeechRecorder] Recognition Started"
          );

          setStatus("recording");

        },

        /* ----------------------------------------------
         * Recognition Result
         * ---------------------------------------------- */

        onResult: (
          text: string
        ) => {

          setTranscript(text);

        },

        /* ----------------------------------------------
         * Recognition Error
         * ---------------------------------------------- */

        onError: (
          message: string
        ) => {

          console.error(
            "[SpeechRecorder]",
            message
          );

          setStatus("finished");

        },

        /* ----------------------------------------------
         * Recognition End
         * ---------------------------------------------- */

        onEnd: () => {

          console.log(
            "[SpeechRecorder] Recognition Ended"
          );

          setStatus("finished");

        },

      });

    recognitionRef.current =
      recognition;

    registerRecognition(
      recognition
    );

    return () => {

      unregisterRecognition();

      destroySpeechRecognition(
        recognition
      );

      recognitionRef.current =
        null;

    };

  }, [

    setTranscript,

    setStatus,

  ]);
    /* ==========================================================
   * Event Handlers
   * ==========================================================
   */

  /**
   * Start Recording
   */
  const handleStartRecording = (): void => {

    console.log(
      "[SpeechRecorder] Start Button Clicked"
    );

    if (status === "recording") {

      return;

    }

    resetSpeech();

    const started =
      startRecording();

    if (!started) {

      console.warn(
        "[SpeechRecorder] Unable to start recording."
      );

    }

  };

  /**
   * Stop Recording
   */
  const handleStopRecording = (): void => {

    console.log(
      "[SpeechRecorder] Stop Button Clicked"
    );

    if (status !== "recording") {

      return;

    }

    const stopped =
      stopRecording();

    if (stopped) {

      setStatus("processing");

    }

  };

  /**
   * Clear Transcript
   */
  const handleClearTranscript = (): void => {

    if (status === "recording") {

      return;

    }

    resetSpeech();

  };

  /* ==========================================================
   * Status Text
   * ==========================================================
   */

  const statusText: Record<

    "ready" |
    "recording" |
    "processing" |
    "finished",

    string

  > = {

    ready:
      "🎤 Ready to practice",

    recording:
      "🔴 Recording...",

    processing:
      "🤖 AI is evaluating...",

    finished:
      "✅ Recording completed",

  };
    /* ==========================================================
   * UI
   * ==========================================================
   */

  return (

    <div className="mt-10 rounded-xl border bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">

        🎤 Speaking Practice

      </h2>

      <div className="flex gap-4">

        {

          status === "recording"

            ? (

              <button

                onClick={handleStopRecording}

                className="rounded-lg bg-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-800"

              >

                ⏹ Stop Recording

              </button>

            )

            : (

              <button

                onClick={handleStartRecording}

                className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"

              >

                🎤 Start Recording

              </button>

            )

        }

        <button

          onClick={handleClearTranscript}

          disabled={status === "recording"}

          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"

        >

          🗑 Clear

        </button>

      </div>

      <div className="mt-6">

        <p className="font-semibold text-blue-600">

          {statusText[status]}

        </p>

      </div>

      <div className="mt-6">

        <h3 className="mb-3 text-lg font-semibold">

          Your Answer

        </h3>

        <div className="min-h-[180px] rounded-lg border bg-gray-50 p-4 leading-7">

          {

            transcript.trim().length > 0

              ? (

                <p className="whitespace-pre-wrap">

                  {transcript}

                </p>

              )

              : (

                <p className="text-gray-400">

                  Start speaking...

                </p>

              )

          }

        </div>

      </div>

    </div>

  );

}