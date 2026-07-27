"use client";

/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * AI Interviewer
 *
 * File:
 * components/interview/AIInterviewer.tsx
 *
 * Version:
 * 2.1 Stable
 *
 * Status:
 * Production Stable
 *
 * Description:
 * ------------------------------------------------------------
 * Responsible for:
 *
 * • Speaking the current interview question
 * • Triggering Listening mode after AI finishes speaking
 * • Preventing duplicate speech
 *
 * ============================================================
 */

import { useEffect, useRef } from "react";

import { useInterviewContext } from "@/context/InterviewContext";

import {
  enqueueSpeech,
} from "@/services/speechQueueService";

import {
  InterviewState,
  startListening,
} from "@/services/interviewFlowService";

export default function AIInterviewer() {

  const {
    currentQuestion,
    flow,
    setFlow,
  } = useInterviewContext();

  /**
   * Remember the last question spoken.
   * Prevent duplicate enqueue caused by re-render.
   */
  const lastQuestionRef = useRef<string>("");

  useEffect(() => {

    //----------------------------------------------------------
    // Only speak while AI is asking
    //----------------------------------------------------------

    if (flow.state !== InterviewState.ASKING) {
      return;
    }

    //----------------------------------------------------------
    // No current question
    //----------------------------------------------------------

    if (!currentQuestion) {
      return;
    }

    //----------------------------------------------------------
    // Prevent duplicate speech
    //----------------------------------------------------------

    if (
      lastQuestionRef.current === currentQuestion.title
    ) {
      return;
    }

    lastQuestionRef.current =
      currentQuestion.title;

    console.log(
      "[AIInterviewer] Speaking:",
      currentQuestion.title
    );

    enqueueSpeech(

      currentQuestion.title,

      () => {

        console.log(
          "[AIInterviewer] Finished speaking"
        );

        setFlow(
          startListening()
        );

      }

    );

  }, [

    currentQuestion,

    flow.state,

    setFlow,

  ]);

  /**
   * Reset when moving to another question
   */
  useEffect(() => {

    if (!currentQuestion) {

      lastQuestionRef.current = "";

      return;

    }

    if (
      lastQuestionRef.current !== currentQuestion.title
    ) {

      // Next question will be allowed to speak.

    }

  }, [currentQuestion]);

  return null;

}