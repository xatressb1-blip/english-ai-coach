import type { ClassroomCandidateResult, ClassroomQuestionResult } from "@/types/classroomResults";
import { questionAttainment } from "./lessonAttainment";
import { questions } from "./teacherLessonSynthesis";

// Presentation only: the saved analysis and detailed attainment remain unchanged.
export function questionPresentation(q: ClassroomQuestionResult | null, index: number) {
  const detail = questionAttainment(q, index);
  const recorded = !!q?.transcript?.trim();
  const onTopic = recorded && detail.basic;
  const clear = detail.parts.filter(part => part.counted && part.developed);
  const mentioned = detail.parts.filter(part => part.counted && !part.developed);
  const selected = (clear.length ? clear : mentioned).slice(0, 2);
  return {
    onTopic,
    label: onTopic ? "Trả lời đúng trọng tâm" : recorded ? "Đã ghi nhận câu trả lời" : "Chưa có bản ghi câu trả lời",
    strength: selected.length
      ? `${clear.length ? "Đã thể hiện" : "Đã đề cập"}: ${selected.map(part => part.label.toLocaleLowerCase("vi")).join("; ")}.`
      : recorded ? "Đã có bản ghi trả lời; nội dung thể hiện cần đối chiếu qua quan sát." : "Chưa có bản ghi để tổng hợp nội dung.",
    detail,
  };
}

export function studentPresentation(result: ClassroomCandidateResult) {
  const rows = questions(result).map(questionPresentation);
  // Prioritize an evidenced development need; do not call an unrecognized idea missing.
  const priority = rows.flatMap((row, index) => row.detail.parts
    .filter(part => part.known && !part.counted).map(part => ({ part, index })))[0]
    ?? rows.flatMap((row, index) => row.detail.parts
      .filter(part => part.counted && !part.developed).map(part => ({ part, index })))[0];
  const uncertain = rows.some(row => row.detail.unknown);
  return {
    rows,
    next: priority
      ? `Q${priority.index + 1}: ${priority.part.task}`
      : uncertain
        ? "Luyện cùng bạn: trình bày từng ý bằng câu ngắn, rõ; nhờ bạn nghe và góp ý một câu cần làm rõ."
        : "Mở rộng một ví dụ bằng trải nghiệm thật và làm rõ đóng góp cho vị trí ứng tuyển.",
  };
}
