"use client";

import { useState } from "react";

export default function AudioRecorder() {
  const [recording, setRecording] = useState(false);

  const startRecording = () => {
    setRecording(true);
    alert("Recording started...");
  };

  const stopRecording = () => {
    setRecording(false);
    alert("Recording stopped.");
  };

  return (
    <div className="mt-10 rounded-xl border bg-white p-6 shadow">
      <h2 className="text-2xl font-bold mb-5">
        🎙 Audio Recorder
      </h2>

      {!recording ? (
        <button
          onClick={startRecording}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
        >
          🎤 Start Recording
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
        >
          ⏹ Stop Recording
        </button>
      )}

      <p className="mt-5 text-gray-600">
        {recording
          ? "🔴 Recording..."
          : "Ready to record"}
      </p>
    </div>
  );
}