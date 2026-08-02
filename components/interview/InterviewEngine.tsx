"use client";

import { useState } from "react";

import { useInterviewContext } from "@/context/InterviewContext";
import { InterviewState, readyInterview } from "@/services/interviewFlowService";
import InterviewNavigator from "./InterviewNavigator";
import InterviewProgress from "./InterviewProgress";
import InterviewStatusBar from "./InterviewStatusBar";
import AIInterviewer from "./AIInterviewer";
import ReadyScreen from "./ReadyScreen";
import SpeechRecorder from "../SpeechRecorder";
import AIEvaluation from "../evaluation/AIEvaluation";
import LiveCoachPanel from "./LiveCoachPanel";
import VoiceCoach from "./VoiceCoach";
import VoiceCoachBubble from "./VoiceCoachBubble";
import FeedbackButton from "../feedback/FeedbackButton";
import FeedbackDialog from "../feedback/FeedbackDialog";
import VirtualInterviewLobby from "./VirtualInterviewLobby";
import RecruiterStage from "./RecruiterStage";
import InterviewCompletion from "./InterviewCompletion";
import LevelSelection from "./LevelSelection";
import FinalRecruiterReport from "./FinalRecruiterReport";
import CandidateProfile from "./CandidateProfile";

export default function InterviewEngine() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [levelChosen, setLevelChosen] = useState(false);
  const [enteredRoom, setEnteredRoom] = useState(false);

  const {
    candidateName,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    interviewFinished,
    flow,
    setFlow,
    startQuestion,
  } = useInterviewContext();

  if (!profileCompleted) {
    return <CandidateProfile onContinue={() => setProfileCompleted(true)} />;
  }

  if (!levelChosen) {
    return <LevelSelection onContinue={() => setLevelChosen(true)} />;
  }

  if (!enteredRoom) {
    return (
      <VirtualInterviewLobby
        candidateName={candidateName}
        totalQuestions={totalQuestions}
        onEnter={() => {
          setEnteredRoom(true);
          setFlow(readyInterview());
        }}
      />
    );
  }

  if (interviewFinished) {
    return <FinalRecruiterReport />;
  }

  if (flow.state === InterviewState.READY) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <ReadyScreen
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          onReady={startQuestion}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <RecruiterStage />

      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-xl sm:p-6 lg:p-8">
        <AIInterviewer />
        <VoiceCoachBubble />

        <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
          <InterviewStatusBar />
          <InterviewProgress />
        </div>

        <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-900">
          <strong>Interview rule:</strong> answer in your own words. The model answer is intentionally hidden in Mock Interview mode.
        </div>

        <SpeechRecorder />
        <AIEvaluation question={currentQuestion} />
        <LiveCoachPanel />
        <VoiceCoach />
        <InterviewNavigator />
      </div>

      <FeedbackButton onClick={() => setFeedbackOpen(true)} />
      <FeedbackDialog open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </div>
  );
}
