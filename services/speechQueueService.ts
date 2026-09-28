/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * Speech Queue Service
 *
 * File:
 * services/speechQueueService.ts
 *
 * Version:
 * 1.0.0
 *
 * Status:
 * Production Stable
 *
 * Description:
 * ------------------------------------------------------------
 * Global queue for SpeechSynthesis.
 *
 * Guarantees:
 *
 * • Only ONE utterance speaks at a time.
 * • AI Interviewer and Voice Coach never overlap.
 * • No component calls speechSynthesis directly.
 *
 * ============================================================
 */

import {
  speak,
  stopSpeaking,
} from "./speechSynthesisService";
import type { RecruiterProfile } from "@/data/recruiters";
import type { SpeechVoiceOptions } from "./speechManager";

/* ============================================================
 * Queue Item
 * ============================================================
 */

interface SpeechTask {

  id: number;

  text: string;

  onFinished?: () => void;

  voiceOptions?: SpeechVoiceOptions;

}

/* ============================================================
 * Queue
 * ============================================================
 */

const queue: SpeechTask[] = [];

let speaking = false;

let nextId = 1;

/* ============================================================
 * Process Queue
 * ============================================================
 */

function processQueue(): void {

  if (speaking) {

    return;

  }

  const task = queue.shift();

  if (!task) {

    return;

  }

  speaking = true;

  console.log(
    "[SpeechQueue] ▶",
    task.text
  );

  speak(

    task.text,

    () => {

      console.log(
        "[SpeechQueue] ✓ Finished"
      );

      speaking = false;

      task.onFinished?.();

      processQueue();

    },

    task.voiceOptions

  );

}
/* ============================================================
 * Public API
 * ============================================================
 */

/**
 * Add a speech task to the queue.
 */
export function enqueueSpeech(
  text: string,
  onFinished?: () => void,
  voiceOptions?: SpeechVoiceOptions
): number {

  const task: SpeechTask = {

    id: nextId++,

    text,

    onFinished,

    voiceOptions,

  };

  queue.push(task);

  processQueue();

  return task.id;

}


/**
 * Speak with the currently selected recruiter voice.
 * The task carries its own voice profile so changing recruiter cannot reuse
 * a previously cached male/female voice.
 */
export function enqueueRecruiterSpeech(
  text: string,
  recruiter: RecruiterProfile,
  onFinished?: () => void
): number {
  return enqueueSpeech(text, onFinished, {
    lang: recruiter.voiceLang,
    voicePattern: recruiter.voicePattern,
    gender: recruiter.voiceGender,
    rate: recruiter.rate,
    pitch: recruiter.pitch,
    volume: 1,
    label: `${recruiter.name} (${recruiter.accent})`,
  });
}

/**
 * Stop current speech and clear pending queue.
 */
export function clearSpeechQueue(): void {

  queue.length = 0;

  speaking = false;

  stopSpeaking();

}

/**
 * Check whether queue is speaking.
 */
export function isQueueSpeaking(): boolean {

  return speaking;

}

/**
 * Get pending queue length.
 */
export function getQueueLength(): number {

  return queue.length;

}
