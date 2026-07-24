export enum InterviewState {

  IDLE = "IDLE",

  READY = "READY",

  ASKING = "ASKING",

  LISTENING = "LISTENING",

  EVALUATING = "EVALUATING",

  READY_NEXT = "READY_NEXT",

  FINISHED = "FINISHED",

}

export interface InterviewFlow {
  state: InterviewState;

  message: string;
}

export function getInitialFlow(): InterviewFlow {
  return {
    state: InterviewState.READY,
    message: "Press READY when you are prepared.",
  };
}
export function readyInterview(): InterviewFlow {

  return {

    state: InterviewState.READY,

    message: "Press READY when you are prepared.",

  };

}
export function startInterview(): InterviewFlow {
  return {
    state: InterviewState.ASKING,
    message: "🤖 AI Interviewer is asking the question...",
  };
}

export function startListening(): InterviewFlow {
  return {
    state: InterviewState.LISTENING,
    message: "🎤 Listening... Please answer naturally.",
  };
}

export function startEvaluation(): InterviewFlow {
  return {
    state: InterviewState.EVALUATING,
    message: "🤖 AI is evaluating your answer...",
  };
}

export function readyNextQuestion(): InterviewFlow {
  return {
    state: InterviewState.READY_NEXT,
    message: "✅ Evaluation completed. Click Next to continue.",
  };
}

export function finishInterviewFlow(): InterviewFlow {
  return {
    state: InterviewState.FINISHED,
    message: "🎉 Interview completed successfully.",
  };
}