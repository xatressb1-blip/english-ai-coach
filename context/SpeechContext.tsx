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
import { SpeechMetrics } from "@/types/speechMetrics";

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
   * Metrics captured for the latest recording.
   */
  speechMetrics: SpeechMetrics | null;

  /**
   * Update recording metrics.
   */
  setSpeechMetrics: (metrics: SpeechMetrics | null) => void;

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

  const [speechMetrics, setSpeechMetrics] = useState<SpeechMetrics | null>(null);

  /**
   * Reset UI
   */
  const resetSpeech = (): void => {

    setTranscript("");

    setStatus("ready");

    setSpeechMetrics(null);

  };

  return (

    <SpeechContext.Provider

      value={{

        transcript,

        setTranscript,

        status,

        setStatus,

        speechMetrics,

        setSpeechMetrics,

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