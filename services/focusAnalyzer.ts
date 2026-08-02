import { InterviewQuestion } from "@/types/InterviewQuestion";

export interface FocusAnalysis {
  overallScore: number;
  coverageScore: number;
  structureScore: number;
  lengthScore: number;
  estimatedWords: number;
  estimatedSentences: number;
  totalIdeas: number;
  coveredTopics: string[];
  missingTopics: string[];
  extraTopics: string[];
  feedback: string;
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function normalizeForMatching(text: string): string {
  return normalizeText(text)
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function estimateWords(text: string): number {
  const normalized = normalizeText(text);
  return normalized ? normalized.split(/\s+/).filter(Boolean).length : 0;
}

function estimateSentences(text: string): number {
  const normalized = normalizeText(text);

  if (!normalized) {
    return 0;
  }

  // Prefer real punctuation when it is available in typed answers or
  // speech-recognition output that preserves sentence boundaries.
  const punctuated = normalized
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;

  if (punctuated >= 2) {
    return Math.min(punctuated, 10);
  }

  // Web Speech often returns no punctuation. In that case, estimate idea
  // boundaries from common connectors and repeated sentence starters.
  const lower = normalizeForMatching(normalized);
  const boundaryPattern = /\b(?:and then|but|however|because|also|finally|in addition|for example|for instance|my goal is|i also|i have|i am|i'm|i work|i study|i enjoy|i like|i want|i hope)\b/g;
  const matches = lower.match(boundaryPattern) ?? [];

  // The first clause is already one sentence. Additional meaningful
  // starters/connectors suggest another spoken sentence or idea unit.
  const estimated = 1 + Math.max(0, matches.length - 1);
  return Math.max(1, Math.min(estimated, 10));
}

const TOPIC_ALIASES: Record<string, string[]> = {
  name: ["my name", "i am", "i'm", "called"],
  experience: ["experience", "worked", "work", "job", "internship", "project"],
  skills: ["skill", "skills", "communication", "technical", "problem solving", "teamwork"],
  personality: ["responsible", "hard-working", "hardworking", "positive", "adaptable", "friendly", "patient", "motivated"],
  "career growth": ["career", "grow", "growth", "future", "goal", "develop", "improve"],
  responsibility: ["responsible", "responsibility", "on time", "reliable"],
  teamwork: ["team", "teamwork", "colleague", "cooperate", "support others"],
  learning: ["learn", "learning", "improve", "feedback", "develop"],
  communication: ["communicate", "communication", "listen", "speaking"],
  "company reputation": ["reputation", "well-known", "professional company", "respected company"],
  growth: ["growth", "grow", "develop", "career opportunity", "opportunity"],
  values: ["value", "values", "quality", "culture", "mission"],
  team: ["team", "colleagues", "people", "cooperate"],
  value: ["value", "contribute", "contribution", "benefit", "help the company"],
  responsible: ["responsible", "reliable", "on time"],
  adaptable: ["adapt", "adaptable", "flexible", "change"],
  motivation: ["motivate", "motivated", "motivation", "enthusiastic"],
  "short-term": ["short term", "short-term", "next year", "one or two years", "near future"],
  performance: ["performance", "perform", "results", "expectations"],
  career: ["career", "profession", "professional"],
  leadership: ["leadership", "leader", "lead", "manage"],
  pressure: ["pressure", "stress", "deadline", "busy"],
  priorities: ["priority", "priorities", "important first"],
  "time management": ["time management", "organize my time", "schedule", "deadline"],
  calm: ["calm", "focused", "stay focused"],
  support: ["support", "help", "assist"],
  cooperation: ["cooperate", "cooperation", "work together", "collaborate"],
  adapt: ["adapt", "adjust", "change"],
  "open-minded": ["open-minded", "open minded", "positive attitude"],
  flexible: ["flexible", "adaptable", "adjust"],
  contribution: ["contribute", "contribution", "value", "useful"],
  progress: ["progress", "improve", "development", "grow"],
};

function canonicalTopic(topic: string): string {
  return normalizeForMatching(topic);
}

function topicIsCovered(answer: string, topic: string): boolean {
  const normalizedAnswer = normalizeForMatching(answer);
  const normalizedTopic = canonicalTopic(topic);
  const aliases = TOPIC_ALIASES[normalizedTopic] ?? [normalizedTopic];

  return aliases.some((alias) => normalizedAnswer.includes(normalizeForMatching(alias)));
}

function expectedTopics(question: InterviewQuestion): string[] {
  if (Array.isArray(question.keywords) && question.keywords.length > 0) {
    return [...new Set(question.keywords.map(canonicalTopic).filter(Boolean))];
  }

  const lower = question.title.toLowerCase();

  if (lower.includes("introduce yourself") || lower.includes("tell me about yourself")) {
    return ["name", "experience", "skills", "personality", "career growth"];
  }

  return [];
}

function analyseCoverage(question: InterviewQuestion, answer: string) {
  const expected = expectedTopics(question);
  const coveredTopics = expected.filter((topic) => topicIsCovered(answer, topic));
  const missingTopics = expected.filter((topic) => !topicIsCovered(answer, topic));

  const coverageScore = expected.length > 0
    ? Math.round((coveredTopics.length / expected.length) * 100)
    : 0;

  return {
    coveredTopics,
    missingTopics,
    extraTopics: [] as string[],
    coverageScore,
  };
}

function calculateStructureScore(sentences: number, words: number): number {
  if (words === 0) return 0;
  if (sentences >= 3 && sentences <= 5) return 100;
  if (sentences === 2 || sentences === 6) return 75;
  if (sentences === 1) return words >= 25 ? 60 : 40;
  return 60;
}

function calculateLengthScore(words: number): number {
  if (words >= 45 && words <= 100) return 100;
  if (words >= 30 && words < 45) return 85;
  if (words >= 20 && words < 30) return 70;
  if (words >= 12 && words < 20) return 45;
  if (words > 100 && words <= 130) return 80;
  if (words > 130) return 60;
  return words > 0 ? 25 : 0;
}

function calculateOverallScore(coverage: number, structure: number, length: number): number {
  // Content coverage is the most important part of an interview answer.
  return Math.round(coverage * 0.6 + structure * 0.25 + length * 0.15);
}

function generateFeedback(
  coveredTopics: string[],
  missingTopics: string[],
  overallScore: number,
  sentences: number,
  words: number
): string {
  const messages: string[] = [];

  if (overallScore >= 85) messages.push("Your answer is focused and well developed.");
  else if (overallScore >= 70) messages.push("Your answer covers several relevant ideas.");
  else if (overallScore >= 50) messages.push("Your answer is understandable but needs more relevant detail.");
  else messages.push("Your answer is too limited for this interview question.");

  if (coveredTopics.length > 0) {
    messages.push(`Covered ideas: ${coveredTopics.join(", ")}.`);
  }

  if (missingTopics.length > 0) {
    messages.push(`Add information about: ${missingTopics.join(", ")}.`);
  }

  if (sentences < 2 || words < 20) {
    messages.push("Develop the answer into at least two or three clear sentences.");
  }

  return messages.join(" ");
}

export function analyzeFocus(
  question: InterviewQuestion,
  answer: string
): FocusAnalysis {
  const normalized = normalizeText(answer);
  const estimatedWords = estimateWords(normalized);
  const estimatedSentences = estimateSentences(normalized);
  const coverage = analyseCoverage(question, normalized);
  const structureScore = calculateStructureScore(estimatedSentences, estimatedWords);
  const lengthScore = calculateLengthScore(estimatedWords);
  const overallScore = calculateOverallScore(
    coverage.coverageScore,
    structureScore,
    lengthScore
  );

  return {
    overallScore,
    coverageScore: coverage.coverageScore,
    structureScore,
    lengthScore,
    estimatedWords,
    estimatedSentences,
    totalIdeas: coverage.coveredTopics.length,
    coveredTopics: coverage.coveredTopics,
    missingTopics: coverage.missingTopics,
    extraTopics: coverage.extraTopics,
    feedback: generateFeedback(
      coverage.coveredTopics,
      coverage.missingTopics,
      overallScore,
      estimatedSentences,
      estimatedWords
    ),
  };
}
