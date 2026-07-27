const DEFAULT_LANG = "en-US";

const DEFAULT_RATE = 1;

const DEFAULT_PITCH = 1;

const DEFAULT_VOLUME = 1;

function getEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();

  return (
    voices.find(v => v.lang === "en-US") ||
    voices.find(v => v.lang.startsWith("en")) ||
    null
  );
}

export function speak(
  text: string,
  onEnd?: () => void
): void {

  if (typeof window === "undefined") return;

  if (!("speechSynthesis" in window)) return;

  if (!text.trim()) return;

  const utterance =
    new SpeechSynthesisUtterance(text);

  utterance.lang = DEFAULT_LANG;

  utterance.rate = DEFAULT_RATE;

  utterance.pitch = DEFAULT_PITCH;

  utterance.volume = DEFAULT_VOLUME;

  const voice = getEnglishVoice();

  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    console.log("🔊 AI started speaking");
  };

  utterance.onend = () => {
    console.log("✅ AI finished speaking");
    onEnd?.();
  };

  utterance.onerror = (e) => {
    console.error("Speech Error:", e);
    onEnd?.();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {

  if (typeof window === "undefined") return;

  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
}

export function isSpeechSynthesisSupported(): boolean {

  if (typeof window === "undefined") return false;

  return "speechSynthesis" in window;
}