import Link from "next/link";
import { notFound } from "next/navigation";

import { buildInterviewPrompt } from "@/prompts/interviewPrompts";
import { getQuestionById } from "@/services/interviewService";
import CopyPrompt from "@/components/CopyPrompt";
import OpenChatGPT from "@/components/OpenChatGPT";
import SpeechRecorder from "@/components/SpeechRecorder";
import AudioRecorder from "@/components/AudioRecorder";
import AIEvaluation from "@/components/evaluation/AIEvaluation";
import InterviewHeader from "@/components/interview/InterviewHeader";
import InterviewQuestionCard from "@/components/interview/InterviewQuestionCard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function QuestionDetailPage({ params }: Props) {
  const { id } = await params;
  const question = getQuestionById(Number(id));

  if (!question) notFound();

  const prompt = buildInterviewPrompt(question.title);

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-xl sm:p-8 lg:p-10">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/#learning-path" className="font-semibold text-blue-600 hover:text-blue-700">
            ← Back to Learning Path
          </Link>
          <span className="text-sm text-slate-500">Guided Practice • Lesson {question.id} of 10</span>
        </div>

        <InterviewHeader />

        <InterviewQuestionCard
          title={question.title}
          description={question.description}
          category={question.category}
          level={question.level}
          duration={question.practiceDuration}
        />

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-emerald-900 sm:text-2xl">
            Suggested Confident Answer
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-emerald-900 sm:text-base sm:leading-8">
            {question.sampleAnswer}
          </p>
          <p className="mt-4 text-sm text-emerald-700">
            Use the structure and key ideas as guidance. Replace the personal details with your own experience and speak naturally.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
          <h3 className="text-lg font-bold text-blue-900">Answer checklist</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {question.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-white px-3 py-1 text-sm text-blue-700 shadow-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">🤖 AI Interview Prompt</h2>
          <div className="rounded-xl border bg-gray-100 p-5 shadow-sm">
            <pre className="whitespace-pre-wrap text-sm leading-7">{prompt}</pre>
          </div>
          <div className="mt-5 flex flex-col gap-4 sm:flex-row">
            <CopyPrompt text={prompt} />
            <OpenChatGPT />
          </div>

          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-4 text-xl font-bold">🚀 Guided Practice</h3>
            <ol className="list-decimal space-y-2 pl-6">
              <li>Read the sample answer to understand its structure.</li>
              <li>Replace the sample details with your own information.</li>
              <li>Record your answer or type it in the Your Answer box.</li>
              <li>Ask AI to evaluate your answer against this exact question.</li>
              <li>Review the feedback and try again with more confidence.</li>
            </ol>
          </div>

          <SpeechRecorder />
          <AudioRecorder />
          <AIEvaluation question={question} />
        </div>
      </div>
    </main>
  );
}
