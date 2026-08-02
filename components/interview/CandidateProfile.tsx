"use client";

import { FormEvent, useEffect, useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";

interface Props {
  onContinue: () => void;
}

const buildGreeting = (name: string) =>
  `Hello ${name}. Welcome to your interview practice. Take a slow breath, sit comfortably, and remember that you do not need to be perfect. Speak clearly, answer one idea at a time, and use your own experience. I am here to help you build confidence before your real interview.`;

export default function CandidateProfile({ onContinue }: Props) {
  const { candidateName, setCandidateName } = useInterviewContext();
  const [nameInput, setNameInput] = useState(candidateName);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    setNameInput(candidateName);
  }, [candidateName]);

  const speakGreeting = (name: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(buildGreeting(name));
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find((voice) =>
      /samantha|ava|serena|zira|google us english|english united states/i.test(voice.name)
    );
    if (preferredVoice) utterance.voice = preferredVoice;

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
            disabled={!nameInput.trim()}
            className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-4 font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm Name and Meet Recruiter
          </button>
        </form>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-700 text-3xl shadow-lg">
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

          {confirmed && (
            <button
              type="button"
              onClick={onContinue}
              className="mt-5 w-full rounded-xl bg-slate-900 px-5 py-4 font-bold text-white transition hover:bg-slate-800"
            >
              Choose Interview Level →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
