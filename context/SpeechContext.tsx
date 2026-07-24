"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export type SpeechStatus =
  | "ready"
  | "recording"
  | "processing"
  | "finished";

interface SpeechContextType {
  transcript: string;
  setTranscript: (text: string) => void;

  status: SpeechStatus;
  setStatus: (status: SpeechStatus) => void;
}

const SpeechContext = createContext<
  SpeechContextType | undefined
>(undefined);

export function SpeechProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [transcript, setTranscript] = useState("");

  const [status, setStatus] =
    useState<SpeechStatus>("ready");

  return (
    <SpeechContext.Provider
      value={{
        transcript,
        setTranscript,

        status,
        setStatus,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
}

export function useSpeechContext() {
  const context = useContext(SpeechContext);

  if (!context) {
    throw new Error(
      "useSpeechContext must be used inside SpeechProvider"
    );
  }

  return context;
}