"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ClassroomCandidateResult, ClassroomCloudSession } from "@/types/classroomResults";

import TeacherLessonSynthesis from "./TeacherLessonSynthesis";

const TEACHER_SESSION_KEY = "english-ai-teacher-class-session";
const TEACHER_PIN_KEY = "english-ai-teacher-dashboard-pin";
const STUDENT_BASE_URL_KEY = "english-ai-student-base-url";

type SessionResponse = {
  ok?: boolean;
  session?: ClassroomCloudSession;
  results?: ClassroomCandidateResult[];
  error?: string;
};

function modeLabel(mode: ClassroomCandidateResult["evaluation_mode"]) {
  if (mode === "live_ai") return "Live AI";
  if (mode === "mixed") return "Mixed AI + Backup";
  if (mode === "backup_rubric") return "Backup Rubric";
  return "Unavailable";
}

function scoreOrDash(value: number | null | undefined) {
  return value == null ? "—" : value.toFixed(1);
}

export default function TeacherClassroomDashboard() {
  const [pin, setPin] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [session, setSession] = useState<ClassroomCloudSession | null>(null);
  const [results, setResults] = useState<ClassroomCandidateResult[]>([]);
  const [requestedCode, setRequestedCode] = useState("HG2026");
  const [sessionName, setSessionName] = useState("Job Interview Teaching Demo");
  const [loading, setLoading] = useState(false);
  const [pollingError, setPollingError] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [origin, setOrigin] = useState("");
  const [studentBaseUrl, setStudentBaseUrl] = useState("");

  const loadSession = async (sessionCode: string, teacherPin = pin, silent = false) => {
    if (!sessionCode || !teacherPin) return;
    if (!silent) setLoading(true);
    try {
      const response = await fetch(`/api/class-results/session?code=${encodeURIComponent(sessionCode)}`, {
        headers: { "x-teacher-pin": teacherPin },
        cache: "no-store",
      });
      const data = await response.json() as SessionResponse;
      if (!response.ok || !data.session) throw new Error(data.error || "Could not load class results.");
      setSession(data.session);
      setResults(data.results ?? []);
      setPollingError("");
      localStorage.setItem(TEACHER_SESSION_KEY, data.session.session_code);
    } catch (error) {
      setPollingError(error instanceof Error ? error.message : "Could not load class results.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    const currentOrigin = window.location.origin.replace(/\/$/, "");
    setOrigin(currentOrigin);
    const configuredBaseUrl = (process.env.NEXT_PUBLIC_CLASSROOM_BASE_URL ?? "").trim().replace(/\/$/, "");
    const savedBaseUrl = localStorage.getItem(STUDENT_BASE_URL_KEY)?.trim().replace(/\/$/, "") ?? "";
    setStudentBaseUrl(savedBaseUrl || configuredBaseUrl || currentOrigin);
    const savedPin = sessionStorage.getItem(TEACHER_PIN_KEY) ?? "";
    const savedSession = localStorage.getItem(TEACHER_SESSION_KEY) ?? "";
    if (savedPin) {
      setPin(savedPin);
      setPinInput(savedPin);
      if (savedSession) void loadSession(savedSession, savedPin, true);
    }
    // Restore only once on the teacher machine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!pin || !session?.session_code || session.status === "closed") return;
    const timer = window.setInterval(() => {
      void loadSession(session.session_code, pin, true);
    }, 2500);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin, session?.session_code, session?.status]);

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = pinInput.trim();
    if (!next) return;
    sessionStorage.setItem(TEACHER_PIN_KEY, next);
    setPin(next);
  };

  const createSession = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pin) return;
    setLoading(true);
    setPollingError("");
    try {
      const response = await fetch("/api/class-results/session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-teacher-pin": pin },
        body: JSON.stringify({
          action: "create",
          sessionName,
          expectedCandidates: 4,
          requestedCode,
        }),
      });
      const data = await response.json() as SessionResponse;
      if (!response.ok || !data.session) throw new Error(data.error || "Could not create the class session.");
      setSession(data.session);
      setResults([]);
      setShowSummary(false);
      localStorage.setItem(TEACHER_SESSION_KEY, data.session.session_code);
    } catch (error) {
      setPollingError(error instanceof Error ? error.message : "Could not create the class session.");
    } finally {
      setLoading(false);
    }
  };

  const closeSession = async () => {
    if (!pin || !session) return;
    if (!window.confirm(`Close class session ${session.session_code}? Existing results will remain in Supabase.`)) return;
    setLoading(true);
    setPollingError("");
    try {
      const response = await fetch("/api/class-results/session", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-teacher-pin": pin },
        body: JSON.stringify({ action: "close", sessionCode: session.session_code }),
      });
      const data = await response.json() as SessionResponse;
      if (!response.ok || !data.session) throw new Error(data.error || "Could not close the class session.");
      setSession(data.session);
    } catch (error) {
      setPollingError(error instanceof Error ? error.message : "Could not close the class session.");
    } finally {
      setLoading(false);
    }
  };

  const startNewSession = () => {
    if (session?.status === "open") {
      setPollingError("Close the current session before creating a new one.");
      return;
    }
    localStorage.removeItem(TEACHER_SESSION_KEY);
    setSession(null);
    setResults([]);
    setShowSummary(false);
    setPollingError("");
    setRequestedCode("");
    setSessionName("Job Interview Teaching Demo");
  };

  const updateStudentBaseUrl = (value: string) => {
    const normalized = value.trim().replace(/\/$/, "");
    setStudentBaseUrl(normalized);
    if (normalized) localStorage.setItem(STUDENT_BASE_URL_KEY, normalized);
    else localStorage.removeItem(STUDENT_BASE_URL_KEY);
  };

  const completed = results.length;
  const expected = session?.expected_candidates ?? 4;
  const readyForSummary = Boolean(session && completed >= expected);
  const studentLinkBase = studentBaseUrl || origin;
  const studentLink = session && studentLinkBase
    ? `${studentLinkBase.replace(/\/$/, "")}/interview?session=${encodeURIComponent(session.session_code)}`
    : "";
  const localOnlyStudentLink = /localhost|127\.0\.0\.1/i.test(studentLinkBase);

  if (!pin) {
    return (
      <section className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">FIX 43.3.2 · Teacher access</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Class Results Dashboard</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">Enter the teacher PIN configured on the server. Students never need this PIN.</p>
        <form onSubmit={login} className="mt-6 space-y-4">
          <input type="password" value={pinInput} onChange={(event) => setPinInput(event.target.value)} placeholder="Teacher PIN" className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" autoFocus />
          <button className="w-full rounded-xl bg-blue-600 px-5 py-3 font-black text-white">Open Teacher Dashboard</button>
        </form>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[.18em] text-blue-700">FIX 43.3.2 · Teacher dashboard</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Create the teaching-demo session</h1>
        <p className="mt-3 text-sm leading-7 text-slate-600">The session expects four candidates. Student results are saved locally first and then synchronized to Supabase.</p>
        <form onSubmit={createSession} className="mt-6 grid gap-4">
          <label className="text-sm font-bold text-slate-700">Session name<input value={sessionName} onChange={(event) => setSessionName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-medium" /></label>
          <label className="text-sm font-bold text-slate-700">Session code<input value={requestedCode} onChange={(event) => setRequestedCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 24))} placeholder="Leave blank for an automatic code" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono font-bold uppercase" /></label>
          <button disabled={loading} className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white disabled:bg-slate-400">{loading ? "Creating..." : "Create Class Session"}</button>
        </form>
        {pollingError && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-800">{pollingError}</p>}
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl space-y-5">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 p-6 text-white shadow-2xl sm:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.2em] text-blue-200">AI Interview · Live Class Session</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">{session.session_name}</h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white/10 px-3 py-1.5">Session <strong>{session.session_code}</strong></span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">Supabase centralized results</span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">Auto refresh 2.5s</span>
              <span className="rounded-full bg-white/10 px-3 py-1.5">Status <strong>{session.status}</strong></span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {session.status === "open" ? (
                <button type="button" onClick={() => void closeSession()} disabled={loading} className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15 disabled:opacity-50">Close Session</button>
              ) : (
                <button type="button" onClick={startNewSession} className="rounded-xl bg-white px-4 py-2 text-sm font-black text-slate-950">New Class Session</button>
              )}
            </div>
          </div>
          <div className="rounded-2xl bg-white/10 px-7 py-5 text-center">
            <p className="text-5xl font-black">{completed}/{expected}</p>
            <p className="mt-1 text-sm text-blue-100">Candidates completed</p>
          </div>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs font-black uppercase tracking-[.16em] text-blue-700">Live results</p><h2 className="mt-1 text-2xl font-black text-slate-950">Candidate status</h2></div>
            <button type="button" onClick={() => void loadSession(session.session_code)} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700">Refresh now</button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] border-separate border-spacing-y-2 text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-3 py-2">Candidate</th><th className="px-3 py-2">Q1</th><th className="px-3 py-2">Q2</th><th className="px-3 py-2">Q3</th><th className="px-3 py-2">Overall</th><th className="px-3 py-2">Evaluation</th><th className="px-3 py-2">Cloud</th></tr></thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="bg-slate-50 text-slate-800">
                    <td className="rounded-l-xl px-3 py-3 font-black">{result.candidate_name}</td>
                    <td className="px-3 py-3">{scoreOrDash(result.q1_result?.score)}/10</td>
                    <td className="px-3 py-3">{scoreOrDash(result.q2_result?.score)}/10</td>
                    <td className="px-3 py-3">{scoreOrDash(result.q3_result?.score)}/10</td>
                    <td className="px-3 py-3 text-lg font-black text-blue-700">{Number(result.overall_score).toFixed(1)}</td>
                    <td className="px-3 py-3">{modeLabel(result.evaluation_mode)}</td>
                    <td className="rounded-r-xl px-3 py-3 font-bold text-emerald-700">✓ Synced</td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(expected - results.length, 0) }).map((_, index) => (
                  <tr key={`waiting-${index}`} className="bg-slate-50 text-slate-400"><td className="rounded-l-xl px-3 py-3 font-semibold">Waiting for candidate...</td><td className="px-3 py-3">—</td><td className="px-3 py-3">—</td><td className="px-3 py-3">—</td><td className="px-3 py-3">—</td><td className="px-3 py-3">—</td><td className="rounded-r-xl px-3 py-3">Waiting</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          {pollingError && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{pollingError}</p>}
        </section>

        <aside className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-lg sm:p-6">
          <p className="text-xs font-black uppercase tracking-[.16em] text-emerald-700">Student computers</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">Open this interview link</h2>
          <label className="mt-4 block text-xs font-black uppercase tracking-wide text-emerald-800">Student link base address
            <input
              value={studentBaseUrl}
              onChange={(event) => updateStudentBaseUrl(event.target.value)}
              placeholder={origin}
              className="mt-2 w-full rounded-xl border border-emerald-200 bg-white px-3 py-2 font-mono text-xs normal-case tracking-normal text-slate-700 outline-none focus:border-emerald-500"
            />
          </label>
          {localOnlyStudentLink && (
            <p className="mt-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <strong>Localhost works only on this computer.</strong> For LAN testing, replace it with the teacher computer LAN address, for example <span className="font-mono">http://192.168.x.x:3000</span>. On Vercel, use the production site address.
            </p>
          )}
          <p className="mt-3 break-all rounded-xl border border-emerald-200 bg-white p-3 font-mono text-xs leading-6 text-slate-700">{studentLink}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => navigator.clipboard?.writeText(studentLink)} disabled={!studentLink || session.status !== "open"} className="rounded-xl bg-emerald-700 px-4 py-3 font-black text-white disabled:bg-slate-400">Copy Student Link</button>
            <button type="button" onClick={() => updateStudentBaseUrl(origin)} className="rounded-xl border border-emerald-300 bg-white px-4 py-3 font-bold text-emerald-800">Use Current Address</button>
          </div>
          <p className="mt-4 text-sm leading-6 text-emerald-950">Use the same link on both student computers. After the first candidate finishes, the closing screen tells students to switch roles and start the next candidate.</p>
        </aside>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[.16em] text-indigo-700">Teacher action</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Class performance synthesis</h2>
            <p className="mt-2 text-sm text-slate-600">No extra Gemini request is made here. The summary uses the four completed interview results already stored in Supabase.</p>
          </div>
          <button type="button" disabled={!readyForSummary} onClick={() => setShowSummary(true)} className="min-h-14 rounded-2xl bg-indigo-600 px-7 py-3 text-lg font-black text-white shadow-lg disabled:cursor-not-allowed disabled:bg-slate-300">
            {readyForSummary ? "TỔNG HỢP KẾT QUẢ" : `Waiting for ${expected - completed} candidate${expected - completed === 1 ? "" : "s"}`}
          </button>
        </div>
      </section>

      {showSummary && readyForSummary && session && (
        <TeacherLessonSynthesis key={session.id} sessionId={session.id} results={results} expected={expected} />
      )}
    </section>
  );
}
