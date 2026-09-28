export type ClassroomObservationRole = "content" | "language" | "professional";
export type ClassroomSessionPhase = "ready" | "answering" | "review" | "completed";
export type RubricScore = 0 | 1 | 2 | null;
export type RubricScores = RubricScore[];

export const CLASSROOM_FIXED_STUDENTS = ["MrHuy", "MrLong", "MrKhánh", "MrHoàng"] as const;

export const CLASSROOM_FIXED_ROLES = {
  candidate: CLASSROOM_FIXED_STUDENTS[0],
  content: CLASSROOM_FIXED_STUDENTS[1],
  language: CLASSROOM_FIXED_STUDENTS[2],
  professional: CLASSROOM_FIXED_STUDENTS[3],
} as const;

export interface ClassroomObservation {
  candidateIndex: number;
  observerIndex: number;
  role: ClassroomObservationRole;
  scores: RubricScores;
  totalScore: number | null;
  strength: string;
  improvement: string;
  submittedAt: string;
}

export interface ClassroomSessionSnapshot {
  id: string;
  studentNames: string[];
  companyName: string;
  jobTitle: string;
  recruiterName: string;
  questionAssignments: number[];
  currentRound: number;
  phase: ClassroomSessionPhase;
  joinedStudents: number[];
  observations: ClassroomObservation[];
  createdAt: string;
  expiresAt: string;
}

export const CLASSROOM_ROLE_LABELS: Record<ClassroomObservationRole, string> = {
  content: "Observer 1 · Content & Response Structure",
  language: "Observer 2 · English Language Performance",
  professional: "Observer 3 · Professional Interview Performance",
};

export const CLASSROOM_ROLE_PROMPTS: Record<ClassroomObservationRole, string> = {
  content: "Evaluate relevance, completeness, supporting evidence, and logical organization across all three answers.",
  language: "Evaluate understandability, grammar, vocabulary, linking expressions, fluency, pronunciation, and spoken clarity.",
  professional: "Evaluate visible professional behavior: posture, eye contact, voice, pace, confidence, attitude, listening, and natural response.",
};

export const CLASSROOM_ROLE_SHORT_LABELS: Record<ClassroomObservationRole, string> = {
  content: "Content",
  language: "English",
  professional: "Professional",
};

export function getClassroomObserverRole(
  observerIndex: number,
  candidateIndex: number,
  studentCount = 4,
): ClassroomObservationRole | null {
  // The presentation model is intentionally fixed: Student 1 is the candidate;
  // Students 2–4 are Observer 1–3 for the entire three-question interview.
  if (candidateIndex !== 0 || studentCount < 4 || observerIndex < 1 || observerIndex > 3) return null;
  const roles: ClassroomObservationRole[] = ["content", "language", "professional"];
  return roles[observerIndex - 1] ?? null;
}
