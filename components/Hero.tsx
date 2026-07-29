import Link from "next/link";

export default function Hero() {
  return (
    <section className="px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          AI-powered interview practice
        </span>

        <h1 className="mt-6 text-3xl font-bold leading-tight text-blue-700 sm:text-4xl md:text-5xl lg:text-6xl">
          English AI Interview Coach
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg lg:text-xl">
          Practise English interviews with an AI recruiter and receive instant feedback.
        </p>

        <Link
          href="/interview"
          className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-700 sm:w-auto sm:text-lg"
        >
          Start Interview Practice
        </Link>
      </div>
    </section>
  );
}
