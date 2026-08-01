import { InterviewAttempt, RecruiterReport } from "@/types/interviewReport";

const average = (values: number[]) =>
  values.length ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)) : 0;

export function buildRecruiterReport(attempts: InterviewAttempt[]): RecruiterReport {
  const sorted = [...attempts].sort((a, b) => a.evaluation.overall - b.evaluation.overall);
  const weakestAttempt = sorted[0] ?? null;
  const bestAttempt = sorted.at(-1) ?? null;

  const overallScore = average(attempts.map((item) => item.evaluation.overall));
  const readiness = overallScore < 5
    ? "Developing"
    : overallScore < 7
      ? "Nearly Ready"
      : overallScore < 8.5
        ? "Interview Ready"
        : "Strong Candidate";

  const breakdown = {
    grammar: average(attempts.map((item) => item.evaluation.grammar.score)),
    vocabulary: average(attempts.map((item) => item.evaluation.vocabulary.score)),
    pronunciation: average(attempts.map((item) => item.evaluation.pronunciation.score)),
    fluency: average(attempts.map((item) => item.evaluation.fluency.score)),
    relevance: average(attempts.map((item) => item.evaluation.relevance.score)),
    confidence: average(attempts.map((item) => item.evaluation.confidence.score)),
  };

  const metrics = [
    ["Grammar accuracy", breakdown.grammar],
    ["Vocabulary", breakdown.vocabulary],
    ["Pronunciation", breakdown.pronunciation],
    ["Fluency", breakdown.fluency],
    ["Answer relevance", breakdown.relevance],
    ["Confidence", breakdown.confidence],
  ] as const;

  const strengths = [...metrics]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, score]) => `${name}: ${score}/10`);

  const improvements = [...metrics]
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)
    .map(([name, score]) => `${name}: ${score}/10 — practise this area in your next attempt.`);

  const recruiterImpression = overallScore >= 8.5
    ? "You presented yourself as a confident, relevant, and professional candidate. Your answers would create a strong first impression in a real interview."
    : overallScore >= 7
      ? "You appear prepared and professional. Your answers are generally relevant, but stronger examples and smoother delivery would make you more convincing."
      : overallScore >= 5
        ? "You show potential and a positive attitude, but several answers need clearer structure, stronger examples, and more confident delivery."
        : "You are still developing interview readiness. Focus first on answering the question directly, using complete sentences, and giving one clear example.";

  return {
    overallScore,
    readiness,
    recruiterImpression,
    strengths,
    improvements,
    bestAttempt,
    weakestAttempt,
    scoreBreakdown: breakdown,
  };
}
