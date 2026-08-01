"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  totalQuestions: number;
  onEnter: () => void;
}

type MicState = "idle" | "testing" | "ready" | "error";

export default function VirtualInterviewLobby({ totalQuestions, onEnter }: Props) {
  const [micState, setMicState] = useState<MicState>("idle");
  const [message, setMessage] = useState(
    "Test your microphone before entering the interview room."
  );
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const testMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicState("error");
      setMessage("This browser cannot access the microphone. You can still type your answers.");
      return;
    }

    setMicState("testing");
    setMessage("Requesting microphone permission...");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack || audioTrack.readyState !== "live") {
        throw new Error("No active microphone track");
      }

      setMicState("ready");
      setMessage("Microphone is ready. Speak naturally and clearly during the interview.");

      window.setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }, 1200);
    } catch (error) {
      console.error("[VirtualInterviewLobby] Microphone test failed", error);
      setMicState("error");
      setMessage(
        "Microphone permission was not granted. Check browser settings, or continue and type your answers."
      );
    }
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
      <div className="relative min-h-[360px] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 px-6 py-10 text-white sm:px-10 lg:px-14">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:36px_36px]" />
        <div className="relative grid gap-8 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
              Virtual Recruiter Interview Room
            </span>
            <h1 className="mt-6 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Practice like you are sitting in front of a real recruiter.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
              The AI recruiter will ask {totalQuestions} questions, listen to your answers, and evaluate your interview readiness.
            </p>
          </div>

          <div className="mx-auto w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-blue-300/40 bg-gradient-to-br from-blue-500 to-indigo-700 text-6xl shadow-2xl">
              👩‍💼
            </div>
            <h2 className="mt-5 text-xl font-bold">Ms. Emma</h2>
            <p className="mt-1 text-sm text-blue-100">AI Talent Acquisition Specialist</p>
            <div className="mt-5 rounded-2xl bg-slate-950/30 p-4 text-left text-sm leading-6 text-slate-200">
              “Welcome. Take a breath, sit comfortably, and answer as naturally as you would in a real interview.”
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_1fr] lg:p-10">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-bold text-slate-900">Before you begin</h3>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>✓ Sit upright and look toward the screen.</li>
            <li>✓ Answer in complete sentences using your own experience.</li>
            <li>✓ Pause briefly before speaking; confidence is more important than speed.</li>
            <li>✓ Sample answers are hidden during Mock Interview mode.</li>
          </ul>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🎙️</div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Microphone check</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={testMicrophone}
              disabled={micState === "testing"}
              className="rounded-xl border border-blue-300 bg-white px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-wait disabled:opacity-60"
            >
              {micState === "testing" ? "Testing..." : micState === "ready" ? "✓ Test Again" : "Test Microphone"}
            </button>

            <button
              type="button"
              onClick={onEnter}
              className="rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[.98]"
            >
              Enter Interview Room →
            </button>
          </div>

          {micState === "ready" && (
            <p className="mt-3 text-sm font-semibold text-emerald-700">✓ Microphone permission confirmed.</p>
          )}
          {micState === "error" && (
            <p className="mt-3 text-sm font-semibold text-amber-700">You may continue using typed answers.</p>
          )}
        </div>
      </div>
    </section>
  );
}
