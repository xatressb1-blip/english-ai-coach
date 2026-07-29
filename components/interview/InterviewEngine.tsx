"use client";

import { useState } from "react";

import { useInterviewContext } from "@/context/InterviewContext";

import {
  InterviewState,
  readyInterview,
} from "@/services/interviewFlowService";
import InterviewHeader from "./InterviewHeader";
import InterviewQuestionCard from "./InterviewQuestionCard";
import InterviewNavigator from "./InterviewNavigator";
import AIInterviewer from "./AIInterviewer";
import WelcomeInterviewer from "./WelcomeInterviewer";
import ReadyScreen from "./ReadyScreen";
import SpeechRecorder from "../SpeechRecorder";
import AIEvaluation from "../evaluation/AIEvaluation";
import LiveCoachPanel from "./LiveCoachPanel";
import VoiceCoach from "./VoiceCoach";
import VoiceCoachBubble from "./VoiceCoachBubble";
import FeedbackButton from "../feedback/FeedbackButton";
import FeedbackDialog from "../feedback/FeedbackDialog";
export default function InterviewEngine() {
const [feedbackOpen, setFeedbackOpen] = useState(false);
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

      <div
  className="
    mx-auto

    w-full

    max-w-3xl
    lg:max-w-5xl

    px-2
    sm:px-4
    lg:px-0
  "
>

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
      <div
  className="
    mx-auto
    w-full
    max-w-5xl
    px-2
    sm:px-4
    lg:px-0
  "
>
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

      <div
  className="
    mx-auto
    w-full
    max-w-5xl

    rounded-xl
    lg:rounded-2xl

    bg-white

    p-4
    sm:p-6
    lg:p-10

    shadow-md
    lg:shadow-xl
  "
>


        <div
  className="
    mt-6
    lg:mt-8

    rounded-xl

    border
    border-green-300

    bg-green-50

    p-5
    sm:p-8
    lg:p-10

    text-center
  "
>

          <h2
  className="
    text-2xl
    sm:text-3xl
    lg:text-4xl

    font-bold
    text-green-700
  "
>

            🎉 Interview Completed

          </h2>

          <p
  className="
    mt-4
    lg:mt-5

    text-base
    lg:text-lg

    text-gray-700
  "
>

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

    <div
  className="
    mx-auto
    w-full
    max-w-5xl

    rounded-xl
    lg:rounded-2xl

    bg-white

    p-4
    sm:p-6
    lg:p-10

    shadow-md
    lg:shadow-xl
  "
>

      <div
  className="
    space-y-5
    sm:space-y-6
    lg:space-y-8
  "
>

        <InterviewHeader />


<AIInterviewer />

<VoiceCoachBubble />

<LiveCoachPanel />

<VoiceCoach />


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
         <FeedbackButton
        onClick={() => setFeedbackOpen(true)}
      />

      <FeedbackDialog
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />

    </div>

  );

}