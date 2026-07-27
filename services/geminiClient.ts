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

  vocabulary: number;

  pronunciation: number;

  fluency: number;

  relevance: number;

  confidence: number;

  mistakes: string[];

  suggestions: string[];

  improvedAnswer: string;

}

/* ============================================================
 * Generate Interview Evaluation
 * ============================================================
 */

export async function generateEvaluation(

  answer: string

): Promise<GeminiEvaluationResult> {

  const prompt = `
You are a professional English Interview Examiner.

Evaluate the following interview answer.

Candidate Answer:

"${answer}"

Return ONLY valid JSON.

{
  "grammar":0,
  "vocabulary":0,
  "pronunciation":0,
  "fluency":0,
  "relevance":0,
  "confidence":0,
  "mistakes":[],
  "suggestions":[],
  "improvedAnswer":""
}
`;

  console.log(

    "[Gemini] Evaluating interview..."

  );

  const result =

    await generateJson<GeminiEvaluationResult>(

      prompt

    );

  console.log(

    "[Gemini] Evaluation completed."

  );

  return result;

}

/* ============================================================
 * End of File
 * ============================================================  */