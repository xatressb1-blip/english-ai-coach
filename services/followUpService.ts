import { FollowUpDecision, FollowUpRequest } from "@/types/followUp";

const NO_FOLLOW_UP: FollowUpDecision = {
  shouldAsk: false,
  question: "",
  reason: "The interview can continue without a follow-up question.",
};

export async function requestFollowUp(payload: FollowUpRequest): Promise<FollowUpDecision> {
  try {
    const response = await fetch("/api/follow-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return NO_FOLLOW_UP;

    const data = (await response.json()) as { success?: boolean; decision?: FollowUpDecision };
    if (!data.success || !data.decision) return NO_FOLLOW_UP;

    const question = data.decision.question.trim();
    return {
      shouldAsk: Boolean(data.decision.shouldAsk && question),
      question,
      reason: data.decision.reason?.trim() || "",
    };
  } catch (error) {
    console.warn("[Follow-up] Continuing without a follow-up question.", error);
    return NO_FOLLOW_UP;
  }
}
