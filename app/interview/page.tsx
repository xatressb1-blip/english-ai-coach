import InterviewEngine from "@/components/interview/InterviewEngine";

export default function InterviewPage() {
  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(191,219,254,0.32),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(224,231,255,0.4),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef2f7_100%)] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 xl:px-10 xl:py-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-[4%] top-[6%] hidden h-36 w-56 rounded-[28px] border border-white/60 bg-white/35 shadow-xl backdrop-blur-sm lg:block" />
        <div className="absolute right-[6%] top-[14%] hidden h-44 w-64 rounded-[28px] border border-white/60 bg-white/30 shadow-xl backdrop-blur-sm lg:block" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-200/55 to-transparent" />
        <div className="absolute bottom-[8%] left-1/2 hidden h-24 w-[80%] -translate-x-1/2 rounded-[36px] bg-white/28 shadow-[0_-12px_32px_rgba(15,23,42,0.08)] backdrop-blur-sm lg:block" />
        <div className="absolute left-[12%] top-[40%] h-32 w-32 rounded-full bg-blue-200/25 blur-3xl" />
        <div className="absolute right-[10%] top-[36%] h-40 w-40 rounded-full bg-indigo-200/25 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-6xl">
        <InterviewEngine />
      </div>
    </main>
  );
}
