"use client";

import { useEffect, useRef, useState } from "react";
import { recruiters } from "@/data/recruiters";
import { useInterviewContext } from "@/context/InterviewContext";

interface Props {
  candidateName: string;
  totalQuestions: number;
  onEnter: () => void;
}

type MicState = "idle" | "testing" | "ready" | "error";

export default function VirtualInterviewLobby({ candidateName, totalQuestions, onEnter }: Props) {
  const { selectedRecruiter, setSelectedRecruiterId, selectedCompany, selectedJobRole } = useInterviewContext();
  const [micState, setMicState] = useState<MicState>("idle");
  const [message, setMessage] = useState("Test your microphone before entering the interview room.");
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => () => streamRef.current?.getTracks().forEach((track) => track.stop()), []);

  const testMicrophone = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicState("error");
      setMessage("This browser cannot access the microphone. Mock Interview requires microphone access.");
      return;
    }
    setMicState("testing");
    setMessage("Requesting microphone permission...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack || audioTrack.readyState !== "live") throw new Error("No active microphone track");
      setMicState("ready");
      setMessage("Microphone is ready. For best results, use a quiet room and keep the phone 20–30 cm away.");
      window.setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }, 900);
    } catch (error) {
      console.error("[VirtualInterviewLobby] Microphone test failed", error);
      setMicState("error");
      setMessage("Microphone permission was not granted. Allow microphone access in browser settings, then test again.");
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-8 text-white sm:px-8 sm:py-10 lg:px-12">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.1)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">Virtual Recruiter Interview Room</span>
          <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">Choose the recruiter who will guide your interview.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">You are interviewing for <strong>{selectedJobRole.title}</strong> at <strong>{selectedCompany.name}</strong>. Choose the recruiter who will conduct the session.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {recruiters.map((recruiter) => {
              const active = recruiter.id === selectedRecruiter.id;
              return (
                <button key={recruiter.id} type="button" onClick={() => setSelectedRecruiterId(recruiter.id)} aria-pressed={active}
                  className={`min-h-44 rounded-2xl border p-4 text-left transition active:scale-[.98] ${active ? "border-blue-300 bg-white text-slate-900 shadow-xl ring-4 ring-blue-400/20" : "border-white/15 bg-white/10 text-white hover:bg-white/15"}`}>
                  <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${recruiter.gradient} text-3xl shadow-lg`}>{recruiter.emoji}</div>
                  <p className="mt-3 font-bold">{recruiter.name}</p>
                  <p className={`mt-1 text-xs ${active ? "text-blue-700" : "text-blue-100"}`}>{recruiter.title}</p>
                  <p className={`mt-3 text-xs leading-5 ${active ? "text-slate-600" : "text-slate-300"}`}>{recruiter.style}</p>
                  <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${active ? "bg-blue-100 text-blue-700" : "bg-white/10 text-blue-100"}`}>{active ? "✓ Selected" : recruiter.accent}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-4 sm:p-7 lg:grid-cols-[.9fr_1.1fr] lg:p-9">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${selectedRecruiter.gradient} text-3xl`}>{selectedRecruiter.emoji}</div>
            <div><h2 className="font-bold text-slate-900">{selectedRecruiter.name}</h2><p className="text-xs text-slate-500">{selectedRecruiter.accent} • {totalQuestions} questions</p></div>
          </div>
          <div className="mt-4 rounded-xl border border-blue-100 bg-white p-4 text-sm leading-6 text-slate-600"><p className="font-bold text-slate-900">{selectedJobRole.title}</p><p className="text-xs text-blue-700">{selectedCompany.name} • {selectedJobRole.department}</p><p className="mt-3">“Hello {candidateName}. Thank you for applying to {selectedCompany.name}. I will be interviewing you for the {selectedJobRole.title} position. Take a breath and answer naturally.”</p></div>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-600"><li>✓ Use your own experience.</li><li>✓ Pause briefly before speaking.</li><li>✓ Sample answers stay hidden.</li><li>✓ Mock Interview accepts microphone answers only.</li></ul>
        </div>

        <div className={`rounded-2xl border p-5 ${micState === "ready" ? "border-emerald-200 bg-emerald-50" : micState === "error" ? "border-amber-200 bg-amber-50" : "border-blue-200 bg-blue-50"}`}>
          <div className="flex items-start gap-3"><div className="text-3xl">🎙️</div><div><h3 className="text-lg font-bold text-slate-900">Microphone check</h3><p className="mt-1 text-sm leading-6 text-slate-600">{message}</p></div></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={testMicrophone} disabled={micState === "testing"} className="min-h-12 rounded-xl border border-blue-300 bg-white px-4 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-60">{micState === "testing" ? "Testing..." : micState === "ready" ? "✓ Test Again" : "Test Microphone"}</button>
            <button type="button" onClick={onEnter} disabled={micState !== "ready"} className="min-h-12 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">Enter Interview Room →</button>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">On iPhone/Safari, audio is recorded first and converted to text after you press Stop. Do not lock the screen while recording.</p>
        </div>
      </div>
    </section>
  );
}
