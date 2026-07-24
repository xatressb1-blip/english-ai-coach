"use client";

import { InterviewHistory } from "@/types/history";

interface Props {
  histories: InterviewHistory[];
}

export default function SkillAnalytics({
  histories,
}: Props) {

  if (histories.length === 0) {

    return (

      <section className="rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">

          📊 Skill Analytics

        </h2>

        <p className="mt-6 text-gray-500">

          No data available.

        </p>

      </section>

    );

  }

  const average = (values: number[]) =>
    Math.round(
      values.reduce((a, b) => a + b, 0) /
      values.length
    );

  const grammar =
    average(
      histories.map(
        item => item.evaluation.grammar.score
      )
    );

  const vocabulary =
    average(
      histories.map(
        item => item.evaluation.vocabulary.score
      )
    );

  const pronunciation =
    average(
      histories.map(
        item => item.evaluation.pronunciation.score
      )
    );

  const fluency =
    average(
      histories.map(
        item => item.evaluation.fluency.score
      )
    );

  const relevance =
    average(
      histories.map(
        item => item.evaluation.relevance.score
      )
    );

  const confidence =
    average(
      histories.map(
        item => item.evaluation.confidence.score
      )
    );

  return (

    <section className="rounded-2xl border bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        📊 Average Skill Scores

      </h2>

      <div className="mt-8 grid gap-5 md:grid-cols-2">

        <SkillRow
          title="Grammar"
          score={grammar}
        />

        <SkillRow
          title="Vocabulary"
          score={vocabulary}
        />

        <SkillRow
          title="Pronunciation"
          score={pronunciation}
        />

        <SkillRow
          title="Fluency"
          score={fluency}
        />

        <SkillRow
          title="Relevance"
          score={relevance}
        />

        <SkillRow
          title="Confidence"
          score={confidence}
        />

      </div>

    </section>

  );

}

interface SkillRowProps {

  title: string;

  score: number;

}

function SkillRow({

  title,

  score,

}: SkillRowProps) {

  return (

    <div>

      <div className="mb-2 flex justify-between">

        <span className="font-medium">

          {title}

        </span>

        <span className="font-bold text-blue-600">

          {score}

        </span>

      </div>

      <div className="h-3 rounded-full bg-gray-200">

        <div
          className="h-3 rounded-full bg-blue-600 transition-all"
          style={{
            width: `${score}%`,
          }}
        />

      </div>

    </div>

  );

}