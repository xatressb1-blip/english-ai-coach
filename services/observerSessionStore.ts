import type { ObserverKey, ObserverNote } from "@/services/teacherFeedbackService";
import type { ObserverSessionSnapshot, ObserverSubmission } from "@/services/observerSessionTypes";

type SessionMap = Map<string, ObserverSessionSnapshot>;

declare global {
  // eslint-disable-next-line no-var
  var __observerSessionStore: SessionMap | undefined;
}

const sessions: SessionMap = globalThis.__observerSessionStore ?? new Map<string, ObserverSessionSnapshot>();
if (!globalThis.__observerSessionStore) globalThis.__observerSessionStore = sessions;

const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

function nowIso() {
  return new Date().toISOString();
}

function cleanExpired() {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (new Date(session.expiresAt).getTime() <= now) sessions.delete(id);
  }
}

function generateId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    let id = "";
    for (let i = 0; i < 6; i += 1) id += alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!sessions.has(id)) return id;
  }
  return `${Date.now().toString(36).slice(-6)}`.toUpperCase();
}

export function createObserverSession(input: {
  candidateName: string;
  companyName: string;
  jobTitle: string;
}): ObserverSessionSnapshot {
  cleanExpired();
  const id = generateId();
  const createdAt = nowIso();
  const session: ObserverSessionSnapshot = {
    id,
    candidateName: input.candidateName.trim() || "Candidate",
    companyName: input.companyName.trim(),
    jobTitle: input.jobTitle.trim(),
    createdAt,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    submissions: {},
  };
  sessions.set(id, session);
  return structuredClone(session);
}

export function getObserverSession(id: string): ObserverSessionSnapshot | null {
  cleanExpired();
  const session = sessions.get(id.toUpperCase());
  return session ? structuredClone(session) : null;
}

export function submitObserverAssessment(input: {
  sessionId: string;
  role: ObserverKey;
  scores: Array<number | null>;
  note: ObserverNote;
}): ObserverSessionSnapshot | null {
  cleanExpired();
  const id = input.sessionId.toUpperCase();
  const session = sessions.get(id);
  if (!session) return null;

  const normalizedScores = input.scores.slice(0, 5).map((value) =>
    value === 0 || value === 1 || value === 2 ? value : null,
  );
  while (normalizedScores.length < 5) normalizedScores.push(null);

  if (normalizedScores.some((value) => value === null)) {
    throw new Error("All five observer criteria must be scored before submission.");
  }

  const submission: ObserverSubmission = {
    role: input.role,
    scores: normalizedScores,
    note: {
      strength: input.note.strength.trim(),
      improvement: input.note.improvement.trim(),
    },
    submittedAt: nowIso(),
  };

  session.submissions[input.role] = submission;
  sessions.set(id, session);
  return structuredClone(session);
}

export function deleteObserverSession(id: string) {
  return sessions.delete(id.toUpperCase());
}
