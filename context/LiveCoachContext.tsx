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
  createContext<LiveCoachContextType | null>(
    null
  );

export function LiveCoachProvider({
  children,
}: {
  children: ReactNode;
}) {

  const { transcript } =
    useSpeechContext();

  const [coach, setCoach] =
    useState<LiveCoachResult>(
      analyzeLiveTranscript("")
    );

  useEffect(() => {

    const timer =
      setInterval(() => {

        setCoach(

          analyzeLiveTranscript(
            transcript
          )

        );

      }, 2000);

    return () => {

      clearInterval(timer);

    };

  }, [transcript]);

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
    useContext(
      LiveCoachContext
    );

  if (!context) {

    throw new Error(
      "useLiveCoach must be used inside LiveCoachProvider."
    );

  }

  return context;

}