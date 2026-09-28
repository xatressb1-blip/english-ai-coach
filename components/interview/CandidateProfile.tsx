"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import RecruiterAvatar from "./RecruiterAvatar";
import SceneBackdrop from "./SceneBackdrop";
import { clearSpeechQueue, enqueueRecruiterSpeech } from "@/services/speechQueueService";

interface Props {
  onContinue: () => void;
}

const buildGreeting = (name: string) =>
  `Hello ${name}. Welcome to your interview practice. Take a slow breath, sit comfortably, and remember that you do not need to be perfect. Speak clearly, answer one idea at a time, and use your own experience. I am here to help you build confidence before your real interview.`;

const waveformBars = [30, 56, 42, 72, 50, 82, 46, 68, 38, 76, 48, 62, 34, 58];

function VoiceStatus({
  active,
  recruiterName,
}: {
  active: boolean;
  recruiterName: string;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 transition-colors sm:px-4 ${
        active
          ? "border-emerald-200 bg-emerald-50"
          : "border-slate-200 bg-slate-50"
      }`}
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span
          className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base ${
            active
              ? "bg-emerald-500 text-white shadow-sm"
              : "bg-slate-200 text-slate-600"
          }`}
          aria-hidden="true"
        >
          {active && (
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />
          )}
          <span className="relative">🔊</span>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className={`truncate text-sm font-bold ${active ? "text-emerald-900" : "text-slate-700"}`}>
              {active ? `${recruiterName} is speaking` : "Recruiter voice ready"}
            </p>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                active
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {active ? "Speaking" : "Ready"}
            </span>
          </div>

          <div className="mt-2 flex h-7 items-center gap-1" aria-hidden="true">
            {waveformBars.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className={`w-1 flex-1 rounded-full ${
                  active
                    ? "animate-[candidateWave_850ms_ease-in-out_infinite] bg-emerald-500"
                    : "bg-slate-300"
                }`}
                style={{
                  maxWidth: "5px",
                  height: active ? `${height}%` : "22%",
                  animationDelay: `${index * 52}ms`,
                }}
              />
            ))}
          </div>
        </div>
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
  const { candidateName, setCandidateName, selectedRecruiter } = useInterviewContext();
  const [nameInput, setNameInput] = useState(candidateName);
  const [confirmed, setConfirmed] = useState(Boolean(candidateName));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");

  useEffect(() => {
    setNameInput(candidateName);
  }, [candidateName]);

  useEffect(() => {
    return () => {
      clearSpeechQueue();
    };
  }, []);

  const normalizedName = nameInput.trim().replace(/\s+/g, " ");
  const greetingText = useMemo(
    () => buildGreeting(confirmed && candidateName ? candidateName : normalizedName || "Candidate"),
    [candidateName, confirmed, normalizedName]
  );

  const speakGreeting = (name: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setVoiceMessage("Voice playback is not supported in this browser.");
      return;
    }

    clearSpeechQueue();
    setVoiceMessage("");
    setIsSpeaking(true);

    const exactGreeting = buildGreeting(name);
    enqueueRecruiterSpeech(exactGreeting, selectedRecruiter, () => {
      setIsSpeaking(false);
      setVoiceMessage("Greeting completed. You can continue when you are ready.");
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!normalizedName) return;

    setCandidateName(normalizedName);
    setConfirmed(true);
    speakGreeting(normalizedName);
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <SceneBackdrop
        scene="lobby"
        overlay="dark"
        className="px-4 py-5 text-white sm:px-6 sm:py-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-blue-100 sm:text-xs">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">
                Step 1 of 4
              </span>
              <span>Candidate check-in</span>
            </div>
            <h1 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">
              Meet your virtual recruiter
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-100 sm:text-base">
              Enter your name, listen to the recruiter greeting, then continue to interview setup.
            </p>
          </div>
          <div className="hidden rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-right text-xs text-blue-100 backdrop-blur lg:block">
            <p className="font-bold text-white">Corporate interview simulation</p>
            <p>Voice • recruiter • guided setup</p>
          </div>
        </div>
      </SceneBackdrop>

      <div className="p-4 sm:p-5 lg:p-6">
        <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
                  Candidate
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-950">Your interview name</h2>
              </div>
              {confirmed && candidateName && (
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  Confirmed
                </span>
              )}
            </div>

            <label htmlFor="candidate-name" className="sr-only">
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
                clearSpeechQueue();
              }}
              placeholder="Example: Chung"
              maxLength={60}
              autoComplete="name"
              className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-base font-medium text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
            <p className="mt-2 text-xs leading-5 text-slate-500">
              This name is used in the spoken greeting and final recruiter report.
            </p>

            {!confirmed && (
              <button
                type="submit"
                disabled={!normalizedName || isSpeaking}
                className="mt-4 min-h-12 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Confirm & Play Greeting
              </button>
            )}

            {confirmed && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-white px-4 py-3 text-xs leading-5 text-slate-600">
                <strong className="text-slate-900">Next:</strong> listen once, replay only if needed, then continue to choose your interview level.
              </div>
            )}
          </form>

          <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <RecruiterAvatar
                recruiter={selectedRecruiter}
                state="idle"
                size="md"
                priority
                showStatusDot
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-slate-950">{selectedRecruiter.name}</p>
                <p className="truncate text-sm font-medium text-blue-700">AI {selectedRecruiter.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{selectedRecruiter.accent}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-blue-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-700">
              {confirmed && candidateName ? (
                <>
                  <p className="mb-1 font-bold text-blue-900">Spoken greeting</p>
                  <p>{greetingText}</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-blue-900">Your greeting will appear here.</p>
                  <p className="mt-1 text-slate-600">
                    The text shown in this panel will be exactly the same text spoken by the recruiter.
                  </p>
                </>
              )}
            </div>

            <div className="mt-3">
              <VoiceStatus active={isSpeaking} recruiterName={selectedRecruiter.name} />
            </div>

            {voiceMessage && (
              <p className="mt-2 text-xs font-medium text-slate-500">{voiceMessage}</p>
            )}
          </div>
        </div>

        {confirmed && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:ml-auto lg:max-w-xl">
            <button
              type="button"
              onClick={() => speakGreeting(candidateName)}
              disabled={isSpeaking}
              className="min-h-12 rounded-xl border border-blue-300 bg-white px-5 py-3 font-bold text-blue-700 transition hover:bg-blue-50 active:scale-[.99] disabled:cursor-wait disabled:opacity-60"
            >
              {isSpeaking ? "Recruiter Speaking..." : "🔊 Listen Again"}
            </button>

            <button
              type="button"
              onClick={() => {
                clearSpeechQueue();
                setIsSpeaking(false);
                onContinue();
              }}
              className="min-h-12 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white shadow-sm transition hover:bg-slate-800 active:scale-[.99]"
            >
              Continue to Interview Level →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
