export enum SpeechActivity {

  IDLE = "IDLE",

  SPEAKING = "SPEAKING",

  PAUSED = "PAUSED",

  FINISHED = "FINISHED",

}

export interface SpeechActivityResult {

  activity: SpeechActivity;

  silenceDuration: number;

  message: string;

}

/**
 * User has not started speaking yet.
 */
export function idleActivity(): SpeechActivityResult {

  return {

    activity: SpeechActivity.IDLE,

    silenceDuration: 0,

    message: "Waiting for your answer.",

  };

}

/**
 * User is speaking.
 */
export function speakingActivity(): SpeechActivityResult {

  return {

    activity: SpeechActivity.SPEAKING,

    silenceDuration: 0,

    message: "Speaking...",

  };

}

/**
 * User pauses while speaking.
 */
export function pausedActivity(
  seconds: number
): SpeechActivityResult {

  return {

    activity: SpeechActivity.PAUSED,

    silenceDuration: seconds,

    message: "Please continue speaking.",

  };

}

/**
 * Recording has finished.
 */
export function finishedActivity(): SpeechActivityResult {

  return {

    activity: SpeechActivity.FINISHED,

    silenceDuration: 0,

    message: "Recording finished.",

  };

}