import { questions } from "@/data/questions";
import { buildInterviewPrompt } from "@/prompts/interviewPrompts";
import CopyPrompt from "@/components/CopyPrompt";
import OpenChatGPT from "@/components/OpenChatGPT";
import SpeechRecorder from "@/components/SpeechRecorder";
import AudioRecorder from "@/components/AudioRecorder";
import AIEvaluation from "@/components/evaluation/AIEvaluation";
import InterviewHeader from "@/components/interview/InterviewHeader";
import InterviewProgress from "@/components/interview/InterviewProgress";
import InterviewQuestionCard from "@/components/interview/InterviewQuestionCard";
import InterviewNavigator from "@/components/interview/InterviewNavigator";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuestionDetailPage({ params }: Props) {
  const { id } = await params;

  const question = questions.find((item) => item.id === Number(id));

  if (!question) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-3xl font-bold">Question not found</h1>
      </main>
    );
  }

  const prompt = buildInterviewPrompt(question.title);

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl rounded-2xl bg-white p-6 shadow-xl sm:p-8 lg:p-10">
        <InterviewHeader />
        <InterviewProgress />

        <InterviewQuestionCard
          title={question.title}
          description={question.description}
          category={question.category}
          level={question.level}
          duration={question.duration}
        />

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:p-6">
          <h2 className="text-xl font-bold text-emerald-900 sm:text-2xl">
            Suggested Confident Answer
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-emerald-900 sm:text-base sm:leading-8">
            {question.sampleAnswer}
          </p>
          <p className="mt-4 text-sm text-emerald-700">
            Use this answer as a reference. You do not need to copy it exactly. Try to answer naturally in your own words.
          </p>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">🤖 AI Interview Prompt Generator</h2>

          <div className="rounded-xl border bg-gray-100 p-5 shadow-sm">
            <pre className="whitespace-pre-wrap text-sm leading-7">{prompt}</pre>
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row">
            <CopyPrompt text={prompt} />
            <OpenChatGPT />
          </div>

          <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-4 text-xl font-bold">🚀 Practice Guide</h3>

            <ol className="list-decimal space-y-2 pl-6">
              <li>Read the sample answer once to understand the structure.</li>
              <li>Click <strong>Copy Prompt</strong>.</li>
              <li>Click <strong>Open ChatGPT</strong>.</li>
              <li>Paste the prompt into ChatGPT.</li>
              <li>Answer the interview question using your own voice and ideas.</li>
              <li>Read the AI feedback carefully and answer again to improve your score.</li>
            </ol>
          </div>

          <SpeechRecorder />
          <AudioRecorder />
          <AIEvaluation />
          <InterviewNavigator />
        </div>
      </div>
    </main>
  );
}
