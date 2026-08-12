import Link from "next/link";
import { InterviewAttempt } from "@/types/interviewReport";

interface InterviewReviewProps {
  attempts: InterviewAttempt[];
  title?: string;
  description?: string;
  compact?: boolean;
}

interface AnswerParts {
  mainAnswer: string;
  followUpQuestion: string;
  followUpAnswer: string;
}

function splitAnswer(transcript: string): AnswerParts {
  const questionMarker = "Follow-up question:";
  const answerMarker = "Follow-up answer:";
  const questionIndex = transcript.indexOf(questionMarker);

  if (questionIndex < 0) {
    return {
      mainAnswer: transcript.trim(),
      followUpQuestion: "",
      followUpAnswer: "",
    };
  }

  const answerIndex = transcript.indexOf(answerMarker, questionIndex + questionMarker.length);
  const mainAnswer = transcript.slice(0, questionIndex).trim();

  if (answerIndex < 0) {
    return {
      mainAnswer,
      followUpQuestion: transcript.slice(questionIndex + questionMarker.length).trim(),
      followUpAnswer: "",
    };
  }

  return {
    mainAnswer,
    followUpQuestion: transcript
      .slice(questionIndex + questionMarker.length, answerIndex)
      .trim(),
    followUpAnswer: transcript.slice(answerIndex + answerMarker.length).trim(),
  };
}

function scoreTone(score: number) {
  if (score >= 8) return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (score >= 6.5) return "border-blue-200 bg-blue-50 text-blue-800";
  if (score >= 5) return "border-amber-200 bg-amber-50 text-amber-800";
  return "border-rose-200 bg-rose-50 text-rose-800";
}

function statusBadge(status: "covered" | "partial" | "missing") {
  if (status === "covered") return { icon: "✓", label: "Covered", className: "bg-emerald-100 text-emerald-800" };
  if (status === "partial") return { icon: "◐", label: "Partly covered", className: "bg-amber-100 text-amber-800" };
  return { icon: "+", label: "Add this idea", className: "bg-rose-100 text-rose-800" };
}


