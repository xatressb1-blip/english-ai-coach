import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-4 py-16 text-center sm:py-20">
      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
        AI-powered recruiter simulation
      </span>

      <h1 className="mx-auto mt-6 max-w-5xl text-4xl font-bold tracking-tight text-blue-700 sm:text-5xl lg:text-6xl">
        English AI Interview Coach
      </h1>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
        Practice with an AI recruiter, improve every answer, and build the confidence to face a real business interview.
      </p>

      <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="#learning-path"
          className="rounded-xl bg-blue-600 px-7 py-4 text-base font-bold text-white transition hover:bg-blue-700"
        >
          Start Guided Practice
        </Link>
        <Link
          href="/interview"
          className="rounded-xl border border-slate-300 bg-white px-7 py-4 text-base font-bold text-slate-800 transition hover:bg-slate-50"
        >
          Enter Mock Interview
        </Link>
      </div>
    </section>
  );
}
