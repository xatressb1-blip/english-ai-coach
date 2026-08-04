export type SpeechPaceStatus = "Slow" | "Comfortable" | "Fast" | "Unavailable";
export type ResponseLengthStatus = "Too short" | "Appropriate" | "Long" | "Unavailable";
export type SpeechHabitStatus = "Good" | "Watch" | "Needs practice" | "Unavailable";

export interface FillerWordCount {
  phrase: string;
  count: number;
}

export interface SpeechMetrics {
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number | null;
  paceStatus: SpeechPaceStatus;
  responseLengthStatus: ResponseLengthStatus;
  fillerWordCount: number;
  fillerWords: FillerWordCount[];
  fillerStatus: SpeechHabitStatus;
  repeatedWordCount: number;
  repeatedWords: FillerWordCount[];
  repetitionStatus: SpeechHabitStatus;
  capturedAt: string;
}
