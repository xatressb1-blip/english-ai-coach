import { NextResponse } from "next/server";
import { upsertCandidateResult } from "@/services/supabaseClassroomStore";
import { candidateKeyFromName, normalizeSessionCode } from "@/services/classroomResultUtils";
import type { ClassroomSyncPayload } from "@/types/classroomResults";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Partial<ClassroomSyncPayload>;
    const sessionCode = normalizeSessionCode(String(body.sessionCode ?? ""));
    const candidateName = String(body.candidateName ?? "").trim();
    const candidateKey = String(body.candidateKey ?? candidateKeyFromName(candidateName)).trim().slice(0, 64);

    if (!sessionCode) return NextResponse.json({ error: "Class session code is required." }, { status: 400 });
    if (!candidateName) return NextResponse.json({ error: "Candidate name is required." }, { status: 400 });
    if (!body.report || !Array.isArray(body.attempts) || body.attempts.length < 3) {
      return NextResponse.json({ error: "A completed three-question interview report is required." }, { status: 400 });
    }

    const payload: ClassroomSyncPayload = {
      sessionCode,
      candidateKey,
      candidateName,
      companyName: String(body.companyName ?? ""),
      jobTitle: String(body.jobTitle ?? ""),
      recruiterName: String(body.recruiterName ?? ""),
      report: body.report,
      attempts: body.attempts,
    };

    const synced = await upsertCandidateResult(payload);
    return NextResponse.json({ ok: true, sessionCode: synced.session.session_code, result: synced.result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not synchronize the candidate result.";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
