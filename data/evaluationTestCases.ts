export type ExpectedLevel = "low" | "medium" | "high";

export interface EvaluationTestCase {
  id: string;
  questionId: number;
  label: string;
  category:
    | "very-weak"
    | "medium"
    | "strong"
    | "off-topic"
    | "keyword-trap"
    | "missing-result";
  transcript: string;
  expectations: {
    coverage?: ExpectedLevel;
    evidence?: ExpectedLevel;
    relevance?: ExpectedLevel;
    notes: string[];
  };
}

export const evaluationTestCases: EvaluationTestCase[] = [
  {
    id: "q1-short",
    questionId: 1,
    label: "Q1 · Very short introduction",
    category: "very-weak",
    transcript: "My name is Minh. I study Information Technology.",
    expectations: {
      coverage: "medium",
      evidence: "low",
      relevance: "medium",
      notes: [
        "Career direction, contribution, and professional growth should be missing.",
        "Coverage must not be 100%.",
      ],
    },
  },
  {
    id: "q1-strong",
    questionId: 1,
    label: "Q1 · Complete introduction",
    category: "strong",
    transcript:
      "My name is Minh. I graduated from an agricultural mechanics college with a major in Information Technology. I want to become a network technician. I hope to use my technical knowledge to support the company and continue developing professionally.",
    expectations: {
      coverage: "high",
      evidence: "medium",
      relevance: "high",
      notes: ["Most or all Level 1 criteria should be covered."],
    },
  },
  {
    id: "q2-keyword-trap",
    questionId: 2,
    label: "Q2 · Keyword trap and negation",
    category: "keyword-trap",
    transcript:
      "I do not have any teamwork experience. I cannot give an example or describe a result.",
    expectations: {
      coverage: "low",
      evidence: "low",
      relevance: "low",
      notes: [
        "The words teamwork, experience, example, and result must not create false coverage.",
      ],
    },
  },
  {
    id: "q2-no-result",
    questionId: 2,
    label: "Q2 · Example without a result",
    category: "missing-result",
    transcript:
      "My strength is learning quickly because technology changes often. During my internship, I learned Power BI and created a monthly report for my team.",
    expectations: {
      coverage: "medium",
      evidence: "medium",
      relevance: "high",
      notes: [
        "Strength, explanation, example, and action may be covered.",
        "Result and measurable evidence should remain missing or partial.",
      ],
    },
  },
  {
    id: "q2-strong",
    questionId: 2,
    label: "Q2 · STAR-style answer",
    category: "strong",
    transcript:
      "My biggest strength is learning quickly. This matters because technology changes rapidly. For example, I learned Power BI in two months and used it to automate monthly reports. As a result, reporting time fell from six hours to two hours, and the team could focus on more valuable tasks. This strength will help me become productive quickly in this role.",
    expectations: {
      coverage: "high",
      evidence: "high",
      relevance: "high",
      notes: ["Evidence Quality should be clearly higher than the short answer."],
    },
  },
  {
    id: "q3-generic",
    questionId: 3,
    label: "Q3 · Generic company answer",
    category: "very-weak",
    transcript: "Your company is very good and I want to work here.",
    expectations: {
      coverage: "low",
      evidence: "low",
      relevance: "low",
      notes: ["Company research and role fit should not be marked covered."],
    },
  },
  {
    id: "q3-off-topic",
    questionId: 3,
    label: "Q3 · Off-topic answer",
    category: "off-topic",
    transcript:
      "My favorite hobby is football. I play every weekend with my friends and watch many matches.",
    expectations: {
      coverage: "low",
      evidence: "low",
      relevance: "low",
      notes: ["Relevance and Coverage should both be low."],
    },
  },
  {
    id: "q3-strong",
    questionId: 3,
    label: "Q3 · Company-specific answer",
    category: "strong",
    transcript:
      "I researched your company and was impressed by its focus on innovation, product quality, and employee development. This position matches my problem-solving and teamwork skills. I would like to contribute to meaningful projects while learning new technologies and growing with the company.",
    expectations: {
      coverage: "high",
      evidence: "medium",
      relevance: "high",
      notes: ["Most criteria should be covered without copying the sample answer."],
    },
  },
];
