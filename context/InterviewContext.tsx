"use client";

import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { interviewQuestions } from "@/data/interviewQuestions";
import { InterviewQuestion } from "@/types/InterviewQuestion";
import { InterviewAttempt, TrainingLevel } from "@/types/interviewReport";
import { InterviewFlow, InterviewState, getInitialFlow, readyInterview, startInterview } from "@/services/interviewFlowService";
import { defaultRecruiter, getRecruiterById, RecruiterProfile } from "@/data/recruiters";
import { CompanyProfile, defaultCompany, defaultJobRole, getCompanyById, getJobRoleById, JobRoleProfile } from "@/data/interviewProfiles";
import { CandidateQuestionResult } from "@/types/candidateQuestion";

interface InterviewContextType {
  candidateName: string;
  setCandidateName: (name: string) => void;
  selectedRecruiter: RecruiterProfile;
  setSelectedRecruiterId: (id: string) => void;
  selectedCompany: CompanyProfile;
  selectedJobRole: JobRoleProfile;
  setSelectedCompanyId: (id: string) => void;
  setSelectedJobRoleId: (id: string) => void;
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
  candidateQuestion: CandidateQuestionResult | null;
  setCandidateQuestion: (result: CandidateQuestionResult | null) => void;
  startQuestion: () => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  finishInterview: () => void;
  resetInterview: () => void;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [candidateName, setCandidateNameState] = useState("");
  const [selectedRecruiterId, setSelectedRecruiterIdState] = useState(defaultRecruiter.id);
  const [selectedCompanyId, setSelectedCompanyIdState] = useState(defaultCompany.id);
  const [selectedJobRoleId, setSelectedJobRoleIdState] = useState(defaultJobRole.id);
  const [selectedLevel, setSelectedLevelState] = useState<TrainingLevel>("basic");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [flow, setFlow] = useState<InterviewFlow>(getInitialFlow());
  const [attempts, setAttempts] = useState<InterviewAttempt[]>([]);
  const [candidateQuestion, setCandidateQuestion] = useState<CandidateQuestionResult | null>(null);

  const selectedRecruiter = useMemo(() => getRecruiterById(selectedRecruiterId), [selectedRecruiterId]);
  const selectedCompany = useMemo(() => getCompanyById(selectedCompanyId), [selectedCompanyId]);
  const selectedJobRole = useMemo(() => getJobRoleById(selectedCompany, selectedJobRoleId), [selectedCompany, selectedJobRoleId]);

  const setSelectedRecruiterId = (id: string) => {
    setSelectedRecruiterIdState(getRecruiterById(id).id);
    if (typeof window !== "undefined") {
      localStorage.setItem("english-ai-recruiter", getRecruiterById(id).id);
    }
  };


  const setSelectedCompanyId = (id: string) => {
    const company = getCompanyById(id);
    setSelectedCompanyIdState(company.id);
    setSelectedJobRoleIdState(company.roles[0].id);
    if (typeof window !== "undefined") {
      localStorage.setItem("english-ai-company", company.id);
      localStorage.setItem("english-ai-job-role", company.roles[0].id);
    }
  };

  const setSelectedJobRoleId = (id: string) => {
    const role = getJobRoleById(selectedCompany, id);
    setSelectedJobRoleIdState(role.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("english-ai-job-role", role.id);
    }
  };

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

  const setCandidateName = (name: string) => {
    const normalizedName = name.trim().replace(/\s+/g, " ");
    setCandidateNameState(normalizedName);

    if (typeof window !== "undefined") {
      localStorage.setItem("english-ai-candidate-name", normalizedName);
    }
  };

  const setSelectedLevel = (level: TrainingLevel) => {
    setSelectedLevelState(level);
    setCurrentQuestionIndex(0);
    setInterviewFinished(false);
    setAttempts([]);
    setCandidateQuestion(null);
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
    setCandidateQuestion(null);
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
      candidateName, setCandidateName, selectedRecruiter, setSelectedRecruiterId, selectedCompany, selectedJobRole, setSelectedCompanyId, setSelectedJobRoleId, selectedLevel, setSelectedLevel, currentQuestionIndex, currentQuestion, totalQuestions,
      completedQuestions, remainingQuestions, progress, isFirstQuestion, isLastQuestion,
      interviewFinished, flow, setFlow, attempts, saveAttempt, candidateQuestion, setCandidateQuestion, startQuestion, nextQuestion,
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
