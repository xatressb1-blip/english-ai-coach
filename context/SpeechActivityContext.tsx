"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  SpeechActivity,
  SpeechActivityResult,
} from "@/services/speechActivityService";

interface SpeechActivityContextType {
  activity: SpeechActivityResult;

  setActivity: (
    activity: SpeechActivityResult
  ) => void;
}

const SpeechActivityContext =
  createContext<
    SpeechActivityContextType | undefined
  >(undefined);

export function SpeechActivityProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [activity, setActivity] =
    useState<SpeechActivityResult>({
      activity: SpeechActivity.IDLE,
      silenceDuration: 0,
      message: "Waiting for your answer.",
    });

  return (
    <SpeechActivityContext.Provider
      value={{
        activity,
        setActivity,
      }}
    >
      {children}
    </SpeechActivityContext.Provider>
  );
}

export function useSpeechActivity() {

  const context =
    useContext(SpeechActivityContext);

  if (!context) {

    throw new Error(
      "useSpeechActivity must be used inside SpeechActivityProvider."
    );

  }

  return context;

}