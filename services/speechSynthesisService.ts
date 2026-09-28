import SpeechManager, { SpeechVoiceOptions } from "./speechManager";

export function speak(
  text: string,
  onEnd?: () => void,
  voiceOptions?: SpeechVoiceOptions
): void {
  if (typeof window === "undefined") return;
  if (!("speechSynthesis" in window)) return;
  SpeechManager.speak(text, onEnd, voiceOptions);
}

export function stopSpeaking(): void {
  if (typeof window === "undefined") return;
  SpeechManager.stop();
}

export function isSpeechSynthesisSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "speechSynthesis" in window;
}
