"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";

interface Props {
  onContinue: () => void;
}

const buildGreeting = (name: string) =>
  `Hello ${name}. Welcome to your interview practice. Take a slow breath, sit comfortably, and remember that you do not need to be perfect. Speak clearly, answer one idea at a time, and use your own experience. I am here to help you build confidence before your real interview.`;

const waveformBars = [
  20, 34, 48, 28, 58, 40, 66, 32, 52, 72, 44, 62, 30, 54, 38, 68, 46, 26,
];

function SpeakingWaveform({ active }: { active: boolean }) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border px-4 py-4 transition-all duration-300 ${
        active
          ? "border-emerald-300 bg-gradient-to-r from-emerald-50 via-cyan-50 to-blue-50 shadow-[0_12px_35px_rgba(16,185,129,0.14)]"
          : "border-slate-200 bg-slate-50"
      }`}
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
              active
                ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {active && (
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-25" />
            )}
            <span className="relative">🔊</span>
          </span>

          <div className="min-w-0">
            <p className={`font-bold ${active ? "text-emerald-900" : "text-slate-700"}`}>
              {active ? "Ms. Emma is speaking" : "Recruiter voice ready"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {active ? "Listen, breathe slowly, and get ready with confidence." : "Your personal greeting will play here."}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
            active
              ? "bg-emerald-100 text-emerald-700"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {active ? "Speaking" : "Ready"}
        </span>
      </div>

      <div className="mt-4 flex h-16 items-center justify-center gap-1.5" aria-hidden="true">
        {waveformBars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={`w-1.5 rounded-full transition-colors duration-300 ${
              active
                ? "animate-[candidateWave_900ms_ease-in-out_infinite] bg-gradient-to-t from-blue-500 to-emerald-400"
                : "bg-slate-300"
            }`}
            style={{
              height: active ? `${height}%` : "18%",
              animationDelay: `${index * 55}ms`,
              animationDuration: `${760 + (index % 5) * 90}ms`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes candidateWave {
          0%, 100% {
            transform: scaleY(0.45);
            opacity: 0.55;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          span {
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function CandidateProfile({ onContinue }: Props) {
  const { candidateName, setCandidateName } = useInterviewContext();
  const [nameInput, setNameInput] = useState(candidateName);
  const [confirmed, setConfirmed] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setNameInput(candidateName);
  }, [candidateName]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const selectEnglishVoice = () => {
    const voices = window.speechSynthesis.getVoices();

    return (
      voices.find((voice) =>
        /samantha|ava|serena|zira|google us english|microsoft aria|microsoft jenny/i.test(
          voice.name
        )
      ) ??
      voices.find((voice) => /^en-(US|GB|AU|CA)/i.test(voice.lang)) ??
      voices.find((voice) => /^en/i.test(voice.lang))
    );
  };

  const speakGreeting = (name: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceMessage("Voice playback is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();
    setVoiceMessage("");

    const utterance = new SpeechSynthesisUtterance(buildGreeting(name));
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.02;
    utterance.volume = 1;

    const preferredVoice = selectEnglishVoice();
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setVoiceMessage("");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setVoiceMessage("Greeting completed. You are ready to choose your interview level.");
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      if (event.error !== "canceled" && event.error !== "interrupted") {
        setVoiceMessage("The greeting could not be played. Tap Listen Again to retry.");
      }
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = nameInput.trim().replace(/\s+/g, " ");
    if (!normalizedName) return;

    setCandidateName(normalizedName);
    setConfirmed(true);
    speakGreeting(normalizedName);
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-6 py-10 text-white sm:px-10 lg:px-14">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
          Candidate Profile
        </span>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
          Let the virtual recruiter know who is joining the interview.
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-200">
          Your name will be used in the recruiter greeting and saved with your Final Recruiter Report.
        </p>
      </div>

      <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[.9fr_1.1fr] lg:p-10">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <label htmlFor="candidate-name" className="text-sm font-bold uppercase tracking-wide text-slate-600">
            Candidate name
          </label>
          <input
            id="candidate-name"
            type="text"
            value={nameInput}
            onChange={(event) => {
              setNameInput(event.target.value);
              setConfirmed(false);
              setIsSpeaking(false);
              setVoiceMessage("");
              if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
              }
            }}
            placeholder="Example: Chung"
            maxLength={60}
            autoComplete="name"
            className="mt-3 w-full rounded-xl border border-slate-300 bg-white px-4 py-4 text-lg text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter the name you want the recruiter to use during this interview.
          </p>
          <button
            type="submit"
            disabled={!nameInput.trim() || isSpeaking}
            className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSpeaking ? "Recruiter Is Greeting You..." : "Confirm Name and Meet Recruiter"}
          </button>
        </form>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-3xl shadow-lg ${isSpeaking ? "ring-4 ring-emerald-200" : ""}`}>
              👩‍💼
            </div>
            <div>
              <p className="font-bold text-slate-900">Ms. Emma</p>
              <p className="text-sm text-blue-700">AI Talent Acquisition Specialist</p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-white p-5 text-sm leading-7 text-slate-700">
            {confirmed && candidateName ? (
              <>
                <p className="text-lg font-bold text-blue-900">Hello {candidateName}!</p>
                <p className="mt-3">
                  Take a slow breath and sit comfortably. You do not need to be perfect. Speak clearly, answer one idea at a time, and use your own experience. This practice is here to help you become more confident before meeting a real recruiter.
                </p>
              </>
            ) : (
              <p>
                After you confirm your name, I will greet you personally and share a few simple reminders to help you feel calm and confident.
              </p>
            )}
          </div>

          <div className="mt-5">
            <SpeakingWaveform active={isSpeaking} />
          </div>

          {voiceMessage && (
            <p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600">
              {voiceMessage}
            </p>
          )}

          {confirmed && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => speakGreeting(candidateName)}
                disabled={isSpeaking}
                className="rounded-xl border border-blue-300 bg-white px-5 py-4 font-bold text-blue-700 transition hover:bg-blue-100 disabled:cursor-wait disabled:opacity-60"
              >
                {isSpeaking ? "Speaking..." : "🔊 Listen Again"}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  setIsSpeaking(false);
                  onContinue();
                }}
                className="rounded-xl bg-slate-900 px-5 py-4 font-bold text-white transition hover:bg-slate-800"
              >
                Choose Interview Level →
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
