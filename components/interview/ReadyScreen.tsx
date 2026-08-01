"use client";

interface Props {
  current: number;
  total: number;
  onReady: () => void;
}

export default function ReadyScreen({ current, total, onReady }: Props) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 px-6 py-12 text-center text-white sm:px-10">
        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-white/15 bg-white/10 text-6xl shadow-xl">👩‍💼</div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">Ms. Emma • AI Recruiter</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Question {current} of {total}</h1>
        <div className="mx-auto mt-5 max-w-xl rounded-2xl border border-white/10 bg-white/10 p-5 text-base leading-7 text-slate-200 backdrop-blur">
          “Take a breath. When you press Ready, I will ask the next question aloud. Listen carefully before answering.”
        </div>
      </div>

      <div className="p-6 text-center sm:p-8">
        <div className="mx-auto grid max-w-2xl gap-3 text-left text-sm text-slate-600 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">1. Listen to the full question.</div>
          <div className="rounded-xl bg-slate-50 p-4">2. Pause and organize your answer.</div>
          <div className="rounded-xl bg-slate-50 p-4">3. Speak clearly and naturally.</div>
        </div>

        <button
          type="button"
          onClick={onReady}
          className="mt-7 w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[.98] sm:w-auto sm:min-w-72"
        >
          I’m Ready — Ask Me
        </button>
      </div>
    </section>
  );
}
