import type { ClassroomQuestionResult } from "@/types/classroomResults";
import { questionNotes, supportedNotes, usable } from "./teacherLessonSynthesis";

const labels: Record<string,string> = {
  "personal-introduction":"giới thiệu bản thân",education:"trường/trình độ",major:"ngành học","career-direction":"mục tiêu nghề nghiệp",contribution:"đóng góp","professional-growth":"phát triển nghề nghiệp",
  "clear-strength":"điểm mạnh",explanation:"lý do điểm mạnh hữu ích","specific-example":"ví dụ cụ thể",action:"hành động của em",result:"kết quả",evidence:"chi tiết minh chứng","job-connection":"liên hệ công việc",
  "company-research":"tìm hiểu công ty","company-attraction":"điều hấp dẫn ở công ty","role-fit":"sự phù hợp với vị trí","relevant-skills":"kỹ năng phù hợp","growth-alignment":"đóng góp và phát triển",specificity:"lý do riêng về công ty",
};
const tasks: Record<string,string> = {
  "personal-introduction":"Nói một câu giới thiệu tên/bản thân rõ ràng.", education:"Bổ sung một câu về trường và trình độ của em.", major:"Nêu ngành học bằng tên ngành phù hợp.","career-direction":"Nêu rõ vị trí công việc em muốn theo đuổi.", contribution:"Nêu một kỹ năng em có thể dùng để giúp công ty.","professional-growth":"Nêu điều em muốn học và phát triển khi làm việc.",
  "clear-strength":"Diễn đạt một điểm mạnh của bản thân rõ ràng.",explanation:"Giải thích điểm mạnh đó giúp ích thế nào trong công việc.","specific-example":"Thêm một tình huống thật, việc em đã làm và kết quả.",action:"Nêu rõ em đã làm gì trong ví dụ, dùng ngôi I.",result:"Bổ sung kết quả của việc em đã làm; dùng chi tiết thật, không bịa số liệu.",evidence:"Thêm một chi tiết cụ thể đúng trải nghiệm để làm rõ ví dụ.","job-connection":"Kết thúc bằng một câu liên hệ điểm mạnh với công việc.",
  "company-research":"Kiểm tra một thông tin thật về công ty và đưa vào câu trả lời.","company-attraction":"Nêu một đặc điểm cụ thể khiến em muốn vào công ty.","role-fit":"Giải thích vị trí phù hợp với ngành học hoặc sở thích nghề nghiệp của em.","relevant-skills":"Nêu một kỹ năng cá nhân liên quan đến vị trí.","growth-alignment":"Liên hệ việc học hỏi của em với đóng góp cho công ty.",specificity:"Thay lời khen chung bằng một lý do riêng có thể kiểm chứng về công ty.",
};
export function criterionEvidence(q: ClassroomQuestionResult | null, value: unknown) {
  if (typeof value !== "string" || !value.trim() || /criterion supported|related phrase was detected/i.test(value)) return "";
  const text = supportedNotes([value])[0];
  if (!text) return "";
  // Backup evidence must be an exact excerpt. AI paraphrases are labelled as prior analysis.
  if (q?.source === "backup_rubric" && !q.transcript.replace(/\s+/g," ").includes(text.replace(/\s+/g," "))) return "";
  return text;
}
export function coaching(q: ClassroomQuestionResult | null) {
  if (!usable(q)) return {strength:"Chưa đủ dữ liệu.",improvement:"Cô kiểm tra transcript trước khi nhận xét.",practice:"Nghe/đọc lại câu trả lời và chọn một ý cần luyện.",summary:"Chưa đủ dữ liệu"};
  const criteria = q?.criteria ?? [];
  const covered = criteria.filter(c=>c.status === "covered");
  const missing = criteria.filter(c=>c.status === "missing");
  const partial = criteria.filter(c=>c.status === "partial");
  const priority = missing[0] ?? partial[0];
  const label = priority ? labels[priority.id] ?? priority.label : "";
  const stored = questionNotes(q,"improvement")[0];
  const improvement = q?.source === "live_ai" && stored ? stored : priority ? `${priority.status === "missing" ? "Rubric chưa nhận diện" : "Cần làm rõ"} ${label}; cô đối chiếu transcript.` : "Các ý đã được nhận diện; cô kiểm chứng độ rõ và tính cá nhân hóa.";
  const practice = q?.source === "live_ai" && stored ? `Thực hiện góp ý: ${stored} Sau đó nói lại câu trả lời và giải thích một thay đổi với bạn/cô.` : priority ? `${tasks[priority.id] ?? `Làm rõ ${label}.`} Nói lại với bạn và đối chiếu phần vừa bổ sung.` : "Nói lại bằng trải nghiệm của em; nhờ bạn kiểm tra sự rõ ràng.";
  const supported = covered.find(c=>criterionEvidence(q,c.evidence));
  return {
    strength: supported ? `Đã thể hiện ${labels[supported.id] ?? supported.label}: “${criterionEvidence(q,supported.evidence)}”` : covered.length ? `Rubric/AI ghi nhận ${labels[covered[0].id] ?? covered[0].label}; chưa có trích dẫn cụ thể, cô xác minh.` : questionNotes(q,"strength")[0] ?? "Chưa có điểm mạnh được nhận diện; cô xác minh qua lời nói.",
    improvement,practice,
    summary: criteria.length ? `${covered.length}/${criteria.length} ý đã nhận diện${partial.length ? `, ${partial.length} ý một phần` : ""}${priority ? `; xem lại ${label}` : "; cô xác nhận mức đạt"}` : "Chưa lưu tiêu chí chi tiết; xem transcript",
  };
}
