import SpeechManager from "./speechManager";

export function speak(
  text: string,
  onEnd?: () => void
): void {

  if (typeof window === "undefined") return;

  if (!("speechSynthesis" in window)) return;

  SpeechManager.speak(text, onEnd);

}

export function stopSpeaking(): void {

  if (typeof window === "undefined") return;

  SpeechManager.stop();

}

export function isSpeechSynthesisSupported(): boolean {

  if (typeof window === "undefined") {

    return false;

  }

  return "speechSynthesis" in window;

}