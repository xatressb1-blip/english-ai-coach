"use client";

import { useEffect } from "react";

import { useInterviewContext } from "@/context/InterviewContext";

import {
  speak,
  stopSpeaking,
} from "@/services/speechSynthesisService";

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

  useEffect(() => {

    if (flow.state !== InterviewState.ASKING) {
      return;
    }

    if (!currentQuestion) {
      return;
    }

    speak(
      currentQuestion.title,

      () => {

        setFlow(
          startListening()
        );

      }

    );

    return () => {

      stopSpeaking();

    };

  }, [

    currentQuestion,

    flow.state,

    setFlow,

  ]);

  return null;

}