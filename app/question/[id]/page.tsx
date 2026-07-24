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

  const question = questions.find(
    (item) => item.id === Number(id)
  );
  if (!question) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Question not found
        </h1>
      </main>
    );
  }

const prompt = buildInterviewPrompt(question.title);

  return (
    <main className="min-h-screen bg-slate-100 p-10">

     <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-10">

        <InterviewHeader />
        <InterviewProgress />

<InterviewQuestionCard
  title={question.title}
  description={question.description}
  category={question.category}
  level={question.level}
  duration={question.duration}
/>

<div className="mt-10">

  <h2 className="text-2xl font-semibold mb-4">
    🤖 AI Interview Prompt Generator
  </h2>

  <div className="bg-gray-100 rounded-xl border p-5 shadow-sm">
    <pre className="whitespace-pre-wrap text-sm leading-7">
      {prompt}
    </pre>
  </div>

  <div className="mt-5 flex gap-4">

  <CopyPrompt text={prompt} />

  <OpenChatGPT />

</div>
<div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">

  <h3 className="text-xl font-bold mb-4">
    🚀 Practice Guide
  </h3>

  <ol className="list-decimal pl-6 space-y-2">

    <li>Click <strong>Copy Prompt</strong>.</li>

    <li>Click <strong>Open ChatGPT</strong>.</li>

    <li>Paste the prompt into ChatGPT.</li>

    <li>Answer the interview question using your voice.</li>

    <li>Read the AI feedback carefully.</li>

    <li>Answer again to improve your score.</li>

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