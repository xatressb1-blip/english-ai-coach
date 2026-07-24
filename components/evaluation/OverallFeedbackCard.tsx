"use client";

interface Props {
  overall: number;
}

function getTitle(score: number) {

  if (score >= 9)
    return "🌟 Excellent Interview";

  if (score >= 8)
    return "🎉 Very Good Interview";

  if (score >= 7)
    return "👍 Good Performance";

  if (score >= 6)
    return "🙂 Fair Performance";

  return "💪 Keep Practicing";
}

function getMessage(score: number) {

  if (score >= 9)
    return "Excellent work! Your English communication is clear, confident and suitable for professional interviews.";

  if (score >= 8)
    return "Very good performance. Continue improving fluency and confidence to reach an excellent level.";

  if (score >= 7)
    return "Good job. Your answer is understandable, but there is still room for improvement.";

  if (score >= 6)
    return "Your interview answer is acceptable, but grammar, vocabulary and fluency should be improved.";

  return "Your answer needs significant improvement. Focus on grammar, vocabulary, pronunciation and confidence before your next interview.";
}

function getColor(score: number) {

  if (score >= 9)
    return "border-green-300 bg-green-50";

  if (score >= 8)
    return "border-blue-300 bg-blue-50";

  if (score >= 7)
    return "border-yellow-300 bg-yellow-50";

  if (score >= 6)
    return "border-orange-300 bg-orange-50";

  return "border-red-300 bg-red-50";
}

export default function OverallFeedbackCard({
  overall,
}: Props) {

  return (

    <div
      className={`mt-8 rounded-2xl border p-6 shadow-sm ${getColor(overall)}`}
    >

      <h3 className="text-2xl font-bold">

        {getTitle(overall)}

      </h3>

      <p className="mt-4 leading-8 text-gray-700">

        {getMessage(overall)}

      </p>

    </div>

  );

}