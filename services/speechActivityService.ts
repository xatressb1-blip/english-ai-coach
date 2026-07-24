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

let lastSpeechTime = Date.now();

export function detectSpeechActivity(

  transcript: string

): SpeechActivityResult {

  const text = transcript.trim();

  const now = Date.now();

  //------------------------------------------------
  // User is speaking
  //------------------------------------------------

  if (text.length > 0) {

    lastSpeechTime = now;

    return {

      activity: SpeechActivity.SPEAKING,

      silenceDuration: 0,

      message: "Speaking...",

    };

  }

  //------------------------------------------------
  // User paused
  //------------------------------------------------

  const silence = Math.floor(

    (now - lastSpeechTime) / 1000

  );

  if (silence >= 3) {

    return {

      activity: SpeechActivity.PAUSED,

      silenceDuration: silence,

      message:
        "Please continue speaking.",

    };

  }

  //------------------------------------------------
  // Waiting
  //------------------------------------------------

  return {

    activity: SpeechActivity.IDLE,

    silenceDuration: silence,

    message:
      "Waiting for your answer.",

  };

}