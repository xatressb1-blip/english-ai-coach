import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuestionCard from "@/components/QuestionCard";
import { interviewQuestions } from "@/data/interviewQuestions";

export default function Home() {
  const basic = interviewQuestions.filter((question) => question.trainingLevel === "basic");
  const advanced = interviewQuestions.filter((question) => question.trainingLevel === "advanced");

  const renderLevel = (title: string, subtitle: string, items: typeof interviewQuestions, startNumber: number, accent: string) => (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className={`rounded-3xl border p-6 sm:p-8 ${accent}`}>
        <div className="mb-7 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-[.18em] text-slate-500">Learning Path</p><h2 className="mt-2 text-3xl font-bold text-slate-900">{title}</h2><p className="mt-2 max-w-3xl leading-7 text-slate-600">{subtitle}</p></div>
          <Link href="/interview" className="rounded-xl bg-slate-900 px-6 py-3 text-center font-bold text-white">Start {title} Mock Interview</Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">{items.map((question, index) => <QuestionCard key={question.id} question={question} index={startNumber + index - 1} />)}</div>
      </div>
    </section>
  );

  return <main className="min-h-screen bg-slate-100"><Navbar /><Hero />
    {renderLevel("Level 1 – Cơ bản", "Questions 1–3: build a confident foundation with self-introduction, strengths, and company motivation.", basic, 1, "border-blue-200 bg-blue-50/50")}
    {renderLevel("Level 2 – Nâng cao", "Questions 4–10: practise deeper recruiter questions about value, goals, pressure, teamwork, change, and motivation.", advanced, 4, "border-violet-200 bg-violet-50/50")}
  </main>;
}
