"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ClassroomObservationRole,
  ClassroomSessionSnapshot,
  RubricScores,
} from "@/services/classroomSessionTypes";
import {
  CLASSROOM_ROLE_LABELS,
  CLASSROOM_ROLE_PROMPTS,
  CLASSROOM_ROLE_SHORT_LABELS,
  getClassroomObserverRole,
} from "@/services/classroomSessionTypes";
import { interviewQuestions } from "@/data/interviewQuestions";

const scoreLabels: Record<0 | 1 | 2, string> = {
  0: "Not yet",
  1: "Partly",
  2: "Achieved",
};

const RUBRICS: Record<ClassroomObservationRole, { criteria: string[]; evidence: string[] }> = {
  content: {
    criteria: [
      "Answers all three questions directly and appropriately.",
      "Question 1 includes all key points.",
      "Question 2 follows a clear strength-evidence structure.",
      "Question 3 demonstrates understanding of the company and job fit.",
      "Overall structure is clear and concise.",
    ],
    evidence: [
      "The answers address the questions directly and do not shift to irrelevant content.",
      "Includes the candidate's name, college/school, field of study, career objective, and the value the candidate hopes to contribute.",
      "States a strength, explains it, provides an example, describes the result, and connects it to the job position.",
      "Shows research about the company, explains what attracts the candidate, identifies relevant skills, describes potential contributions, and expresses a desire for professional development.",
      "Ideas are presented logically, with a clear beginning, development, and conclusion, without unnecessary repetition or rambling.",
    ],
  },
  language: {
    criteria: [
      "Answers are easy to understand and basic grammar is appropriate.",
      "Vocabulary is appropriate for a job interview.",
      "Uses linking words to connect ideas.",
      "Speaks relatively fluently, with limited fillers and repetition.",
      "Speech is clear and delivered at an appropriate pace.",
    ],
    evidence: [
      "The meaning is clear, and grammatical errors do not cause misunderstanding.",
      "Uses vocabulary related to skills, education, work, and the company/business.",
      "For example: because, for example, as a result, therefore, moreover, and similar linking expressions.",
      "Shows few long hesitations and does not repeat words excessively.",
      "The volume is sufficient, the pace is neither too fast nor too slow, and pronunciation is clear enough to understand.",
    ],
  },
  professional: {
    criteria: [
      "Appropriate posture and eye contact.",
      "Appropriate volume and speaking pace.",
      "Shows confidence and composure.",
      "Polite, positive, and professional attitude.",
      "Listens and responds naturally.",
    ],
    evidence: [
      "Sits upright and looks toward the virtual recruiter.",
      "The candidate can be heard clearly, and the pace creates an impression of calmness and professionalism.",
      "Begins answering proactively, limits signs of nervousness, and handles hesitation appropriately.",
      "Uses appropriate greetings and thanks, positive language, and behavior suitable for a corporate environment.",
      "Waits until the question is finished, responds appropriately, and does not simply read a prepared answer word for word.",
    ],
  },
};

function questionTitle(questionId: number) {
  return interviewQuestions.find((question) => question.id === questionId)?.title ?? `Question ${questionId}`;
}

function questionShortTitle(questionId: number) {
  return interviewQuestions.find((question) => question.id === questionId)?.shortTitle ?? `Question ${questionId}`;
}

function emptyScores(): RubricScores {
  return [null, null, null, null, null];
}

function countScored(scores: RubricScores) {
  return scores.filter((value) => value !== null).length;
}

