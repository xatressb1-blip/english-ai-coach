import { generateRecruiterReport } from "@/services/geminiClient";
import { TrainingLevel } from "@/types/interviewReport";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const attempts = Array.isArray(body?.attempts) ? body.attempts : [];
    const level = body?.level as TrainingLevel;
    const candidateName = String(body?.candidateName ?? "Candidate").trim() || "Candidate";
    const interviewContext = body?.interviewContext ?? {};

    if (!attempts.length) {
      return Response.json({ success: false, message: "No evaluated answers were provided." }, { status: 400 });
    }

    const report = await generateRecruiterReport(
      candidateName,
      level === "advanced" ? "Level 2 – Nâng cao" : "Level 1 – Cơ bản",
      attempts.map((item: any) => ({
        questionTitle: item.questionTitle ?? "",
        transcript: item.transcript ?? "",
        overall: item.evaluation?.overall ?? 0,
        relevance: item.evaluation?.relevance?.score ?? 0,
        confidence: item.evaluation?.confidence?.score ?? 0,
        suggestions: Array.isArray(item.evaluation?.suggestions) ? item.evaluation.suggestions : [],
      })),
      {
        companyName: String(interviewContext.companyName ?? "Simulated Company"),
        companyIndustry: String(interviewContext.companyIndustry ?? "General"),
        jobTitle: String(interviewContext.jobTitle ?? "Entry-level position"),
        jobDepartment: String(interviewContext.jobDepartment ?? "General"),
        recruiterName: String(interviewContext.recruiterName ?? "AI Recruiter"),
      }
    );

    return Response.json({ success: true, report });
  } catch (error: any) {
    console.error("[Interview Report API]", error);
    return Response.json(
      { success: false, message: error?.message ?? "Unable to create recruiter report." },
      { status: 500 }
    );
  }
}
