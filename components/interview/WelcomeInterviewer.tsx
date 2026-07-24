"use client";

import { useEffect } from "react";

import {
  speak,
  stopSpeaking,
} from "@/services/speechSynthesisService";

interface Props {
  totalQuestions: number;
  onFinished: () => void;
}

export default function WelcomeInterviewer({
  totalQuestions,
  onFinished,
}: Props) {

  useEffect(() => {

    const message = `
Welcome to today's English interview.

Thank you for taking the time to join us.

This interview contains ${totalQuestions} interview questions.

Please answer each question naturally, confidently, and as clearly as possible.

I wish you the very best of luck, and I hope to welcome you as a member of our company in the future.

When you are ready, please click the READY button to begin the interview.
`;

    speak(
      message,
      () => {

        onFinished();

      }
    );

    return () => {

      stopSpeaking();

    };

  }, [totalQuestions, onFinished]);

  return (

    <div className="rounded-2xl border bg-white p-10 shadow-xl text-center">

      <div className="text-6xl">

        🤖

      </div>

      <h2 className="mt-6 text-3xl font-bold">

        AI Interview Coach

      </h2>

      <p className="mt-4 text-gray-600 leading-8">

        Please listen to the introduction...

      </p>

    </div>

  );

}