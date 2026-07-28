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
    <section
  className="
    mt-6
    sm:mt-8
    lg:mt-10
  "
>

      <h2
  className="
    text-2xl
    sm:text-3xl
    lg:text-4xl

    font-bold

    leading-tight

    text-slate-800
  "
>
        {title}
      </h2>

      <div
  className="
    mt-4

    flex
    flex-wrap

    gap-2
    sm:gap-3
  "
>

        <span
          className={`
rounded-full

px-3
py-1.5

text-xs
sm:text-sm

font-semibold

${getCategoryColor()}
`}
        >
          {category}
        </span>

        <span
         className={`
rounded-full

px-3
py-1.5

text-xs
sm:text-sm

font-semibold

${getLevelColor()}
`}
        >
          {level}
        </span>

        <span className="
rounded-full

bg-orange-100

px-3
py-1.5

text-xs
sm:text-sm

font-semibold

text-orange-700
">
          {duration} min
        </span>

      </div>

      <div
  className="
    mt-6
    sm:mt-8

    rounded-2xl

    border-l-4
    border-l-blue-600

    border
    border-slate-200

    bg-gradient-to-br
    from-white
    to-slate-50

    p-4
    sm:p-5
    lg:p-8

    shadow-md

    transition-all
  "
>

        <h3
  className="
    mb-4

    text-lg
    sm:text-xl
    lg:text-2xl

    font-semibold

    text-slate-800
  "
>
          🎯 Interview Question
        </h3>
<hr className="mb-5 border-slate-200" />
<div className="mb-4">

  <span
    className="
      inline-flex
      items-center

      rounded-full

      bg-blue-100

      px-3
      py-1

      text-xs
      font-semibold

      uppercase

      tracking-wide

      text-blue-700
    "
  >
    🤖 AI Recruiter asks
    
  </span>

</div>
<div className="mt-5 flex items-start gap-4">

    <div
        className="
            flex
            h-12
            w-12
            sm:h-14
            sm:w-14
            items-center
            justify-center

            rounded-full

            bg-gradient-to-br
            from-blue-600
            to-indigo-700

            text-2xl

            text-white

            shadow-md
        "
    >
        🤖
    </div>

    <div className="flex-1">
      <div
    className="
        rounded-2xl

        bg-blue-50

        p-5

        shadow-sm
    "
>
        <p
  className="
    text-lg
    sm:text-xl

    font-medium

    leading-9

    text-slate-800
  "
>
          {description}
        </p>
</div>

</div>

</div>
      </div>

    </section>
  );
}