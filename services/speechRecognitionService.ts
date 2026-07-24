// ======================================================
// File: services/speechRecognitionService.ts
// English AI Coach - Speech Recognition v3.0 (Stable)
// ======================================================

export interface SpeechRecognitionCallbacks {
  onStart: () => void;
  onResult: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export function createSpeechRecognition(
  callbacks: SpeechRecognitionCallbacks
) {
  const SpeechRecognition = (
  window as any
).SpeechRecognition ||
(
  window as any
).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    throw new Error("Speech Recognition is not supported.");
  }

  const recognition = new SpeechRecognition();

  // ----------------------------------
  // Configuration
  // ----------------------------------

  recognition.lang = "en-US";

  recognition.continuous = true;

  recognition.interimResults = true;

  recognition.maxAlternatives = 1;

  // ----------------------------------
  // Events
  // ----------------------------------

  recognition.onstart = () => {
    callbacks.onStart();
  };

  recognition.onresult = (event: any) => {
    let transcript = "";

    for (
      let i = 0;
      i < event.results.length;
      i++
    ) {
      transcript +=
        event.results[i][0].transcript + " ";
    }

    callbacks.onResult(
      transcript.trim()
    );
  };

  recognition.onerror = (
  event: any
) => {
    switch (event.error) {
      case "no-speech":
        callbacks.onError(
          "No speech detected."
        );
        break;

      case "audio-capture":
        callbacks.onError(
          "No microphone found."
        );
        break;

      case "not-allowed":
        callbacks.onError(
          "Microphone permission denied."
        );
        break;

      case "aborted":
        callbacks.onError(
          "Recording aborted."
        );
        break;

      default:
        callbacks.onError(
          event.error
        );
    }
  };

  recognition.onend = () => {
    callbacks.onEnd();
  };

  return recognition;
}