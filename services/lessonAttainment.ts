import type { ClassroomCandidateResult, ClassroomQuestionResult } from "@/types/classroomResults";
import { lessonOverview, LESSON_PARTS } from "./lessonAnswerOverview";
import { questions, usable } from "./teacherLessonSynthesis";

const normalize = (text: string) => text.normalize("NFKC").toLowerCase()
  .replace(/[’‘]/g, "'").replace(/[^\p{L}\p{N}']+/gu, " ").trim();
const negative = (text: string) => /(?:\bnot\b(?!\s+(?:only|just|merely)\b)|\b(?:no|never|cannot|can't|don't|didn't|isn't|aren't|wasn't|weren't|lack)\b)/i.test(text);
// Only expand short evidence when its sentence expresses the actual criterion.
// The saved covered/partial status is still required; no new AI request is made.
const contexts: Record<string, RegExp> = {
  "personal-introduction": /\b(?:my name(?: is)?|i am|i'm)\s+[\p{L}]/iu,
  education: /\b(?:graduated|study|studied|student|degree|diploma)\b[^.!?]*\b(?:college|university|school|degree|diploma)\b/i,
  major: /\b(?:my major(?: is)?|majoring in|studied|study)\s+[a-z]/i,
  "career-direction": /\b(?:want|hope|would like|aim|plan) to (?:become|be|work)\b/i,
  contribution: /\b(?:i|my|we)\b[^.!?]*\b(?:contribute|bring|help|support|knowledge|skills)\b/i,
  "clear-strength": /\b(?:my (?:(?:biggest|greatest|main|key) )?strengths? (?:is|are)|i am good at|i'm good at|my ability to)\s+[a-z]/i,
  explanation: /\b(?:because|this is important|this matters|helps? (?:me|us)|projects? require)\b/i,
  "specific-example": /\b(?:for example|during my|in my (?:internship|project)|i worked|we worked)\b/i,
  action: /\b(?:i|we)\s+(?:[a-z]+\s+){0,3}(?:worked|work|developed|develop|built|build|created|create|helped|help|taught|automated|coordinated|shared)\b|\bwork with a team\b/i,
  result: /\b(?:as a result|we complete|we completed|completed|delivered|reduced|saved|finished|on time)\b/i,
  "job-connection": /\b(?:this (?:strength|skill|ability|experience)|will help|would help|contribute)\b/i,
  "company-research": /\b(?:researched|learned about|read about|your website|found that)\b/i,
  "company-attraction": /\b(?:impressed|attracted|interested|want to (?:work|join)|supportive working environment|employee development)\b/i,
  "relevant-skills": /\b(?:my skills|i have|i am|i'm|my programming|my technical|my network|my teamwork)\b/i,
  "role-fit": /\b(?:position|role|job|match|fit|suit|my skills)\b/i,
  "growth-alignment": /\b(?:grow|growth|develop|development|learn|learning)\b/i,
};
function supportedQuote(q: ClassroomQuestionResult, value: string, id: string) {
  // Match punctuation/case without inventing a missing passage or using a reference answer.
  if (!value?.trim() || /criterion supported|related phrase was detected/i.test(value)) return "";
  const clean = normalize(value), transcript = normalize(q.transcript);
  if (!clean || !(" " + transcript + " ").includes(" " + clean + " ") || negative(value)) return "";
  const count = clean.split(/\s+/).length;
  const sentences = q.transcript.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/);
  const matching = sentences.filter(sentence => (" " + normalize(sentence) + " ").includes(" " + clean + " "));
  // A long excerpt cannot bypass a negation present in its surrounding sentence.
  const positive = matching.filter(sentence => !negative(sentence));
  if (count >= 3) return matching.length && !positive.length ? "" : value.trim();
  const sentence = positive.find(sentence => contexts[id]?.test(sentence));
  return sentence ?? "";
}
// Activity 2's introductory practice target accepts one relevant evidenced idea.
// Subcriteria can stand on their own here; they need not complete a 5/5/4 group.
// This does not change the full-structure coverage calculation below.
export function practiceEvidence(q: ClassroomQuestionResult | null, index: number) {
  if (!usable(q) || !q?.transcript?.trim()) return [];
  const labels: Record<string, string> = {
    "personal-introduction": "Giới thiệu bản thân", education: "Trường/trình độ",
    major: "Ngành học", "career-direction": "Mục tiêu nghề nghiệp", contribution: "Đóng góp",
    "clear-strength": "Điểm mạnh", explanation: "Lý do", "specific-example": "Ví dụ cụ thể",
    action: "Hành động trong ví dụ", result: "Kết quả", "job-connection": "Liên hệ công việc",
    "company-research": "Tìm hiểu công ty", "company-attraction": "Điều hấp dẫn ở công ty",
    "relevant-skills": "Kỹ năng của bản thân", "role-fit": "Liên hệ với vị trí",
    "growth-alignment": "Hướng phát triển bản thân",
  };
  const ids = [...new Set((LESSON_PARTS[index] ?? []).flatMap(part => part.ids))];
  return ids.flatMap(id => {
    const matches = (q.criteria ?? []).filter(c => c.id === id);
    if (matches.length !== 1 || !["covered", "partial"].includes(matches[0].status)) return [];
    const evidence = supportedQuote(q, matches[0].evidence, id);
    return evidence ? [{ id, label: labels[id], evidence, developed: matches[0].status === "covered" }] : [];
  });
}
// Same Q1/Q2/Q3 lesson groups, not the detailed rubric's 6/7/7 counts.
// A keyword cue alone is never sufficient for a counted part.
export function questionAttainment(q: ClassroomQuestionResult | null, index: number) {
  const hints = lessonOverview(q, index);
  const parts = (LESSON_PARTS[index] ?? []).map((part, i) => {
    const records = part.ids.map(id => {
      const matches = (q?.criteria ?? []).filter(c => c.id === id);
      return matches.length === 1 ? matches[0] : null;
    });
    const proofs = part.ids.map((id, j) => {
      const record = records[j];
      if (usable(q) && q?.transcript.trim() && record && ["covered", "partial"].includes(record.status)) {
        const quote = supportedQuote(q, record.evidence, id);
        if (quote) return { quote, developed: record.status === "covered", origin: "Phân tích đã lưu và ngữ cảnh transcript" };
      }
      // A narrow repair for the lesson's grouped contribution + growth part.
      // Only an explicit personal growth statement in the actual transcript counts.
      if (index === 2 && id === "growth-alignment" && usable(q) && q?.transcript.trim()
          && (q.criteria ?? []).filter(c => c.id === id).length <= 1) {
        const quote = q.transcript.replace(/\s+/g, " ").trim().split(/(?<=[.!?])\s+/).find(sentence =>
          !negative(sentence) && /\b(?:i|we)\b[^.!?]*\b(?:grow as (?:a|an) [a-z][a-z-]+|grow (?:with|together with) (?:your|the) (?:company|team)|develop (?:my|our) (?:skills|knowledge)|grow professionally)\b/i.test(sentence));
        if (quote) return { quote, developed: true, origin: "Đối chiếu phát biểu phát triển bản thân trong transcript" };
      }
      return null;
    });
    const grounded = usable(q) && !!q?.transcript.trim() && proofs.every(Boolean);
    const absent = usable(q) && !!q?.transcript.trim() && !hints.parts[i]?.mentioned && records.every(c => c?.status === "missing");
    return { label: part.label, task: part.task, counted: !!grounded,
      known: !!grounded || !!absent,
      evidence: grounded ? [...new Set(proofs.map(proof => proof!.quote))].join(" / ") : "",
      origin: grounded ? [...new Set(proofs.map(proof => proof!.origin))].join("; ") : "",
      // Partial evidence counts a basic part, but is still a useful development priority.
      developed: !!grounded && proofs.every(proof => proof?.developed),
      hint: hints.parts[i]?.evidence ?? "" };
  });
  const count = parts.filter(part => part.counted).length;
  const total = parts.length;
  const threshold = Math.ceil(total / 2);
  // Q3's core is a reason to choose the company (attraction), not research alone.
  const core = !!parts[index === 2 ? 1 : 0]?.counted;
  const basic = total > 0 && count >= threshold && core;
  const full = total > 0 && count === total && core;
  const unknown = parts.some(part => !part.known);
  const label = full ? "Đủ ý nội dung" : basic ? "Đạt cơ bản về nội dung · đề xuất"
    : count >= threshold && !core ? parts[index === 2 ? 1 : 0]?.known ? "Cần bổ sung ý trọng tâm" : "Cần xác minh ý trọng tâm"
    : unknown ? "Cần xác minh transcript hoặc minh chứng" : count > 0 ? "Đã thể hiện một phần nội dung — cần bổ sung" : "Đã có câu trả lời — cần bổ sung nội dung";
  const priority = parts.find(part => part.known && !part.counted) ?? parts.find(part => part.counted && !part.developed) ?? parts.find(part => !part.known);
  return { parts, count, total, threshold, core, basic, full, unknown, label,
    countText: `${unknown ? "Ít nhất " : ""}${count}/${total} ${index === 0 ? "ý" : "phần"} có minh chứng`,
    next: priority?.task ?? "Duy trì cách trả lời; mở rộng bằng trải nghiệm thật nếu phù hợp.",
    tone: basic ? "good" : unknown ? "unknown" : "developing" };
}
export function studentAttainment(result: ClassroomCandidateResult) {
  const rows = questions(result).map(questionAttainment);
  const completedCount = questions(result).filter(q => !!q?.transcript?.trim()).length;
  const strengthPart = rows.flatMap((row, i) => row.parts.filter(part => part.counted && part.developed)
    .map(part => ({ ...part, index: i })))[0]
    ?? rows.flatMap((row, i) => row.parts.filter(part => part.counted).map(part => ({ ...part, index: i })))[0];
  const missing = rows.flatMap((row, i) => row.parts.filter(part => part.known && !part.counted).map(part => ({ ...part, index: i })))[0];
  const partial = rows.flatMap((row, i) => row.parts.filter(part => part.counted && !part.developed).map(part => ({ ...part, index: i })))[0];
  const unknown = rows.flatMap((row, i) => row.parts.filter(part => !part.known).map(part => ({ ...part, index: i })))[0];
  const priority = missing ?? partial;
  return { rows, completedCount, completed: completedCount === 3,
    basicCount: rows.filter(row => row.basic).length, full: rows.every(row => row.full),
    strength: strengthPart ? `Q${strengthPart.index + 1} · ${strengthPart.label}` : "Chưa đủ minh chứng để nêu điểm mạnh.",
    strengthEvidence: strengthPart?.evidence ?? "",
    next: priority ? `Q${priority.index + 1}: ${priority.task}` : unknown
      ? `Q${unknown.index + 1}: đối chiếu transcript với lời nói thực tế trước khi chọn nội dung cần luyện.`
      : "Duy trì cách trả lời; mở rộng ví dụ bằng trải nghiệm thật phù hợp vị trí ứng tuyển.",
  };
}
// Hide numeric grades in generated notes; the original stored data is untouched.
// Transcript remains a verbatim record and is deliberately not transformed.
export function teacherNarrative(text: string) {
  return text.replace(/\b\d+(?:[.,]\d+)?\s*(?:\/|out of|trên)\s*(?:100|10)\b/gi, "[điểm số đã ẩn]")
    .replace(/\d+(?:[.,]\d+)?\s*%/g, "[chỉ số đã ẩn]");
}
