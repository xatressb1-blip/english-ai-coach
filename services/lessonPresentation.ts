import type { ClassroomCandidateResult, ClassroomQuestionResult } from "@/types/classroomResults";
import { practiceEvidence, questionAttainment } from "./lessonAttainment";
import { questions } from "./teacherLessonSynthesis";
import { LESSON_PARTS } from "./lessonAnswerOverview";

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

// Each recommendation is an extension of this question, never a new judgment
// of the student's ability. Only grounded, saved evidence supplies the anchor.
function nextStep(row: ReturnType<typeof questionPresentation>, index: number, partIndex: number) {
  const part = LESSON_PARTS[index][partIndex];
  const has = (id: string) => row.evidence.some(idea => idea.id === id);
  let task = part.task;
  if (index === 1 && partIndex === 2) {
    if (has("specific-example") && !has("action")) task = "Từ ví dụ đã nêu, thêm một câu nói rõ việc chính em đã làm.";
    else if (has("action") && !has("specific-example")) task = "Đặt hành động đã nêu vào một tình huống thật cụ thể.";
  }
  if (index === 2) {
    if (partIndex === 0) task = "Chọn một thông tin thật về công ty và giải thích ngắn vì sao thông tin đó khiến em muốn ứng tuyển.";
    if (partIndex === 2 && has("relevant-skills") && !has("role-fit")) task = "Liên hệ kỹ năng đã nêu với một nhiệm vụ của vị trí ứng tuyển.";
    if (partIndex === 2 && has("role-fit") && !has("relevant-skills")) task = "Thêm một kỹ năng của em để làm rõ sự phù hợp với vị trí đã nêu.";
    if (partIndex === 3 && has("contribution") && !has("growth-alignment")) task = "Từ ý đóng góp đã nêu, thêm một câu về điều em muốn học hỏi hoặc phát triển tại công ty.";
    if (partIndex === 3 && has("growth-alignment") && !has("contribution")) task = "Từ hướng phát triển đã nêu, thêm một việc em có thể đóng góp cho công ty.";
  }
  const anchor = row.evidence.find(idea => part.ids.includes(idea.id))
    ?? row.evidence.find(idea => idea.developed) ?? row.evidence[0];
  const context = anchor ? `Dựa trên ý ${anchor.label.toLocaleLowerCase("vi")} đã ghi nhận, ` : "";
  return `Tiếp tục luyện tập — Q${index + 1}: ${context}${context ? task.charAt(0).toLocaleLowerCase("vi") + task.slice(1) : task}`;
}

export function studentPresentation(result: ClassroomCandidateResult) {
  const rows = questions(result).map(questionPresentation);
  // Keep the known-missing priority across Q1-Q3. Unknown does not mean absent.
  // A grouped part may contain one evidenced subidea; extend that idea rather
  // than asking the learner to repeat the whole group.
  const candidates = rows.flatMap((row, index) => row.detail.parts.map((part, partIndex) => ({ row, part, index, partIndex })));
  const priority = candidates.find(({ row, part }) => row.practiceMet && part.known && !part.counted)
    ?? candidates.find(({ row, part }) => row.practiceMet && part.counted && !part.developed)
    ?? candidates.find(({ row, part, index, partIndex }) => row.practiceMet && !part.counted
      && row.evidence.some(idea => LESSON_PARTS[index][partIndex].ids.includes(idea.id)));
  const unclearIndex = rows.findIndex(row => !row.practiceMet);
  const uncertainIndex = rows.findIndex(row => row.detail.unknown);
  return {
    rows,
    next: priority
      ? nextStep(priority.row, priority.index, priority.partIndex)
      : unclearIndex >= 0
        ? `Tiếp tục luyện tập — Q${unclearIndex + 1}: ${questions(result)[unclearIndex]?.transcript?.trim()
          ? "Cùng bạn đối chiếu bản ghi với phần thể hiện thực tế, rồi luyện trình bày một ý bằng câu ngắn, rõ."
          : "Luyện trả lời một ý bằng câu ngắn, rõ và kiểm tra micro trước khi ghi âm."}`
      : uncertainIndex >= 0
        ? `Tiếp tục luyện tập — Q${uncertainIndex + 1}: Dựa trên ý ${rows[uncertainIndex].evidence[0].label.toLocaleLowerCase("vi")} đã ghi nhận, cùng bạn chọn thêm một ý trong khung luyện tập để mở rộng câu trả lời.`
        : "Tiếp tục luyện tập: mở rộng một ví dụ bằng trải nghiệm thật và làm rõ đóng góp cho vị trí ứng tuyển.",
  };
}
