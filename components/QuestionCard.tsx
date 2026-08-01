import Link from "next/link";
import { Question } from "@/types/question";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Personal":
        return "bg-blue-100 text-blue-700";
      case "Company Fit":
        return "bg-violet-100 text-violet-700";
      case "Goals":
        return "bg-emerald-100 text-emerald-700";
      case "Teamwork":
        return "bg-orange-100 text-orange-700";
      case "Work Style":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getCategoryColor(
            question.category
          )}`}
        >
          {question.category}
        </span>

        <span className="text-sm text-slate-500">⏱ {question.duration} min</span>
      </div>

      <h2 className="mt-5 min-h-[64px] text-xl font-bold leading-8 text-slate-900">
        {question.title}
      </h2>

      <p className="mt-3 min-h-[72px] text-sm leading-7 text-slate-600">
        {question.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="font-semibold text-green-600">{question.level}</p>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          Model answer ready
        </span>
      </div>

      <Link
        href={`/question/${question.id}`}
        className="mt-6 block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
      >
        Practice
      </Link>
    </div>
  );
}
