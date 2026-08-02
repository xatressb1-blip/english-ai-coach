/**
 * ============================================================
 * English AI Coach
 * ------------------------------------------------------------
 * Module:
 * Gemini Client
 *
 * File:
 * services/geminiClient.ts
 *
 * Version:
 * 1.0 Stable
 *
 * Status:
 * Development
 *
 * Description
 * ------------------------------------------------------------
 * Single gateway to Google Gemini.
 *
 * IMPORTANT
 * ------------------------------------------------------------
 * No other file in the project is allowed to communicate
 * directly with Google Gemini.
 *
 * ============================================================
 */

import {

  GoogleGenAI,

} from "@google/genai";

/* ============================================================
 * Singleton
 * ============================================================
 */

let client:

  GoogleGenAI |

  null = null;

/* ============================================================
 * Get Client
 * ============================================================
 */

export function getGeminiClient():

GoogleGenAI {

  if (client) {

    return client;

  }

  const apiKey =

    process.env.GEMINI_API_KEY;

  if (!apiKey) {

    throw new Error(

      "GEMINI_API_KEY is missing."

    );

  }

  client =

    new GoogleGenAI({

      apiKey,

    });

  return client;

}
/* ============================================================
 * Default Model
 * ============================================================
 */

const DEFAULT_MODEL =
  process.env.GEMINI_MODEL ??
  "models/gemini-3-flash-preview";

/* ============================================================
 * Generate Content
 * ============================================================
 */

export async function generateContent(

  prompt: string

): Promise<string> {

  const ai =
    getGeminiClient();

  const response =
    await ai.models.generateContent({

      model: DEFAULT_MODEL,

      contents: prompt,

    });

  const text =
    response.text;

  if (!text?.trim()) {

    throw new Error(

      "Gemini returned empty response."

    );

  }

  return text.trim();

}

/* ============================================================
 * Generate JSON
 * ============================================================
 */

export async function generateJson<T>(

  prompt: string

): Promise<T> {

  const text =
    await generateContent(prompt);

  const cleaned =

    text

      .replace(/```json/gi, "")

      .replace(/```/g, "")

      .trim();

  try {

    return JSON.parse(cleaned) as T;

  }

  catch {

    throw new Error(

      "Gemini returned invalid JSON."

    );

  }

}
/* ============================================================
 * Evaluation JSON Structure
 * ============================================================
 */

export interface GeminiEvaluationResult {
  grammar: number;
  grammarComment: string;
  vocabulary: number;
  vocabularyComment: string;
  pronunciation: number;
  pronunciationComment: string;
  fluency: number;
  fluencyComment: string;
  relevance: number;
  relevanceComment: string;
  confidence: number;
  confidenceComment: string;
  overallFeedback: string;
  mistakes: string[];
  suggestions: string[];
  improvedAnswer: string;
  contentAssessment?: {
    criteria: Array<{
      id: string;
      label: string;
      status: "covered" | "partial" | "missing";
      evidence: string;
      coachingTip: string;
    }>;
    evidenceQualityScore: number;
    summary: string;
  };
}

export interface EvaluationQuestionContext {
  title: string;
  description: string;
  level: string;
  keywords: string[];
  grammarFocus: string[];
  vocabularyLevel: string;
  sampleAnswer: string;
  commonMistakes: string[];
  expectedIdeas: Array<{
    id: string;
    label: string;
    description: string;
    weight?: number;
  }>;
}

interface GenerateEvaluationInput {
  transcript: string;
  question: EvaluationQuestionContext;
}

/* ============================================================
 * Generate Interview Evaluation
 * ============================================================
 */

