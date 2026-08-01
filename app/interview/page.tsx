import InterviewEngine from "@/components/interview/InterviewEngine";

export default function InterviewPage() {
  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50 px-2 py-4 sm:px-4 sm:py-6 lg:px-6 lg:py-8">
      <div className="mx-auto w-full max-w-7xl">
        <InterviewEngine />
      </div>
    </main>
  );
}
