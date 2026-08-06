export type AiErrorCode =
  | "AI_TIMEOUT"
  | "AI_NETWORK"
  | "AI_HIGH_DEMAND"
  | "AI_RATE_LIMIT"
  | "AI_DAILY_QUOTA"
  | "AI_INVALID_RESPONSE"
  | "AI_UNKNOWN";

export interface AiErrorPayload {
  code: AiErrorCode;
  message: string;
  retryable: boolean;
  retryAfterSeconds?: number;
}

export class AiEvaluationError extends Error {
  code: AiErrorCode;
  retryable: boolean;
  retryAfterSeconds?: number;

  constructor(payload: AiErrorPayload) {
    super(payload.message);
    this.name = "AiEvaluationError";
    this.code = payload.code;
    this.retryable = payload.retryable;
    this.retryAfterSeconds = payload.retryAfterSeconds;
  }
}

export function isAiEvaluationError(error: unknown): error is AiEvaluationError {
  return error instanceof AiEvaluationError;
}