export async function generateEvaluation({
  transcript,
  question,
}: GenerateEvaluationInput): Promise<GeminiEvaluationResult> {
  const prompt = `
You are a professional English job-interview examiner and supportive speaking coach.

Evaluate the candidate's answer for THIS specific interview question.

INTERVIEW QUESTION:
${question.title}

QUESTION PURPOSE:
${question.description}

EXPECTED LEVEL:
${question.level}

TARGET VOCABULARY LEVEL:
${question.vocabularyLevel}

IMPORTANT IDEAS OR KEYWORDS:
${question.keywords.join(", ")}

GRAMMAR FOCUS:
${question.grammarFocus.join(", ")}

REFERENCE SAMPLE ANSWER:
${question.sampleAnswer}

COMMON MISTAKES TO WATCH FOR:
${question.commonMistakes.join("; ")}

QUESTION-SPECIFIC CONTENT CRITERIA:
${JSON.stringify(question.expectedIdeas, null, 2)}

CANDIDATE ANSWER:
${transcript}

SCORING RULES:
- Score every category from 0 to 10.
- Use the sample answer only as a content and structure benchmark.
- Do NOT penalize the candidate for using different wording or personal details.
- Give a high relevance score when the answer directly addresses the question and covers several important ideas.
- Evaluate grammar according to the listed grammar focus while also considering overall accuracy.
- Evaluate vocabulary according to the target level and suitability for a professional interview.
- Pronunciation must be estimated only from the transcript, so state this limitation briefly.
- Confidence should be inferred from clarity, directness, positive wording, and completeness.
- Keep feedback encouraging, specific, and suitable for an English learner.
- The improved answer must preserve the candidate's meaning, correct errors, and sound natural and confident.
- Do not copy the sample answer word for word.
- Evaluate every question-specific content criterion semantically, not by keyword matching alone.
- Mark a criterion "covered" only when the candidate clearly communicates the idea.
- Mark it "partial" when the idea is hinted at but lacks clarity, detail, or support.
- Mark it "missing" when the idea is absent, contradicted, or represented only by an isolated word.
- Evidence must quote or closely paraphrase a short part of the candidate answer. If missing, use an empty string.
- Evidence quality score is 0-100 and reflects specificity, examples, actions, outcomes, measurable details, and job connection.
- Keep the content summary consistent with the criterion statuses and the relevance score.
- Return exactly one criteria item for each supplied criterion, preserving its id and label.
- If QUESTION-SPECIFIC CONTENT CRITERIA is empty, return an empty criteria array.

Return ONLY valid JSON with exactly this structure:
{
  "grammar": 0,
  "grammarComment": "",
  "vocabulary": 0,
  "vocabularyComment": "",
  "pronunciation": 0,
  "pronunciationComment": "",
  "fluency": 0,
  "fluencyComment": "",
  "relevance": 0,
  "relevanceComment": "",
  "confidence": 0,
  "confidenceComment": "",
  "overallFeedback": "",
  "mistakes": [],
  "suggestions": [],
  "improvedAnswer": "",
  "contentAssessment": {
    "criteria": [
      {
        "id": "",
        "label": "",
        "status": "covered",
        "evidence": "",
        "coachingTip": ""
      }
    ],
    "evidenceQualityScore": 0,
    "summary": ""
  }
}
`;

  console.log("[Gemini] Evaluating answer against question context...");

  const result = await generateJson<GeminiEvaluationResult>(prompt);

  console.log("[Gemini] Context-aware evaluation completed.");

  return result;
}

/* ============================================================
 * End of File
 * ============================================================  */
export interface GeminiRecruiterReportResult {
  recruiterImpression: string;
  strengths: string[];
  improvements: string[];
  recommendedNextPractice: string[];
}

export async function generateRecruiterReport(
  candidateName: string,
  levelLabel: string,
  attempts: Array<{
    questionTitle: string;
    transcript: string;
    overall: number;
    relevance: number;
    confidence: number;
    suggestions: string[];
  }>
): Promise<GeminiRecruiterReportResult> {
  return generateJson<GeminiRecruiterReportResult>(`
You are a professional corporate recruiter and supportive interview coach.
Create one final recruiter report for this completed interview level.

CANDIDATE NAME: ${candidateName}
LEVEL: ${levelLabel}

INTERVIEW RESULTS:
${JSON.stringify(attempts, null, 2)}

RULES:
- Address the candidate naturally by name where appropriate, but do not overuse the name.
- Base every comment only on the supplied answers and scores.
- Do not claim that the candidate did something that is not shown in the data.
- Be encouraging but honest and consistent with the scores.
- If scores are low, do not use words such as excellent or outstanding.
- Strengths must be specific and evidence-based.
- Improvements must be practical and specific.
- Recommend exactly three next practice actions.
- Return valid JSON only.

JSON FORMAT:
{
  "recruiterImpression": "",
  "strengths": ["", "", ""],
  "improvements": ["", "", ""],
  "recommendedNextPractice": ["", "", ""]
}
`);
}
