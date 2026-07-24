export interface LiveCoachResult {

  message: string;

  level: "success" | "warning" | "error";

}

export function analyzeLiveTranscript(

  transcript: string

): LiveCoachResult {

  const text = transcript.trim();

  if (text.length === 0) {

    return {

      message: "🎤 Start speaking when you are ready.",

      level: "success",

    };

  }

  const words = text
    .split(/\s+/)
    .filter(Boolean);

  //------------------------------------------------

  // Too Short

  //------------------------------------------------

  if (words.length < 8) {

    return {

      message:
        "Continue speaking. Try to answer in 3–5 complete sentences.",

      level: "warning",

    };

  }

  //------------------------------------------------

  // Too Long

  //------------------------------------------------

  if (words.length > 120) {

    return {

      message:
        "Your answer is becoming too long. Try to conclude.",

      level: "warning",

    };

  }

  //------------------------------------------------

  // Repeated words

  //------------------------------------------------

  let repeated = 0;

  for (let i = 1; i < words.length; i++) {

    if (

      words[i].toLowerCase() ===

      words[i - 1].toLowerCase()

    ) {

      repeated++;

    }

  }

  if (repeated >= 3) {

    return {

      message:
        "Avoid repeating the same words.",

      level: "error",

    };

  }

  //------------------------------------------------

  // Good

  //------------------------------------------------

  return {

    message:
      "👍 Good. Keep speaking naturally.",

    level: "success",

  };

}