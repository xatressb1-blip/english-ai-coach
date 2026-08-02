import Link from "next/link";
import { notFound } from "next/navigation";

import { getQuestionById, getTotalQuestions } from "@/services/interviewService";
import SpeechRecorder from "@/components/SpeechRecorder";
import AIEvaluation from "@/components/evaluation/AIEvaluation";
import GuidedPracticePanel from "@/components/practice/GuidedPracticePanel";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuestionDetailPage({ params }: Props) {
  const { id } = await params;
  const question = getQuestionById(Number(id));

  if (!question) notFound();

  const totalQuestions = getTotalQuestions();
  const nextQuestionId = question.id < totalQuestions ? question.id + 1 : null;
  const levelLabel = question.trainingLevel === "basic" ? "Cơ bản" : "Nâng cao";
  const progress = Math.round((question.id / totalQuestions) * 100);

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-4 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link
            href="/#learning-path"
            className="font-semibold text-blue-600 transition hover:text-blue-700"
          >
            ← Back to Learning Path
          </Link>

          <div className="text-sm text-slate-500">
            Lesson {question.id} of {totalQuestions} · Level {question.trainingLevel === "basic" ? "1" : "2"} – {levelLabel}
          </div>
        </div>

        <div className="mb-4 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <GuidedPracticePanel question={question} />

        <section className="mt-5">
          <SpeechRecorder />
          <AIEvaluation question={question} />
        </section>

        <div className="mt-5 flex flex-col gap-3 pb-8 sm:flex-row sm:justify-between">
          <Link
            href="/#learning-path"
            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Return to Learning Path
          </Link>

          {nextQuestionId && (
            <Link
              href={`/question/${nextQuestionId}`}
              className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              Next Lesson →
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
