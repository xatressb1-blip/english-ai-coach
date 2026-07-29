"use client";

import { useInterviewContext } from "@/context/InterviewContext";
import { InterviewState } from "@/services/interviewFlowService";

const STATUS_STYLES: Record<string, { icon: string; label: string; className: string }> = {
  [InterviewState.IDLE]: {
    icon: "⚪",
    label: "Chờ",
    className: "bg-slate-100 text-slate-700",
  },
  [InterviewState.ASKING]: {
    icon: "🤖",
    label: "Đặt câu hỏi",
    className: "bg-blue-100 text-blue-700",
  },
  [InterviewState.LISTENING]: {
    icon: "🎤",
    label: "Lắng nghe",
    className: "bg-red-100 text-red-700",
  },
  [InterviewState.EVALUATING]: {
    icon: "🧠",
    label: "Đánh giá",
    className: "bg-violet-100 text-violet-700",
  },
  [InterviewState.READY_NEXT]: {
    icon: "✅",
    label: "Phản hồi",
    className: "bg-green-100 text-green-700",
  },
  [InterviewState.FINISHED]: {
    icon: "🎉",
    label: "Hoàn tất",
    className: "bg-green-100 text-green-700",
  },
};

export default function InterviewHeader() {
  const {
    currentQuestionIndex,
    totalQuestions,
    completedQuestions,
    interviewFinished,
    flow,
  } = useInterviewContext();

  const progress =
    totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

  const remaining = Math.max(totalQuestions - completedQuestions, 0);
  const status = STATUS_STYLES[flow.state] ?? STATUS_STYLES[InterviewState.IDLE];

  return (
    <header className="space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold leading-tight text-slate-800 sm:text-3xl lg:text-4xl">
          🤖 Huấn luyện viên phỏng vấn tiếng Anh bằng AI
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Luyện tập phỏng vấn với AI và nhận phản hồi tức thì.
        </p>
      </div>

      {!interviewFinished ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 sm:p-4">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <SummaryCard
                label="Câu hỏi"
                value={`${currentQuestionIndex + 1} / ${totalQuestions}`}
                valueClass="text-blue-700"
              />
              <SummaryCard
                label="Hoàn thành"
                value={completedQuestions}
                valueClass="text-green-700"
              />
              <SummaryCard
                label="Còn lại"
                value={remaining}
                valueClass="text-orange-700"
              />

              <div className="col-span-2 min-w-0 rounded-xl bg-white p-4 shadow-sm lg:col-span-1">
                <p className="text-center text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
                  Trạng thái AI
                </p>
                <div className="mt-3 flex min-h-[118px] flex-col items-center justify-center text-center">
                  <span className="text-2xl" aria-hidden="true">
                    {status.icon}
                  </span>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                  >
                    {status.label}
                  </span>
                  <p className="mt-2 max-w-[18rem] text-sm leading-5 text-slate-600 break-words sm:text-[15px]">
                    {flow.message}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-700">Tiến độ phỏng vấn</span>
              <span className="shrink-0 font-semibold text-blue-700">{progress}%</span>
            </div>
            <div
              className="h-2.5 overflow-hidden rounded-full bg-slate-200 sm:h-3"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label="Tiến độ phỏng vấn"
            >
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-green-300 bg-green-50 p-5 sm:p-6">
          <h2 className="text-2xl font-bold text-green-700">🎉 Hoàn thành phỏng vấn</h2>
          <p className="mt-3 text-slate-600">
            Tuyệt vời! Bạn đã hoàn thành toàn bộ câu hỏi phỏng vấn.
          </p>
        </div>
      )}
    </header>
  );
}

function SummaryCard({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string | number;
  valueClass: string;
}) {
  return (
    <div className="flex min-h-[118px] min-w-0 flex-col items-center justify-center rounded-xl bg-white p-4 text-center shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500 sm:text-xs">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-bold sm:text-[28px] ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}
