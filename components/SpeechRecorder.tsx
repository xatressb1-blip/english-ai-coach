"use client";

import { useEffect, useRef } from "react";

import { useSpeechContext } from "@/context/SpeechContext";

import {
  createSpeechRecognition,
} from "@/services/speechRecognitionService";
import {
  registerRecognition,
} from "@/services/speechRecognitionManager";
import {
  startRecording,
  stopRecording,
} from "@/services/speechController";
export default function SpeechRecorder() {

  const {
    transcript,
    setTranscript,

    status,
    setStatus,

  } = useSpeechContext();

  const recognitionRef =
    useRef<any>(null);

  //--------------------------------------------------
  // Initialize Speech Recognition
  //--------------------------------------------------

  useEffect(() => {

    recognitionRef.current =
      createSpeechRecognition({

        onStart: () => {

          setStatus("recording");

        },

        onResult: (
          text: string
        ) => {

          // Service luôn trả về transcript đầy đủ.
          // Không nối chuỗi ở đây.
          setTranscript(text);

        },

        onError: (
          error: string
        ) => {

          console.error(
            "Speech Recognition:",
            error
          );

          setStatus("finished");

        },

        onEnd: () => {

          setStatus("finished");

        },

      });

    return () => {
registerRecognition(
  recognitionRef.current
);
      recognitionRef.current?.stop();

    };

  }, [
    setTranscript,
    setStatus,
  ]);

  //--------------------------------------------------
  // Start Recording
  //--------------------------------------------------

  const handleStartRecording = () => {

    setTranscript("");

  setStatus("recording");

  startRecording();
  };

  //--------------------------------------------------
  // Stop Recording
  //--------------------------------------------------

  const handleStopRecording = () => {

   stopRecording();

  setStatus("processing");
  };

  //--------------------------------------------------
  // Clear Transcript
  //--------------------------------------------------

  const clearTranscript = () => {

    setTranscript("");

    setStatus("ready");

  };
    //--------------------------------------------------
  // Status Text
  //--------------------------------------------------

  const statusText: Record<
  "ready" |
  "recording" |
  "processing" |
  "finished",
  string
> = {
    ready: "🎤 Ready to practice",
    recording: "🔴 Recording...",
    processing: "🤖 AI is evaluating...",
    finished: "✅ Recording completed",
  };

  return (
    <div className="mt-10 rounded-xl border bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        🎤 Speaking Practice
      </h2>

      <div className="flex gap-4">

        {status !== "recording" ? (

          <button
            onClick={handleStartRecording}
            className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700"
          >
            🎤 Start Recording
          </button>

        ) : (

          <button
            onClick={handleStopRecording}
            className="rounded-lg bg-gray-700 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
          >
            ⏹ Stop Recording
          </button>

        )}
<button
  onClick={() => {
    const u = new SpeechSynthesisUtterance(
      "Hello. This is a voice test."
    );

    u.lang = "en-US";

    window.speechSynthesis.speak(u);
  }}
  className="rounded-lg bg-green-600 px-6 py-3 text-white"
>
  🔊 Test Voice
</button>
        <button
          onClick={clearTranscript}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
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

          {transcript ? (

            <p className="whitespace-pre-wrap">
              {transcript}
            </p>

          ) : (

            <p className="text-gray-400">
              Start speaking...
            </p>

          )}

        </div>

      </div>

    </div>

  );

}