"use client";

import { useCallback } from "react";

import { useSpeechContext } from "@/context/SpeechContext";
import { useInterviewContext } from "@/context/InterviewContext";
import { useEvaluationContext } from "@/context/EvaluationContext";
import { useHistoryContext } from "@/context/HistoryContext";

import { evaluateInterview } from "@/services/evaluationService";
import { InterviewQuestion } from "@/types/InterviewQuestion";
import { AiEvaluationError } from "@/services/aiError";

export function useEvaluation(questionOverride?: InterviewQuestion) {

  const { transcript } = useSpeechContext();

  const { currentQuestion } = useInterviewContext();

  const {

    result,

    setResult,

    loading,

    setLoading,

    error,

    errorCode,

    errorRetryable,

    setError,

    setErrorCode,

    setErrorRetryable,

  } = useEvaluationContext();

  const {

    addHistory,

  } = useHistoryContext();

  const evaluationQuestion = questionOverride ?? currentQuestion;

  const evaluate = useCallback(async () => {

    setError(null);
    setErrorCode(null);
    setErrorRetryable(false);

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

        evaluationQuestion,

        transcript

      );

      setResult(evaluation);

      addHistory({

        id: crypto.randomUUID(),

        questionId: evaluationQuestion.id,

        questionTitle: evaluationQuestion.title,

        transcript,

        evaluation,

        createdAt: new Date().toISOString(),

      });

    }

    catch (err) {
      if (err instanceof AiEvaluationError) {
        setError(err.message);
        setErrorCode(err.code);
        setErrorRetryable(err.retryable);
      } else if (err instanceof Error) {
        setError(err.message);
        setErrorCode("AI_UNKNOWN");
        setErrorRetryable(false);
      } else {
        setError("AI evaluation is temporarily unavailable. Your answer has been saved.");
        setErrorCode("AI_UNKNOWN");
        setErrorRetryable(false);
      }
    }

    finally {

      setLoading(false);

    }

  }, [

    transcript,

    evaluationQuestion,

    addHistory,
    setError,

    setErrorCode,

    setErrorRetryable,

    setLoading,

    setResult,

  ]);

  return {

    result,

    loading,

    error,

    errorCode,

    errorRetryable,

    evaluate,

  };

}