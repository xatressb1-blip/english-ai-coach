"use client";

interface Props {
  suggestions: string[];
}

export default function SuggestionsCard({
  suggestions,
}: Props) {

  if (!suggestions || suggestions.length === 0) {

    return (

      <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">

        <h3 className="flex items-center gap-2 text-lg font-bold text-blue-700">

          💡 Suggestions

        </h3>

        <p className="mt-3 leading-7 text-gray-700">

          Great job! There are no additional suggestions from Gemini.
          Keep practicing to maintain your speaking performance.

        </p>

      </div>

    );

  }

  return (

    <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">

      <h3 className="flex items-center gap-2 text-lg font-bold text-blue-700">

        💡 Suggestions

      </h3>

      <p className="mt-2 text-sm text-gray-600">

        Here are some recommendations to improve your interview answer.

      </p>

      <div className="mt-5 space-y-4">

        {suggestions.map((item, index) => (

          <div
            key={index}
            className="rounded-lg border bg-white p-4 transition hover:shadow-md"
          >

            <div className="flex items-center justify-between">

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">

                Suggestion {index + 1}

              </span>

              <span className="text-xl">

                💡

              </span>

            </div>

            <p className="mt-3 leading-7 text-gray-700">

              {item}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}