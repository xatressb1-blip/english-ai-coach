import { Lesson } from "@/types/lesson";

interface LessonCardProps {
  lesson: Lesson;
}

export default function LessonCard({ lesson }: LessonCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold">
        {lesson.title}
      </h2>

      <p className="mt-2 text-gray-600">
        {lesson.description}
      </p>

      <div className="mt-4 text-sm text-gray-500">
        <p>Level: {lesson.level}</p>
        <p>Duration: {lesson.duration} minutes</p>
      </div>

      <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        Start Practice
      </button>
    </div>
  );
}