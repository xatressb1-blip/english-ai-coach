"use client";

import { InterviewHistory } from "@/types/history";

interface Props {
  histories: InterviewHistory[];
}

export default function CoachInsights({
  histories,
}: Props) {

  if (histories.length === 0) {

    return (

      <section className="rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">

          🤖 AI Coach

        </h2>

        <p className="mt-6 text-gray-500">

          Complete at least one interview to receive AI coaching insights.

        </p>

      </section>

    );

  }

  const average = (values: number[]) =>
    values.reduce((a, b) => a + b, 0) /
    values.length;

  const skills = [

    {
      name: "Grammar",
      score: average(
        histories.map(h => h.evaluation.grammar.score)
      ),
    },

    {
      name: "Vocabulary",
      score: average(
        histories.map(h => h.evaluation.vocabulary.score)
      ),
    },

    {
      name: "Pronunciation",
      score: average(
        histories.map(h => h.evaluation.pronunciation.score)
      ),
    },

    {
      name: "Fluency",
      score: average(
        histories.map(h => h.evaluation.fluency.score)
      ),
    },

    {
      name: "Relevance",
      score: average(
        histories.map(h => h.evaluation.relevance.score)
      ),
    },

    {
      name: "Confidence",
      score: average(
        histories.map(h => h.evaluation.confidence.score)
      ),
    },

  ];

  const strongest =
    [...skills].sort(
      (a, b) => b.score - a.score
    )[0];

  const weakest =
    [...skills].sort(
      (a, b) => a.score - b.score
    )[0];

  return (

    <section className="rounded-2xl border bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        🤖 AI Coach Insights

      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <div className="rounded-xl bg-green-50 p-6">

          <h3 className="text-xl font-bold text-green-700">

            🏆 Strongest Skill

          </h3>

          <p className="mt-5 text-3xl font-bold">

            {strongest.name}

          </p>

          <p className="mt-2 text-lg text-gray-600">

            Average Score

            {" "}

            {strongest.score.toFixed(1)}

          </p>

        </div>

        <div className="rounded-xl bg-yellow-50 p-6">

          <h3 className="text-xl font-bold text-yellow-700">

            ⚠ Needs Improvement

          </h3>

          <p className="mt-5 text-3xl font-bold">

            {weakest.name}

          </p>

          <p className="mt-2 text-lg text-gray-600">

            Average Score

            {" "}

            {weakest.score.toFixed(1)}

          </p>

        </div>

      </div>

    </section>

  );

}