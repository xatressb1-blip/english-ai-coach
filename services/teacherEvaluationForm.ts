import type { ClassroomCandidateResult, ClassroomQuestionResult } from "@/types/classroomResults";
import { coaching } from "./teacherCoaching";
import { aggregate, metric, questionNotes, questions, supportedNotes, usable } from "./teacherLessonSynthesis";

export function languageDetail(q: ClassroomQuestionResult | null, kind: "grammar" | "vocabulary") {
  if (!usable(q) || q?.source !== "live_ai") return null;
  const detail = q[kind];
  if (!detail || metric(detail.score, 10) === null) return null;
  return { score: detail.score, comment: supportedNotes([detail.comment])[0] ?? "" };
}
export function languageSummary(r: ClassroomCandidateResult, kind: "grammar" | "vocabulary") {
  const rows = questions(r).map((q, index) => ({ index, detail: languageDetail(q, kind) })).filter(row => row.detail);
  const withComment = rows.filter(row => row.detail!.comment);
  // Select one priority comment, with its Q and number of independently evaluated answers.
  const priority = withComment.reduce<typeof rows[number] | null>((best,row) => !best || row.detail!.score < best.detail!.score ? row : best, null);
  return { count: rows.length, text: priority ? `Q${priority.index+1}: ${priority.detail!.comment}` : rows.length ? "Có điểm đã lưu; chưa có nhận xét ngôn ngữ phù hợp." : "Chưa có đánh giá ngôn ngữ độc lập." };
}
export function contentValue(q: ClassroomQuestionResult | null) {
  if (!usable(q)) return null;
  const values = [q?.coverageScore, q?.structureScore, q?.evidenceQualityScore].map(v => metric(v));
  return values.every(v => v !== null) ? Math.min(...values as number[]) : null;
}
export function contentLabel(value: number | null) {
  return value === null ? "Chưa đủ dữ liệu" : value >= 70 ? "Đạt tiêu chí thực hành" : value >= 50 ? "Đạt một phần" : "Cần luyện tập thêm";
}
export function questionSelection(r: ClassroomCandidateResult, best: boolean) {
  const qs = questions(r);
  const rows = qs.map((q,index) => ({ index, value: contentValue(q) }));
  if (rows.some(row => row.value === null) || new Set(qs.map(q => q?.source)).size !== 1) return null;
  const target = best ? Math.max(...rows.map(row => row.value!)) : Math.min(...rows.map(row => row.value!));
  const selected = rows.filter(row => row.value === target);
  return selected.length === 1 ? selected[0].index : null;
}
export function studentFeedback(r: ClassroomCandidateResult) {
  const qs = questions(r);
  const best = questionSelection(r, true), practice = questionSelection(r, false);
  const strengths = qs.flatMap((q,i) => [coaching(q).strength].map(text => `Q${i+1}: ${text}`));
  const improvements = qs.flatMap((q,i) => [coaching(q).improvement].map(text => `Q${i+1}: ${text}`));
  return {
    strength: (best !== null ? [coaching(qs[best]).strength].map(t => `Q${best+1}: ${t}`)[0] : undefined) ?? strengths[0] ?? "Chưa có điểm mạnh có bằng chứng; cô xem chi tiết.",
    improvement: (practice !== null ? [coaching(qs[practice]).improvement].map(t => `Q${practice+1}: ${t}`)[0] : undefined) ?? improvements[0] ?? "Cô đối chiếu câu trả lời để chọn một ưu tiên luyện tập.",
    best, practice,
    levels: qs.map(q => coaching(q).summary),
  };
}
export function classFeedback(results: ClassroomCandidateResult[]) {
  const keys = ["coverageScore","structureScore","evidenceQualityScore"] as const;
  const labels = ["nội dung", "cấu trúc", "minh chứng cụ thể"];
  const rows = keys.map((key,i) => ({ label: labels[i], ...aggregate(results.flatMap(questions).map(q => usable(q) ? metric(q?.[key]) : null)) }));
  const complete = rows.filter(row => row.value !== null);
  const best = complete.reduce<typeof rows[number] | null>((a,b) => !a || b.value! > a.value! ? b : a,null);
  const priority = complete.reduce<typeof rows[number] | null>((a,b) => !a || b.value! < a.value! ? b : a,null);
  return {
    strength: best ? `Chỉ báo tương đối nổi bật: ${best.label}. Cô xác nhận qua câu trả lời.` : "Chưa đủ dữ liệu để xác định điểm mạnh chung.",
    priority: priority ? `Ưu tiên xem lại ${priority.label}; chọn một việc cần sửa cho từng em.` : "Cô đọc transcript và ghi chú của bạn quan sát để chọn ưu tiên.",
  };
}
