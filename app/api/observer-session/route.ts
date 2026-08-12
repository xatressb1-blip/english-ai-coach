import { NextRequest, NextResponse } from "next/server";
import type { ObserverKey } from "@/services/teacherFeedbackService";
import {
  createObserverSession,
  deleteObserverSession,
  getObserverSession,
  submitObserverAssessment,
} from "@/services/observerSessionStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")?.trim().toUpperCase();
  if (!id) return NextResponse.json({ error: "Session id is required." }, { status: 400 });
  const session = getObserverSession(id);
  if (!session) return NextResponse.json({ error: "Observer session not found or expired." }, { status: 404 });
  return NextResponse.json({ session });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body?.action;

    if (action === "create") {
      const session = createObserverSession({
        candidateName: String(body?.candidateName ?? "Candidate"),
        companyName: String(body?.companyName ?? ""),
        jobTitle: String(body?.jobTitle ?? ""),
      });
      return NextResponse.json({ session });
    }

    if (action === "submit") {
      const role = body?.role as ObserverKey;
      if (!(["content", "language", "professional"] as string[]).includes(role)) {
        return NextResponse.json({ error: "Invalid observer role." }, { status: 400 });
      }
      const session = submitObserverAssessment({
        sessionId: String(body?.sessionId ?? ""),
        role,
        scores: Array.isArray(body?.scores) ? body.scores : [],
        note: {
          strength: String(body?.strength ?? ""),
          improvement: String(body?.improvement ?? ""),
        },
      });
      if (!session) return NextResponse.json({ error: "Observer session not found or expired." }, { status: 404 });
      return NextResponse.json({ session });
    }

    if (action === "delete") {
      deleteObserverSession(String(body?.sessionId ?? ""));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Observer session request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
