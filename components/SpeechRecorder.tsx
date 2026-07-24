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
console.log("===== SPEECH RECORDER RENDER =====");
  const {
    transcript,
    setTranscript,

    status,
    setStatus,

  } = useSpeechContext();

  const recognitionRef = useRef<any>(null);

  //--------------------------------------------------
  // Initialize Speech Recognition
  //--------------------------------------------------

  useEffect(() => {

    recognitionRef.current =
      createSpeechRecognition({

        //----------------------------------
        // Recognition Started
        //----------------------------------

        onStart: () => {

          console.log("Recognition Started");

          setStatus("recording");

        },

        //----------------------------------
        // Recognition Result
        //----------------------------------

        onResult: (text: string) => {

          console.log("Speech Result:", text);

          setTranscript(text);

        },

        //----------------------------------
        // Recognition Error
        //----------------------------------

        onError: (error: string) => {

          console.log("Speech Error:", error);

          console.error(error);

          setStatus("finished");

        },

        //----------------------------------
        // Recognition End
        //----------------------------------

        onEnd: () => {

          console.log("Recognition Ended");

          setStatus("finished");

        },

      });

    //--------------------------------------------------
    // VERY IMPORTANT
    //--------------------------------------------------

    registerRecognition(
      recognitionRef.current
    );

    return () => {

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

    console.log("========== START RECORDING ==========");

    console.log(
      "SpeechRecognition available:",
      "SpeechRecognition" in window,
      "webkitSpeechRecognition" in window
    );

    console.log(
      "Recognition Object:",
      recognitionRef.current
    );

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

  //--------------------------------------------------
  // UI
  //--------------------------------------------------

  return (

    <div className="mt-10 rounded-xl border bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">

        🎤 Speaking Practice

      </h2>

      <div className="flex gap-4">

        {

          status !== "recording"

            ? (

              <button
                onClick={handleStartRecording}
                className="rounded-lg bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
              >

                🎤 Start Recording

              </button>

            )

            : (

              <button
                onClick={handleStopRecording}
                className="rounded-lg bg-gray-700 px-6 py-3 font-medium text-white hover:bg-gray-800"
              >

                ⏹ Stop Recording

              </button>

            )

        }

        <button
          onClick={() => {

            const u =
              new SpeechSynthesisUtterance(
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
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
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

            transcript

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