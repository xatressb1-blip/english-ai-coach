"use client";

import type {
  ClassroomLocalSyncRecord,
  ClassroomSyncPayload,
} from "@/types/classroomResults";
import { normalizeSessionCode } from "@/services/classroomResultUtils";

const SYNC_STORAGE_KEY = "english-ai-classroom-sync-v1";
const SESSION_STORAGE_KEY = "english-ai-class-session-code";
const DEVICE_COMPLETION_PREFIX = "english-ai-classroom-device-completions-v1:";

function readRecords(): ClassroomLocalSyncRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SYNC_STORAGE_KEY) ?? "[]") as ClassroomLocalSyncRecord[];
  } catch {
    return [];
  }
}

function writeRecords(records: ClassroomLocalSyncRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SYNC_STORAGE_KEY, JSON.stringify(records.slice(0, 20)));
}

function deviceCompletionKey(sessionCode: string) {
  return `${DEVICE_COMPLETION_PREFIX}${normalizeSessionCode(sessionCode)}`;
}

export function getStoredClassSessionCode() {
  if (typeof window === "undefined") return "";
  return normalizeSessionCode(localStorage.getItem(SESSION_STORAGE_KEY) ?? "");
}

export function storeClassSessionCode(code: string) {
  if (typeof window === "undefined") return;
  const normalized = normalizeSessionCode(code);
  if (normalized) localStorage.setItem(SESSION_STORAGE_KEY, normalized);
  else localStorage.removeItem(SESSION_STORAGE_KEY);
}

export function savePendingClassroomSync(payload: ClassroomSyncPayload): ClassroomLocalSyncRecord {
  const record: ClassroomLocalSyncRecord = {
    sessionCode: normalizeSessionCode(payload.sessionCode),
    candidateKey: payload.candidateKey,
    candidateName: payload.candidateName,
    status: "pending",
    lastAttemptAt: new Date().toISOString(),
    payload: { ...payload, sessionCode: normalizeSessionCode(payload.sessionCode) },
  };
  const current = readRecords();
  const index = current.findIndex(
    (item) => item.sessionCode === record.sessionCode && item.candidateKey === record.candidateKey,
  );
  if (index === -1) current.unshift(record);
  else current[index] = record;
  writeRecords(current);
  return record;
}

export function getClassroomSyncRecord(sessionCode: string, candidateKey: string) {
  const code = normalizeSessionCode(sessionCode);
  return readRecords().find((item) => item.sessionCode === code && item.candidateKey === candidateKey) ?? null;
}

function updateRecord(next: ClassroomLocalSyncRecord) {
  const current = readRecords();
  const index = current.findIndex(
    (item) => item.sessionCode === next.sessionCode && item.candidateKey === next.candidateKey,
  );
  if (index === -1) current.unshift(next);
  else current[index] = next;
  writeRecords(current);
}

export function getDeviceCompletedCandidateKeys(sessionCode: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(deviceCompletionKey(sessionCode)) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function markDeviceCandidateCompleted(sessionCode: string, candidateKey: string): number {
  if (typeof window === "undefined") return 0;
  const current = getDeviceCompletedCandidateKeys(sessionCode);
  if (!current.includes(candidateKey)) current.push(candidateKey);
  localStorage.setItem(deviceCompletionKey(sessionCode), JSON.stringify(current.slice(-12)));
  return current.length;
}

export async function syncClassroomResult(payload: ClassroomSyncPayload): Promise<ClassroomLocalSyncRecord> {
  const pending = savePendingClassroomSync(payload);
  try {
    const response = await fetch("/api/class-results/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pending.payload),
    });
    const data = await response.json() as { ok?: boolean; error?: string };
    if (!response.ok || !data.ok) throw new Error(data.error || "Could not sync the result to the teacher dashboard.");

    const synced: ClassroomLocalSyncRecord = {
      ...pending,
      status: "synced",
      lastAttemptAt: new Date().toISOString(),
      lastSuccessAt: new Date().toISOString(),
      error: undefined,
    };
    updateRecord(synced);
    return synced;
  } catch (error) {
    const failed: ClassroomLocalSyncRecord = {
      ...pending,
      status: "error",
      lastAttemptAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Class result sync failed.",
    };
    updateRecord(failed);
    return failed;
  }
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

/**
 * Fix 43.3.1: keep cloud synchronization off the classroom critical path.
 * The candidate may switch roles as soon as the local result is safe. This
 * helper keeps retrying in the background even if the closing screen unmounts.
 */
export async function syncClassroomResultWithRetry(
  payload: ClassroomSyncPayload,
  maxAttempts = 4,
  retryDelayMs = 2500,
): Promise<ClassroomLocalSyncRecord> {
  let last = await syncClassroomResult(payload);
  for (let attempt = 1; attempt < maxAttempts && last.status !== "synced"; attempt += 1) {
    await wait(retryDelayMs);
    last = await syncClassroomResult(payload);
  }
  return last;
}

export async function retryClassroomSync(sessionCode: string, candidateKey: string) {
  const record = getClassroomSyncRecord(sessionCode, candidateKey);
  if (!record) throw new Error("No locally saved classroom result is available to retry.");
  return syncClassroomResult(record.payload);
}
