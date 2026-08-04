"use client";

import { useState } from "react";
import { useInterviewContext } from "@/context/InterviewContext";
import { InterviewState, readyInterview } from "@/services/interviewFlowService";
import InterviewProgress from "./InterviewProgress";
import InterviewStatusBar from "./InterviewStatusBar";
import AIInterviewer from "./AIInterviewer";
import ReadyScreen from "./ReadyScreen";
import SpeechRecorder from "../SpeechRecorder";
import FeedbackButton from "../feedback/FeedbackButton";
import FeedbackDialog from "../feedback/FeedbackDialog";
import VirtualInterviewLobby from "./VirtualInterviewLobby";
import RecruiterStage from "./RecruiterStage";
import LevelSelection from "./LevelSelection";
import FinalRecruiterReport from "./FinalRecruiterReport";
import CandidateProfile from "./CandidateProfile";
import InterviewPositionSetup from "./InterviewPositionSetup";
import InterviewOpening from "./InterviewOpening";
import InterviewClosing from "./InterviewClosing";
import MockInterviewEvaluation from "./MockInterviewEvaluation";
import CandidateQuestion from "./CandidateQuestion";

export default function InterviewEngine() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [levelChosen, setLevelChosen] = useState(false);
  const [positionChosen, setPositionChosen] = useState(false);
  const [enteredRoom, setEnteredRoom] = useState(false);
  const [briefingCompleted, setBriefingCompleted] = useState(false);
  const [candidateQuestionCompleted, setCandidateQuestionCompleted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const { candidateName, currentQuestionIndex, totalQuestions, interviewFinished, flow, setFlow, startQuestion } = useInterviewContext();

  if (!profileCompleted) return <CandidateProfile onContinue={() => setProfileCompleted(true)} />;
  if (!levelChosen) return <LevelSelection onContinue={() => setLevelChosen(true)} />;
  if (!positionChosen) return <InterviewPositionSetup onContinue={() => setPositionChosen(true)} />;

  if (!enteredRoom) {
    return <VirtualInterviewLobby candidateName={candidateName} totalQuestions={totalQuestions} onEnter={() => setEnteredRoom(true)} />;
  }

  if (!briefingCompleted) {
    return <InterviewOpening onBegin={() => { setBriefingCompleted(true); setFlow(readyInterview()); }} />;
  }

  if (interviewFinished && !candidateQuestionCompleted) return <CandidateQuestion onComplete={() => setCandidateQuestionCompleted(true)} />;
  if (interviewFinished && !showReport) return <InterviewClosing onViewReport={() => setShowReport(true)} />;
  if (interviewFinished && showReport) return <FinalRecruiterReport />;

  if (flow.state === InterviewState.READY) {
    return <div className="mx-auto w-full max-w-5xl"><ReadyScreen current={currentQuestionIndex + 1} total={totalQuestions} onReady={startQuestion} /></div>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6">
      <RecruiterStage />
      <div className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-xl sm:rounded-[28px] sm:p-6 lg:p-8">
        <AIInterviewer />
        <div className="grid gap-3 lg:grid-cols-[1.15fr_.85fr] lg:gap-5"><InterviewStatusBar /><InterviewProgress /></div>
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          <strong>Real interview mode:</strong> answer in your own words. Your transcript and detailed scores remain private until the final recruiter report.
        </div>
        <SpeechRecorder allowManualInput={false} compact hideTranscript title="Your interview response" />
        <MockInterviewEvaluation />
      </div>
      <FeedbackButton onClick={() => setFeedbackOpen(true)} />
      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
