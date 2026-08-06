"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  EvaluationResult,
} from "@/types/evaluation";
import type { AiErrorCode } from "@/services/aiError";

interface EvaluationContextType {
  result: EvaluationResult | null;

  loading: boolean;

  error: string | null;

  errorCode: AiErrorCode | null;

  errorRetryable: boolean;

  setResult: (
    result: EvaluationResult | null
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  setError: (
    error: string | null
  ) => void;

  setErrorCode: (
    code: AiErrorCode | null
  ) => void;

  setErrorRetryable: (
    retryable: boolean
  ) => void;

  resetEvaluation: () => void;
}

const EvaluationContext =
  createContext<
    EvaluationContextType | undefined
  >(undefined);

export function EvaluationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [result, setResult] =
    useState<EvaluationResult | null>(
      null
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [errorCode, setErrorCode] =
    useState<AiErrorCode | null>(null);

  const [errorRetryable, setErrorRetryable] =
    useState(false);

  const resetEvaluation = () => {
    setResult(null);
    setLoading(false);
    setError(null);
    setErrorCode(null);
    setErrorRetryable(false);
  };

  return (
    <EvaluationContext.Provider
      value={{
        result,

        loading,

        error,

        errorCode,

        errorRetryable,

        setResult,

        setLoading,

        setError,

        setErrorCode,

        setErrorRetryable,

        resetEvaluation,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
}

export function useEvaluationContext() {
  const context = useContext(
    EvaluationContext
  );

  if (!context) {
    throw new Error(
      "useEvaluationContext must be used inside EvaluationProvider."
    );
  }

  return context;
}