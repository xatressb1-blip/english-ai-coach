import { ExpectedIdea, InterviewQuestion } from "@/types/InterviewQuestion";
import {
  FocusAnalysis,
  IdeaAssessment,
  IdeaCoverageStatus,
} from "@/types/evaluation";

export interface AIContentAssessment {
  criteria?: Array<{
    id?: string;
    label?: string;
    status?: string;
    evidence?: string;
    coachingTip?: string;
  }>;
  evidenceQualityScore?: number;
  summary?: string;
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
  if (!normalized) return 0;

  const punctuated = normalized
    .split(/[.!?]+/)
    .map((part) => part.trim())
    .filter(Boolean).length;

  if (punctuated >= 2) return Math.min(punctuated, 10);

  const lower = normalizeForMatching(normalized);
  const boundaryPattern = /\b(?:and then|but|however|because|also|finally|in addition|for example|for instance|my goal is|i also|i have|i am|i'm|i work|i study|i enjoy|i like|i want|i hope|as a result)\b/g;
  const matches = lower.match(boundaryPattern) ?? [];
  return Math.max(1, Math.min(1 + Math.max(0, matches.length - 1), 10));
}

const TOPIC_ALIASES: Record<string, string[]> = {
  name: ["my name", "i am", "i'm", "called"],
  education: ["graduated", "college", "university", "school", "degree", "diploma", "studied at"],
  major: ["major", "field of study", "studied information", "information technology", "computer science"],
  "career direction": ["want to become", "career goal", "target role", "technician", "engineer", "developer"],
  contribution: ["contribute", "bring value", "support the team", "use my skills", "help the company"],
  "professional growth": ["grow professionally", "develop", "learn", "improve", "career growth"],
  "clear strength": ["my strength", "strength is", "good at", "ability to", "i am a"],
  explanation: ["because", "important", "helps me", "allows me", "useful"],
  "specific example": ["for example", "for instance", "when i", "in my project", "during my internship"],
  action: ["i taught", "i created", "i solved", "i organized", "i completed", "i helped", "i learned"],
  result: ["as a result", "result", "reduced", "improved", "increased", "saved", "completed"],
  evidence: ["percent", "%", "hours", "months", "weeks", "from", "to", "less than", "more than"],
  "job connection": ["this strength will help", "in this role", "at your company", "become productive", "contribute"],
  "company research": ["researched", "learned that", "from your website", "i know that", "read about"],
  "company attraction": ["innovation", "quality", "products", "culture", "employee development", "reputation"],
  "role fit": ["great match", "fits my", "matches my", "suitable for", "this position"],
  "relevant skills": ["problem solving", "technology", "teamwork", "collaboratively", "communication"],
  "growth alignment": ["grow together", "continuous learning", "develop", "career growth"],
  specificity: ["innovation", "high-quality products", "employee development", "meaningful projects", "your team"],
};

function canonicalTopic(topic: string): string {
  return normalizeForMatching(topic);
}

function topicIsCovered(answer: string, topic: string): boolean {
  const normalizedAnswer = normalizeForMatching(answer);
  const aliases = TOPIC_ALIASES[canonicalTopic(topic)] ?? [canonicalTopic(topic)];
  return aliases.some((alias) => normalizedAnswer.includes(normalizeForMatching(alias)));
}

function expectedIdeas(question: InterviewQuestion): ExpectedIdea[] {
  if (question.expectedIdeas?.length) return question.expectedIdeas;

  return (question.keywords ?? []).map((keyword) => ({
    id: canonicalTopic(keyword).replace(/\s+/g, "-"),
    label: keyword,
    description: `Addresses the expected idea: ${keyword}.`,
    weight: 1,
  }));
}

function clampPercent(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.max(0, Math.min(100, Math.round(numeric)));
}

function estimateEvidenceQuality(answer: string): number {
  const normalized = normalizeForMatching(answer);
  const words = estimateWords(answer);
  let score = words >= 45 ? 45 : words >= 25 ? 35 : words >= 12 ? 25 : 10;
  if (/\b(for example|for instance|when i|during my|in my project)\b/.test(normalized)) score += 15;
  if (/\b(as a result|therefore|reduced|improved|increased|saved|completed)\b/.test(normalized)) score += 15;
  if (/\b\d+(?:\.\d+)?\b|%|\b(hours?|months?|weeks?|days?)\b/.test(normalized)) score += 15;
  if (/\b(in this role|at your company|contribute|support the team|help me become)\b/.test(normalized)) score += 10;
  return clampPercent(score);
}

function normalizeStatus(value: unknown): IdeaCoverageStatus {
  if (value === "covered") return "covered";
  if (value === "partial" || value === "partiallyCovered") return "partial";
  return "missing";
}

function buildLocalAssessments(question: InterviewQuestion, answer: string): IdeaAssessment[] {
  return expectedIdeas(question).map((idea) => {
    const covered = topicIsCovered(answer, idea.label);
    return {
      id: idea.id,
      label: idea.label,
      status: covered ? "covered" : "missing",
      evidence: covered ? "A related phrase was detected in the answer." : "",
      coachingTip: covered ? "" : idea.description,
    };
  });
}

function mergeAIAssessments(
  question: InterviewQuestion,
  answer: string,
  aiAssessment?: AIContentAssessment
): IdeaAssessment[] {
  const local = buildLocalAssessments(question, answer);
  if (!aiAssessment?.criteria?.length) return local;

  const byId = new Map(
    aiAssessment.criteria.map((item) => [String(item.id ?? ""), item])
  );

  return expectedIdeas(question).map((idea, index) => {
    const ai = byId.get(idea.id) ?? aiAssessment.criteria?.[index];
    if (!ai) return local[index];

    return {
      id: idea.id,
      label: idea.label,
      status: normalizeStatus(ai.status),
      evidence: typeof ai.evidence === "string" ? ai.evidence.trim() : "",
      coachingTip:
        typeof ai.coachingTip === "string" && ai.coachingTip.trim()
          ? ai.coachingTip.trim()
          : idea.description,
    };
  });
}

function calculateCoverageScore(question: InterviewQuestion, assessments: IdeaAssessment[]): number {
  const ideas = expectedIdeas(question);
  const totalWeight = ideas.reduce((sum, idea) => sum + (idea.weight ?? 1), 0);
  if (!totalWeight) return 0;

  const earned = assessments.reduce((sum, assessment, index) => {
    const weight = ideas[index]?.weight ?? 1;
    const factor = assessment.status === "covered" ? 1 : assessment.status === "partial" ? 0.5 : 0;
    return sum + weight * factor;
  }, 0);

  return Math.round((earned / totalWeight) * 100);
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

function calculateOverallScore(coverage: number, structure: number, length: number, evidence: number): number {
  return Math.round(coverage * 0.55 + structure * 0.2 + length * 0.1 + evidence * 0.15);
}

function generateFeedback(
  assessments: IdeaAssessment[],
  overallScore: number,
  sentences: number,
  words: number,
  aiSummary?: string
): string {
  if (aiSummary?.trim()) return aiSummary.trim();

  const missing = assessments.filter((item) => item.status === "missing");
  const partial = assessments.filter((item) => item.status === "partial");
  const messages: string[] = [];

  if (overallScore >= 85) messages.push("Your answer is focused and well supported.");
  else if (overallScore >= 70) messages.push("Your answer covers most of the expected content.");
  else if (overallScore >= 50) messages.push("Your answer is understandable but needs more complete supporting detail.");
  else messages.push("Your answer needs more of the question-specific content criteria.");

  if (partial.length) messages.push(`Develop these ideas further: ${partial.map((item) => item.label).join(", ")}.`);
  if (missing.length) messages.push(`Add: ${missing.map((item) => item.label).join(", ")}.`);
  if (sentences < 2 || words < 20) messages.push("Use at least two or three clear sentences and include one concrete detail.");

  return messages.join(" ");
}

export function analyzeFocus(
  question: InterviewQuestion,
  answer: string,
  aiAssessment?: AIContentAssessment
): FocusAnalysis {
  const normalized = normalizeText(answer);
  const estimatedWords = estimateWords(normalized);
  const estimatedSentences = estimateSentences(normalized);
  const ideaAssessments = mergeAIAssessments(question, normalized, aiAssessment);
  const coverageScore = calculateCoverageScore(question, ideaAssessments);
  const structureScore = calculateStructureScore(estimatedSentences, estimatedWords);
  const lengthScore = calculateLengthScore(estimatedWords);
  const evidenceQualityScore = aiAssessment
    ? clampPercent(aiAssessment.evidenceQualityScore)
    : estimateEvidenceQuality(normalized);
  const overallScore = calculateOverallScore(
    coverageScore,
    structureScore,
    lengthScore,
    evidenceQualityScore
  );

  const coveredTopics = ideaAssessments.filter((item) => item.status === "covered").map((item) => item.label);
  const partialTopics = ideaAssessments.filter((item) => item.status === "partial").map((item) => item.label);
  const missingTopics = ideaAssessments.filter((item) => item.status === "missing").map((item) => item.label);

  return {
    overallScore,
    coverageScore,
    structureScore,
    lengthScore,
    evidenceQualityScore,
    estimatedWords,
    estimatedSentences,
    totalIdeas: ideaAssessments.length,
    coveredTopics,
    partialTopics,
    missingTopics,
    extraTopics: [],
    ideaAssessments,
    feedback: generateFeedback(
      ideaAssessments,
      overallScore,
      estimatedSentences,
      estimatedWords,
      aiAssessment?.summary
    ),
  };
}
