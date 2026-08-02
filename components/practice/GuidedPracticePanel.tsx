"use client";

import { useEffect, useMemo, useState } from "react";
import { InterviewQuestion } from "@/types/InterviewQuestion";

interface GuidedPracticePanelProps {
  question: InterviewQuestion;
}

const waveHeights = [18, 30, 22, 38, 26, 44, 24, 36, 20, 32, 16, 28];

export default function GuidedPracticePanel({
  question,
}: GuidedPracticePanelProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speechText = useMemo(
    () => `${question.title}. ${question.description}`,
    [question.description, question.title]
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakQuestion = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = "en-US";
    utterance.rate = 0.92;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) =>
        voice.lang.toLowerCase().startsWith("en") &&
        /samantha|zira|aria|google us english|daniel|serena/i.test(voice.name)
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            Interview question
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
            {question.title}
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
            {question.description}
          </p>
        </div>

        <button
          type="button"
          onClick={speakQuestion}
          disabled={isSpeaking}
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed sm:w-auto"
        >
          <span aria-hidden="true">🔊</span>
          {isSpeaking ? "Recruiter is speaking" : "Listen to Question"}
        </button>
      </div>

      {isSpeaking && (
        <div className="mt-5 flex items-center gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex h-11 items-center gap-1" aria-hidden="true">
            {waveHeights.map((height, index) => (
              <span
                key={`${height}-${index}`}
                className="w-1 animate-pulse rounded-full bg-emerald-500"
                style={{
                  height,
                  animationDelay: `${index * 70}ms`,
                  animationDuration: "650ms",
                }}
              />
            ))}
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-800">AI recruiter is speaking</p>
            <p className="text-xs text-emerald-700">Listen carefully, then answer in your own words.</p>
          </div>
        </div>
      )}

      <div className="mt-5">
        <p className="text-sm font-bold text-slate-800">Useful ideas</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {question.keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50">
        <button
          type="button"
          onClick={() => setShowAnswer((current) => !current)}
          className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
          aria-expanded={showAnswer}
        >
          <div>
            <p className="font-bold text-emerald-900">Suggested Confident Answer</p>
            <p className="mt-1 text-xs text-emerald-700">
              Try answering first. Open this only when you need guidance.
            </p>
          </div>
          <span className="shrink-0 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </span>
        </button>

        {showAnswer && (
          <div className="border-t border-emerald-200 px-4 py-5 sm:px-5">
            <p className="whitespace-pre-wrap text-sm leading-7 text-emerald-950 sm:text-base sm:leading-8">
              {question.sampleAnswer}
            </p>
            <p className="mt-4 text-xs leading-6 text-emerald-700 sm:text-sm">
              Use the structure and key ideas as guidance. Replace personal details with your own experience and speak naturally.
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center text-xs font-semibold text-slate-600 sm:text-sm">
        <span>1. Prepare</span>
        <span>2. Record</span>
        <span>3. Review</span>
      </div>
    </section>
  );
}
