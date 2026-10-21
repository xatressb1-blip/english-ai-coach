"use client";

import { useState } from "react";
import type { ClassroomCandidateResult, ClassroomQuestionResult } from "@/types/classroomResults";
import { QUESTIONS, questions, supportedNotes } from "@/services/teacherLessonSynthesis";
import { criterionEvidence } from "@/services/teacherCoaching";
import { languageDetail } from "@/services/teacherEvaluationForm";
import { studentAttainment, teacherNarrative } from "@/services/lessonAttainment";

import { questionPresentation, studentPresentation } from "@/services/lessonPresentation";

const panel = "rounded-2xl border border-slate-200 bg-white p-4 sm:p-5";
const mode = (value: string) => ({ live_ai: "AI trực tiếp", mixed: "AI trực tiếp kết hợp tiêu chí dự phòng", backup_rubric: "Tiêu chí dự phòng" } as Record<string, string>)[value] ?? "Chưa có phân tích";
function Language({ q, kind }: { q: ClassroomQuestionResult | null; kind: "grammar" | "vocabulary" }) {
  const detail = languageDetail(q, kind);
  return <div><h5 className="font-bold text-blue-900">{kind === "grammar" ? "Ngữ pháp" : "Từ vựng"}</h5>
    {detail ? <><p className="text-sm">{teacherNarrative(detail.comment || "Chưa lưu nhận xét chi tiết.")}</p>
      {kind === "grammar" && q?.grammar && <ul className="mt-1 list-disc pl-5 text-sm">{supportedNotes(q.grammar.mistakes).map((v, i) => <li key={i}>{teacherNarrative(v)}</li>)}</ul>}</>
      : <p className="text-sm text-slate-600">{q?.source === "backup_rubric" ? "Chế độ dự phòng chưa có phân tích ngôn ngữ độc lập." : "Chưa lưu phân tích ngôn ngữ chi tiết."}</p>}
  </div>;
}
function QuestionCard({ q, index }: { q: ClassroomQuestionResult | null; index: number }) {
  const presentation = questionPresentation(q, index);
  const row = presentation.detail;
  return <article className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <h4 className="font-black text-blue-950">Q{index + 1} · {QUESTIONS[index].title}</h4>
    <p className="text-xs text-slate-600">{QUESTIONS[index].structure}</p>
    <p className="font-bold text-blue-950">{presentation.label}</p>
    <p className="text-xs text-slate-600">Yêu cầu thực hành bước đầu: có ít nhất một ý phù hợp câu hỏi, được đối chiếu bằng minh chứng đã lưu. Khung đầy đủ bên dưới là hướng luyện tập tiếp.</p>
    {presentation.evidence.length > 0 && <div><h5 className="font-bold text-teal-900">Minh chứng ghi nhận yêu cầu thực hành</h5><ul className="mt-2 space-y-2 text-sm">{presentation.evidence.map(idea => <li key={idea.id}><strong>{idea.label}:</strong><p className="text-xs text-slate-600">“{idea.evidence}”</p></li>)}</ul></div>}
    <h5 className="font-bold text-blue-900">Khung luyện tập đầy đủ · tham khảo</h5>
    <p className="text-sm text-slate-600">{row.countText}. Số phần cấu trúc đầy đủ khác với yêu cầu thực hành bước đầu.</p>
    <ul className="space-y-3 text-sm">{row.parts.map(part => <li key={part.label}>
      <strong>{part.label}</strong>: {part.counted ? part.developed ? "Đã thể hiện" : "Đã đề cập, cần làm rõ" : part.known ? "Cần bổ sung" : "Chưa đủ minh chứng để xác nhận"}
      {(part.evidence || part.hint) && <p className="mt-1 text-xs text-slate-600">{part.counted ? part.origin || "Minh chứng đối chiếu transcript" : "Nội dung gợi ý để đối chiếu, chưa tính đạt"}: “{teacherNarrative(part.evidence || part.hint)}”</p>}
    </li>)}</ul>
    {q?.evaluationNotice && <p className="text-xs text-amber-900">{teacherNarrative(q.evaluationNotice)}</p>}
    <Language q={q} kind="grammar"/><Language q={q} kind="vocabulary"/>
    <p className="text-xs leading-5 text-amber-900">Nhận xét ngôn ngữ dựa trên transcript đã lưu. Nếu bản nhận diện sai hoặc thiếu, giáo viên đối chiếu lời nói thực tế trước khi quy thành lỗi của sinh viên.</p>
    <div><h5 className="font-bold text-blue-800">{row.full ? "Hướng phát triển" : "Hướng luyện tiếp"}</h5><p className="text-sm">{row.next}</p></div>
    <details><summary className="cursor-pointer font-bold text-blue-800">Nguồn và phân tích tiêu chí gốc</summary>
      <p className="mt-2 text-xs text-slate-600">{mode(q?.source ?? "unavailable")}. Khung bài học gộp theo 5/5/4; rubric gốc có tiêu chí con và tiêu chí mở rộng.</p>
      {q?.criteria?.length ? <ul className="mt-2 space-y-2 text-sm">{q.criteria.map((c, i) => <li key={i}><strong>{teacherNarrative(c.label)}</strong>: {({ covered: "Đã thể hiện", partial: "Một phần", missing: "Chưa nhận diện" } as Record<string, string>)[c.status] ?? "Chưa đủ dữ liệu"}
        {criterionEvidence(q, c.evidence) && <p className="text-xs text-slate-600">Trích dẫn/diễn giải đã lưu, cần đối chiếu: {teacherNarrative(criterionEvidence(q, c.evidence))}</p>}</li>)}</ul> : <p className="mt-2 text-sm">Chưa lưu tiêu chí chi tiết.</p>}
    </details>
    <details><summary className="cursor-pointer font-bold text-blue-800">Xem transcript</summary><p className="mt-2 whitespace-pre-wrap break-words text-sm">{q?.transcript || "Chưa lưu transcript."}</p></details>
  </article>;
}

