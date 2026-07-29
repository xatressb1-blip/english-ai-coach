import Link from "next/link";
import { Lesson } from "@/types/lesson";

interface LessonCardProps {
  lesson: Lesson;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg sm:p-6">
      <h2 className="break-words text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
        {lesson.title}
      </h2>

      <p className="mt-3 flex-1 break-words text-sm leading-6 text-slate-600 sm:text-base">
        {lesson.description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Level</p>
          <p className="mt-1 font-semibold text-slate-700">{lesson.level}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Duration</p>
          <p className="mt-1 font-semibold text-slate-700">{lesson.duration} min</p>
        </div>
      </div>

      <Link
        href="/interview"
        className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
      >
        Start Practice
      </Link>
    </article>
  );
}
