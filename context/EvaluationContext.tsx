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

interface EvaluationContextType {
  result: EvaluationResult | null;

  loading: boolean;

  error: string | null;

  setResult: (
    result: EvaluationResult | null
  ) => void;

  setLoading: (
    loading: boolean
  ) => void;

  setError: (
    error: string | null
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

  const resetEvaluation = () => {
    setResult(null);
    setLoading(false);
    setError(null);
  };

  return (
    <EvaluationContext.Provider
      value={{
        result,

        loading,

        error,

        setResult,

        setLoading,

        setError,

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