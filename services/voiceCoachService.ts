// ======================================================
// File: services/voiceCoachService.ts
// English AI Coach
// AI Recruiter Voice Coach
// Version 1.0
// ======================================================

export interface VoiceCoachMessage {

  id: number;

  text: string;

  category:
    | "welcome"
    | "before"
    | "during"
    | "after"
    | "warning";

}
/**
 * Pick one random message
 */
function randomMessage(
  messages: VoiceCoachMessage[]
): VoiceCoachMessage {

  if (messages.length === 1) {
    return messages[0];
  }

  let candidate: VoiceCoachMessage;

  do {

    const index = Math.floor(
      Math.random() * messages.length
    );

    candidate = messages[index];

  } while (
    candidate.id === lastMessageId
  );

  lastMessageId = candidate.id;

  return candidate;

}
let lastMessageId = -1;
// ======================================================
// Recruiter Decision Levels
// ======================================================

export enum RecruiterDecision {

  SILENT = "SILENT",

  ENCOURAGE = "ENCOURAGE",

  CONTINUE = "CONTINUE",

  EXAMPLE = "EXAMPLE",

  WAITING = "WAITING",

}
const welcomeMessages: VoiceCoachMessage[] = [

  {
    id: 1,
    category: "welcome",
    text:
      "Welcome. I will be your interviewer today.",
  },

  {
    id: 2,
    category: "welcome",
    text:
      "Relax and answer naturally.",
  },

  {
    id: 3,
    category: "welcome",
    text:
      "There are no perfect answers.",
  },

];

const beforeAnswerMessages: VoiceCoachMessage[] = [

  {
    id: 101,
    category: "before",
    text:
      "Take a deep breath before answering.",
  },

  {
    id: 102,
    category: "before",
    text:
      "Use complete sentences.",
  },

  {
    id: 103,
    category: "before",
    text:
      "Give one real example if possible.",
  },

];

const duringAnswerMessages: VoiceCoachMessage[] = [

  {
    id: 201,
    category: "during",
    text:
      "Keep speaking naturally.",
  },

  {
    id: 202,
    category: "during",
    text:
      "Maintain a steady pace.",
  },

  {
    id: 203,
    category: "during",
    text:
      "Don't worry about small mistakes.",
  },

];
// ======================================================
// Public APIs
// VoiceCoach v1.0
// ======================================================

/**
 * Welcome message
 */
export function coachWelcome(): string {

  return randomMessage(
    welcomeMessages
  ).text;

}

/**
 * Before answering
 */
export function coachBeforeAnswer(): string {

  return randomMessage(
    beforeAnswerMessages
  ).text;

}

/**
 * Continue speaking
 * Temporary implementation
 */
export function coachContinueSpeaking(

  onFinished?: () => void

): void {

  const message =
  randomMessage(
    duringAnswerMessages
  );

console.log(
  "[Voice Coach]",
  message.text
);

  setTimeout(() => {

    onFinished?.();

  }, 1200);

}
// ======================================================
// Decision Engine v1.0
// ======================================================
// ======================================================
// Recruiter Messages
// ======================================================

export function coachEncourage(): string {

  return "Take your time.";

}

export function coachContinue(): string {

  return "Good. Continue speaking.";

}

export function coachExample(): string {

  return "Can you give one example?";

}

export function coachWaiting(): string {

  return "I'm still listening.";

}
export function decideRecruiterAction(

  pauseSeconds: number

): RecruiterDecision {

  if (pauseSeconds < 3) {

    return RecruiterDecision.SILENT;

  }

  if (pauseSeconds < 6) {

    return RecruiterDecision.ENCOURAGE;

  }

  if (pauseSeconds < 9) {

    return RecruiterDecision.CONTINUE;

  }

  if (pauseSeconds < 13) {

    return RecruiterDecision.EXAMPLE;

  }

  return RecruiterDecision.WAITING;

}