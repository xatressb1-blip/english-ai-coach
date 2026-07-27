/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * Speech Recognition Manager
 *
 * File:
 * services/speechRecognitionManager.ts
 *
 * Version:
 * 1.0.0
 *
 * Status:
 * Production Stable
 *
 * Owner:
 * Tech Lead
 *
 * Description:
 * Global manager for the browser Speech Recognition instance.
 * Responsible for:
 * - Registering the active recognition instance
 * - Providing global access
 * - Pausing recognition
 * - Resuming recognition
 * - Releasing resources safely
 * *
 * IMPORTANT
 * This file MUST NEVER create a new SpeechRecognition object.
 * It only manages the existing instance.
 * ============================================================
 */

import type {
  BrowserSpeechRecognition,
} from "./speechRecognitionService";

/**
 * ============================================================
 * Private Global Instance
 * ============================================================
 */

let recognitionInstance:
  BrowserSpeechRecognition | null = null;

/**
 * ============================================================
 * Register Recognition Instance
 * ============================================================
 */

export function registerRecognition(
  recognition: BrowserSpeechRecognition
): void {

  recognitionInstance = recognition;

}

/**
 * ============================================================
 * Unregister Recognition Instance
 * ============================================================
 */

export function unregisterRecognition(): void {

  recognitionInstance = null;

}

/**
 * ============================================================
 * Get Current Recognition Instance
 * ============================================================
 */

export function getRecognition():
  BrowserSpeechRecognition | null {

  return recognitionInstance;

}

/**
 * ============================================================
 * Check Recognition Exists
 * ============================================================
 */

export function hasRecognition(): boolean {

  return recognitionInstance !== null;

}
/**
 * ============================================================
 * Pause Recognition
 * ============================================================
 */

export function pauseRecognition(): void {

  if (!recognitionInstance) {

    return;

  }

  try {

    recognitionInstance.stop();

  } catch (error) {

    console.warn(
      "[SpeechRecognitionManager] Failed to pause recognition.",
      error
    );

  }

}

/**
 * ============================================================
 * Resume Recognition
 * ============================================================
 */

export function resumeRecognition(): void {

  if (!recognitionInstance) {

    return;

  }

  try {

    recognitionInstance.start();

  } catch (error) {

    console.warn(
      "[SpeechRecognitionManager] Failed to resume recognition.",
      error
    );

  }

}

/**
 * ============================================================
 * Destroy Recognition
 * ============================================================
 */

export function destroyRecognition(): void {

  if (!recognitionInstance) {

    return;

  }

  try {

    recognitionInstance.onstart = null;

    recognitionInstance.onresult = null;

    recognitionInstance.onerror = null;

    recognitionInstance.onend = null;

  } catch {

    // Ignore callback cleanup errors

  }

  try {

    recognitionInstance.abort();

  } catch {

    // Ignore abort errors

  }

  try {

    recognitionInstance.stop();

  } catch {

    // Ignore stop errors

  }

  recognitionInstance = null;

}