import Link from "next/link";
import { Question } from "@/types/question";

interface QuestionCardProps {
  question: Question;
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "Personal":
      return "bg-blue-100 text-blue-700";
    case "Education":
      return "bg-green-100 text-green-700";
    case "Teamwork":
      return "bg-orange-100 text-orange-700";
    case "Career":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold sm:text-sm ${getCategoryColor(
            question.category
          )}`}
        >
          {question.category}
        </span>
        <span className="text-sm text-slate-500">⏱ {question.duration} min</span>
      </div>

      <h2 className="mt-5 break-words text-xl font-bold leading-tight text-slate-900">
        {question.title}
      </h2>

      <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600 sm:text-base">
        {question.description}
      </p>

      <p className="mt-4 font-semibold text-green-600">{question.level}</p>

      <Link
        href={`/question/${question.id}`}
        className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
      >
        Practice
      </Link>
    </article>
  );
}
