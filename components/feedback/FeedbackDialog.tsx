"use client";

interface FeedbackDialogProps {

  open: boolean;

  onClose: () => void;

}

export default function FeedbackDialog({

  open,

  onClose,

}: FeedbackDialogProps) {

  if (!open) {

    return null;

  }

  return (

    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/40

        px-4
      "
    >

      <div
        className="
          w-full
          max-w-md

          rounded-2xl

          bg-white

          p-6

          shadow-2xl
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-slate-800
          "
        >
          💬 Feedback
        </h2>

        <p
          className="
            mt-4
            leading-7
            text-gray-600
          "
        >
          Thank you for trying
          <strong> English AI Coach</strong>.
        </p>

        <p
          className="
            mt-3
            leading-7
            text-gray-600
          "
        >
          Your feedback helps us improve the learning
          experience for everyone.
        </p>

        <a
          href="https://forms.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="
            mt-8
            block

            rounded-xl

            bg-blue-600

            py-3

            text-center

            font-semibold

            text-white

            transition

            hover:bg-blue-700
          "
        >
          Open Feedback Form
        </a>

        <button
          onClick={onClose}
          className="
            mt-4
            w-full

            rounded-xl

            border

            py-3

            font-medium

            transition

            hover:bg-gray-100
          "
        >
          Close
        </button>

      </div>

    </div>

  );

}