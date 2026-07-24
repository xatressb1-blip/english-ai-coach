import { EvaluationResult } from "@/types/evaluation";

export interface InterviewHistory {
  id: string;

  questionId: number;

  questionTitle: string;

  transcript: string;

  evaluation: EvaluationResult;

  createdAt: string;
}

export type HistorySortType =
  | "latest"
  | "oldest"
  | "highest"
  | "lowest";

export function formatHistoryDate(
  value: string
): string {
  const date = new Date(value);

  return date.toLocaleString();
}

export function calculateAverageScore(
  histories: InterviewHistory[]
): number {
  if (histories.length === 0) {
    return 0;
  }

  const total = histories.reduce(
    (sum, item) => sum + item.evaluation.overall,
    0
  );

  return Number(
    (total / histories.length).toFixed(1)
  );
}

export function calculateBestScore(
  histories: InterviewHistory[]
): number {
  if (histories.length === 0) {
    return 0;
  }

  return Math.max(
    ...histories.map(
      item => item.evaluation.overall
    )
  );
}

export function calculateTotalPractice(
  histories: InterviewHistory[]
): number {
  return histories.length;
}

export function sortHistories(
  histories: InterviewHistory[],
  type: HistorySortType
): InterviewHistory[] {

  const copied = [...histories];

  switch (type) {

    case "latest":
      return copied.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

    case "oldest":
      return copied.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
      );

    case "highest":
      return copied.sort(
        (a, b) =>
          b.evaluation.overall -
          a.evaluation.overall
      );

    case "lowest":
      return copied.sort(
        (a, b) =>
          a.evaluation.overall -
          b.evaluation.overall
      );

    default:
      return copied;
  }
}