"use client";

interface FeedbackButtonProps {
  onClick: () => void;
}

export default function FeedbackButton({
  onClick,
}: FeedbackButtonProps) {

  return (

    <button
      onClick={onClick}
      className="
        fixed

        bottom-5
        right-5

        z-50

        rounded-full

        bg-blue-600

        px-5
        py-3

        text-sm
        font-semibold

        text-white

        shadow-xl

        transition-all

        hover:bg-blue-700

        active:scale-95
      "
    >
      💬 Feedback
    </button>

  );

}