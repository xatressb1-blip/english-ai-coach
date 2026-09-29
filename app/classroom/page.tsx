import Link from "next/link";

export default function ClassroomPage() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-gradient-to-b from-slate-100 via-slate-50 to-blue-50 px-4 py-8">
      <section className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl sm:p-10">
        <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-600">
          Teaching Demo · Fix 43
        </span>
        <h1 className="mt-5 text-3xl font-black text-slate-950">Classroom Rapid Mode is locked</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
          The current teaching-demonstration workflow uses the Individual Mock Interview. Peer observers assess the candidate on paper forms and present their feedback after the three interview questions.
        </p>
        <Link
          href="/interview"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700"
        >
          Continue to Mock Interview →
        </Link>
      </section>
    </main>
  );
}
