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

    <div
  className="
    mt-6
    sm:mt-8
    lg:mt-10

    rounded-xl
    lg:rounded-2xl

    border

    bg-white

    p-4
    sm:p-6
    lg:p-8

    shadow-md
    lg:shadow-lg
  "
>

      <h2
  className="
    mb-5

    text-xl
    sm:text-2xl
    lg:text-3xl

    font-bold
  "
>

        🎤 Speaking Practice

      </h2>

      <div
  className="
    flex
    flex-col

    gap-3

    sm:flex-row
    sm:gap-4
  "
>

        {

          status === "recording"

            ? (

              <button

                onClick={handleStopRecording}

              className="
w-full
sm:w-auto

rounded-2xl

bg-gradient-to-r
from-gray-700
to-gray-800

px-8
py-5

text-lg
font-bold

text-white

shadow-lg

transition-all
duration-200

hover:scale-105

active:scale-95
"

              >

                ⏹ Stop Recording

              </button>

            )

            : (

              <button

                onClick={handleStartRecording}

                className="
w-full
sm:w-auto

rounded-2xl

bg-gradient-to-r
from-red-500
to-red-600

px-8
py-5

text-lg
font-bold

text-white

shadow-lg

transition-all
duration-200

hover:scale-105
hover:shadow-xl

active:scale-95
"

              >

                🎤 Start Speaking

              </button>

            )

        }

        <button

          onClick={handleClearTranscript}

          disabled={status === "recording"}

          className="
w-full
sm:w-auto

rounded-2xl

bg-gradient-to-r
from-blue-500
to-blue-600

px-8
py-5

text-lg
font-semibold

text-white

shadow-lg

transition-all
duration-200

hover:scale-105

active:scale-95

disabled:opacity-40
disabled:cursor-not-allowed
"

        >

          🗑 Clear

        </button>

      </div>

      <div className="mt-6">

  <div className="flex items-center gap-3">

    <div
      className={`
        h-3
        w-3
        rounded-full
        transition-all

        ${
          status === "recording"
            ? "bg-red-500 animate-pulse"
            : status === "processing"
            ? "bg-yellow-500 animate-pulse"
            : status === "finished"
            ? "bg-green-500"
            : "bg-blue-500"
        }
      `}
    />

    <p
      className="
        text-sm
        sm:text-base

        font-semibold

        text-blue-700
      "
    >
      {statusText[status]}
    </p>

  </div>

  {
    status === "recording" && (

      <div className="mt-4 flex gap-2">

        <span className="h-2 w-2 rounded-full bg-red-500 animate-bounce" />

        <span
          className="h-2 w-2 rounded-full bg-red-500 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        />

        <span
          className="h-2 w-2 rounded-full bg-red-500 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        />

      </div>

    )
  }

  {
    status === "processing" && (

      <div
        className="
          mt-4

          h-2
          w-full

          overflow-hidden

          rounded-full

          bg-gray-200
        "
      >

        <div
          className="
            h-full
            w-1/2

            animate-pulse

            rounded-full

            bg-blue-600
          "
        />

      </div>

    )
  }

</div>

      <div
  className="
    mt-6
    sm:mt-8
  "
>

        <h3
  className="
    mb-3

    text-base
    sm:text-lg

    font-semibold

    text-slate-800
  "
>

          Your Answer

        </h3>

        <div
  className="
    min-h-[150px]
sm:min-h-[200px]
lg:min-h-[220px]

    rounded-xl

    border

    bg-slate-50

    p-4
    sm:p-5
    lg:p-6

    leading-7

    overflow-y-auto

    break-words

    transition
  "
>

          {

            transcript.trim().length > 0

              ? (

                <p
  className="
    whitespace-pre-wrap

    text-[15px]
    sm:text-base

    leading-7

    text-slate-800
  "
>

                  {transcript}

                </p>

              )

              : (

                <p
  className="
    text-sm
    sm:text-base

    italic

    text-gray-400
  "
>

                  Your answer will appear here...

                </p>

              )

          }

        </div>

      </div>

    </div>

  );

}