export default function ClassroomObserverPage() {
  const [sessionId, setSessionId] = useState("");
  const [session, setSession] = useState<ClassroomSessionSnapshot | null>(null);
  const [observerIndex, setObserverIndex] = useState<number | null>(null);
  const [scores, setScores] = useState<RubricScores>(emptyScores());
  const [strength, setStrength] = useState("");
  const [improvement, setImprovement] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "saving" | "error">("idle");
  const [message, setMessage] = useState("");
  const hydratedRef = useRef("");
  const saveChainRef = useRef(Promise.resolve());

  const role = useMemo(
    () => observerIndex === null ? null : getClassroomObserverRole(observerIndex, 0, 4),
    [observerIndex],
  );
  const rubric = role ? RUBRICS[role] : null;
  const scoredCount = countScored(scores);
  const currentQuestionIndex = session?.currentRound ?? 0;
  const currentQuestionId = session?.questionAssignments[currentQuestionIndex] ?? 1;

  const loadSession = async (id = sessionId) => {
    const normalized = id.trim().toUpperCase();
    if (!normalized) return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch(`/api/classroom-session?id=${encodeURIComponent(normalized)}`, { cache: "no-store" });
      const data = (await response.json()) as { session?: ClassroomSessionSnapshot; error?: string };
      if (!response.ok || !data.session) throw new Error(data.error || "Classroom session not found.");
      setSessionId(normalized);
      setSession(data.session);
      setStatus("ready");
    } catch (error) {
      setSession(null);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to open classroom session.");
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session")?.trim().toUpperCase() ?? "";
    const observerParam = Number(params.get("observer"));
    setSessionId(id);
    if (id) void loadSession(id);
    if ([1, 2, 3].includes(observerParam)) setObserverIndex(observerParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    const sync = async () => {
      try {
        const response = await fetch(`/api/classroom-session?id=${encodeURIComponent(sessionId)}`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { session?: ClassroomSessionSnapshot };
        if (cancelled || !data.session) return;
        setSession(data.session);
      } catch {
        // Keep the last known state so a brief Wi-Fi interruption does not interrupt observation.
      }
    };
    const timer = window.setInterval(() => void sync(), 1500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [observerIndex, sessionId]);

  useEffect(() => {
    if (!session || observerIndex === null) return;
    const key = `${session.id}:${observerIndex}`;
    if (hydratedRef.current === key) return;
    hydratedRef.current = key;
    const observation = session.observations.find((item) => item.observerIndex === observerIndex);
    if (!observation) return;
    setScores(observation.scores);
    setStrength(observation.strength);
    setImprovement(observation.improvement);
  }, [observerIndex, session]);

  const joinAsObserver = async (index: number) => {
    if (!session) return;
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/classroom-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "join", sessionId: session.id, studentIndex: index }),
      });
      const data = (await response.json()) as { session?: ClassroomSessionSnapshot; error?: string };
      if (!response.ok || !data.session) throw new Error(data.error || "Unable to join the classroom session.");
      setObserverIndex(index);
      setSession(data.session);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to join the classroom session.");
    }
  };

  useEffect(() => {
    if (!session || observerIndex === null) return;
    if (session.joinedStudents.includes(observerIndex)) return;
    void joinAsObserver(observerIndex);
    // The QR code already identifies the observer station, so joining can be automatic.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerIndex, session?.id]);

  const saveRubric = (nextScores: RubricScores, nextStrength = strength, nextImprovement = improvement) => {
    if (!session || observerIndex === null || !role) return;
    setScores(nextScores);
    setStatus("saving");
    setMessage("Saving…");

    const payload = {
      action: "submit-observation",
      sessionId: session.id,
      candidateIndex: 0,
      observerIndex,
      role,
      scores: nextScores,
      strength: nextStrength,
      improvement: nextImprovement,
    };

    saveChainRef.current = saveChainRef.current.then(async () => {
      try {
        const response = await fetch("/api/classroom-session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = (await response.json()) as { session?: ClassroomSessionSnapshot; error?: string };
        if (!response.ok || !data.session) throw new Error(data.error || "Unable to save observation.");
        setSession(data.session);
        setStatus("ready");
        setMessage(countScored(nextScores) === 5 ? "Rubric complete ✓" : "Saved ✓");
      } catch (error) {
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Unable to save observation.");
      }
    });
  };

  const selectScore = (index: number, value: 0 | 1 | 2) => {
    const next = scores.map((score, scoreIndex) => scoreIndex === index ? value : score) as RubricScores;
    void saveRubric(next);
  };

  const saveFeedback = () => {
    void saveRubric(scores, strength, improvement);
  };

  if (!session) {
    return (
      <main className="mx-auto min-h-screen max-w-xl bg-slate-50 p-4 sm:p-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">AI Rapid Interview · Observer</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">Join the classroom session</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Scan the teacher QR code. If the QR code cannot be used, enter the six-character session code below.</p>
          <input value={sessionId} onChange={(event) => setSessionId(event.target.value.toUpperCase())} maxLength={6} placeholder="ABC123" className="mt-6 w-full rounded-xl border border-slate-300 p-4 text-center text-xl font-black uppercase tracking-[0.25em] outline-none focus:border-blue-500" />
          <button type="button" onClick={() => void loadSession()} disabled={!sessionId.trim() || status === "loading"} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 font-black text-white disabled:opacity-50">{status === "loading" ? "Opening…" : "Open Session"}</button>
          {message && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}
        </section>
      </main>
    );
  }

  if (observerIndex === null) {
    return (
      <main className="mx-auto min-h-screen max-w-xl bg-slate-50 p-4 sm:p-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Session {session.id}</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">Select your observer station</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Choose the station assigned by the teacher. Your phone will show only that observer's rubric.</p>
          <div className="mt-5 grid gap-3">
            {[1, 2, 3].map((index) => {
              const assignedRole = getClassroomObserverRole(index, 0, 4);
              if (!assignedRole) return null;
              return (
                <button key={index} type="button" onClick={() => void joinAsObserver(index)} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-blue-400 hover:bg-blue-50">
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">{session.studentNames[index]} · Observer {index}</p>
                  <p className="mt-1 text-lg font-black text-slate-950">{CLASSROOM_ROLE_SHORT_LABELS[assignedRole]}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{CLASSROOM_ROLE_PROMPTS[assignedRole]}</p>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  if (!role || !rubric) return null;

  if (session.phase === "completed") {
    return (
      <main className="mx-auto min-h-screen max-w-xl bg-slate-50 p-3 sm:p-6">
        <section className="rounded-3xl border border-emerald-200 bg-white p-7 text-center shadow-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">✓</div>
          <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{session.studentNames[observerIndex]} · Observer {observerIndex} · {CLASSROOM_ROLE_SHORT_LABELS[role]}</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950">Interview completed</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Your observation data has been saved for the teacher's final multi-source summary.</p>
          <p className="mt-4 text-lg font-black text-slate-950">{scoredCount}/5 criteria completed</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-slate-50 p-2 sm:p-4">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="bg-slate-950 p-4 text-white sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-blue-300">{session.studentNames[observerIndex]} · Observer {observerIndex} · {CLASSROOM_ROLE_SHORT_LABELS[role]}</p>
              <h1 className="mt-1 text-xl font-black">{session.studentNames[0]} · AI Interview</h1>
              <p className="mt-1 text-xs text-slate-300">{session.jobTitle} · {session.companyName}</p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-black text-slate-200">AI hidden</span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {session.questionAssignments.map((questionId, index) => {
              const active = index === currentQuestionIndex;
              const done = index < currentQuestionIndex || session.phase === "review" && index === currentQuestionIndex;
              return (
                <div key={questionId} className={`rounded-xl border p-2 ${active ? "border-blue-400 bg-blue-500/20" : done ? "border-emerald-400/50 bg-emerald-500/10" : "border-white/10 bg-white/5"}`}>
                  <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-300">Q{index + 1}</p>
                  <p className="mt-1 truncate text-xs font-bold text-white">{questionShortTitle(questionId)}</p>
                  <p className="mt-1 text-[10px] text-slate-400">{active ? "Now" : done ? "Observed" : "Next"}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">Your only task</p>
            <h2 className="mt-1 text-lg font-black text-slate-950">{CLASSROOM_ROLE_LABELS[role]}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">{CLASSROOM_ROLE_PROMPTS[role]}</p>
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">{session.phase === "ready" ? "Interview opening" : "Current question"}</p>
            <p className="mt-1 text-sm font-black text-slate-900">{session.phase === "ready" ? "Professional greeting & readiness" : `Q${currentQuestionIndex + 1} · ${questionTitle(currentQuestionId)}`}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{session.phase === "ready" ? "Observe the candidate's greeting, listening behavior, confidence, and professional etiquette. The opening is not AI-scored." : "Observe the candidate directly. AI results are intentionally hidden so your assessment remains independent."}</p>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-900">Your rubric</p>
              <p className="text-xs text-slate-500">Tap one score for each criterion. Every tap is saved automatically.</p>
            </div>
            <span className={`rounded-full px-3 py-1.5 text-xs font-black ${scoredCount === 5 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{scoredCount}/5 saved</span>
          </div>

          <div className="mt-3 space-y-3">
            {rubric.criteria.map((criterion, index) => (
              <article key={criterion} className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-black leading-5 text-slate-900">{criterion}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{rubric.evidence[index]}</p>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {([0, 1, 2] as const).map((value) => (
                        <button key={value} type="button" onClick={() => selectScore(index, value)} className={`rounded-xl border py-2.5 text-center transition active:scale-[0.98] ${(scores[index] ?? null) === value ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 bg-white text-slate-800 hover:border-blue-400"}`}>
                          <span className="block text-lg font-black">{value}</span>
                          <span className="mt-0.5 block text-[10px] font-bold">{scoreLabels[value]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-900">Short feedback after Q3</p>
                <p className="text-xs leading-5 text-slate-500">One strength + one improvement, matching the observer assessment form.</p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Optional until Q3</span>
            </div>
            <label className="mt-3 block text-xs font-black text-slate-700">One strong point
              <textarea value={strength} onChange={(event) => setStrength(event.target.value)} onBlur={saveFeedback} rows={2} maxLength={240} className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm font-normal outline-none focus:border-blue-500" placeholder="Example: The candidate answered all three questions directly." />
            </label>
            <label className="mt-3 block text-xs font-black text-slate-700">One area for improvement
              <textarea value={improvement} onChange={(event) => setImprovement(event.target.value)} onBlur={saveFeedback} rows={2} maxLength={240} className="mt-1.5 w-full rounded-xl border border-slate-300 p-3 text-sm font-normal outline-none focus:border-blue-500" placeholder="Example: Make the Q3 company reason more specific." />
            </label>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
            <p className={`text-xs font-bold ${message.includes("✓") ? "text-emerald-700" : "text-slate-500"}`}>{message || "Your score stays independent from AI."}</p>
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">{status === "saving" ? "Saving" : "Auto-saved"}</span>
          </div>
        </div>
      </section>
    </main>
  );
}
