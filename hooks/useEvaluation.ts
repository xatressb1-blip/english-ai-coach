"use client";

import { useCallback } from "react";

import { useSpeechContext } from "@/context/SpeechContext";
import { useInterviewContext } from "@/context/InterviewContext";
import { useEvaluationContext } from "@/context/EvaluationContext";
import { useHistoryContext } from "@/context/HistoryContext";

import { evaluateInterview } from "@/services/evaluationService";

export function useEvaluation() {

  const { transcript } = useSpeechContext();

  const {

    currentQuestion,

    currentQuestionIndex,

  } = useInterviewContext();

  const {

    result,

    setResult,

    loading,

    setLoading,

    error,

    setError,

  } = useEvaluationContext();

  const {

    addHistory,

  } = useHistoryContext();

  const evaluate = useCallback(async () => {

    setError(null);

    setResult(null);

    if (!transcript.trim()) {

      setError(

        "Please enter or record your answer before asking AI to evaluate."

      );

      return;

    }

    try {

      setLoading(true);

      const evaluation = await evaluateInterview(

        currentQuestion,

        transcript

      );

      setResult(evaluation);

      addHistory({

        id: crypto.randomUUID(),

        questionId: currentQuestionIndex,

        questionTitle: currentQuestion.title,

        transcript,

        evaluation,

        createdAt: new Date().toISOString(),

      });

    }

    catch (err) {

      if (err instanceof Error) {

        setError(err.message);

      }

      else {

        setError(

          "Unexpected error occurred."

        );

      }

    }

    finally {

      setLoading(false);

    }

  }, [

    transcript,

    currentQuestion,

    currentQuestionIndex,

    addHistory,

    setError,

    setLoading,

    setResult,

  ]);

  return {

    result,

    loading,

    error,

    evaluate,

  };

}