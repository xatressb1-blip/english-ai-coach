/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * Voice Coach Service
 *
 * File:
 * services/voiceCoachService.ts
 *
 * Version:
 * 3.0.0
 *
 * Status:
 * Production Stable
 *
 * Description:
 * ------------------------------------------------------------
 * Voice Coach no longer communicates directly with
 * Browser SpeechSynthesis.
 *
 * All voice requests MUST go through Speech Queue.
 * ============================================================
 */

import {
  enqueueSpeech,
} from "./speechQueueService";

/* ============================================================
 * Coach Messages
 * ============================================================
 */

export function coachContinueSpeaking(
  onFinished?: () => void
): void {

  enqueueSpeech(
    "Please continue speaking.",
    onFinished
  );

}

export function coachGoodJob(
  onFinished?: () => void
): void {

  enqueueSpeech(
    "Good job. Keep going.",
    onFinished
  );

}

export function coachExcellent(
  onFinished?: () => void
): void {

  enqueueSpeech(
    "Excellent answer.",
    onFinished
  );

}

export function coachSlowDown(
  onFinished?: () => void
): void {

  enqueueSpeech(
    "Please speak a little more slowly.",
    onFinished
  );

}