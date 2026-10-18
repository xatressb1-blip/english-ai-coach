import type { ClassroomCandidateResult } from "@/types/classroomResults";
import { lessonOverview } from "./lessonAnswerOverview";
import { questions } from "./teacherLessonSynthesis";

// Presentation only: use exact transcript excerpts and the existing lesson groups.
// No AI request, score recalculation, or comparison between students.
export function teacherPracticeOverview(result: ClassroomCandidateResult) {
  const rows = questions(result).map((q, index) => ({ index, ...lessonOverview(q, index) }));
  const strengths = rows.flatMap(row => row.parts.filter(part => part.clear && part.evidence)
    .map(part => ({ index: row.index, label: part.label, evidence: part.evidence })));
  const strength = strengths[0];
  const missing = rows.flatMap(row => row.parts.filter(part => part.known && !part.mentioned)
    .map(part => ({ index: row.index, part })));
  const developing = rows.flatMap(row => row.parts.filter(part => part.mentioned && !part.clear)
    .map(part => ({ index: row.index, part })));
  const priority = missing[0] ?? developing[0];
  return {
    strength: strength ? `Q${strength.index + 1} · ${strength.label}: “${strength.evidence}”`
      : "Chưa có ý đủ minh chứng rõ theo tiêu chí đã lưu; giáo viên xem chi tiết.",
    priority: priority ? `Q${priority.index + 1} · ${priority.part.label}` : null,
    next: priority ? priority.part.task : rows.some(row => !row.enough)
      ? "Giáo viên đối chiếu transcript và lời nói thực tế để chọn một việc cần luyện."
      : "Duy trì cách trả lời; kiểm tra tính chính xác và cá nhân hóa cùng bạn học.",
  };
}
