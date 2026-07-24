"use client";

interface Props {
  transcript: string;
}

export default function TranscriptCard({
  transcript,
}: Props) {

  const text = transcript.trim();

  const words =
    text.length === 0
      ? 0
      : text.split(/\s+/).length;

  //----------------------------------

  const seconds =
    Math.max(
      1,
      Math.round(words / 2.5)
    );

  //----------------------------------

  let status = "Empty";

  let color =
    "text-gray-500";

  if (words >= 1 && words <= 9) {

    status = "Too Short";

    color = "text-red-600";

  }

  else if (words <= 25) {

    status = "Short";

    color = "text-orange-500";

  }

  else if (words <= 60) {

    status = "Good";

    color = "text-blue-600";

  }

  else {

    status = "Excellent";

    color = "text-green-600";

  }

  return (

    <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

      <h3 className="text-lg font-bold">

        🖋 Transcript

      </h3>

      <div className="mt-5 grid grid-cols-3 gap-4">

        <div className="rounded-lg border p-4">

          <p className="text-xs text-gray-500">

            Words

          </p>

          <p className="mt-2 text-3xl font-bold">

            {words}

          </p>

        </div>

        <div className="rounded-lg border p-4">

          <p className="text-xs text-gray-500">

            Speaking Time

          </p>

          <p className="mt-2 text-3xl font-bold">

            {seconds}s

          </p>

        </div>

        <div className="rounded-lg border p-4">

          <p className="text-xs text-gray-500">

            Status

          </p>

          <p className={`mt-2 text-xl font-bold ${color}`}>

            {status}

          </p>

        </div>

      </div>

      <div className="mt-6 rounded-lg border bg-gray-50 p-5">

        <p className="whitespace-pre-wrap break-words leading-7 text-gray-700">

          {text || "No transcript available."}

        </p>

      </div>

    </div>

  );

}