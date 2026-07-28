// ======================================================
// File: services/speechDebugService.ts
// English AI Coach
// Speech Engine v2
// Debug Service
// ======================================================

export interface SpeechDebugLog {

  id: number;

  time: string;

  event: string;

  detail?: string;

  level: "info" | "warning" | "error";

}

let logs: SpeechDebugLog[] = [];

let nextId = 1;

/**
 * Format current time
 */
function getCurrentTime(): string {

  return new Date().toLocaleTimeString();

}

/**
 * Add new debug log
 */
export function addSpeechLog(

  event: string,

  detail?: string,

  level: "info" | "warning" | "error" = "info"

): void {

  const log: SpeechDebugLog = {

    id: nextId++,

    time: getCurrentTime(),

    event,

    detail,

    level,

  };

  logs.push(log);

  console.log(

    `[Speech][${level.toUpperCase()}]`,

    event,

    detail ?? ""

  );

}
/**
 * Get all speech logs
 */
export function getSpeechLogs(): SpeechDebugLog[] {

  return [...logs];

}

/**
 * Get latest speech log
 */
export function getLatestSpeechLog():

  SpeechDebugLog | undefined {

  if (logs.length === 0) {

    return undefined;

  }

  return logs[logs.length - 1];

}

/**
 * Get total log count
 */
export function getSpeechLogCount(): number {

  return logs.length;

}

/**
 * Clear all logs
 */
export function clearSpeechLogs(): void {

  logs = [];

  nextId = 1;

  console.log(

    "[Speech] Debug logs cleared."

  );

}

/**
 * Check if any error exists
 */
export function hasSpeechErrors(): boolean {

  return logs.some(

    log => log.level === "error"

  );

}
/**
 * Add Info Log
 */
export function addSpeechInfo(

  event: string,

  detail?: string

): void {

  addSpeechLog(

    event,

    detail,

    "info"

  );

}

/**
 * Add Warning Log
 */
export function addSpeechWarning(

  event: string,

  detail?: string

): void {

  addSpeechLog(

    event,

    detail,

    "warning"

  );

}

/**
 * Add Error Log
 */
export function addSpeechError(

  event: string,

  detail?: string

): void {

  addSpeechLog(

    event,

    detail,

    "error"

  );

}

/**
 * Export Logs
 * Useful for debugging mobile devices
 */
export function exportSpeechLogs(): string {

  if (logs.length === 0) {

    return "No speech logs available.";

  }

  return logs

    .map(

      log =>

        `[${log.time}] ` +

        `[${log.level.toUpperCase()}] ` +

        `${log.event}` +

        (log.detail

          ? ` : ${log.detail}`

          : "")

    )

    .join("\n");

}

/**
 * Initialize Debug Engine
 */
export function initializeSpeechDebug(): void {

  clearSpeechLogs();

  addSpeechInfo(

    "Speech Debug Initialized"

  );

}