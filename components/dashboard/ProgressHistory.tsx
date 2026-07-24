"use client";

import { InterviewHistory } from "@/types/history";

interface Props {
  histories: InterviewHistory[];
}

export default function ProgressHistory({
  histories,
}: Props) {

  return (

    <section className="rounded-2xl border bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        📈 Recent Interview Results

      </h2>

      <p className="mt-2 text-gray-500">

        Your latest interview performances.

      </p>

      <div className="mt-8 space-y-4">

        {histories.length === 0 ? (

          <p className="text-gray-500">

            No interview history.

          </p>

        ) : (

          histories.slice(0, 5).map((item, index) => (

            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border p-5"
            >

              <div>

                <p className="font-semibold">

                  Interview #{histories.length - index}

                </p>

                <p className="text-sm text-gray-500">

                  {item.questionTitle}

                </p>

              </div>

              <div className="text-3xl font-bold text-blue-600">

                {item.evaluation.overall}

              </div>

            </div>

          ))

        )}

      </div>

    </section>

  );

}