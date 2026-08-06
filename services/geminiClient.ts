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
import type { FollowUpDecision, FollowUpRequest } from "@/types/followUp";

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
  fastEvaluation?: boolean;
}

/* ============================================================
 * Generate Interview Evaluation
 * ============================================================
 */

export async function generateEvaluation({
  transcript,
  question,
  fastEvaluation = false,
}: GenerateEvaluationInput): Promise<GeminiEvaluationResult> {
  const fastPrompt = `
You are evaluating one entry-level English job-interview answer during a live classroom demonstration.
Return a fast, consistent and encouraging assessment. Be concise.

QUESTION: ${question.title}
CONTENT CRITERIA: ${JSON.stringify(question.expectedIdeas)}
ANSWER: ${transcript}

RULES:
- Score grammar, vocabulary, pronunciation estimate, fluency, relevance and confidence from 0 to 10.
- Pronunciation is only an estimate from the transcript; keep its comment brief.
- Assess each supplied content criterion semantically. Preserve every criterion id and label.
- Status must be covered, partial or missing. A keyword alone is not enough.
- Evidence must be a very short quote or paraphrase; use an empty string when missing.
- evidenceQualityScore is 0-100.
- Keep every comment to one short sentence.
- Return at most one grammar mistake and exactly one priority suggestion.
- Do not generate an improved answer in fast mode; return an empty string.
- Return valid JSON only, with no markdown.

JSON:
{
  "grammar": 0, "grammarComment": "",
  "vocabulary": 0, "vocabularyComment": "",
  "pronunciation": 0, "pronunciationComment": "",
  "fluency": 0, "fluencyComment": "",
  "relevance": 0, "relevanceComment": "",
  "confidence": 0, "confidenceComment": "",
  "overallFeedback": "",
  "mistakes": [],
  "suggestions": [""],
  "improvedAnswer": "",
  "contentAssessment": {
    "criteria": [{"id":"", "label":"", "status":"covered", "evidence":"", "coachingTip":""}],
    "evidenceQualityScore": 0,
    "summary": ""
  }
}`;

  const fullPrompt = `
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

  const prompt = fastEvaluation ? fastPrompt : fullPrompt;

  console.log(`[Gemini] Evaluating answer (${fastEvaluation ? "fast" : "full"} mode)...`);

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
  }>,
  interviewContext?: { companyName: string; companyIndustry: string; jobTitle: string; jobDepartment: string; recruiterName: string }
): Promise<GeminiRecruiterReportResult> {
  return generateJson<GeminiRecruiterReportResult>(`
You are a professional corporate recruiter and supportive interview coach.
Create one final recruiter report for this completed interview level.

CANDIDATE NAME: ${candidateName}
LEVEL: ${levelLabel}
COMPANY: ${interviewContext?.companyName ?? "Simulated Company"}
INDUSTRY: ${interviewContext?.companyIndustry ?? "General"}
POSITION: ${interviewContext?.jobTitle ?? "Entry-level position"}
DEPARTMENT: ${interviewContext?.jobDepartment ?? "General"}
INTERVIEWER: ${interviewContext?.recruiterName ?? "AI Recruiter"}

INTERVIEW RESULTS:
${JSON.stringify(attempts, null, 2)}

RULES:
- Address the candidate naturally by name where appropriate, but do not overuse the name.
- Base every comment only on the supplied answers and scores.
- When relevant, connect feedback to the selected position and company context without inventing company facts.
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

/* ============================================================
 * Intelligent Follow-up Question
 * ============================================================
 */

export async function generateFollowUpDecision(input: FollowUpRequest): Promise<FollowUpDecision> {
  const prompt = `
You are ${input.recruiterName || "a professional recruiter"} conducting a realistic entry-level job interview.

CONTEXT:
Candidate: ${input.candidateName || "Candidate"}
Company: ${input.companyName || "the company"}
Position: ${input.jobTitle || "the position"}
Main interview question: ${input.mainQuestion}
Candidate's answer: ${input.mainAnswer}
Relevance score: ${input.relevanceScore}/10
Content coverage score: ${input.contentCoverageScore}/100
Partly covered ideas: ${input.partialIdeas.join(", ") || "None"}
Missing ideas: ${input.missingIdeas.join(", ") || "None"}

DECISION RULES:
- Ask at most ONE short follow-up question.
- Ask only when it would make the interview more realistic and reveal useful evidence.
- Good reasons include: the answer is too general, lacks a concrete example, mentions an experience worth clarifying, gives a result without explaining the candidate's action, or does not directly answer the main question.
- Do not ask a follow-up when the answer is already clear, specific, relevant, and sufficiently supported.
- Do not ask for sensitive personal information, protected characteristics, salary history, health, family status, religion, politics, or anything unrelated to job performance.
- The question must be natural spoken English, one sentence, no more than 22 words, and understandable to an English learner.
- Do not repeat the main question.
- Do not mention scores, coverage, missing ideas, AI, evaluation, or feedback.
- If uncertain, choose shouldAsk=false.

Return ONLY valid JSON:
{
  "shouldAsk": false,
  "question": "",
  "reason": ""
}
`;

  const result = await generateJson<FollowUpDecision>(prompt);
  const question = typeof result.question === "string" ? result.question.trim() : "";
  return {
    shouldAsk: Boolean(result.shouldAsk && question),
    question: question.slice(0, 220),
    reason: typeof result.reason === "string" ? result.reason.trim().slice(0, 240) : "",
  };
}
