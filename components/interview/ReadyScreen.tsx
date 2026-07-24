"use client";

interface Props {
  current: number;
  total: number;
  onReady: () => void;
}

export default function ReadyScreen({
  current,
  total,
  onReady,
}: Props) {
  return (
    <div className="rounded-2xl border bg-white p-12 shadow-xl text-center">

      <div className="text-7xl">
        🎤
      </div>

      <h2 className="mt-6 text-4xl font-bold text-gray-800">
        English AI Interview
      </h2>

      <p className="mt-6 text-xl text-blue-600 font-semibold">
        Question {current} of {total}
      </p>

      <p className="mt-8 text-lg leading-8 text-gray-600">
        Take a deep breath.
        <br />
        When you are ready,
        click the button below.
      </p>

      <button
        onClick={onReady}
        className="mt-10 rounded-xl bg-blue-600 px-10 py-4 text-xl font-bold text-white transition hover:bg-blue-700"
      >
        ▶ READY
      </button>

    </div>
  );
}