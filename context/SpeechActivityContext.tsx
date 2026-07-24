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
  detectSpeechActivity,
  SpeechActivityResult,
} from "@/services/speechActivityService";

interface SpeechActivityContextType {

  activity: SpeechActivityResult;

}

const SpeechActivityContext =
  createContext<SpeechActivityContextType | null>(
    null
  );

export function SpeechActivityProvider({
  children,
}: {
  children: ReactNode;
}) {

  const { transcript } =
    useSpeechContext();

  const [
    activity,
    setActivity,
  ] = useState<SpeechActivityResult>(
    detectSpeechActivity("")
  );

  useEffect(() => {

    const timer =
      setInterval(() => {

        setActivity(

          detectSpeechActivity(
            transcript
          )

        );

      }, 500);

    return () => {

      clearInterval(timer);

    };

  }, [transcript]);

  return (

    <SpeechActivityContext.Provider
      value={{
        activity,
      }}
    >

      {children}

    </SpeechActivityContext.Provider>

  );

}

export function useSpeechActivity() {

  const context =
    useContext(
      SpeechActivityContext
    );

  if (!context) {

    throw new Error(
      "useSpeechActivity must be used inside SpeechActivityProvider."
    );

  }

  return context;

}