export default function TeacherLessonSynthesis({ sessionId, results, expected }: { sessionId: string; results: ClassroomCandidateResult[]; expected: number }) {
  // No teacher grading input or browser storage. Old teacher notes are untouched.
  const [selected, setSelected] = useState<{ sessionId: string; id: string } | null>(null);
  const student = selected?.sessionId === sessionId ? results.find(r => r.id === selected.id) : undefined;
  return <section className="space-y-4 rounded-3xl border border-blue-200 bg-slate-50 p-4 shadow-xl sm:p-6">
    <header><p className="text-xs font-bold text-blue-700">FIX 43.3.17 · {results.length}/{expected} sinh viên có kết quả</p>
      <h2 className="mt-1 text-2xl font-black text-blue-950">EVALUATION FORM (AI)</h2>
      <p className="mt-2 text-sm text-slate-600">Kết quả ghi nhận mức thực hành bước đầu. Giáo viên kết hợp phân tích của ứng dụng, quan sát thực tế và nhận xét của bạn đồng hành để nhận xét cuối cùng.</p>
    </header>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white"><table className="w-full min-w-[1080px] table-fixed text-left text-sm">
      <thead className="bg-blue-950 text-white"><tr><th scope="col" className="w-[14%] px-3 py-3">Sinh viên</th>{QUESTIONS.map((q, i) => <th key={q.title} scope="col" className="w-[12%] px-3 py-3">Q{i + 1}<span className="mt-1 block text-[11px] font-normal">{["Giới thiệu bản thân", "Điểm mạnh", "Lý do chọn công ty"][i]}</span></th>)}<th scope="col" className="w-[28%] px-3 py-3">Điểm đã làm được</th><th scope="col" className="w-[22%] px-3 py-3">Hướng luyện tiếp</th></tr></thead>
      <tbody>{results.map(r => { const data = studentAttainment(r); const presentation = studentPresentation(r); return <tr key={r.id} className="border-t border-slate-200 align-top">
        <th scope="row" className="px-3 py-3"><span className="text-base text-blue-950">{r.candidate_name}</span>
          <button
            type="button"
            aria-expanded={student?.id === r.id}
            aria-controls={student?.id === r.id ? "student-evaluation-details" : undefined}
            aria-label={`${data.completed ? "Đã hoàn thành 3 câu" : `${data.completedCount}/3 câu có bản ghi`} — ${student?.id === r.id ? "Đóng" : "Xem"} chi tiết của ${r.candidate_name}`}
            title={student?.id === r.id ? "Nhấn để đóng chi tiết" : "Nhấn để xem chi tiết"}
            onClick={() => setSelected(student?.id === r.id ? null : { sessionId, id: r.id })}
            className={`mt-1 block cursor-pointer rounded py-1 text-left text-xs font-normal underline decoration-dotted underline-offset-4 transition-colors hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${student?.id === r.id ? "text-blue-700" : "text-slate-600"}`}
          >{data.completed ? "Đã hoàn thành 3 câu" : `${data.completedCount}/3 câu có bản ghi`}</button></th>
        {presentation.rows.map((row, i) => <td key={i} className="px-2 py-3"><div className={`rounded-xl border p-2.5 text-xs font-semibold leading-5 ${row.practiceMet ? "border-teal-200 bg-teal-50 text-teal-950" : "border-slate-200 bg-slate-50 text-slate-700"}`}>{row.label}</div></td>)}
        <td className="px-3 py-3 text-xs leading-5 text-teal-900"><ul className="space-y-2">{presentation.rows.map((row, i) => <li key={i}><strong>Q{i + 1}:</strong> {row.strength}</li>)}</ul></td><td className="px-3 py-3 text-xs leading-5 text-blue-950">{presentation.next}</td>
      </tr>; })}</tbody>
    </table></div>
    <details className="text-xs leading-5 text-slate-600"><summary className="cursor-pointer font-bold text-blue-900">Cách đọc bảng và tiêu chí chi tiết</summary>
      <p className="mt-2">Mỗi câu Q1–Q3 ghi “Đạt yêu cầu thực hành” khi có ít nhất một ý phù hợp với câu hỏi và minh chứng trong transcript đã lưu. “Đã ghi nhận câu trả lời” xác nhận có transcript nhưng chưa đủ minh chứng để kết luận; giáo viên đối chiếu phần thể hiện thực tế. “Chưa có bản ghi” nghĩa là chưa có transcript. Hoàn thành ba câu và đạt yêu cầu thực hành được ghi nhận riêng.</p>
      <p className="mt-2">Khung đầy đủ Q1/Q2/Q3 gồm 5/5/4 phần dùng để định hướng luyện tiếp, không phải ngưỡng đạt của buổi thực hành này. Ngữ pháp và từ vựng xem trong chi tiết. Không xếp hạng sinh viên hoặc tự kết luận kỹ năng nói từ transcript.</p>
      <p className="mt-2">Minh chứng ngắn được đối chiếu cả câu và đúng tiêu chí; một từ đứng riêng không tự tính đạt. Chưa đủ minh chứng không tự đồng nghĩa sinh viên chưa nói ý đó. Ứng dụng không phục hồi phần lời nói chưa được ghi nhận.</p>
    </details>
    {student && <section id="student-evaluation-details" className={panel}>
      <div className="flex items-center justify-between gap-3"><h3 className="text-xl font-black text-blue-950">Q1–Q3 · {student.candidate_name}</h3><button type="button" onClick={() => setSelected(null)} className="font-bold text-blue-700">Đóng</button></div>
      <p className="mt-2 text-xs text-slate-600">Nguồn phân tích: {mode(student.evaluation_mode)}. Kết quả là dữ liệu hỗ trợ nhận xét, không thay kết luận của giáo viên.</p>
      <div className="mt-4 grid gap-4 xl:grid-cols-3">{questions(student).map((q, i) => <QuestionCard key={i} q={q} index={i}/>)}</div>
    </section>}
  </section>;
}
