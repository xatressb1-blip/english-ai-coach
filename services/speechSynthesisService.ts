const DEFAULT_LANG = "en-US";

const DEFAULT_RATE = 1;

const DEFAULT_PITCH = 1;

const DEFAULT_VOLUME = 1;

/**
 * Speak a text using the browser Speech Synthesis API.
 */
export function speak(
  text: string,
  onEnd?: () => void
): void {

  if (typeof window === "undefined") {
    return;
  }

  if (!text.trim()) {
    return;
  }

  if (!("speechSynthesis" in window)) {
    console.warn("Speech Synthesis is not supported.");
    return;
  }

  // Stop any speech currently playing
  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = DEFAULT_LANG;

  utterance.rate = DEFAULT_RATE;

  utterance.pitch = DEFAULT_PITCH;

  utterance.volume = DEFAULT_VOLUME;

  utterance.onend = () => {

    onEnd?.();

  };

  window.speechSynthesis.speak(
    utterance
  );

}

/**
 * Stop speaking immediately.
 */
export function stopSpeaking(): void {

  if (typeof window === "undefined") {
    return;
  }

  if (!("speechSynthesis" in window)) {
    return;
  }

  window.speechSynthesis.cancel();

}

/**
 * Check browser support.
 */
export function isSpeechSynthesisSupported(): boolean {

  if (typeof window === "undefined") {
    return false;
  }

  return "speechSynthesis" in window;

}