"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  isSpeechSynthesisSupported,
  speak,
  stopSpeaking,
} from "@/services/speechSynthesisService";

interface Props {
  totalQuestions: number;
  onFinished: () => void;
}

type WelcomeStatus = "idle" | "speaking" | "finished" | "error";

const SPEECH_TIMEOUT_MS = 45_000;

export default function WelcomeInterviewer({
  totalQuestions,
  onFinished,
}: Props) {
  const [status, setStatus] = useState<WelcomeStatus>("idle");
  const completedRef = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSpeechTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const finishWelcome = useCallback(() => {
    if (completedRef.current) return;

    completedRef.current = true;
    clearSpeechTimeout();
    stopSpeaking();
    setStatus("finished");
    onFinished();
  }, [clearSpeechTimeout, onFinished]);

  const handleStartIntroduction = useCallback(() => {
    if (status === "speaking" || completedRef.current) return;

    if (!isSpeechSynthesisSupported()) {
      setStatus("error");
      return;
    }

    const message = `
Welcome to today's English interview.

Thank you for taking the time to join us.

This interview contains ${totalQuestions} interview questions.

Please answer each question naturally, confidently, and as clearly as possible.

I wish you the very best of luck, and I hope to welcome you as a member of our company in the future.

When you are ready, please click the continue button to begin the interview.
`;

    setStatus("speaking");
    stopSpeaking();

    timeoutRef.current = setTimeout(() => {
      setStatus("error");
      stopSpeaking();
    }, SPEECH_TIMEOUT_MS);

    speak(message, finishWelcome);
  }, [finishWelcome, status, totalQuestions]);

  useEffect(() => {
    return () => {
      clearSpeechTimeout();
      stopSpeaking();
    };
  }, [clearSpeechTimeout]);

  const speaking = status === "speaking";

  return (
    <>
      <section className="relative min-h-[720px] overflow-hidden rounded-[30px] border border-slate-200 bg-slate-900 shadow-2xl sm:min-h-[760px] lg:min-h-[820px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/interview-room-final.png')" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-slate-900/18" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,rgba(15,23,42,0.22)_100%)]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[720px] items-center justify-center p-4 sm:min-h-[760px] sm:p-6 lg:min-h-[820px] lg:p-10">
          <div className="w-full max-w-[800px] rounded-[30px] border border-white/75 bg-white/94 p-6 text-center shadow-[0_28px_80px_rgba(15,23,42,0.34)] backdrop-blur-md sm:p-8 lg:p-10">
            <AnimatedRobotAvatar speaking={speaking} />

            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-[44px]">
              AI Interview Coach
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
              Practice in a professional interview space. Listen to the introduction,
              then continue to the interview when you are ready.
            </p>

            <div className="mx-auto mt-5 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-sm sm:text-sm">
              <span>{totalQuestions} questions</span>
              <span>•</span>
              <span>English speaking practice</span>
              <span>•</span>
              <span>Realistic interview flow</span>
            </div>

            {status === "idle" && (
              <>
                <button
                  type="button"
                  onClick={handleStartIntroduction}
                  className="mt-7 w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto sm:min-w-72 sm:text-lg"
                >
                  ▶ Play Introduction
                </button>

                <div className="mx-auto mt-6 max-w-2xl border-t border-slate-200 pt-5 text-sm leading-6 text-slate-600">
                  Tap the button above to hear the introduction.<br />
                  Mobile browsers need a user action before audio can start.
                </div>
              </>
            )}

            {status === "speaking" && (
              <>
                <div className="mx-auto mt-7 max-w-2xl rounded-2xl border border-blue-200 bg-blue-50/90 p-4 sm:p-5">
                  <div className="flex items-center justify-center gap-4 text-blue-700">
                    <div className="flex items-end gap-1" aria-hidden="true">
                      {[14, 24, 18, 28, 16].map((height, index) => (
                        <span
                          key={index}
                          className="w-1.5 rounded-full bg-blue-600 motion-safe:animate-pulse"
                          style={{
                            height,
                            animationDelay: `${index * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-left text-sm font-semibold sm:text-base">
                      The interviewer is speaking.<br />
                      Please listen to the introduction.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex justify-center gap-2" aria-label="Speaking">
                  <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-600" />
                  <span
                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-400"
                    style={{ animationDelay: "0.15s" }}
                  />
                  <span
                    className="h-2.5 w-2.5 animate-bounce rounded-full bg-blue-300"
                    style={{ animationDelay: "0.3s" }}
                  />
                </div>
              </>
            )}

            {status === "error" && (
              <div className="mx-auto mt-6 max-w-xl rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left">
                <p className="font-semibold text-amber-900">
                  The introduction audio could not be played on this browser.
                </p>
                <p className="mt-2 text-sm leading-6 text-amber-800">
                  You can continue safely. This will not prevent you from taking the interview.
                </p>
              </div>
            )}

            {(status === "speaking" || status === "error") && (
              <button
                type="button"
                onClick={finishWelcome}
                className="mt-7 w-full rounded-2xl bg-slate-900 px-6 py-4 text-base font-bold text-white shadow-lg transition hover:bg-slate-800 active:scale-[0.98] sm:w-auto sm:min-w-72 sm:text-lg"
              >
                Continue to Interview
              </button>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes mouthTalk {
          0%,
          100% {
            transform: scaleX(0.85) scaleY(0.45);
            opacity: 0.85;
          }
          25% {
            transform: scaleX(1.15) scaleY(1.25);
            opacity: 1;
          }
          50% {
            transform: scaleX(0.72) scaleY(0.55);
            opacity: 0.9;
          }
          75% {
            transform: scaleX(1.08) scaleY(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

function AnimatedRobotAvatar({ speaking }: { speaking: boolean }) {
  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 via-[#132845] to-[#2758b2] shadow-xl ring-8 ring-blue-50 sm:h-32 sm:w-32">
        <div className="relative h-[72px] w-[64px] rounded-[22px] border-[5px] border-slate-900 bg-slate-100 shadow-inner">
          <div className="absolute left-1/2 top-[-14px] h-4 w-3 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]" />

          <div className="absolute left-[-10px] top-4 h-5 w-5 rounded-full border-[4px] border-slate-900 bg-slate-200" />
          <div className="absolute right-[-10px] top-4 h-5 w-5 rounded-full border-[4px] border-slate-900 bg-slate-200" />

          <div className="absolute left-4 top-5 h-4 w-4 rounded-md bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
          <div className="absolute right-4 top-5 h-4 w-4 rounded-md bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.7)]" />

          <div className="absolute left-1/2 top-[45px] -translate-x-1/2">
            <div
              className="h-[10px] w-[24px] rounded-full bg-slate-900"
              style={
                speaking
                  ? { animation: "mouthTalk 0.38s ease-in-out infinite" }
                  : { transform: "scaleY(0.45)", opacity: 0.9 }
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600">
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            speaking ? "animate-pulse bg-green-500" : "bg-slate-300"
          }`}
        />
        <span>{speaking ? "AI interviewer is speaking..." : "AI interviewer is ready"}</span>
      </div>
    </div>
  );
}
