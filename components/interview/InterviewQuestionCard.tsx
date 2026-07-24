"use client";

interface InterviewQuestionCardProps {
  title: string;
  description: string;
  category: string;
  level: string;
  duration: number;
}

export default function InterviewQuestionCard({
  title,
  description,
  category,
  level,
  duration,
}: InterviewQuestionCardProps) {
  const getCategoryColor = () => {
    switch (category) {
      case "Personal":
        return "bg-blue-100 text-blue-700";

      case "Education":
        return "bg-green-100 text-green-700";

      case "Experience":
        return "bg-purple-100 text-purple-700";

      case "Career":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelColor = () => {
    switch (level) {
      case "Beginner":
        return "bg-green-100 text-green-700";

      case "Intermediate":
        return "bg-yellow-100 text-yellow-700";

      case "Advanced":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <section className="mt-8">

      <h2 className="text-4xl font-bold text-slate-800">
        {title}
      </h2>

      <div className="mt-4 flex flex-wrap gap-3">

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${getCategoryColor()}`}
        >
          {category}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${getLevelColor()}`}
        >
          {level}
        </span>

        <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
          {duration} min
        </span>

      </div>

      <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">

        <h3 className="mb-4 text-2xl font-semibold">
          📄 Interview Question
        </h3>

        <p className="text-lg leading-8 text-gray-700">
          {description}
        </p>

      </div>

    </section>
  );
}