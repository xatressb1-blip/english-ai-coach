import { evaluateInterview } from "@/services/evaluationService";
import type { InterviewQuestion } from "@/types/InterviewQuestion";
import type { EvaluationResult } from "@/types/evaluation";

interface BackgroundEvaluationTask {
  id: number;
  generation: number;
  question: InterviewQuestion;
  transcript: string;
  onSuccess: (evaluation: EvaluationResult) => void;
  onError?: (error: unknown) => void;
}

const queue: BackgroundEvaluationTask[] = [];
let processing = false;
let nextId = 1;
let generation = 1;

async function processQueue(): Promise<void> {
  if (processing) return;

  const task = queue.shift();
  if (!task) return;

  processing = true;

  try {
    const evaluation = await evaluateInterview(task.question, task.transcript);

    // A reset/new interview invalidates results from the old interview run.
    if (task.generation === generation) {
      task.onSuccess(evaluation);
    }
  } catch (error) {
    if (task.generation === generation) {
      task.onError?.(error);
    }
  } finally {
    processing = false;
    void processQueue();
  }
}

/**
 * Queue a live AI evaluation without blocking the interview UI.
 * Tasks are intentionally processed one at a time to reduce burst traffic
 * and lower the chance of rate-limit errors during a live class.
 */
export function enqueueBackgroundEvaluation(input: {
  question: InterviewQuestion;
  transcript: string;
  onSuccess: (evaluation: EvaluationResult) => void;
  onError?: (error: unknown) => void;
}): number {
  const task: BackgroundEvaluationTask = {
    id: nextId++,
    generation,
    question: input.question,
    transcript: input.transcript,
    onSuccess: input.onSuccess,
    onError: input.onError,
  };

  queue.push(task);
  void processQueue();
  return task.id;
}

/**
 * Invalidate pending work when a new mock interview starts.
 * An already-running request is allowed to finish, but its stale result is
 * ignored and never written into the new interview.
 */
export function resetBackgroundEvaluationQueue(): void {
  generation += 1;
  queue.length = 0;
}

export function getBackgroundEvaluationQueueLength(): number {
  return queue.length + (processing ? 1 : 0);
}
