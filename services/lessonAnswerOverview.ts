import type { ClassroomCandidateResult, ClassroomQuestionResult } from "@/types/classroomResults";
import { criterionEvidence } from "./teacherCoaching";
import { questions, usable } from "./teacherLessonSynthesis";

type PartDefinition = { label: string; ids: string[]; cues: RegExp[]; generic?: RegExp; task: string };
// Presentation groups map the existing detailed rubric into the lesson's 5/5/4 parts.
// Transcript cues identify mention only; they never promote a part to fully developed.
export const LESSON_PARTS: PartDefinition[][] = [
  [
    {label:"Tên/giới thiệu",ids:["personal-introduction"],cues:[/\bmy name (?:is\s+[a-z][\w'-]+|(?!is\b)[a-z][\w'-]+)/i],task:"Giới thiệu bản thân bằng một câu đầy đủ."},
    {label:"Trường/trình độ",ids:["education"],cues:[/\b(?:graduated|study|studied|student)\b[^.!?]*\b(?:college|university|school)\b/i],task:"Nêu rõ trường hoặc trình độ của em."},
    {label:"Ngành học",ids:["major"],cues:[/\b(?:my major is|majoring in)\s+[a-z][\w'-]+/i],task:"Nêu rõ ngành học."},
    {label:"Mục tiêu nghề nghiệp",ids:["career-direction"],cues:[/\b(?:want|hope|would like) to become\s+(?:a |an )?[a-z][\w'-]+/i],generic:/\b(?:a |an )?(?:skilled )?technician\b/i,task:"Nêu vị trí nghề nghiệp cụ thể, phù hợp với em."},
    {label:"Đóng góp",ids:["contribution"],cues:[/\b(?:contribute|contribution|bring value|help (?:your|the) company)\b/i],generic:/\b(?:contribute|contributing) to (?:your|the) (?:company|team)\b/i,task:"Nêu một kỹ năng/kiến thức em có thể dùng để đóng góp."},
  ],
  [
    {label:"Điểm mạnh",ids:["clear-strength"],cues:[/\bmy (?:biggest )?strength(?:s)? (?:is|are)\s+\w+/i,/\bmy ability to\s+\w+/i],task:"Nêu một điểm mạnh rõ ràng."},
    {label:"Lý do",ids:["explanation"],cues:[/\b(?:because|this is important because)\s+\w+/i],task:"Giải thích vì sao điểm mạnh hữu ích trong công việc."},
    {label:"Ví dụ và hành động",ids:["specific-example","action"],cues:[/\b(?:for example|during my internship|in my project)\b/i],task:"Thêm tình huống thật và việc chính em đã làm."},
    {label:"Kết quả",ids:["result"],cues:[/\bas a result\b/i,/\b(?:reduced|saved|completed|delivered)\b[^.!?]+/i],task:"Nêu kết quả thật của hành động; không bịa số liệu."},
    {label:"Liên hệ công việc",ids:["job-connection"],cues:[/\bthis strength will help\b/i,/\bcontribute to\b/i],task:"Liên hệ điểm mạnh với một nhiệm vụ của vị trí ứng tuyển."},
  ],
  [
    {label:"Tìm hiểu công ty",ids:["company-research"],cues:[/\bi (?:have )?researched\b/i,/\bfrom your website\b/i],task:"Đưa một thông tin thật đã tìm hiểu về công ty."},
    {label:"Điều hấp dẫn",ids:["company-attraction"],cues:[/\b(?:impressed me|attracted me|supportive working environment)\b/i],task:"Nêu điều cụ thể khiến em muốn làm việc tại công ty."},
    {label:"Kỹ năng phù hợp",ids:["relevant-skills","role-fit"],cues:[/\b(?:my skills|programming|teamwork|software development)\b/i],task:"Nêu kỹ năng của em và giải thích liên hệ với vị trí."},
    {label:"Đóng góp và phát triển",ids:["contribution","growth-alignment"],cues:[/\b(?:contribute|grow|develop my)\b/i],task:"Làm rõ đóng góp của em và hướng học hỏi/phát triển."},
  ],
];
function excerpt(text: string, cues: RegExp[]) {
  const sentences = text.replace(/\s+/g," ").trim().split(/(?<=[.!?])\s+/);
  return sentences.find(s=>cues.some(c=>c.test(s)) && !/\b(?:not|never|cannot|can't|don't|didn't)\b/i.test(s))?.slice(0,240) ?? "";
}
export function lessonOverview(q: ClassroomQuestionResult | null, index: number) {
  const definitions=LESSON_PARTS[index] ?? [];
  const parts=definitions.map(def=>{
    if (!usable(q) || !q?.transcript?.trim()) return {...def,mentioned:false,clear:false,known:false,evidence:"",origin:""};
    const records=def.ids.map(id=>{
      // Duplicate/conflicting criterion records are ambiguous, never silently counted twice.
      const matches=(q.criteria ?? []).filter(c=>c.id===id);
      return matches.length===1 && ["covered","partial","missing"].includes(matches[0].status) ? matches[0] : null;
    });
    const quote=excerpt(q.transcript,def.cues);
    const recordedEvidence=records.map(c=>c ? criterionEvidence(q,c.evidence) : "").find(Boolean) ?? "";
    const mentioned=!!quote || records.some(c=>c?.status==="covered" || c?.status==="partial");
    // A valid exact quote for every covered subcriterion is required for a clear part.
    const grounded=records.every(c=>c?.status==="covered" && !!criterionEvidence(q,c.evidence) && q.transcript.replace(/\s+/g," ").includes(c.evidence.replace(/\s+/g," ")));
    const evidence=quote || recordedEvidence;
    const generic=!!def.generic?.test(evidence) && !/\b(?:skills|knowledge|network|programming|technical|support|solve)\b/i.test(evidence);
    return {...def,mentioned,clear:grounded && !generic,known:!!quote || records.every(Boolean),evidence,origin:quote?"Trích transcript theo quy tắc":"Phân tích đã lưu"};
  });
  const mentioned=parts.filter(p=>p.mentioned).length,clear=parts.filter(p=>p.clear).length,unknown=parts.filter(p=>!p.known).length;
  const enough=unknown===0 && parts.length>0;
  const onTopic=enough && parts[0]?.mentioned && mentioned>=Math.ceil(parts.length/2);
  const good=onTopic && mentioned===parts.length && clear===parts.length;
  const level=!enough?"Chưa đủ dữ liệu":good?"Đáp ứng tốt theo minh chứng":onTopic?"Đúng trọng tâm; cần làm rõ":"Cần bổ sung trọng tâm";
  const priority=parts.find(p=>p.known && !p.mentioned) ?? parts.find(p=>p.mentioned && !p.clear) ?? parts.find(p=>!p.known);
  return {parts,mentioned,clear,unknown,total:parts.length,enough,onTopic,good,level,
    countText: `${unknown ? "Ít nhất " : ""}${mentioned}/${parts.length} ý đã đề cập · ${clear} ý có minh chứng rõ`,
    next:priority?.task ?? "Giữ cách trả lời; cô kiểm chứng tính cá nhân hóa.",
    tone:!enough?"unknown":good?"good":"developing"};
}
export function lessonClassSummary(results: ClassroomCandidateResult[]) {
  const rows=results.flatMap(r=>questions(r).map((q,i)=>lessonOverview(q,i)));
  const count=rows.filter(row=>row.onTopic).length;
  const all=results.length>0 && count===results.length*3;
  return all ? `Theo dữ liệu hiện có, cả ${results.length} ứng viên trả lời đúng trọng tâm Q1–Q3. Cô kiểm chứng phần cần làm rõ trong bảng.` : `Dữ liệu hiện có nhận diện ${count}/${rows.length} câu đúng trọng tâm; xem từng ô để hướng dẫn phần còn thiếu hoặc chưa đủ minh chứng.`;
}
