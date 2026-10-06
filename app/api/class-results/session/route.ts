import { NextRequest, NextResponse } from "next/server";
import {
  completeCloudSession,
  closeCloudSession,
  createCloudSession,
  getCloudSessionByCode,
  listSessionResults,
  verifyTeacherPin,
} from "@/services/supabaseClassroomStore";
import { normalizeSessionCode } from "@/services/classroomResultUtils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function teacherPin(request: NextRequest) {
  return request.headers.get("x-teacher-pin");
}

function unauthorized() {
  return NextResponse.json({ error: "Teacher access denied." }, { status: 401 });
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyTeacherPin(teacherPin(request))) return unauthorized();
    const code = normalizeSessionCode(request.nextUrl.searchParams.get("code") ?? "");
    if (!code) return NextResponse.json({ error: "Session code is required." }, { status: 400 });

    const session = await getCloudSessionByCode(code);
    if (!session) return NextResponse.json({ error: "Class session not found." }, { status: 404 });
    const results = await listSessionResults(session.id);
    return NextResponse.json({ ok: true, session, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load the class session.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyTeacherPin(teacherPin(request))) return unauthorized();
    const body = await request.json();
    const action = String(body?.action ?? "create");

    if (action === "create") {
      const session = await createCloudSession({
        sessionName: String(body?.sessionName ?? "Job Interview Teaching Demo"),
        expectedCandidates: Number(body?.expectedCandidates ?? 4),
        requestedCode: String(body?.requestedCode ?? ""),
      });
      return NextResponse.json({ ok: true, session });
    }

    if (action === "complete") {
      const code = normalizeSessionCode(String(body?.sessionCode ?? ""));
      if (!code) return NextResponse.json({ error: "Session code is required." }, { status: 400 });
      const session = await completeCloudSession(code);
      return NextResponse.json({ ok: true, session });
    }

    if (action === "close") {
      const code = normalizeSessionCode(String(body?.sessionCode ?? ""));
      if (!code) return NextResponse.json({ error: "Session code is required." }, { status: 400 });
      const session = await closeCloudSession(code);
      return NextResponse.json({ ok: true, session });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Class session request failed.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
