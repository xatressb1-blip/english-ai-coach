"use client";

interface Props {
  title: string;
  score: number;
}

function getProgressColor(score: number) {

  if (score >= 8) {
    return "bg-green-500";
  }

  if (score >= 6) {
    return "bg-yellow-500";
  }

  return "bg-red-500";
}

export default function SkillCard({
  title,
  score,
}: Props) {

  return (

    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <h3 className="font-semibold">
          {title}
        </h3>

        <span className="text-xl font-bold text-blue-600">
          {score}
        </span>

      </div>

      <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-200">

        <div
          className={`h-full ${getProgressColor(score)}`}
          style={{
            width: `${score * 10}%`,
          }}
        />

      </div>

    </div>

  );

}