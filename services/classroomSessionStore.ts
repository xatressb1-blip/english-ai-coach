import type {
  ClassroomObservation,
  ClassroomObservationRole,
  ClassroomSessionPhase,
  ClassroomSessionSnapshot,
  RubricScores,
} from "@/services/classroomSessionTypes";
import { CLASSROOM_FIXED_STUDENTS, getClassroomObserverRole } from "@/services/classroomSessionTypes";

type SessionMap = Map<string, ClassroomSessionSnapshot>;

declare global {
  // eslint-disable-next-line no-var
  var __classroomSessionStore: SessionMap | undefined;
}

const sessions: SessionMap = globalThis.__classroomSessionStore ?? new Map<string, ClassroomSessionSnapshot>();
if (!globalThis.__classroomSessionStore) globalThis.__classroomSessionStore = sessions;

const SESSION_TTL_MS = 2 * 60 * 60 * 1000;

function nowIso() {
  return new Date().toISOString();
}

function clone(session: ClassroomSessionSnapshot) {
  return structuredClone(session);
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
    for (let index = 0; index < 6; index += 1) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    if (!sessions.has(id)) return id;
  }
  return Date.now().toString(36).slice(-6).toUpperCase();
}

function normalizeNames(_values: unknown[]): string[] {
  // Fix 42.1 presentation class: identities are intentionally fixed so the
  // candidate and the three observer stations cannot be mixed up on event day.
  return [...CLASSROOM_FIXED_STUDENTS];
}

function normalizeAssignments(values: unknown[]): number[] {
  const defaults = [1, 2, 3];
  return defaults.map((fallback, index) => {
    const value = Number(values[index]);
    return value >= 1 && value <= 3 ? Math.round(value) : fallback;
  });
}

function normalizeScores(values: unknown[]): RubricScores {
  const normalized = values.slice(0, 5).map((value) =>
    value === 0 || value === 1 || value === 2 ? value : null,
  ) as RubricScores;
  while (normalized.length < 5) normalized.push(null);
  return normalized;
}

function totalScore(scores: RubricScores) {
  if (scores.length < 5 || scores.some((value) => value === null)) return null;
  return scores.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}

export function createClassroomSession(input: {
  studentNames: unknown[];
  companyName: string;
  jobTitle: string;
  recruiterName: string;
  questionAssignments: unknown[];
}): ClassroomSessionSnapshot {
  cleanExpired();
  const id = generateId();
  const createdAt = nowIso();
  const session: ClassroomSessionSnapshot = {
    id,
    studentNames: normalizeNames(input.studentNames),
    companyName: input.companyName.trim(),
    jobTitle: input.jobTitle.trim(),
    recruiterName: input.recruiterName.trim(),
    questionAssignments: normalizeAssignments(input.questionAssignments),
    currentRound: 0,
    phase: "ready",
    joinedStudents: [],
    observations: [],
    createdAt,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };
  sessions.set(id, session);
  return clone(session);
}

export function getClassroomSession(id: string): ClassroomSessionSnapshot | null {
  cleanExpired();
  const session = sessions.get(id.trim().toUpperCase());
  return session ? clone(session) : null;
}

export function joinClassroomSession(input: {
  sessionId: string;
  studentIndex: number;
}): ClassroomSessionSnapshot | null {
  cleanExpired();
  const id = input.sessionId.trim().toUpperCase();
  const session = sessions.get(id);
  if (!session) return null;
  if (input.studentIndex < 0 || input.studentIndex >= session.studentNames.length) {
    throw new Error("Invalid observer identity.");
  }
  if (!session.joinedStudents.includes(input.studentIndex)) {
    session.joinedStudents.push(input.studentIndex);
    session.joinedStudents.sort((a, b) => a - b);
  }
  sessions.set(id, session);
  return clone(session);
}

export function updateClassroomRound(input: {
  sessionId: string;
  currentRound: number;
  phase: ClassroomSessionPhase;
}): ClassroomSessionSnapshot | null {
  cleanExpired();
  const id = input.sessionId.trim().toUpperCase();
  const session = sessions.get(id);
  if (!session) return null;

  const safeRound = Math.max(0, Math.min(session.questionAssignments.length - 1, Math.round(input.currentRound)));
  session.currentRound = safeRound;
  session.phase = input.phase;
  sessions.set(id, session);
  return clone(session);
}

export function submitClassroomObservation(input: {
  sessionId: string;
  candidateIndex: number;
  observerIndex: number;
  role: ClassroomObservationRole;
  scores: unknown[];
  strength?: string;
  improvement?: string;
}): ClassroomSessionSnapshot | null {
  cleanExpired();
  const id = input.sessionId.trim().toUpperCase();
  const session = sessions.get(id);
  if (!session) return null;

  const candidateIndex = Math.round(input.candidateIndex);
  const observerIndex = Math.round(input.observerIndex);
  const expectedRole = getClassroomObserverRole(observerIndex, candidateIndex, session.studentNames.length);
  if (!expectedRole || expectedRole !== input.role) {
    throw new Error("Observer role does not match the fixed classroom assignment.");
  }

  const scores = normalizeScores(input.scores);
  const observation: ClassroomObservation = {
    candidateIndex: 0,
    observerIndex,
    role: input.role,
    scores,
    totalScore: totalScore(scores),
    strength: String(input.strength ?? "").trim().slice(0, 240),
    improvement: String(input.improvement ?? "").trim().slice(0, 240),
    submittedAt: nowIso(),
  };

  const existingIndex = session.observations.findIndex((item) => item.observerIndex === observerIndex);
  if (existingIndex === -1) session.observations.push(observation);
  else session.observations[existingIndex] = observation;

  sessions.set(id, session);
  return clone(session);
}

export function completeClassroomSession(id: string): ClassroomSessionSnapshot | null {
  cleanExpired();
  const key = id.trim().toUpperCase();
  const session = sessions.get(key);
  if (!session) return null;
  session.phase = "completed";
  sessions.set(key, session);
  return clone(session);
}

export function deleteClassroomSession(id: string) {
  return sessions.delete(id.trim().toUpperCase());
}
