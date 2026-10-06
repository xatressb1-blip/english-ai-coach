import "server-only";

import { randomBytes, timingSafeEqual } from "node:crypto";
import type {
  ClassroomCandidateResult,
  ClassroomCloudSession,
  ClassroomSyncPayload,
} from "@/types/classroomResults";
import { buildClassroomResultRecord, normalizeSessionCode } from "@/services/classroomResultUtils";

function getConfig() {
  const url = process.env.SUPABASE_URL?.trim().replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    throw new Error("Supabase classroom storage is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.");
  }
  return { url, key };
}

async function supabaseRest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { url, key } = getConfig();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Content-Type", "application/json");
  if (key.startsWith("eyJ")) headers.set("Authorization", `Bearer ${key}`);

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) {
    let message = text || `Supabase request failed (${response.status}).`;
    try {
      const parsed = JSON.parse(text) as { message?: string; details?: string };
      message = parsed.message || parsed.details || message;
    } catch {
      // Keep the raw response when it is not JSON.
    }
    throw new Error(message);
  }

  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export function verifyTeacherPin(value: string | null | undefined) {
  const expected = process.env.TEACHER_DASHBOARD_PIN?.trim();
  if (!expected) return false;
  const supplied = String(value ?? "").trim();
  const left = Buffer.from(expected);
  const right = Buffer.from(supplied);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

function generateSessionCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  let code = "HG-";
  for (let index = 0; index < 6; index += 1) code += alphabet[bytes[index] % alphabet.length];
  return code;
}

export async function createCloudSession(input: {
  sessionName?: string;
  expectedCandidates?: number;
  requestedCode?: string;
}) {
  const requested = normalizeSessionCode(input.requestedCode ?? "");
  const sessionCode = requested || generateSessionCode();
  const expectedCandidates = Math.max(1, Math.min(12, Math.round(input.expectedCandidates ?? 4)));
  const rows = await supabaseRest<ClassroomCloudSession[]>("interview_sessions", {
    method: "POST",
    headers: { Prefer: "return=representation" },
    body: JSON.stringify({
      session_code: sessionCode,
      session_name: String(input.sessionName || "Job Interview Teaching Demo").trim().slice(0, 120),
      expected_candidates: expectedCandidates,
      status: "open",
    }),
  });
  if (!rows?.[0]) throw new Error("Supabase did not return the created classroom session.");
  return rows[0];
}

export async function getCloudSessionByCode(code: string) {
  const normalized = normalizeSessionCode(code);
  if (!normalized) return null;
  const rows = await supabaseRest<ClassroomCloudSession[]>(
    `interview_sessions?session_code=eq.${encodeURIComponent(normalized)}&select=id,session_code,session_name,expected_candidates,status,created_at,completed_at&limit=1`,
  );
  return rows?.[0] ?? null;
}

export async function listSessionResults(sessionId: string) {
  return supabaseRest<ClassroomCandidateResult[]>(
    `candidate_results?session_id=eq.${encodeURIComponent(sessionId)}&select=*&order=completed_at.asc`,
  );
}

export async function upsertCandidateResult(payload: ClassroomSyncPayload) {
  const session = await getCloudSessionByCode(payload.sessionCode);
  if (!session) throw new Error("Class session was not found. Check the session code on the student computer.");
  if (session.status !== "open") throw new Error("This class session is no longer open for interview results.");

  const existingResults = await listSessionResults(session.id);
  const alreadyExists = existingResults.some((item) => item.candidate_key === payload.candidateKey);
  if (!alreadyExists && existingResults.length >= session.expected_candidates) {
    throw new Error(`This class session already has ${session.expected_candidates} candidate results.`);
  }

  const record = buildClassroomResultRecord({
    sessionId: session.id,
    candidateKey: payload.candidateKey,
    candidateName: payload.candidateName,
    companyName: payload.companyName,
    jobTitle: payload.jobTitle,
    recruiterName: payload.recruiterName,
    report: payload.report,
    attempts: payload.attempts,
  });

  const rows = await supabaseRest<ClassroomCandidateResult[]>(
    "candidate_results?on_conflict=session_id,candidate_key",
    {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=representation" },
      body: JSON.stringify(record),
    },
  );
  if (!rows?.[0]) throw new Error("Supabase did not return the synchronized candidate result.");
  return { session, result: rows[0] };
}

export async function completeCloudSession(code: string) {
  const session = await getCloudSessionByCode(code);
  if (!session) throw new Error("Class session was not found.");
  const rows = await supabaseRest<ClassroomCloudSession[]>(
    `interview_sessions?id=eq.${encodeURIComponent(session.id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "completed", completed_at: new Date().toISOString() }),
    },
  );
  return rows?.[0] ?? session;
}


export async function closeCloudSession(code: string) {
  const session = await getCloudSessionByCode(code);
  if (!session) throw new Error("Class session was not found.");
  const rows = await supabaseRest<ClassroomCloudSession[]>(
    `interview_sessions?id=eq.${encodeURIComponent(session.id)}`,
    {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status: "closed", completed_at: new Date().toISOString() }),
    },
  );
  return rows?.[0] ?? { ...session, status: "closed" as const, completed_at: new Date().toISOString() };
}