function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining.toString().padStart(2, "0")}s`;
}

function speechAdvice(attempt: InterviewAttempt): string {
  const metrics = attempt.speechMetrics;
  if (!metrics) return "Speech metrics were not captured for this earlier interview.";

  const advice: string[] = [];
  if (metrics.responseLengthStatus === "Too short") advice.push("Develop the answer with one supporting example and a clear result.");
  if (metrics.responseLengthStatus === "Long") advice.push("Make the answer more concise and keep only the most relevant example.");
  if (metrics.paceStatus === "Slow") advice.push("Practise in short idea groups so the delivery becomes more continuous.");
  if (metrics.paceStatus === "Fast") advice.push("Slow down slightly and pause between key ideas.");
  if (metrics.fillerStatus !== "Good") advice.push("Replace filler words with a short silent pause.");
  if (metrics.repetitionStatus !== "Good") advice.push("Pause before restarting a phrase to reduce repeated words.");

  return advice.length
    ? advice.join(" ")
    : "Your answer length, pace, and speaking habits were within a comfortable practice range.";
}

export default function InterviewReview({
  attempts,
  title = "Interview Review & Retry",
  description = "Review what you said, identify missing ideas, and practise the answers that will improve your next interview most.",
  compact = false,
}: InterviewReviewProps) {
  const evaluatedAttempts = attempts.filter((attempt) => attempt.evaluation.evaluationStatus !== "unavailable");
  if (!evaluatedAttempts.length) return null;

  const sortedByScore = [...evaluatedAttempts].sort(
    (a, b) => a.evaluation.overall - b.evaluation.overall
  );
  const retryIds = new Set(sortedByScore.slice(0, Math.min(3, evaluatedAttempts.length)).map((item) => item.questionId));

  return (
    <section className={compact ? "mt-5" : "border-t border-slate-200 px-4 py-7 sm:px-8 sm:py-9"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-700">Personal improvement session</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">{title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
        </div>
        <div className="rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-900">
          {retryIds.size} priority {retryIds.size === 1 ? "answer" : "answers"} selected
        </div>
      </div>

      <div className="mt-5 space-y-4">
        {evaluatedAttempts.map((attempt, index) => {
          const answer = splitAnswer(attempt.transcript);
          const focus = attempt.evaluation.focusAnalysis;
          const ideas = focus?.ideaAssessments ?? [];
          const coveredCount = ideas.filter((idea) => idea.status === "covered").length;
          const partialCount = ideas.filter((idea) => idea.status === "partial").length;
          const isPriority = retryIds.has(attempt.questionId);

          return (
            <details
              key={`${attempt.questionId}-${index}`}
              open={isPriority && index === sortedByScore.findIndex((item) => item.questionId === attempt.questionId)}
              className={`group overflow-hidden rounded-2xl border bg-white ${isPriority ? "border-amber-300 shadow-sm" : "border-slate-200"}`}
            >
              <summary className="cursor-pointer list-none p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-black text-white">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isPriority && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Priority retry</span>
                      )}
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${scoreTone(attempt.evaluation.overall)}`}>
                        {attempt.evaluation.overall.toFixed(1)}/10
                      </span>
                      {attempt.evaluation.evaluationSource === "backup_rubric" && (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Backup Rubric</span>
                      )}
                      {focus && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          Coverage {focus.coverageScore}%
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 break-words text-base font-bold leading-6 text-slate-950 sm:text-lg">
                      {attempt.questionTitle}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {ideas.length
                        ? `${coveredCount} covered • ${partialCount} partly covered • ${ideas.length - coveredCount - partialCount} missing`
                        : "Open to review this answer and coaching feedback."}
                    </p>
                  </div>
                  <span className="mt-2 text-xl text-slate-400 transition group-open:rotate-180">⌄</span>
                </div>
              </summary>

              <div className="border-t border-slate-200 bg-slate-50/70 p-4 sm:p-5">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Your main answer</p>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                      {answer.mainAnswer || "No transcript was captured for this answer."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{attempt.evaluation.evaluationSource === "backup_rubric" ? "Backup rubric assessment" : "Recruiter assessment"}</p>
                    <p className="mt-3 text-sm leading-7 text-blue-950">{attempt.evaluation.overallFeedback}</p>
                    {focus && (
                      <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
                        <Metric label="Coverage" value={`${focus.coverageScore}%`} />
                        <Metric label="Evidence" value={`${focus.evidenceQualityScore}%`} />
                        <Metric label="Structure" value={`${focus.structureScore}%`} />
                      </div>
                    )}
                  </div>
                </div>

                {attempt.speechMetrics && (
                  <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 sm:p-5">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-cyan-700">Speech performance</p>
                        <h4 className="mt-1 font-bold text-slate-950">How your answer was delivered</h4>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-cyan-800">Estimated from recording time and transcript</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                      <Metric label="Speaking time" value={formatDuration(attempt.speechMetrics.durationSeconds)} />
                      <Metric label="Words" value={attempt.speechMetrics.wordCount.toString()} />
                      <Metric label="Pace" value={attempt.speechMetrics.wordsPerMinute ? `${attempt.speechMetrics.wordsPerMinute} WPM` : "—"} />
                      <Metric label="Length" value={attempt.speechMetrics.responseLengthStatus} />
                      <Metric label="Fillers" value={attempt.speechMetrics.fillerWordCount.toString()} />
                      <Metric label="Repetitions" value={attempt.speechMetrics.repeatedWordCount.toString()} />
                    </div>
                    {(attempt.speechMetrics.fillerWords.length > 0 || attempt.speechMetrics.repeatedWords.length > 0) && (
                      <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                        {attempt.speechMetrics.fillerWords.slice(0, 3).map((item) => (
                          <span key={`filler-${item.phrase}`} className="rounded-full bg-white px-3 py-1">{item.phrase}: {item.count}</span>
                        ))}
                        {attempt.speechMetrics.repeatedWords.slice(0, 3).map((item) => (
                          <span key={`repeat-${item.phrase}`} className="rounded-full bg-white px-3 py-1">repeated “{item.phrase}”: {item.count}</span>
                        ))}
                      </div>
                    )}
                    <p className="mt-3 text-sm leading-6 text-slate-700">{speechAdvice(attempt)}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">These metrics do not assess accent or detailed pronunciation. They are coaching estimates based on transcript and recording duration.</p>
                  </div>
                )}

                {answer.followUpQuestion && (
                  <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Follow-up exchange</p>
                    <p className="mt-3 font-semibold leading-7 text-slate-900">{answer.followUpQuestion}</p>
                    <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                      {answer.followUpAnswer || "No follow-up answer was captured."}
                    </p>
                  </div>
                )}

                {ideas.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold text-slate-900">Content criteria</h4>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      {ideas.map((idea) => {
                        const badge = statusBadge(idea.status);
                        return (
                          <div key={idea.id} className="rounded-xl border border-slate-200 bg-white p-4">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="font-semibold text-slate-900">{idea.label}</p>
                              <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${badge.className}`}>
                                {badge.icon} {badge.label}
                              </span>
                            </div>
                            {idea.evidence && (
                              <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                                <strong>Detected:</strong> {idea.evidence}
                              </p>
                            )}
                            {idea.status !== "covered" && idea.coachingTip && (
                              <p className="mt-2 text-sm leading-6 text-slate-700">
                                <strong>Improve:</strong> {idea.coachingTip}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-violet-700">Improved answer</p>
                  <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-violet-950">
                    {attempt.evaluation.improvedAnswer}
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm leading-6 text-slate-600">
                    Practise this question in Guided Practice, then record a new answer using the missing ideas above.
                  </p>
                  <Link
                    href={`/question/${attempt.questionId}?source=interview-review`}
                    className={`min-h-12 shrink-0 rounded-xl px-5 py-3 text-center font-bold text-white transition ${isPriority ? "bg-amber-600 hover:bg-amber-700" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    Practice This Question Again
                  </Link>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/80 p-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-black text-slate-900">{value}</p>
    </div>
  );
}
