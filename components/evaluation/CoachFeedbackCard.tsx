"use client";

import { CoachResult } from "@/types/evaluation";

interface Props {

  coach: CoachResult;

}

export default function CoachFeedbackCard({

  coach,

}: Props) {

  return (

    <div className="mt-8 rounded-2xl border bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        💡 AI Interview Coach

      </h2>

      {

        coach.good ? (

          <div className="mt-6 rounded-xl bg-green-50 p-5">

            <p className="text-lg font-semibold text-green-700">

              ✅ Excellent!

            </p>

            <p className="mt-2 text-gray-700">

              Your answer contains the main ideas expected for this interview question.

            </p>

          </div>

        ) : (

          <div className="mt-6 rounded-xl bg-yellow-50 p-5">

            <p className="text-lg font-semibold text-yellow-700">

              Suggestions for Improvement

            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-gray-700">

              {

                coach.feedback.map(

                  (item, index) => (

                    <li key={index}>

                      {item}

                    </li>

                  )

                )

              }

            </ul>

          </div>

        )

      }

    </div>

  );

}