"use client";

import { useEffect, useMemo, useState } from "react";
import type { ObserverKey } from "@/services/teacherFeedbackService";
import type { ObserverSessionSnapshot } from "@/services/observerSessionTypes";
import { OBSERVER_ROLE_LABELS } from "@/services/observerSessionTypes";

const rubrics: Record<ObserverKey, { focus: string; criteria: string[] }> = {
  content: {
    focus: "Focus on relevance, required ideas, examples, evidence, and job connection.",
    criteria: [
      "Answers all three interview questions directly and stays on topic.",
      "Q1 includes education/major, career direction, and potential contribution.",
      "Q2 states a clear strength and supports it with an explanation, example, action, and result.",
      "Q3 shows company research, role fit, relevant skills, contribution, and willingness to grow.",
      "Ideas are logically organized, specific enough, and easy to follow.",
    ],
  },
  language: {
    focus: "Focus on understandable English, vocabulary, fluency, clarity, and spoken control.",
    criteria: [
      "Uses understandable and mostly accurate grammar.",
      "Uses suitable professional and job-interview vocabulary.",
      "Connects ideas clearly with appropriate linking words.",
      "Speaks fluently with limited fillers and unnecessary repetition.",
      "Pronunciation and spoken clarity are understandable to the listener.",
    ],
  },
  professional: {
    focus: "Focus on visible professional behavior that transcript-based AI cannot reliably judge.",
    criteria: [
      "Maintains appropriate posture and eye contact.",
      "Uses an audible voice and an appropriate speaking pace.",
      "Shows confidence and remains calm while answering.",
      "Shows a polite, positive, and professional attitude.",
      "Listens carefully and responds naturally without reading the whole answer.",
    ],
  },
};

