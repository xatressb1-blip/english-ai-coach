import { generateFollowUpDecision } from "@/services/geminiClient";
import { FollowUpRequest } from "@/types/followUp";

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<FollowUpRequest>;
    const payload: FollowUpRequest = {
      candidateName: cleanString(body.candidateName),
      companyName: cleanString(body.companyName),
      jobTitle: cleanString(body.jobTitle),
      recruiterName: cleanString(body.recruiterName),
      mainQuestion: cleanString(body.mainQuestion),
      mainAnswer: cleanString(body.mainAnswer),
      relevanceScore: Number(body.relevanceScore) || 0,
      contentCoverageScore: Number(body.contentCoverageScore) || 0,
      missingIdeas: Array.isArray(body.missingIdeas) ? body.missingIdeas.filter((item): item is string => typeof item === "string") : [],
      partialIdeas: Array.isArray(body.partialIdeas) ? body.partialIdeas.filter((item): item is string => typeof item === "string") : [],
    };

    if (!payload.mainQuestion || !payload.mainAnswer) {
      return Response.json({ success: false, message: "Main question and answer are required." }, { status: 400 });
    }

    const decision = await generateFollowUpDecision(payload);
    return Response.json({ success: true, decision });
  } catch (error) {
    console.error("[Follow-up API]", error);
    return Response.json(
      { success: false, message: error instanceof Error ? error.message : "Unable to prepare a follow-up question." },
      { status: 500 }
    );
  }
}
