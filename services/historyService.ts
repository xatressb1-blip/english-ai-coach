import { InterviewHistory } from "@/types/history";

const STORAGE_KEY = "english-ai-history";

/**
 * Read all interview histories
 */
export function getHistories(): InterviewHistory[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);

    if (!data) {
      return [];
    }

    const histories =
  JSON.parse(data) as InterviewHistory[];

return histories.filter(
  (item) => item.evaluation
);
  } catch (error) {
    console.error("Failed to load histories:", error);
    return [];
  }
}

/**
 * Save all interview histories
 */
export function saveHistories(
  histories: InterviewHistory[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(histories)
    );
  } catch (error) {
    console.error("Failed to save histories:", error);
  }
}

/**
 * Add one history
 */
export function addHistory(
  history: InterviewHistory
): void {
  const histories = getHistories();

  histories.unshift(history);

  saveHistories(histories);
}

/**
 * Delete one history
 */
export function deleteHistory(
  id: string
): void {
  const histories = getHistories().filter(
    item => item.id !== id
  );

  saveHistories(histories);
}

/**
 * Remove all histories
 */
export function clearHistories(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get one history
 */
export function getHistoryById(
  id: string
): InterviewHistory | undefined {
  return getHistories().find(
    item => item.id === id
  );
}

/**
 * Replace one history
 */
export function updateHistory(
  history: InterviewHistory
): void {

  const histories = getHistories();

  const index = histories.findIndex(
    item => item.id === history.id
  );

  if (index === -1) {
    return;
  }

  histories[index] = history;

  saveHistories(histories);
}