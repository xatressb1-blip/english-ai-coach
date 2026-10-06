import type { ClassroomCandidateResult, ClassroomQuestionResult } from "@/types/classroomResults";

export const QUESTIONS = [
  { title: "Tell me about yourself", structure: "name → college/university → major → career goal → contribution", practice: "Write five personalized sentences in the Q1 sequence. Rehearse a 45–60 second answer with a partner, then revise one unclear sentence." },
  { title: "What are your strengths?", structure: "strength → reason → specific example → result → connection to job", practice: "Choose one strength. Add a real situation, your action and a concrete result; finish with how it helps this job. Rehearse with a partner." },
  { title: "Why do you want to work for our company?", structure: "company research → company attraction → personal skills → contribution and growth", practice: "Verify one fact about the company, explain why it attracts you, connect a personal skill, then describe your contribution and growth. Rehearse without reading." },
] as const;

export function valid(value: unknown, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= max;
}
export function questions(result: ClassroomCandidateResult) {
  return [result.q1_result, result.q2_result, result.q3_result];
}
export function usable(q: ClassroomQuestionResult | null) {
  return !!q && q.source !== "unavailable";
}
export function metric(value: unknown, max = 100) {
  return valid(value, max) ? value : null;
}
export function achievement(value: number | null) {
  return value === null ? "Insufficient evidence" : value >= 70 ? "Meets practice target" : value >= 50 ? "Developing" : "Needs focused practice";
}
export function questionLevel(q: ClassroomQuestionResult | null) {
  // Score is displayed separately; attainment depends on three content criteria.
  const values = usable(q) ? [q?.coverageScore, q?.structureScore, q?.evidenceQualityScore].map(v => metric(v)) : [];
  return achievement(values.length === 3 && values.every(v => v !== null) ? Math.min(...values as number[]) : null);
}
export function aggregate(values: (number | null)[]) {
  const available = values.filter((v): v is number => v !== null);
  return { value: available.length ? Number((available.reduce((a,b) => a+b, 0) / available.length).toFixed(1)) : null, count: available.length };
}
export function buildTeacherSynthesis(results: ClassroomCandidateResult[]) {
  const rows = results.flatMap(questions);
  const indicators = (["coverageScore", "structureScore", "evidenceQualityScore"] as const).map((key, i) => ({
    label: ["Content coverage", "Answer structure", "Specific evidence"][i],
    ...aggregate(rows.map(q => usable(q) ? metric(q?.[key]) : null)),
  }));
  const available = indicators.filter(i => i.value !== null);
  const strongest = available.reduce<typeof indicators[number] | null>((best, i) => !best || i.value! > best.value! ? i : best, null);
  const priority = available.reduce<typeof indicators[number] | null>((best, i) => !best || i.value! < best.value! ? i : best, null);
  return { indicators, strongest, priority, questionGroups: QUESTIONS.map((question, i) => ({
    ...question,
    levels: results.map(r => questionLevel(questions(r)[i])),
    scores: aggregate(results.map(r => { const q = questions(r)[i]; return usable(q) ? metric(q?.score, 10) : null; })),
  })) };
}
// Stored narrative may contain claims outside transcript-supported analysis.
// Omit the entire item conservatively; never promote those claims to a finding.
export function supportedNotes(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && !!v.trim())
    .filter(v => !/eye[ -]?contact|posture|body language|confidence|confident|pronunciation|fluency|fluent|voice|pace|attitude|listening|gesture|professional behavio|ánh mắt|tư thế|tự tin|phát âm|trôi chảy|giọng|tác phong/i.test(v));
}
