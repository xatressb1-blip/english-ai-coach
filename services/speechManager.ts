type QueueItem = {
  text: string;
  onEnd?: () => void;
};

class SpeechManager {

  private queue: QueueItem[] = [];

  private speaking = false;

  private current: SpeechSynthesisUtterance | null = null;

  speak(text: string, onEnd?: () => void) {

    if (!text.trim()) return;

    this.queue.push({
      text,
      onEnd,
    });

    this.playNext();

  }

  private playNext() {

    if (this.speaking) return;

    if (this.queue.length === 0) return;

    const item = this.queue.shift();

    if (!item) return;

    this.speaking = true;

    const utterance =
      new SpeechSynthesisUtterance(item.text);

    utterance.lang = "en-US";

    utterance.rate = 1;

    utterance.pitch = 1;

    utterance.volume = 1;

    this.current = utterance;

    utterance.onstart = () => {

      console.log("🔊", item.text);

    };

    utterance.onend = () => {

      this.current = null;

      this.speaking = false;

      item.onEnd?.();

      this.playNext();

    };

    utterance.onerror = () => {

      this.current = null;

      this.speaking = false;

      this.playNext();

    };

    window.speechSynthesis.speak(utterance);

  }

  stop() {

    this.queue = [];

    this.speaking = false;

    this.current = null;

    window.speechSynthesis.cancel();

  }

  clearQueue() {

    this.queue = [];

  }

  isSpeaking() {

    return this.speaking;

  }

}

export default new SpeechManager();