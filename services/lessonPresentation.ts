import type { ClassroomCandidateResult, ClassroomQuestionResult } from "@/types/classroomResults";
import { practiceEvidence, questionAttainment } from "./lessonAttainment";
import { questions } from "./teacherLessonSynthesis";

// Fixed Vietnamese wording describes only ideas with saved, grounded evidence.
// It does not infer language ability, behaviour or details absent from the answer.
const highlightPhrases: Record<string, string> = {
  "personal-introduction": "giới thiệu được bản thân",
  education: "nêu được trường hoặc trình độ học tập",
  major: "nêu được ngành học",
  "career-direction": "nêu được mục tiêu nghề nghiệp",
  contribution: "đề cập được ý đóng góp cho công ty",
  "clear-strength": "nêu được điểm mạnh của bản thân",
  explanation: "đưa ra được lý do giải thích cho điểm mạnh",
  "specific-example": "đưa ra được ví dụ minh họa",
  action: "nêu được việc đã làm trong tình huống minh họa",
  result: "nêu được kết quả của hành động",
  "job-connection": "liên hệ được điểm mạnh với công việc",
  "company-research": "nêu được thông tin đã tìm hiểu về công ty",
  "company-attraction": "nêu được điều thu hút bản thân ở công ty",
  "relevant-skills": "nêu được kỹ năng của bản thân",
  "role-fit": "liên hệ được bản thân với vị trí ứng tuyển",
  "growth-alignment": "đề cập được hướng phát triển bản thân",
};

// Presentation only: the saved analysis and detailed attainment remain unchanged.
export function questionPresentation(q: ClassroomQuestionResult | null, index: number) {
  const detail = questionAttainment(q, index);
  const recorded = !!q?.transcript?.trim();
  const evidence = practiceEvidence(q, index);
  const practiceMet = recorded && evidence.length > 0;
  const clear = evidence.filter(idea => idea.developed);
  const mentioned = evidence.filter(idea => !idea.developed);
  // Include a partial idea when a clear idea leaves room, without upgrading it.
  const selected = [...clear, ...mentioned].slice(0, 2);
  const narrative = selected.map(idea =>
    `${idea.developed ? "" : "bước đầu "}${highlightPhrases[idea.id]}`
  ).join("; ");
  return {
    practiceMet,
    label: practiceMet ? "Đạt yêu cầu thực hành" : recorded ? "Đã ghi nhận câu trả lời" : "Chưa có bản ghi",
    strength: selected.length
      ? `${narrative.charAt(0).toLocaleUpperCase("vi")}${narrative.slice(1)}.`
      : recorded ? "Nội dung ghi nhận: xem chi tiết." : "Chưa có bản ghi để tổng hợp nội dung.",
    evidence,
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
      ? `Tiếp tục luyện tập — Q${priority.index + 1}: ${priority.part.task}`
      : uncertain
        ? "Tiếp tục luyện tập cùng bạn: trình bày từng ý bằng câu ngắn, rõ; nhờ bạn nghe và góp ý một câu cần làm rõ."
        : "Tiếp tục luyện tập: mở rộng một ví dụ bằng trải nghiệm thật và làm rõ đóng góp cho vị trí ứng tuyển.",
  };
}
