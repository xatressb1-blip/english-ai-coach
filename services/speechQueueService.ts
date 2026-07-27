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

/* ============================================================
 * Queue Item
 * ============================================================
 */

interface SpeechTask {

  id: number;

  text: string;

  onFinished?: () => void;

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

    }

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
  onFinished?: () => void
): number {

  const task: SpeechTask = {

    id: nextId++,

    text,

    onFinished,

  };

  queue.push(task);

  processQueue();

  return task.id;

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
