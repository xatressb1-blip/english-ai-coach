import {
  FillerWordCount,
  ResponseLengthStatus,
  SpeechHabitStatus,
  SpeechMetrics,
  SpeechPaceStatus,
} from "@/types/speechMetrics";

const FILLER_PATTERNS: Array<{ phrase: string; pattern: RegExp }> = [
  { phrase: "um", pattern: /\bum+\b/gi },
  { phrase: "uh", pattern: /\buh+\b/gi },
  { phrase: "erm", pattern: /\berm+\b/gi },
  { phrase: "you know", pattern: /\byou\s+know\b/gi },
  { phrase: "basically", pattern: /\bbasically\b/gi },
  { phrase: "actually", pattern: /\bactually\b/gi },
];

function countMatches(text: string, pattern: RegExp): number {
  return text.match(pattern)?.length ?? 0;
}

function getWords(text: string): string[] {
  return text.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g) ?? [];
}

function getPaceStatus(wordsPerMinute: number | null): SpeechPaceStatus {
  if (wordsPerMinute === null) return "Unavailable";
  if (wordsPerMinute < 75) return "Slow";
  if (wordsPerMinute <= 155) return "Comfortable";
  return "Fast";
}

function getLengthStatus(durationSeconds: number, wordCount: number): ResponseLengthStatus {
  if (!durationSeconds || !wordCount) return "Unavailable";
  if (durationSeconds < 15 || wordCount < 25) return "Too short";
  if (durationSeconds <= 100 && wordCount <= 220) return "Appropriate";
  return "Long";
}

function getHabitStatus(count: number, wordCount: number): SpeechHabitStatus {
  if (!wordCount) return "Unavailable";
  const ratePerHundredWords = (count / wordCount) * 100;
  if (count <= 1 || ratePerHundredWords <= 2) return "Good";
  if (ratePerHundredWords <= 5) return "Watch";
  return "Needs practice";
}

function findRepeatedWords(words: string[]): FillerWordCount[] {
  const counts = new Map<string, number>();

  for (let index = 1; index < words.length; index += 1) {
    const current = words[index].toLowerCase();
    const previous = words[index - 1].toLowerCase();
    if (current === previous && current.length > 1) {
      counts.set(current, (counts.get(current) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([phrase, count]) => ({ phrase, count }))
    .sort((a, b) => b.count - a.count);
}

export function calculateSpeechMetrics(
  transcript: string,
  durationMilliseconds: number
): SpeechMetrics {
  const cleanedTranscript = transcript.trim();
  const words = getWords(cleanedTranscript);
  const wordCount = words.length;
  const durationSeconds = Math.max(0, Math.round(durationMilliseconds / 1000));
  const wordsPerMinute = durationSeconds >= 2 && wordCount > 0
    ? Math.round((wordCount / durationSeconds) * 60)
    : null;

  const fillerWords = FILLER_PATTERNS
    .map(({ phrase, pattern }) => ({ phrase, count: countMatches(cleanedTranscript, pattern) }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
  const fillerWordCount = fillerWords.reduce((sum, item) => sum + item.count, 0);

  const repeatedWords = findRepeatedWords(words);
  const repeatedWordCount = repeatedWords.reduce((sum, item) => sum + item.count, 0);

  return {
    durationSeconds,
    wordCount,
    wordsPerMinute,
    paceStatus: getPaceStatus(wordsPerMinute),
    responseLengthStatus: getLengthStatus(durationSeconds, wordCount),
    fillerWordCount,
    fillerWords,
    fillerStatus: getHabitStatus(fillerWordCount, wordCount),
    repeatedWordCount,
    repeatedWords,
    repetitionStatus: getHabitStatus(repeatedWordCount, wordCount),
    capturedAt: new Date().toISOString(),
  };
}
