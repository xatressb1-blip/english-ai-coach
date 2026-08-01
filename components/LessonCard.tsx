import Link from "next/link";
import { Lesson } from "@/types/lesson";

interface LessonCardProps {
  lesson: Lesson;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900">
        {lesson.title}
      </h2>

      <p className="mt-2 min-h-[56px] text-sm leading-7 text-slate-600">
        {lesson.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Level</p>
          <p className="mt-1 font-semibold text-slate-800">{lesson.level}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 text-slate-600">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">Duration</p>
          <p className="mt-1 font-semibold text-slate-800">{lesson.duration} min</p>
        </div>
      </div>

      <Link
        href={`/question/${lesson.questionId}`}
        className="mt-5 block w-full rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
      >
        Start Practice
      </Link>
    </div>
  );
}
