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
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useSpeechContext,
} from "@/context/SpeechContext";

import {
  createSpeechRecognition,
  destroySpeechRecognition,
  isSpeechRecognitionSupported,
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

  const [speechSupported, setSpeechSupported] = useState<boolean | null>(null);
  const [speechError, setSpeechError] = useState("");
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [forceTextInput, setForceTextInput] = useState(false);

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

  const shouldKeepRecordingRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transcriptRef = useRef("");

  const appendTranscript = useCallback((nextText: string): void => {
    const cleanText = nextText.trim().replace(/\s+/g, " ");

    if (!cleanText) {
      return;
    }

    const capitalizeFirstLetter = (value: string): string => {
      return value.charAt(0).toUpperCase() + value.slice(1);
    };

    const ensureSentenceEnding = (value: string): string => {
      return /[.!?]$/.test(value) ? value : `${value}.`;
    };

    const currentText = transcriptRef.current.trim().replace(/\s+/g, " ");
    const preparedNextText = capitalizeFirstLetter(cleanText);

    if (!currentText) {
      transcriptRef.current = preparedNextText;
      setTranscript(preparedNextText);
      return;
    }

    const currentLower = currentText.toLowerCase();
    const nextLower = preparedNextText.toLowerCase();

    if (currentLower.includes(nextLower)) {
      return;
    }

    if (nextLower.includes(currentLower)) {
      transcriptRef.current = preparedNextText;
      setTranscript(preparedNextText);
      return;
    }

    const currentWords = currentText.split(" ");
    const nextWords = preparedNextText.split(" ");
    const maxOverlap = Math.min(currentWords.length, nextWords.length);
    let overlap = 0;

    for (let size = maxOverlap; size > 0; size -= 1) {
      const currentTail = currentWords
        .slice(currentWords.length - size)
        .join(" ")
        .replace(/[.!?,]$/g, "")
        .toLowerCase();
      const nextHead = nextWords
        .slice(0, size)
        .join(" ")
        .replace(/[.!?,]$/g, "")
        .toLowerCase();

      if (currentTail === nextHead) {
        overlap = size;
        break;
      }
    }

    const wordsToAppend = nextWords.slice(overlap);

    if (wordsToAppend.length === 0) {
      return;
    }

    const appendedText = wordsToAppend.join(" ");

    // A new browser result after a pause is treated as a new sentence.
    // When the browser repeats overlapping words, continue the same sentence.
    const combinedText = overlap > 0
      ? `${currentText} ${appendedText}`
      : `${ensureSentenceEnding(currentText)} ${capitalizeFirstLetter(appendedText)}`;

    transcriptRef.current = combinedText;
    setTranscript(combinedText);
  }, [setTranscript]);
      /* ==========================================================
   * Initialize Speech Recognition
   * ==========================================================
   */

  useEffect(() => {

    const userAgent = window.navigator.userAgent;
    const iosDevice = /iPad|iPhone|iPod/.test(userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);

    setIsIOSDevice(iosDevice);

    if (!isSpeechRecognitionSupported()) {
      queueMicrotask(() => {
        setSpeechSupported(false);
        setSpeechError(
          "Voice recognition is not supported by this browser. Please type your answer below."
        );
      });
      return;
    }

    queueMicrotask(() => setSpeechSupported(true));

    let recognition: BrowserSpeechRecognition | null = null;

    try {
      recognition = createSpeechRecognition({
        onStart: () => {
          setSpeechError("");
          setStatus("recording");
        },
        onResult: (text: string) => {
          appendTranscript(text);
        },
        onError: (message: string) => {
          console.error("[SpeechRecorder]", message);

          const isRecoverableSilence =
            message === "No speech detected." ||
            message === "Speech recognition aborted.";

          if (shouldKeepRecordingRef.current && isRecoverableSilence) {
            return;
          }

          shouldKeepRecordingRef.current = false;

          const serviceBlocked =
            message === "Speech service is not allowed." ||
            message === "Microphone permission denied.";

          if (serviceBlocked) {
            setForceTextInput(true);
            setSpeechSupported(false);
            setStatus("ready");
            setSpeechError(
              isIOSDevice
                ? "iPhone Safari could not start Apple speech recognition. Turn off Request Desktop Website for this site, keep Microphone set to Allow, reload the page, and try again. You can type the answer below while voice recognition is unavailable."
                : message
            );
            return;
          }

          setSpeechError(message);
          setStatus("finished");
        },
        onEnd: () => {
          if (!shouldKeepRecordingRef.current) {
            setStatus("finished");
            return;
          }

          if (restartTimerRef.current) {
            clearTimeout(restartTimerRef.current);
          }

          restartTimerRef.current = setTimeout(() => {
            if (!shouldKeepRecordingRef.current || !recognitionRef.current) {
              return;
            }

            try {
              recognitionRef.current.start();
            } catch (error) {
              console.warn(
                "[SpeechRecorder] Recognition restart delayed.",
                error
              );
            }
          }, 80);
        },
      });

      recognitionRef.current = recognition;
      registerRecognition(recognition);
    } catch (error) {
      console.error("[SpeechRecorder] Initialization failed", error);
      queueMicrotask(() => {
        setSpeechSupported(false);
        setSpeechError(
          "Voice recognition could not be started. Please type your answer below."
        );
      });
    }

    return () => {
      shouldKeepRecordingRef.current = false;

      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
        restartTimerRef.current = null;
      }

      unregisterRecognition();
      destroySpeechRecognition(recognition);
      recognitionRef.current = null;
    };
  }, [appendTranscript, isIOSDevice, setStatus]);
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

    if (status === "recording" || speechSupported !== true) {

      return;

    }

    setSpeechError("");
    transcriptRef.current = "";
    resetSpeech();
    shouldKeepRecordingRef.current = true;

    const started =
      startRecording();

    if (!started) {

      shouldKeepRecordingRef.current = false;

      console.warn(
        "[SpeechRecorder] Unable to start recording."
      );
      setSpeechError(
        "The microphone could not start. Check microphone permission, then try again."
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

    shouldKeepRecordingRef.current = false;

    const currentText = transcriptRef.current.trim();

    if (currentText && !/[.!?]$/.test(currentText)) {
      const punctuatedText = `${currentText}.`;
      transcriptRef.current = punctuatedText;
      setTranscript(punctuatedText);
    }

    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
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

    transcriptRef.current = "";
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

      {isIOSDevice && (
        <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          <p className="font-semibold">iPhone / iPad voice setup</p>
          <p className="mt-1">
            Use Safari, turn off “Request Desktop Website” for this site, set Microphone to Allow, then reload the page. Speak English after the red recording indicator appears.
          </p>
        </div>
      )}

      {speechError && (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
          {speechError}
        </div>
      )}

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
                disabled={speechSupported !== true}

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

disabled:cursor-not-allowed
disabled:opacity-50
"

              >

                {speechSupported === false ? "⌨️ Type Answer" : "🎤 Start Speaking"}

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


        {(speechSupported === false || forceTextInput) && (
          <textarea
            value={transcript}
            onChange={(event) => setTranscript(event.target.value)}
            placeholder="Type your answer here..."
            aria-label="Type your interview answer"
            className="mt-4 min-h-40 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-base leading-7 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        )}
      </div>

    </div>

  );

}