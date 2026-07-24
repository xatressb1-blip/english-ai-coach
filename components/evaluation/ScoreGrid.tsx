"use client";

import { EvaluationResult } from "@/types/evaluation";

interface Props {
  result: EvaluationResult;
}

interface ScoreCardProps {
  title: string;
  score: number;
  comment: string;
}

function getScoreColor(score: number): string {
  if (score >= 9) return "border-green-500 bg-green-50";
  if (score >= 8) return "border-blue-500 bg-blue-50";
  if (score >= 7) return "border-yellow-500 bg-yellow-50";
  if (score >= 6) return "border-orange-500 bg-orange-50";

  return "border-red-500 bg-red-50";
}

function ScoreCard({
  title,
  score,
  comment,
}: ScoreCardProps) {
  return (
    <div
      className={`rounded-xl border-2 p-5 shadow-sm transition hover:shadow-md ${getScoreColor(
        score
      )}`}
    >
      <div className="flex items-center justify-between">

        <h3 className="font-bold text-gray-700">
          {title}
        </h3>

        <span className="text-3xl font-bold text-blue-600">
          {score.toFixed(1)}
        </span>

      </div>

      <p className="mt-4 text-sm leading-6 text-gray-600">
        {comment || "No comment."}
      </p>
    </div>
  );
}

export default function ScoreGrid({
  result,
}: Props) {

  return (

    <div className="mt-8">

      <h2 className="mb-5 text-2xl font-bold">
        📊 Detailed Scores
      </h2>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        <ScoreCard
          title="Grammar"
          score={result.grammar.score}
          comment={result.grammar.comment}
        />

        <ScoreCard
          title="Vocabulary"
          score={result.vocabulary.score}
          comment={result.vocabulary.comment}
        />

        <ScoreCard
          title="Pronunciation"
          score={result.pronunciation.score}
          comment={result.pronunciation.comment}
        />

        <ScoreCard
          title="Fluency"
          score={result.fluency.score}
          comment={result.fluency.comment}
        />

        <ScoreCard
          title="Relevance"
          score={result.relevance.score}
          comment={result.relevance.comment}
        />

        <ScoreCard
          title="Confidence"
          score={result.confidence.score}
          comment={result.confidence.comment}
        />

      </div>

    </div>

  );

}