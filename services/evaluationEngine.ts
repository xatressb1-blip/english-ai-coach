import { InterviewQuestion } from "@/types/InterviewQuestion";

export interface EvaluationResult {
  grammar: number;
  vocabulary: number;
  fluency: number;
  confidence: number;
  overall: number;
  feedback: string;
}

export function evaluateAnswer(
  transcript: string,
  question: InterviewQuestion
): EvaluationResult {

  if (!transcript.trim()) {
    return {
      grammar: 0,
      vocabulary: 0,
      fluency: 0,
      confidence: 0,
      overall: 0,
      feedback: "No answer detected. Please try again.",
    };
  }

  const words = transcript.trim().split(/\s+/);

  const wordCount = words.length;

  let grammar = 6;
  let vocabulary = 6;
  let fluency = 6;
  let confidence = 6;

  // Demo Rule 1
  if (wordCount >= 30) grammar += 2;

  // Demo Rule 2
  if (wordCount >= 50) vocabulary += 2;

  // Demo Rule 3
  if (transcript.endsWith(".")) grammar += 1;

  // Demo Rule 4
  if (
    question.keywords.some(keyword =>
      transcript
        .toLowerCase()
        .includes(keyword.toLowerCase())
    )
  ) {
    confidence += 2;
  }

  grammar = Math.min(grammar, 10);
  vocabulary = Math.min(vocabulary, 10);
  fluency = Math.min(fluency, 10);
  confidence = Math.min(confidence, 10);

  const overall =
    Number(
      (
        (grammar +
          vocabulary +
          fluency +
          confidence) /
        4
      ).toFixed(1)
    );

  return {
    grammar,
    vocabulary,
    fluency,
    confidence,
    overall,
    feedback:
      overall >= 8
        ? "Excellent answer."
        : overall >= 6
        ? "Good answer. Keep practicing."
        : "You need more practice.",
  };
}