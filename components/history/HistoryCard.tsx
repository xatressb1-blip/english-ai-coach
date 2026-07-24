"use client";

import {
  InterviewHistory,
  formatHistoryDate,
} from "./HistoryTypes";

interface Props {
  history: InterviewHistory;
}

export default function HistoryCard({
  history,
}: Props) {

  const evaluation =
    history.evaluation;

  return (

    <div className="rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>

          <h3 className="text-xl font-bold text-gray-800">

            {history.questionTitle}

          </h3>

          <p className="mt-2 text-sm text-gray-500">

            {formatHistoryDate(history.createdAt)}

          </p>

        </div>

        <div className="rounded-xl bg-blue-600 px-5 py-3 text-center text-white">

          <p className="text-xs uppercase">

            Overall

          </p>

          <p className="text-3xl font-bold">

            {evaluation.overall}

          </p>

        </div>

      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">

        <Skill
          title="Grammar"
          value={evaluation.grammar.score}
        />

        <Skill
          title="Vocabulary"
          value={evaluation.vocabulary.score}
        />

        <Skill
          title="Pronunciation"
          value={evaluation.pronunciation.score}
        />

        <Skill
          title="Fluency"
          value={evaluation.fluency.score}
        />

        <Skill
          title="Relevance"
          value={evaluation.relevance.score}
        />

        <Skill
          title="Confidence"
          value={evaluation.confidence.score}
        />

      </div>

      {evaluation.suggestions.length > 0 && (

        <div className="mt-6 rounded-xl bg-gray-50 p-4">

          <h4 className="font-semibold">

            AI Suggestions

          </h4>

          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">

            {evaluation.suggestions.map(
              (item, index) => (

                <li key={index}>

                  {item}

                </li>

              )
            )}

          </ul>

        </div>

      )}

    </div>

  );

}

interface SkillProps {

  title: string;

  value: number;

}

function Skill({

  title,

  value,

}: SkillProps) {

  return (

    <div className="rounded-xl border bg-gray-50 p-4 text-center">

      <p className="text-sm text-gray-500">

        {title}

      </p>

      <p className="mt-2 text-2xl font-bold text-blue-600">

        {value}

      </p>

    </div>

  );

}