export default function ObserverPage() {
  const [sessionId, setSessionId] = useState("");
  const [session, setSession] = useState<ObserverSessionSnapshot | null>(null);
  const [role, setRole] = useState<ObserverKey | "">("");
  const [scores, setScores] = useState<Array<number | null>>([null, null, null, null, null]);
  const [strength, setStrength] = useState("");
  const [improvement, setImprovement] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "submitting" | "submitted" | "error">("idle");
  const [message, setMessage] = useState("");

  const rubric = role ? rubrics[role] : null;
  const canSubmit = useMemo(() => role && scores.every((value) => value !== null), [role, scores]);

  const loadSession = async (id = sessionId) => {
    const normalized = id.trim().toUpperCase();
    if (!normalized) return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`/api/observer-session?id=${encodeURIComponent(normalized)}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Session not found.");
      setSessionId(normalized);
      setSession(data.session);
      setStatus("ready");
    } catch (error) {
      setSession(null);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to open observer session.");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = new URLSearchParams(window.location.search).get("session")?.trim().toUpperCase() ?? "";
    setSessionId(id);
    if (id) void loadSession(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = async () => {
    if (!session || !role || !canSubmit) return;
    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/observer-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit",
          sessionId: session.id,
          role,
          scores,
          strength,
          improvement,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Unable to submit assessment.");
      setSession(data.session);
      setStatus("submitted");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit assessment.");
    }
  };

  if (!session) {
    return (
      <main className="mx-auto min-h-screen max-w-xl bg-slate-50 p-4 sm:p-8">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Fix 39.1 · Observer Assessment</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">Join Observer Session</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Enter the 6-character session code shown on the teacher screen. Observer assessment is independent; AI results are intentionally hidden.</p>
          <label className="mt-6 block text-sm font-bold text-slate-800">
            Session code
            <input
              value={sessionId}
              onChange={(event) => setSessionId(event.target.value.toUpperCase())}
              maxLength={6}
              className="mt-2 w-full rounded-xl border border-slate-300 p-3 text-center text-xl font-black uppercase tracking-[0.25em] outline-none focus:border-indigo-500"
              placeholder="ABC123"
            />
          </label>
          <button type="button" onClick={() => void loadSession()} disabled={!sessionId.trim() || status === "loading"} className="mt-4 w-full rounded-xl bg-indigo-600 px-4 py-3 font-bold text-white disabled:opacity-50">
            {status === "loading" ? "Joining…" : "Join Session"}
          </button>
          {message && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}
        </section>
      </main>
    );
  }

  if (status === "submitted") {
    return (
      <main className="mx-auto min-h-screen max-w-xl bg-slate-50 p-4 sm:p-8">
        <section className="rounded-3xl border border-emerald-200 bg-white p-7 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
          <h1 className="mt-4 text-2xl font-black text-slate-950">Assessment Submitted</h1>
          <p className="mt-2 text-sm text-slate-600">{role ? OBSERVER_ROLE_LABELS[role] : "Observer"}</p>
          <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900">Your independent assessment has been sent to the teacher screen. Please do not change your rating after seeing AI/Backup results unless the teacher asks you to review it.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-slate-50 p-3 sm:p-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-indigo-600">Observer Session · {session.id}</p>
            <h1 className="mt-1 text-xl font-black text-slate-950">{session.candidateName}</h1>
            <p className="mt-1 text-sm text-slate-500">{session.jobTitle}{session.companyName ? ` · ${session.companyName}` : ""}</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">AI hidden</span>
        </div>

        {!role ? (
          <div className="mt-6">
            <h2 className="font-black text-slate-900">Select your assigned observer role</h2>
            <div className="mt-3 grid gap-3">
              {(Object.keys(OBSERVER_ROLE_LABELS) as ObserverKey[]).map((key) => {
                const alreadySubmitted = Boolean(session.submissions[key]);
                return (
                  <button key={key} type="button" disabled={alreadySubmitted} onClick={() => setRole(key)} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60">
                    <p className="font-black text-slate-950">{OBSERVER_ROLE_LABELS[key]}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{alreadySubmitted ? "Already submitted for this session." : rubrics[key].focus}</p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <button type="button" onClick={() => setRole("")} className="text-sm font-bold text-indigo-700">← Change role</button>
            <h2 className="mt-3 text-lg font-black text-slate-950">{OBSERVER_ROLE_LABELS[role]}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">{rubric?.focus}</p>
            <div className="mt-4 rounded-xl bg-blue-50 p-3 text-xs leading-5 text-blue-900"><strong>Score:</strong> 2 = Achieved · 1 = Partly achieved · 0 = Not yet achieved</div>

            <div className="mt-4 space-y-3">
              {rubric?.criteria.map((criterion, index) => (
                <div key={criterion} className="rounded-2xl border border-slate-200 p-4">
                  <p className="text-sm font-semibold leading-6 text-slate-800">{index + 1}. {criterion}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((value) => (
                      <button key={value} type="button" onClick={() => setScores((current) => current.map((score, scoreIndex) => scoreIndex === index ? value : score))} className={`rounded-xl border py-2 font-black ${scores[index] === value ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white text-slate-700"}`}>
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <label className="mt-5 block text-sm font-bold text-slate-800">One strong point
              <textarea value={strength} onChange={(event) => setStrength(event.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-normal outline-none focus:border-indigo-500" placeholder="Example: The answer was relevant and well organized." />
            </label>
            <label className="mt-4 block text-sm font-bold text-slate-800">One area for improvement
              <textarea value={improvement} onChange={(event) => setImprovement(event.target.value)} rows={2} className="mt-2 w-full rounded-xl border border-slate-300 p-3 font-normal outline-none focus:border-indigo-500" placeholder="Example: Make the result more specific." />
            </label>

            <button type="button" onClick={() => void submit()} disabled={!canSubmit || status === "submitting"} className="mt-5 w-full rounded-xl bg-indigo-600 px-4 py-3 font-black text-white disabled:opacity-40">
              {status === "submitting" ? "Submitting…" : "Submit Assessment"}
            </button>
            {message && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}
          </div>
        )}
      </section>
    </main>
  );
}
