"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import { useSpeechContext } from "@/context/SpeechContext";

import {
  analyzeLiveTranscript,
  LiveCoachResult,
} from "@/services/liveCoachService";

interface LiveCoachContextType {
  coach: LiveCoachResult;
}

const LiveCoachContext =
  createContext<LiveCoachContextType | null>(null);

export function LiveCoachProvider({
  children,
}: {
  children: ReactNode;
}) {

  const {
    transcript,
    status,
  } = useSpeechContext();

  const [coach, setCoach] =
    useState<LiveCoachResult>(
      analyzeLiveTranscript("")
    );

  useEffect(() => {

    // Chỉ phân tích khi đang ghi âm
    if (status !== "recording") {
      return;
    }

    setCoach(
      analyzeLiveTranscript(
        transcript
      )
    );

  }, [transcript, status]);

  return (
    <LiveCoachContext.Provider
      value={{
        coach,
      }}
    >
      {children}
    </LiveCoachContext.Provider>
  );
}

export function useLiveCoach() {

  const context =
    useContext(LiveCoachContext);

  if (!context) {
    throw new Error(
      "useLiveCoach must be used inside LiveCoachProvider."
    );
  }

  return context;
}