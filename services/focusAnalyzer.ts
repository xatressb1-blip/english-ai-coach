/**
 * ============================================================
 * English AI Coach Platform
 * ------------------------------------------------------------
 * Module:
 * Focus Analyzer
 *
 * File:
 * services/focusAnalyzer.ts
 *
 * Version:
 * 2.0 Stable
 *
 * Status:
 * Development
 *
 * Description
 * ------------------------------------------------------------
 * Analyse interview answers and estimate:
 *
 * - Coverage
 * - Structure
 * - Length
 * - Focus
 *
 * This module intentionally contains NO AI call.
 *
 * It is deterministic.
 *
 * ============================================================
 */

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

/* ============================================================
 * Normalization
 * ============================================================
 */

function normalizeText(
  text: string
): string {

  return text

    .replace(/\s+/g, " ")

    .replace(/\n/g, " ")

    .trim();

}

/* ============================================================
 * Word Count
 * ============================================================
 */

function estimateWords(
  text: string
): number {

  return normalizeText(text)

    .split(" ")

    .filter(word => word.length > 0)

    .length;

}

/* ============================================================
 * Sentence Estimation
 *
 * Speech Recognition normally has
 * no punctuation.
 *
 * Therefore we estimate sentences
 * from conjunctions and idea starters.
 * ============================================================
 */

function estimateSentences(
  text: string
): number {

  const lower =
    normalizeText(text).toLowerCase();

  const starters = [

    "my name",

    "i am",

    "i'm",

    "i work",

    "i study",

    "i like",

    "in my free time",

    "because",

    "after",

    "before",

    "then",

    "finally",

    "also",

    "besides",

    "however",

    "although"

  ];

  let count = 1;

  starters.forEach(item => {

    const matches =
      lower.match(
        new RegExp(item, "g")
      );

    if (matches) {

      count += matches.length - 1;

    }

  });

  return Math.max(
    1,
    Math.min(count, 10)
  );

}

/* ============================================================
 * Expected Topics
 * ============================================================
 */

function expectedTopics(
  question: string
): string[] {

  const lower =
    question.toLowerCase();

  if (
    lower.includes("tell me about yourself")
  ) {

    return [

      "name",

      "age",

      "education",

      "job",

      "hobby",

      "strength",

      "goal"

    ];

  }

  if (
    lower.includes("strength")
  ) {

    return [

      "skill",

      "experience",

      "example"

    ];

  }

  if (
    lower.includes("weakness")
  ) {

    return [

      "weakness",

      "improvement",

      "solution"

    ];

  }

  return [];

}
/* ============================================================
 * Topic Detection
 * ============================================================
 */

function detectTopics(
  answer: string
): string[] {

  const lower =
    normalizeText(answer).toLowerCase();

  const topics: string[] = [];

  const dictionary: Record<string, string[]> = {

    name: [

      "my name",

      "i'm",

      "i am"

    ],

    age: [

      "years old",

      "year old"

    ],

    education: [

      "university",

      "college",

      "student",

      "graduate",

      "degree",

      "school"

    ],

    job: [

      "work",

      "teacher",

      "developer",

      "engineer",

      "lecturer",

      "employee",

      "company",

      "office"

    ],

    hobby: [

      "like",

      "love",

      "enjoy",

      "football",

      "music",

      "reading",

      "travel",

      "movie",

      "sport"

    ],

    strength: [

      "hardworking",

      "friendly",

      "patient",

      "responsible",

      "creative",

      "confident"

    ],

    goal: [

      "future",

      "goal",

      "dream",

      "hope",

      "want to",

      "plan to"

    ]

  };

  Object.entries(dictionary).forEach(

    ([topic, keywords]) => {

      const found = keywords.some(

        keyword => lower.includes(keyword)

      );

      if (found) {

        topics.push(topic);

      }

    }

  );

  return [...new Set(topics)];

}

/* ============================================================
 * Coverage Analysis
 * ============================================================
 */

