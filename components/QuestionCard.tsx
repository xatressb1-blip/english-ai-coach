import Link from "next/link";
import { InterviewQuestion } from "@/types/InterviewQuestion";

interface QuestionCardProps {
  question: InterviewQuestion;
  index: number;
}

export default function QuestionCard({ question, index }: QuestionCardProps) {
  return (
    <article className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="absolute -left-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-100 bg-blue-600 font-bold text-white shadow">
        {index + 1}
      </div>

      <div className="ml-5 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {question.category}
        </span>
        <span className="text-sm text-slate-500">
          {question.practiceDuration} min
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold leading-8 text-slate-900">
        {question.shortTitle}
      </h3>

      <p className="mt-2 text-sm font-medium leading-6 text-blue-700">
        {question.title}
      </p>

      <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-600">
        {question.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="font-semibold text-emerald-600">{question.level}</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          Guided practice
        </span>
      </div>

      <Link
        href={`/question/${question.id}`}
        className="mt-6 block w-full rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
      >
        Start Lesson
      </Link>
    </article>
  );
}
