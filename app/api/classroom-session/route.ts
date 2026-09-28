import { NextRequest, NextResponse } from "next/server";
import type { ClassroomObservationRole, ClassroomSessionPhase } from "@/services/classroomSessionTypes";
import {
  completeClassroomSession,
  createClassroomSession,
  deleteClassroomSession,
  getClassroomSession,
  joinClassroomSession,
  submitClassroomObservation,
  updateClassroomRound,
} from "@/services/classroomSessionStore";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("health") === "1") {
    return NextResponse.json({ ok: true, service: "classroom-session" });
  }

  const id = request.nextUrl.searchParams.get("id")?.trim().toUpperCase();
  if (!id) return NextResponse.json({ error: "Session id is required." }, { status: 400 });
  const session = getClassroomSession(id);
  if (!session) return NextResponse.json({ error: "Classroom session not found or expired." }, { status: 404 });
  return NextResponse.json({ session });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = String(body?.action ?? "");

    if (action === "create") {
      const session = createClassroomSession({
        studentNames: Array.isArray(body?.studentNames) ? body.studentNames : [],
        companyName: String(body?.companyName ?? ""),
        jobTitle: String(body?.jobTitle ?? ""),
        recruiterName: String(body?.recruiterName ?? ""),
        questionAssignments: Array.isArray(body?.questionAssignments) ? body.questionAssignments : [],
      });
      return NextResponse.json({ session });
    }

    if (action === "join") {
      const session = joinClassroomSession({
        sessionId: String(body?.sessionId ?? ""),
        studentIndex: Number(body?.studentIndex),
      });
      if (!session) return NextResponse.json({ error: "Classroom session not found or expired." }, { status: 404 });
      return NextResponse.json({ session });
    }

    if (action === "set-round") {
      const phase = String(body?.phase ?? "ready") as ClassroomSessionPhase;
      if (!( ["ready", "answering", "review", "completed"] as string[] ).includes(phase)) {
        return NextResponse.json({ error: "Invalid classroom phase." }, { status: 400 });
      }
      const session = updateClassroomRound({
        sessionId: String(body?.sessionId ?? ""),
        currentRound: Number(body?.currentRound ?? 0),
        phase,
      });
      if (!session) return NextResponse.json({ error: "Classroom session not found or expired." }, { status: 404 });
      return NextResponse.json({ session });
    }

    if (action === "submit-observation") {
      const role = String(body?.role ?? "") as ClassroomObservationRole;
      if (!( ["content", "language", "professional"] as string[] ).includes(role)) {
        return NextResponse.json({ error: "Invalid observer role." }, { status: 400 });
      }
      const session = submitClassroomObservation({
        sessionId: String(body?.sessionId ?? ""),
        candidateIndex: Number(body?.candidateIndex ?? 0),
        observerIndex: Number(body?.observerIndex),
        role,
        scores: Array.isArray(body?.scores) ? body.scores : [],
        strength: String(body?.strength ?? ""),
        improvement: String(body?.improvement ?? ""),
      });
      if (!session) return NextResponse.json({ error: "Classroom session not found or expired." }, { status: 404 });
      return NextResponse.json({ session });
    }

    if (action === "complete") {
      const session = completeClassroomSession(String(body?.sessionId ?? ""));
      if (!session) return NextResponse.json({ error: "Classroom session not found or expired." }, { status: 404 });
      return NextResponse.json({ session });
    }

    if (action === "delete") {
      deleteClassroomSession(String(body?.sessionId ?? ""));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Classroom session request failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
