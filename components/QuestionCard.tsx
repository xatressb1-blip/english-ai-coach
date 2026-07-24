import { Question } from "@/types/question";
import Link from "next/link";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {

  const getCategoryColor = (category: string) => {

    switch (category) {

      case "Personal":
        return "bg-blue-100 text-blue-700";

      case "Education":
        return "bg-green-100 text-green-700";

      case "Teamwork":
        return "bg-orange-100 text-orange-700";

      case "Career":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 p-6">

      <div className="flex justify-between items-center">

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(
            question.category
          )}`}
        >
          {question.category}
        </span>

        <span className="text-gray-500 text-sm">
          ⏱ {question.duration} min
        </span>

      </div>

      <h2 className="text-xl font-bold mt-5">
        {question.title}
      </h2>

      <p className="text-gray-600 mt-3">
        {question.description}
      </p>

      <p className="mt-4 font-semibold text-green-600">
        {question.level}
      </p>
<Link
  href={`/question/${question.id}`}
  className="block mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 transition text-center"
>
  Practice
</Link>

    </div>
  );
}