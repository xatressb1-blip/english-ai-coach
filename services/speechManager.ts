export type SpeechVoiceGender = "female" | "male";

export interface SpeechVoiceOptions {
  lang?: string;
  voicePattern?: RegExp;
  gender?: SpeechVoiceGender;
  rate?: number;
  pitch?: number;
  volume?: number;
  label?: string;
}

type QueueItem = {
  text: string;
  onEnd?: () => void;
  voiceOptions?: SpeechVoiceOptions;
};

const FEMALE_VOICE_HINTS = [
  "samantha",
  "zira",
  "aria",
  "jenny",
  "ava",
  "karen",
  "natasha",
  "catherine",
  "hazel",
  "serena",
  "susan",
  "google us english female",
  "google uk english female",
];

const MALE_VOICE_HINTS = [
  "daniel",
  "david",
  "mark",
  "george",
  "ryan",
  "oliver",
  "arthur",
  "guy",
  "google uk english male",
  "google us english male",
];

function normaliseLanguage(value: string): string {
  return value.trim().toLowerCase();
}

function isEnglishVoice(voice: SpeechSynthesisVoice): boolean {
  return normaliseLanguage(voice.lang).startsWith("en");
}

function matchesPattern(voice: SpeechSynthesisVoice, pattern?: RegExp): boolean {
  if (!pattern) return false;
  const safePattern = new RegExp(pattern.source, pattern.flags.replace("g", "").replace("y", ""));
  return safePattern.test(voice.name);
}

function findByGenderHint(
  voices: SpeechSynthesisVoice[],
  gender?: SpeechVoiceGender
): SpeechSynthesisVoice | null {
  if (!gender) return null;
  const hints = gender === "male" ? MALE_VOICE_HINTS : FEMALE_VOICE_HINTS;
  for (const hint of hints) {
    const match = voices.find((voice) => voice.name.toLowerCase().includes(hint));
    if (match) return match;
  }
  return null;
}

function selectEnglishVoice(
  voices: SpeechSynthesisVoice[],
  options?: SpeechVoiceOptions
): SpeechSynthesisVoice | null {
  const englishVoices = voices.filter(isEnglishVoice);
  if (englishVoices.length === 0) return null;

  const requestedLang = normaliseLanguage(options?.lang || "en-US");
  const exactLocale = englishVoices.filter(
    (voice) => normaliseLanguage(voice.lang) === requestedLang
  );

  const exactPatternLocale = exactLocale.find((voice) =>
    matchesPattern(voice, options?.voicePattern)
  );
  if (exactPatternLocale) return exactPatternLocale;

  const patternEnglish = englishVoices.find((voice) =>
    matchesPattern(voice, options?.voicePattern)
  );
  if (patternEnglish) return patternEnglish;

  const genderLocale = findByGenderHint(exactLocale, options?.gender);
  if (genderLocale) return genderLocale;

  const genderEnglish = findByGenderHint(englishVoices, options?.gender);
  if (genderEnglish) return genderEnglish;

  if (exactLocale.length > 0) return exactLocale[0];
  return englishVoices[0];
}

class SpeechManager {
  private queue: QueueItem[] = [];
  private speaking = false;
  private current: SpeechSynthesisUtterance | null = null;
  private voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null;

  speak(
    text: string,
    onEnd?: () => void,
    voiceOptions?: SpeechVoiceOptions
  ): void {
    if (!text.trim()) return;
    this.queue.push({ text, onEnd, voiceOptions });
    void this.playNext();
  }

  private async loadVoices(): Promise<SpeechSynthesisVoice[]> {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return [];
    }

    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) return availableVoices;
    if (this.voicesReadyPromise) return this.voicesReadyPromise;

    this.voicesReadyPromise = new Promise((resolve) => {
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        window.speechSynthesis.removeEventListener("voiceschanged", finish);
        resolve(window.speechSynthesis.getVoices());
      };

      window.speechSynthesis.addEventListener("voiceschanged", finish);
      window.setTimeout(finish, 1800);
    });

    const voices = await this.voicesReadyPromise;
    this.voicesReadyPromise = null;
    return voices;
  }

  private async playNext(): Promise<void> {
    if (this.speaking || this.queue.length === 0) return;

    const item = this.queue.shift();
    if (!item || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    this.speaking = true;

    const utterance = new SpeechSynthesisUtterance(item.text);
    const voices = await this.loadVoices();
    const englishVoice = selectEnglishVoice(voices, item.voiceOptions);
    const requestedLang = item.voiceOptions?.lang || englishVoice?.lang || "en-US";

    utterance.lang = requestedLang;
    if (englishVoice) utterance.voice = englishVoice;
    utterance.rate = item.voiceOptions?.rate ?? 0.92;
    utterance.pitch = item.voiceOptions?.pitch ?? 1;
    utterance.volume = item.voiceOptions?.volume ?? 1;

    this.current = utterance;

    utterance.onstart = () => {
      console.log(
        "[SpeechManager] Voice:",
        item.voiceOptions?.label || "default",
        "→",
        englishVoice?.name || "browser fallback",
        englishVoice?.lang || requestedLang
      );
    };

    const finishItem = () => {
      this.current = null;
      this.speaking = false;
      item.onEnd?.();
      void this.playNext();
    };

    utterance.onend = finishItem;

    utterance.onerror = (event) => {
      console.error("[SpeechManager] Speech error:", event.error);
      finishItem();
    };

    window.speechSynthesis.cancel();
    window.setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 80);
  }

  stop(): void {
    this.queue = [];
    this.speaking = false;
    this.current = null;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  clearQueue(): void {
    this.queue = [];
  }

  isSpeaking(): boolean {
    return this.speaking;
  }
}

export default new SpeechManager();
