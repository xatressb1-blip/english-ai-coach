type QueueItem = {
  text: string;
  onEnd?: () => void;
};

const ENGLISH_LOCALES = ["en-US", "en-GB", "en-AU", "en-CA", "en-IN", "en"];

function normaliseLanguage(value: string): string {
  return value.trim().toLowerCase();
}

function isEnglishVoice(voice: SpeechSynthesisVoice): boolean {
  return normaliseLanguage(voice.lang).startsWith("en");
}

function getPreferredEnglishVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  const englishVoices = voices.filter(isEnglishVoice);

  if (englishVoices.length === 0) {
    return null;
  }

  const priorityNames = [
    "samantha",
    "ava",
    "siri",
    "google us english",
    "google uk english female",
    "microsoft aria",
    "microsoft jenny",
    "daniel",
    "karen",
  ];

  for (const preferredName of priorityNames) {
    const match = englishVoices.find((voice) =>
      voice.name.toLowerCase().includes(preferredName)
    );

    if (match) {
      return match;
    }
  }

  for (const locale of ENGLISH_LOCALES) {
    const match = englishVoices.find(
      (voice) => normaliseLanguage(voice.lang) === locale.toLowerCase()
    );

    if (match) {
      return match;
    }
  }

  return englishVoices[0];
}

class SpeechManager {
  private queue: QueueItem[] = [];
  private speaking = false;
  private current: SpeechSynthesisUtterance | null = null;
  private cachedVoice: SpeechSynthesisVoice | null = null;
  private voicesReadyPromise: Promise<SpeechSynthesisVoice[]> | null = null;

  speak(text: string, onEnd?: () => void): void {
    if (!text.trim()) {
      return;
    }

    this.queue.push({ text, onEnd });
    void this.playNext();
  }

  private async loadVoices(): Promise<SpeechSynthesisVoice[]> {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return [];
    }

    const availableVoices = window.speechSynthesis.getVoices();

    if (availableVoices.length > 0) {
      return availableVoices;
    }

    if (this.voicesReadyPromise) {
      return this.voicesReadyPromise;
    }

    this.voicesReadyPromise = new Promise((resolve) => {
      let finished = false;

      const finish = () => {
        if (finished) {
          return;
        }

        finished = true;
        window.speechSynthesis.removeEventListener("voiceschanged", finish);
        resolve(window.speechSynthesis.getVoices());
      };

      window.speechSynthesis.addEventListener("voiceschanged", finish);
      window.setTimeout(finish, 1500);
    });

    const voices = await this.voicesReadyPromise;
    this.voicesReadyPromise = null;
    return voices;
  }

  private async getEnglishVoice(): Promise<SpeechSynthesisVoice | null> {
    if (this.cachedVoice && isEnglishVoice(this.cachedVoice)) {
      return this.cachedVoice;
    }

    const voices = await this.loadVoices();
    this.cachedVoice = getPreferredEnglishVoice(voices);
    return this.cachedVoice;
  }

  private async playNext(): Promise<void> {
    if (this.speaking || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();

    if (!item || typeof window === "undefined") {
      return;
    }

    this.speaking = true;

    const utterance = new SpeechSynthesisUtterance(item.text);
    const englishVoice = await this.getEnglishVoice();

    utterance.lang = englishVoice?.lang || "en-US";
    utterance.voice = englishVoice;
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    this.current = utterance;

    utterance.onstart = () => {
      console.log(
        "[SpeechManager] English voice:",
        englishVoice?.name || "browser fallback",
        utterance.lang
      );
    };

    utterance.onend = () => {
      this.current = null;
      this.speaking = false;
      item.onEnd?.();
      void this.playNext();
    };

    utterance.onerror = (event) => {
      console.error("[SpeechManager] Speech error:", event.error);
      this.current = null;
      this.speaking = false;
      void this.playNext();
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
