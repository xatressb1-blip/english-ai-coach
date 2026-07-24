"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import { InterviewQuestion } from "@/types/InterviewQuestion";

import {
  getAllQuestions,
} from "@/services/interviewService";
import {
  InterviewFlow,
  InterviewState,
  getInitialFlow,
  readyInterview,
  startInterview,
} from "@/services/interviewFlowService";

interface InterviewContextType {
  // Question
  currentQuestionIndex: number;
  currentQuestion: InterviewQuestion;
  totalQuestions: number;

  // Progress
  completedQuestions: number;
  remainingQuestions: number;
  progress: number;

  // Navigation
  isFirstQuestion: boolean;
  isLastQuestion: boolean;

  // Interview Status
  interviewFinished: boolean;

  // Interview Flow
  flow: InterviewFlow;

  setFlow: React.Dispatch<
    React.SetStateAction<InterviewFlow>
  >;

 // Actions
startQuestion: () => void;
nextQuestion: () => void;
previousQuestion: () => void;
finishInterview: () => void;
resetInterview: () => void;
}

const InterviewContext =
  createContext<InterviewContextType | null>(null);

export function InterviewProvider({
  children,
}: {
  children: ReactNode;
}) {

  const questions = getAllQuestions();

  const totalQuestions = questions.length;

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(0);

  const [
    interviewFinished,
    setInterviewFinished,
  ] = useState(false);

  const [
    flow,
    setFlow,
  ] = useState<InterviewFlow>(
    getInitialFlow()
  );

  const completedQuestions =
    interviewFinished
      ? totalQuestions
      : currentQuestionIndex;

  const remainingQuestions =
    totalQuestions - completedQuestions;

  const progress =
    totalQuestions === 0
      ? 0
      : Math.round(
          (completedQuestions / totalQuestions) *
            100
        );

  const isFirstQuestion =
    currentQuestionIndex === 0;

  const isLastQuestion =
    currentQuestionIndex ===
    totalQuestions - 1;

  const finishInterview = () => {

    setInterviewFinished(true);

    setFlow({
      state: InterviewState.FINISHED,
      message:
        "Interview completed successfully.",
    });

  };

  const resetInterview = () => {

    setCurrentQuestionIndex(0);

    setInterviewFinished(false);

    setFlow(getInitialFlow());

  };
const startQuestion = () => {

  setFlow(

    startInterview()

);

};
  const nextQuestion = () => {

    if (isLastQuestion) {

      finishInterview();

      return;

    }

    setCurrentQuestionIndex(
      (prev) => prev + 1
    );

   setFlow(
  readyInterview()
);

  };

  const previousQuestion = () => {

    setCurrentQuestionIndex((prev) =>
      prev > 0 ? prev - 1 : prev
    );

    setFlow(
  readyInterview()
);

  };

  const currentQuestion =
    questions[currentQuestionIndex];

  return (

    <InterviewContext.Provider
      value={{

        currentQuestionIndex,

        currentQuestion,

        totalQuestions,

        completedQuestions,

        remainingQuestions,

        progress,

        isFirstQuestion,

        isLastQuestion,

        interviewFinished,

        flow,

        setFlow,
        startQuestion,
        nextQuestion,
        previousQuestion,
        finishInterview,
        resetInterview,

      }}
    >

      {children}

    </InterviewContext.Provider>

  );

}

export function useInterviewContext() {

  const context =
    useContext(InterviewContext);

  if (!context) {

    throw new Error(
      "useInterviewContext must be used inside InterviewProvider."
    );

  }

  return context;

}