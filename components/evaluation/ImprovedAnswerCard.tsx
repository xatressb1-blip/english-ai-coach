"use client";

import { useState } from "react";

interface Props {
  improvedAnswer: string;
}

export default function ImprovedAnswerCard({
  improvedAnswer,
}: Props) {

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {

    if (!improvedAnswer) return;

    try {

      await navigator.clipboard.writeText(improvedAnswer);

      setCopied(true);

      setTimeout(() => {

        setCopied(false);

      }, 2000);

    } catch {

      alert("Unable to copy text.");

    }

  };

  if (!improvedAnswer) {

    return (

      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">

        <h3 className="flex items-center gap-2 text-lg font-bold text-green-700">

          ✅ Improved Answer

        </h3>

        <p className="mt-3 text-gray-700">

          Gemini did not generate an improved answer.

        </p>

      </div>

    );

  }

  return (

    <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <h3 className="flex items-center gap-2 text-lg font-bold text-green-700">

          ✅ Improved Answer

        </h3>

        <button
          onClick={handleCopy}
          className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
            copied
              ? "bg-blue-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>

      </div>

      <p className="mt-5 rounded-lg border bg-white p-5 leading-8 text-gray-700">

        {improvedAnswer}

      </p>

    </div>

  );

}