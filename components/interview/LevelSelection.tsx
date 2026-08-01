"use client";

import { useInterviewContext } from "@/context/InterviewContext";
import { TrainingLevel } from "@/types/interviewReport";

interface Props { onContinue: () => void; }

const levels: Array<{ id: TrainingLevel; name: string; subtitle: string; questions: string; tone: string }> = [
  { id: "basic", name: "Level 1 – Cơ bản", subtitle: "Build a confident interview foundation", questions: "Questions 1–3", tone: "border-blue-300 bg-blue-50" },
  { id: "advanced", name: "Level 2 – Nâng cao", subtitle: "Handle deeper recruiter questions", questions: "Questions 4–10", tone: "border-violet-300 bg-violet-50" },
];

export default function LevelSelection({ onContinue }: Props) {
  const { selectedLevel, setSelectedLevel } = useInterviewContext();
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-2xl sm:p-8 lg:p-10">
      <div className="text-center">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">Choose interview level</span>
        <h1 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl">Select the interview challenge that fits you</h1>
        <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">Each level includes its own mock interview, question-by-question AI evaluation, saved results, and Final Recruiter Report.</p>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {levels.map((level) => (
          <button key={level.id} type="button" onClick={() => setSelectedLevel(level.id)} className={`rounded-3xl border-2 p-6 text-left transition ${level.tone} ${selectedLevel === level.id ? "ring-4 ring-blue-200" : "hover:-translate-y-1"}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">{level.questions}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">{level.name}</h2>
                <p className="mt-2 text-slate-600">{level.subtitle}</p>
              </div>
              <span className="text-4xl">{level.id === "basic" ? "🌱" : "🚀"}</span>
            </div>
            <ul className="mt-5 space-y-2 text-sm text-slate-600">
              <li>✓ Virtual recruiter interview room</li>
              <li>✓ Voice or typed answers</li>
              <li>✓ AI scoring for every question</li>
              <li>✓ Final Recruiter Report for this level</li>
            </ul>
          </button>
        ))}
      </div>
      <button type="button" onClick={onContinue} className="mx-auto mt-8 block w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg hover:bg-blue-700 sm:w-auto">Continue to Interview Setup →</button>
    </section>
  );
}
