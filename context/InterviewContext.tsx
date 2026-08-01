"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { interviewQuestions } from "@/data/interviewQuestions";
import { InterviewQuestion } from "@/types/InterviewQuestion";
import { InterviewAttempt, TrainingLevel } from "@/types/interviewReport";
import { InterviewFlow, InterviewState, getInitialFlow, readyInterview, startInterview } from "@/services/interviewFlowService";

interface InterviewContextType {
  selectedLevel: TrainingLevel;
  setSelectedLevel: (level: TrainingLevel) => void;
  currentQuestionIndex: number;
  currentQuestion: InterviewQuestion;
  totalQuestions: number;
  completedQuestions: number;
  remainingQuestions: number;
  progress: number;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  interviewFinished: boolean;
  flow: InterviewFlow;
  setFlow: React.Dispatch<React.SetStateAction<InterviewFlow>>;
  attempts: InterviewAttempt[];
  saveAttempt: (attempt: InterviewAttempt) => void;
  startQuestion: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishInterview: () => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [selectedLevel, setSelectedLevelState] = useState<TrainingLevel>("basic");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [flow, setFlow] = useState<InterviewFlow>(getInitialFlow());
  const [attempts, setAttempts] = useState<InterviewAttempt[]>([]);

  const questions = useMemo(
    () => interviewQuestions.filter((question) => question.trainingLevel === selectedLevel),
    [selectedLevel]
  );

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex] ?? questions[0];
  const completedQuestions = interviewFinished ? totalQuestions : currentQuestionIndex;
  const remainingQuestions = Math.max(totalQuestions - completedQuestions, 0);
  const progress = totalQuestions ? Math.round((completedQuestions / totalQuestions) * 100) : 0;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const setSelectedLevel = (level: TrainingLevel) => {
    setSelectedLevelState(level);
    setCurrentQuestionIndex(0);
    setInterviewFinished(false);
    setAttempts([]);
    setFlow(getInitialFlow());
  };

  const saveAttempt = (attempt: InterviewAttempt) => {
    setAttempts((previous) => [
      ...previous.filter((item) => item.questionId !== attempt.questionId),
      attempt,
    ]);
  };

  const finishInterview = () => {
    setInterviewFinished(true);
    setFlow({ state: InterviewState.FINISHED, message: "Interview completed successfully." });
  };

  const resetInterview = () => {
    setCurrentQuestionIndex(0);
    setInterviewFinished(false);
    setAttempts([]);
    setFlow(getInitialFlow());
  };

  const startQuestion = () => setFlow(startInterview());

  const nextQuestion = () => {
    if (isLastQuestion) return finishInterview();
    setCurrentQuestionIndex((previous) => previous + 1);
    setFlow(readyInterview());
  };

  const previousQuestion = () => {
    setCurrentQuestionIndex((previous) => Math.max(previous - 1, 0));
    setFlow(readyInterview());
  };

  return (
    <InterviewContext.Provider value={{
      selectedLevel, setSelectedLevel, currentQuestionIndex, currentQuestion, totalQuestions,
      completedQuestions, remainingQuestions, progress, isFirstQuestion, isLastQuestion,
      interviewFinished, flow, setFlow, attempts, saveAttempt, startQuestion, nextQuestion,
      previousQuestion, finishInterview, resetInterview,
    }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterviewContext() {
  const context = useContext(InterviewContext);
  if (!context) throw new Error("useInterviewContext must be used inside InterviewProvider.");
  return context;
}
