"use client";

/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * Speech Context
 *
 * File:
 * context/SpeechContext.tsx
 *
 * Version:
 * 3.0 Stable
 *
 * Description
 * ------------------------------------------------------------
 * Single Source of Truth for Speech UI.
 *
 * Responsibilities
 * ------------------------------------------------------------
 * • Transcript
 * • Recording Status
 * • Reset UI State
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * This Context NEVER communicates with:
 *
 * - SpeechRecognition
 * - SpeechController
 * - Speech Queue
 *
 * It only stores React UI state.
 * ============================================================
 */

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

/* ============================================================
 * Speech Status
 * ============================================================
 */

export type SpeechStatus =
  | "ready"
  | "recording"
  | "processing"
  | "finished";

/* ============================================================
 * Context Interface
 * ============================================================
 */

interface SpeechContextType {

  /**
   * Current transcript
   */
  transcript: string;

  /**
   * Update transcript
   */
  setTranscript: (
    text: string
  ) => void;

  /**
   * Recording Status
   */
  status: SpeechStatus;

  /**
   * Update status
   */
  setStatus: (
    status: SpeechStatus
  ) => void;

  /**
   * Reset Speech UI
   */
  resetSpeech: () => void;

}

/* ============================================================
 * Context
 * ============================================================
 */

const SpeechContext =
  createContext<
    SpeechContextType | undefined
  >(undefined);

/* ============================================================
 * Provider
 * ============================================================
 */

export function SpeechProvider({

  children,

}: {

  children: ReactNode;

}) {

  const [

    transcript,

    setTranscript,

  ] = useState("");

  const [

    status,

    setStatus,

  ] = useState<SpeechStatus>("ready");

  /**
   * Reset UI
   */
  const resetSpeech = (): void => {

    setTranscript("");

    setStatus("ready");

  };

  return (

    <SpeechContext.Provider

      value={{

        transcript,

        setTranscript,

        status,

        setStatus,

        resetSpeech,

      }}

    >

      {children}

    </SpeechContext.Provider>

  );

}

/* ============================================================
 * Hook
 * ============================================================
 */

export function useSpeechContext() {

  const context =
    useContext(SpeechContext);

  if (!context) {

    throw new Error(
      "useSpeechContext must be used inside SpeechProvider."
    );

  }

  return context;

}