function analyseCoverage(

  expected: string[],

  detected: string[]

) {

  const coveredTopics =

    expected.filter(

      item => detected.includes(item)

    );

  const missingTopics =

    expected.filter(

      item => !detected.includes(item)

    );

  const extraTopics =

    detected.filter(

      item => !expected.includes(item)

    );

  const coverageScore =

    expected.length === 0

      ? 100

      : Math.round(

          coveredTopics.length *

          100 /

          expected.length

        );

  return {

    coveredTopics,

    missingTopics,

    extraTopics,

    coverageScore

  };

}

/* ============================================================
 * Structure Score
 * ============================================================
 */

function calculateStructureScore(

  estimatedSentences: number

): number {

  if (

    estimatedSentences >= 4 &&

    estimatedSentences <= 6

  ) {

    return 100;

  }

  if (

    estimatedSentences === 3 ||

    estimatedSentences === 7

  ) {

    return 85;

  }

  if (

    estimatedSentences === 2 ||

    estimatedSentences === 8

  ) {

    return 70;

  }

  return 50;

}

/* ============================================================
 * Length Score
 * ============================================================
 */

function calculateLengthScore(

  estimatedWords: number

): number {

  if (

    estimatedWords >= 35 &&

    estimatedWords <= 80

  ) {

    return 100;

  }

  if (

    estimatedWords >= 25 &&

    estimatedWords < 35

  ) {

    return 85;

  }

  if (

    estimatedWords > 80 &&

    estimatedWords <= 110

  ) {

    return 80;

  }

  if (

    estimatedWords >= 15

  ) {

    return 65;

  }

  return 40;

}
/* ============================================================
 * Overall Score
 * ============================================================
 */

function calculateOverallScore(

  coverage: number,

  structure: number,

  length: number

): number {

  return Math.round(

    coverage * 0.5 +

    structure * 0.3 +

    length * 0.2

  );

}

/* ============================================================
 * Teacher Feedback
 * ============================================================
 */

function generateFeedback(

  coveredTopics: string[],

  missingTopics: string[],

  overallScore: number

): string {

  let feedback = "";

  if (overallScore >= 90) {

    feedback +=
      "Excellent answer. ";

  }

  else if (overallScore >= 75) {

    feedback +=
      "Good answer. ";

  }

  else if (overallScore >= 60) {

    feedback +=
      "Your answer is understandable. ";

  }

  else {

    feedback +=
      "Your answer needs more development. ";

  }

  if (coveredTopics.length > 0) {

    feedback +=

      `You covered ${coveredTopics.length} important topic`;

    if (coveredTopics.length > 1) {

      feedback += "s";

    }

    feedback += ". ";

  }

  if (missingTopics.length > 0) {

    feedback +=

      "Consider adding: " +

      missingTopics.join(", ") +

      ".";

  }

  return feedback.trim();

}

/* ============================================================
 * Public API
 * ============================================================
 */

export function analyzeFocus(

  question: string,

  answer: string

): FocusAnalysis {

  const normalized =

    normalizeText(answer);

  const estimatedWords =

    estimateWords(normalized);

  const estimatedSentences =

    estimateSentences(normalized);

  const detectedTopics =

    detectTopics(normalized);

  const expected =

    expectedTopics(question);

  const coverage =

    analyseCoverage(

      expected,

      detectedTopics

    );

  const structureScore =

    calculateStructureScore(

      estimatedSentences

    );

  const lengthScore =

    calculateLengthScore(

      estimatedWords

    );

  const overallScore =

    calculateOverallScore(

      coverage.coverageScore,

      structureScore,

      lengthScore

    );

  const feedback =

    generateFeedback(

      coverage.coveredTopics,

      coverage.missingTopics,

      overallScore

    );

  return {

    overallScore,

    coverageScore:

      coverage.coverageScore,

    structureScore,

    lengthScore,

    estimatedWords,

    estimatedSentences,

    totalIdeas:

      coverage.coveredTopics.length,

    coveredTopics:

      coverage.coveredTopics,

    missingTopics:

      coverage.missingTopics,

    extraTopics:

      coverage.extraTopics,

    feedback,

  };

}

/* ============================================================
 * End of File
 * ============================================================
 */