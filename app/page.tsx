import Link from "next/link";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import QuestionCard from "@/components/QuestionCard";
import { interviewQuestions } from "@/data/interviewQuestions";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100">
      <Navbar />
      <Hero />

      <section id="learning-path" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
            Learning Path
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            Build confidence one interview question at a time
          </h2>
          <p className="mt-3 text-base leading-8 text-slate-600">
            Learn the structure, review a confident sample answer, practise by voice or text, and receive question-specific AI feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {interviewQuestions.map((question, index) => (
            <QuestionCard key={question.id} question={question} index={index} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-9 lg:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-blue-200">
                Full Mock Interview
              </span>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Enter the virtual interview room
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                Meet the AI recruiter, answer all 10 questions in sequence, and practise responding under realistic interview pressure. Sample answers stay hidden during this mode.
              </p>

              <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
                <span className="rounded-full bg-white/10 px-4 py-2">10 recruiter questions</span>
                <span className="rounded-full bg-white/10 px-4 py-2">Voice interaction</span>
                <span className="rounded-full bg-white/10 px-4 py-2">AI feedback</span>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <div className="text-6xl">🤖</div>
              <p className="mt-3 font-semibold text-blue-100">AI Recruiter is ready</p>
              <Link
                href="/interview"
                className="mt-6 block rounded-xl bg-blue-500 px-6 py-4 font-bold text-white transition hover:bg-blue-400"
              >
                Start Mock Interview
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
