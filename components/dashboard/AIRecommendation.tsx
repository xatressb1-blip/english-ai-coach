"use client";

import { InterviewHistory } from "@/types/history";

interface Props {
  histories: InterviewHistory[];
}

export default function AIRecommendation({
  histories,
}: Props) {

  if (histories.length === 0) {

    return (

      <section className="rounded-2xl border bg-white p-8 shadow-sm">

        <h2 className="text-2xl font-bold">

          💡 AI Coach Recommendation

        </h2>

        <p className="mt-5 text-gray-500">

          Complete an interview to receive personalized recommendations.

        </p>

      </section>

    );

  }

  const latest =
    histories[0].evaluation;

  const recommendations: string[] = [];

  if (latest.grammar.score < 7) {

    recommendations.push(
      "Review basic grammar structures before answering interview questions."
    );

  }

  if (latest.vocabulary.score < 7) {

    recommendations.push(
      "Use a wider range of vocabulary instead of repeating common words."
    );

  }

  if (latest.pronunciation.score < 7) {

    recommendations.push(
      "Practice pronunciation by listening and repeating native speakers."
    );

  }

  if (latest.fluency.score < 7) {

    recommendations.push(
      "Speak more smoothly. Avoid long pauses while thinking."
    );

  }

  if (latest.relevance.score < 7) {

    recommendations.push(
      "Focus on answering the question directly. Keep your answer within 3–5 meaningful sentences."
    );

  }

  if (latest.confidence.score < 7) {

    recommendations.push(
      "Maintain eye contact, smile naturally, and speak with confidence."
    );

  }

  if (recommendations.length === 0) {

    recommendations.push(
      "Excellent performance! Keep practicing to maintain your high level."
    );

  }

  return (

    <section className="rounded-2xl border bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        💡 AI Coach Recommendation

      </h2>

      <ul className="mt-6 space-y-4">

        {recommendations.map((item, index) => (

          <li
            key={index}
            className="rounded-xl bg-blue-50 p-5"
          >

            ✅ {item}

          </li>

        ))}

      </ul>

    </section>

  );

}