"use client";

import { useState } from "react";

import { useInterviewContext } from "@/context/InterviewContext";

import {
  InterviewState,
  readyInterview,
} from "@/services/interviewFlowService";

import InterviewHeader from "./InterviewHeader";
import InterviewProgress from "./InterviewProgress";
import InterviewQuestionCard from "./InterviewQuestionCard";
import InterviewNavigator from "./InterviewNavigator";
import InterviewStatusBar from "./InterviewStatusBar";
import AIInterviewer from "./AIInterviewer";
import WelcomeInterviewer from "./WelcomeInterviewer";
import ReadyScreen from "./ReadyScreen";

import SpeechRecorder from "../SpeechRecorder";
import AIEvaluation from "../evaluation/AIEvaluation";
import LiveCoachPanel from "./LiveCoachPanel";
import VoiceCoach from "./VoiceCoach";
export default function InterviewEngine() {

  const {

    currentQuestion,

    currentQuestionIndex,

    totalQuestions,

    interviewFinished,

    flow,

    setFlow,

    startQuestion,

  } = useInterviewContext();

  const [

    welcomeFinished,

    setWelcomeFinished,

  ] = useState(false);

  /**
   * Welcome Screen
   */
  if (!welcomeFinished) {

    return (

      <div className="mx-auto max-w-5xl">

        <WelcomeInterviewer

          totalQuestions={totalQuestions}

          onFinished={() => {

            setWelcomeFinished(true);

            setFlow(

              readyInterview()

            );

          }}

        />

      </div>

    );

  }

   /**
   * Ready Screen
   */

  if (flow.state === InterviewState.READY) {
    return (
      <div className="mx-auto max-w-5xl">
        <ReadyScreen
          current={currentQuestionIndex + 1}
          total={totalQuestions}
          onReady={startQuestion}
        />
      </div>
    );
  }
  
   /**
   * Interview Finished
   */

  if (interviewFinished) {

    return (

      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 shadow-xl">

               <InterviewHeader />

        <div className="mt-8 rounded-xl border border-green-300 bg-green-50 p-10 text-center">

          <h2 className="text-4xl font-bold text-green-700">

            🎉 Interview Completed

          </h2>

          <p className="mt-5 text-lg text-gray-700">

            Congratulations!

          </p>

          <p className="mt-2 text-gray-600">

            You have successfully completed all interview questions.

          </p>

        </div>

      </div>

    );

  }

  /**
   * Main Interview Screen
   */

  return (

    <div className="mx-auto max-w-5xl rounded-2xl bg-white p-10 shadow-xl">

      <div className="space-y-8">

        <InterviewHeader />

        <InterviewStatusBar />
        <AIInterviewer />

        <LiveCoachPanel />
        <VoiceCoach />
        <InterviewProgress />

        <InterviewQuestionCard

          title={currentQuestion.title}

          description={currentQuestion.description}

          category={currentQuestion.category}

          level={currentQuestion.level}

          duration={currentQuestion.duration}

        />

        <SpeechRecorder />
        
         <AIEvaluation />
        <InterviewNavigator />
      </div>
    </div>
  );
}