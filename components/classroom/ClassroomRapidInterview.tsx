"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import SpeechRecorder from "@/components/SpeechRecorder";
import LocalQrCode from "@/components/classroom/LocalQrCode";
import RecruiterAvatar from "@/components/interview/RecruiterAvatar";
import SceneBackdrop from "@/components/interview/SceneBackdrop";
import { useSpeechContext } from "@/context/SpeechContext";
import { companies, defaultCompany, getCompanyById, getJobRoleById } from "@/data/interviewProfiles";
import { recruiters, defaultRecruiter, getRecruiterById } from "@/data/recruiters";
import { interviewQuestions } from "@/data/interviewQuestions";
import type { EvaluationResult } from "@/types/evaluation";
import type { SpeechMetrics } from "@/types/speechMetrics";
import type { ClassroomObservationRole, ClassroomSessionSnapshot } from "@/services/classroomSessionTypes";
import { CLASSROOM_FIXED_STUDENTS, CLASSROOM_ROLE_LABELS, CLASSROOM_ROLE_SHORT_LABELS } from "@/services/classroomSessionTypes";
import { buildBackupRubricEvaluation } from "@/services/backupRubricEvaluation";
import { enqueueBackgroundEvaluation, resetBackgroundEvaluationQueue } from "@/services/backgroundEvaluationQueue";
import { enqueueRecruiterSpeech, clearSpeechQueue } from "@/services/speechQueueService";
import { buildClassroomSummary, type ClassroomSummaryCandidate } from "@/services/classroomSummaryService";

interface CandidateResult extends ClassroomSummaryCandidate {
  speechMetrics?: SpeechMetrics;
  aiError?: string;
}

type ActivityStage = "setup" | "waiting" | "opening" | "running" | "closing" | "completed";

interface LanAddressOption {
  interfaceName: string;
  address: string;
  origin: string;
}

const OBSERVER_INDEXES = [1, 2, 3] as const;
const OBSERVER_ROLES: ClassroomObservationRole[] = ["content", "language", "professional"];

function questionById(id: number) {
  return interviewQuestions.find((question) => question.id === id) ?? interviewQuestions[0];
}

function mmss(seconds: number) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

function scoreTone(value: number) {
  if (value >= 8) return "bg-emerald-100 text-emerald-800";
  if (value >= 7) return "bg-blue-100 text-blue-800";
  return "bg-amber-100 text-amber-800";
}

export default function ClassroomRapidInterview() {
  const { transcript, status: speechStatus, speechMetrics, resetSpeech } = useSpeechContext();
  const studentNames = [...CLASSROOM_FIXED_STUDENTS];
  const [selectedCompanyId, setSelectedCompanyId] = useState(defaultCompany.id);
  const [selectedJobRoleId, setSelectedJobRoleId] = useState(defaultCompany.roles[0].id);
  const [selectedRecruiterId, setSelectedRecruiterId] = useState(defaultRecruiter.id);
  const [observerBaseUrl, setObserverBaseUrl] = useState("");
  const [lanOptions, setLanOptions] = useState<LanAddressOption[]>([]);
  const [serverReady, setServerReady] = useState<"checking" | "ready" | "error">("checking");
  const [session, setSession] = useState<ClassroomSessionSnapshot | null>(null);
  const [stage, setStage] = useState<ActivityStage>("setup");
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [recruiterSpeaking, setRecruiterSpeaking] = useState(false);
  const [sessionBusy, setSessionBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [activityStartedAt, setActivityStartedAt] = useState<number | null>(null);
  const [nextQuestionCountdown, setNextQuestionCountdown] = useState<number | null>(null);
  const [openingStep, setOpeningStep] = useState<0 | 1>(0);
  const [openingReplyCountdown, setOpeningReplyCountdown] = useState<number | null>(null);
  const capturedQuestionsRef = useRef<Set<number>>(new Set());
  const autoAdvancedQuestionsRef = useRef<Set<number>>(new Set());

  const selectedCompany = useMemo(() => getCompanyById(selectedCompanyId), [selectedCompanyId]);
  const selectedJobRole = useMemo(() => getJobRoleById(selectedCompany, selectedJobRoleId), [selectedCompany, selectedJobRoleId]);
  const selectedRecruiter = useMemo(() => getRecruiterById(selectedRecruiterId), [selectedRecruiterId]);
  const assignments = [1, 2, 3];
  const currentQuestionIndex = session?.currentRound ?? 0;
  const currentQuestion = questionById(session?.questionAssignments[currentQuestionIndex] ?? assignments[currentQuestionIndex]);
  const candidateName = session?.studentNames[0] ?? studentNames[0];

  useEffect(() => {
    if (typeof window === "undefined") return;
    const pageOrigin = window.location.origin;
    const pageHostname = window.location.hostname;
    const pagePort = window.location.port || "3000";
    const pageIsLanAddress = !["localhost", "127.0.0.1", "::1", "[::1]"].includes(pageHostname);
    if (pageIsLanAddress) setObserverBaseUrl(pageOrigin);

    const discoverNetwork = async () => {
      try {
        const response = await fetch("/api/network-info", { cache: "no-store" });
        if (!response.ok) throw new Error("Network discovery unavailable.");
        const data = (await response.json()) as {
          addresses?: Array<{ interfaceName: string; address: string }>;
          preferred?: { interfaceName: string; address: string } | null;
        };
        const options = (data.addresses ?? []).map((item) => ({ ...item, origin: `http://${item.address}:${pagePort}` }));
        setLanOptions(options);
        if (!pageIsLanAddress) {
          const preferred = data.preferred ? `http://${data.preferred.address}:${pagePort}` : options[0]?.origin;
          setObserverBaseUrl(preferred ?? pageOrigin);
        }
      } catch {
        setObserverBaseUrl((current) => current || pageOrigin);
      }
    };

    const checkServer = async () => {
      try {
        const response = await fetch("/api/classroom-session?health=1", { cache: "no-store" });
        setServerReady(response.ok ? "ready" : "error");
      } catch {
        setServerReady("error");
      }
    };

    void discoverNetwork();
    void checkServer();
  }, []);

  useEffect(() => {
    if (!activityStartedAt || stage === "completed") return;
    const timer = window.setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - activityStartedAt) / 1000)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [activityStartedAt, stage]);

  useEffect(() => {
    if (!session || stage === "setup") return;
    let cancelled = false;
    const sync = async () => {
      try {
        const response = await fetch(`/api/classroom-session?id=${encodeURIComponent(session.id)}`, { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as { session?: ClassroomSessionSnapshot };
        if (!cancelled && data.session) setSession(data.session);
      } catch {
        // Keep the teacher screen alive during a brief LAN interruption.
      }
    };
    const timer = window.setInterval(() => void sync(), 1200);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [session?.id, stage]);

  useEffect(() => () => clearSpeechQueue(), []);

  const observerJoinUrl = useMemo(() => {
    if (!session || !observerBaseUrl.trim()) return "";
    return `${observerBaseUrl.replace(/\/$/, "")}/classroom-observer?session=${encodeURIComponent(session.id)}`;
  }, [observerBaseUrl, session]);

  const roleJoinUrl = (observerIndex: number) => {
    if (!observerJoinUrl) return "";
    return `${observerJoinUrl}&observer=${observerIndex}`;
  };

  const summary = useMemo(() => buildClassroomSummary(results, session?.observations ?? []), [results, session?.observations]);
  const observations = session?.observations ?? [];

  const updateServerRound = async (round: number, phase: ClassroomSessionSnapshot["phase"]) => {
    if (!session) return null;
    try {
      const response = await fetch("/api/classroom-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set-round", sessionId: session.id, currentRound: round, phase }),
      });
      const data = (await response.json()) as { session?: ClassroomSessionSnapshot; error?: string };
      if (!response.ok || !data.session) throw new Error(data.error || "Unable to update interview stage.");
      setSession(data.session);
      return data.session;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update interview stage.");
      return null;
    }
  };

  const speakRecruiterLine = (text: string, onFinished?: () => void) => {
    clearSpeechQueue();
    setRecruiterSpeaking(true);
    enqueueRecruiterSpeech(text, selectedRecruiter, () => {
      setRecruiterSpeaking(false);
      onFinished?.();
    });
  };

  const speakQuestion = (questionId: number) => {
    const question = questionById(questionId);
    speakRecruiterLine(question.title);
  };

  const openingLines = [
    `Good morning, Mr. Huy. Welcome to ${selectedCompany.name}. I'm ${selectedRecruiter.shortName}, your interviewer today. Thank you for joining us.`,
    "Please make yourself comfortable. We'll have a short interview today. Are you ready to begin?",
  ] as const;

  const candidateOpeningCues = [
    "Greet the recruiter professionally and thank them for the opportunity.",
    "Confirm that you are ready to begin the interview.",
  ] as const;

  const createSession = async () => {
    setSessionBusy(true);
    setMessage("Connecting to the classroom session service…");
    resetBackgroundEvaluationQueue();
    resetSpeech();
    setResults([]);
    setNextQuestionCountdown(null);
    setOpeningStep(0);
    setOpeningReplyCountdown(null);
    capturedQuestionsRef.current.clear();
    autoAdvancedQuestionsRef.current.clear();

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch("/api/classroom-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          studentNames,
          companyName: selectedCompany.name,
          jobTitle: selectedJobRole.title,
          recruiterName: selectedRecruiter.name,
          questionAssignments: assignments,
        }),
        signal: controller.signal,
      });
      const data = (await response.json()) as { session?: ClassroomSessionSnapshot; error?: string };
      if (!response.ok || !data.session) throw new Error(data.error || "Unable to create classroom session.");
      setSession(data.session);
      setMessage("");
      setServerReady("ready");
      setStage("waiting");
    } catch (error) {
      setServerReady("error");
      const timedOut = error instanceof DOMException && error.name === "AbortError";
      setMessage(timedOut ? "The classroom API did not respond within 8 seconds. Use production mode for the presentation LAN." : error instanceof Error ? error.message : "Unable to create classroom session.");
    } finally {
      window.clearTimeout(timeout);
      setSessionBusy(false);
    }
  };

  const startActivity = async () => {
    if (!session) return;
    resetSpeech();
    setElapsedSeconds(0);
    setActivityStartedAt(Date.now());
    setNextQuestionCountdown(null);
    setOpeningStep(0);
    setOpeningReplyCountdown(null);
    autoAdvancedQuestionsRef.current.clear();
    setStage("opening");
    const updated = await updateServerRound(0, "ready");
    if (updated) {
      speakRecruiterLine(openingLines[0], () => {
        // No button after Step 1. Give the real candidate a short natural
        // greeting window, then move to Step 2 automatically.
        setOpeningReplyCountdown(6);
      });
    }
  };

  useEffect(() => {
    if (stage !== "opening" || openingStep !== 0 || openingReplyCountdown === null) return;

    if (openingReplyCountdown <= 0) {
      setOpeningReplyCountdown(null);
      setOpeningStep(1);
      speakRecruiterLine(openingLines[1]);
      return;
    }

    const timer = window.setTimeout(() => {
      setOpeningReplyCountdown((current) => (current === null ? null : current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [stage, openingStep, openingReplyCountdown]);

  const advanceOpening = async () => {
    if (!session || recruiterSpeaking) return;
    if (openingStep === 0) {
      setOpeningReplyCountdown(null);
      setOpeningStep(1);
      speakRecruiterLine(openingLines[1]);
      return;
    }

    resetSpeech();
    setStage("running");
    const updated = await updateServerRound(0, "answering");
    if (updated) speakRecruiterLine(`Great. Let's begin. ${questionById(updated.questionAssignments[0] ?? 1).title}`);
  };

  const saveQuestionResult = (questionIndex: number, evaluation: EvaluationResult, aiState: CandidateResult["aiState"], aiError?: string) => {
    if (!session) return;
    const questionId = session.questionAssignments[questionIndex] ?? assignments[questionIndex] ?? 1;
    const question = questionById(questionId);
    const safeTranscript = transcript.trim();
    const metrics = speechMetrics ?? undefined;
    const next: CandidateResult = {
      candidateIndex: questionIndex,
      candidateName,
      questionId,
      questionTitle: question.title,
      transcript: safeTranscript,
      evaluation,
      speechMetrics: metrics,
      aiState,
      aiError,
    };
    setResults((current) => {
      const existingIndex = current.findIndex((item) => item.candidateIndex === questionIndex);
      if (existingIndex === -1) return [...current, next].sort((a, b) => a.candidateIndex - b.candidateIndex);
      const clone = [...current];
      clone[existingIndex] = { ...clone[existingIndex], ...next, speechMetrics: clone[existingIndex].speechMetrics ?? metrics };
      return clone;
    });
  };

  useEffect(() => {
    if (!session || stage !== "running" || recruiterSpeaking) return;
    if (speechStatus !== "finished" || !transcript.trim()) return;
    const questionIndex = session.currentRound;
    if (capturedQuestionsRef.current.has(questionIndex)) return;
    capturedQuestionsRef.current.add(questionIndex);

    const questionId = session.questionAssignments[questionIndex] ?? 1;
    const question = questionById(questionId);
    const safeTranscript = transcript.trim();
    const backup = buildBackupRubricEvaluation(question, safeTranscript, "Live AI is processing in the background.");
    saveQuestionResult(questionIndex, backup, "pending");
    void updateServerRound(questionIndex, questionIndex === session.questionAssignments.length - 1 ? "review" : "review");

    enqueueBackgroundEvaluation({
      question,
      transcript: safeTranscript,
      onSuccess: (liveEvaluation) => {
        setResults((current) => current.map((item) => item.candidateIndex === questionIndex ? { ...item, evaluation: liveEvaluation, aiState: "live", aiError: undefined } : item));
      },
      onError: (error) => {
        const errorMessage = error instanceof Error ? error.message : "Live AI unavailable.";
        setResults((current) => current.map((item) => item.candidateIndex === questionIndex ? { ...item, aiState: "backup", aiError: errorMessage } : item));
      },
    });

    if (questionIndex < session.questionAssignments.length - 1) setNextQuestionCountdown(1);
    // Capture is intentionally based on the finished recording, not the AI response.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recruiterSpeaking, session?.currentRound, speechStatus, stage, transcript]);

  const moveToNextQuestion = async () => {
    if (!session) return;
    const nextQuestionIndex = session.currentRound + 1;
    setNextQuestionCountdown(null);
    resetSpeech();
    setRecruiterSpeaking(false);
    clearSpeechQueue();

    if (nextQuestionIndex >= session.questionAssignments.length) {
      await updateServerRound(session.currentRound, "review");
      return;
    }

    autoAdvancedQuestionsRef.current.add(session.currentRound);
    const updated = await updateServerRound(nextQuestionIndex, "answering");
    if (updated) speakQuestion(updated.questionAssignments[nextQuestionIndex] ?? 1);
  };

  useEffect(() => {
    if (nextQuestionCountdown === null || nextQuestionCountdown <= 0 || stage !== "running") return;
    const timer = window.setTimeout(() => setNextQuestionCountdown((current) => current === null ? null : Math.max(0, current - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [nextQuestionCountdown, stage]);

  useEffect(() => {
    if (nextQuestionCountdown !== 0 || !session || stage !== "running") return;
    setNextQuestionCountdown(null);
    void moveToNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextQuestionCountdown, session?.currentRound, stage]);

  const startClosing = async () => {
    if (!session || recruiterSpeaking) return;
    clearSpeechQueue();
    resetSpeech();
    setStage("closing");
    await updateServerRound(session.questionAssignments.length - 1, "review");
    speakRecruiterLine(`Thank you, Mr. Huy. That concludes your interview today. It was a pleasure speaking with you.`);
  };

  const openTeacherSummary = () => {
    // Keep the server session in review mode so observer phones can finish
    // their rubric while the teacher summary is already visible.
    setStage("completed");
  };

  const deleteSessionAndReset = async () => {
    const current = session;
    clearSpeechQueue();
    resetBackgroundEvaluationQueue();
    resetSpeech();
    setSession(null);
    setResults([]);
    setStage("setup");
    setMessage("");
    setElapsedSeconds(0);
    setActivityStartedAt(null);
    setNextQuestionCountdown(null);
    setOpeningStep(0);
    setOpeningReplyCountdown(null);
    capturedQuestionsRef.current.clear();
    autoAdvancedQuestionsRef.current.clear();
    if (!current) return;
    try {
      await fetch("/api/classroom-session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", sessionId: current.id }) });
    } catch {
      // Session expires automatically.
    }
  };

  if (stage === "setup") {
    return (
      <div className="mx-auto w-full max-w-6xl py-4 sm:py-8">
        <SceneBackdrop scene="lobby" overlay="dark" className="rounded-[30px] border border-slate-700 shadow-2xl">
          <div className="p-5 text-white sm:p-8 lg:p-10">
            <Link href="/interview" className="mb-4 inline-flex text-xs font-black text-blue-100 transition hover:text-white">← Back to Interview Modes</Link>
            <br />
            <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-blue-100">Fix 42.1 · Authentic Classroom Interview</span>
            <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-4xl">One candidate. Three questions. Three professional observers.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">The candidate completes the full three-question interview. The other three students each observe one fixed dimension: Content, English, or Professional Performance. AI analyzes each answer in the background while the interview continues.</p>
          </div>
        </SceneBackdrop>

        <section className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
            <h2 className="text-xl font-black text-slate-950">1. Today&apos;s interview team</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">The presentation class uses fixed identities so every student can move directly into the assigned professional role.</p>
            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700">Candidate</p>
              <p className="mt-1 text-xl font-black text-slate-950">{studentNames[0]}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">Completes the authentic interview opening and Q1 → Q2 → Q3.</p>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {OBSERVER_INDEXES.map((index, roleIndex) => {
                const role = OBSERVER_ROLES[roleIndex];
                return <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-3"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-700">{studentNames[index]} · Observer {index}</p><p className="mt-1 text-sm font-black text-slate-900">{CLASSROOM_ROLE_SHORT_LABELS[role]}</p><p className="mt-1 text-xs leading-5 text-slate-500">{CLASSROOM_ROLE_LABELS[role].split("·")[1]?.trim()}</p></div>;
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
            <h2 className="text-xl font-black text-slate-950">2. Interview context</h2>
            <div className="mt-4 grid gap-3">
              <label className="text-sm font-bold text-slate-700">Company
                <select value={selectedCompanyId} onChange={(event) => { const company = getCompanyById(event.target.value); setSelectedCompanyId(company.id); setSelectedJobRoleId(company.roles[0].id); }} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500">
                  {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
                </select>
              </label>
              <label className="text-sm font-bold text-slate-700">Position
                <select value={selectedJobRoleId} onChange={(event) => setSelectedJobRoleId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500">
                  {selectedCompany.roles.map((role) => <option key={role.id} value={role.id}>{role.title}</option>)}
                </select>
              </label>
              <label className="text-sm font-bold text-slate-700">Virtual recruiter
                <select value={selectedRecruiterId} onChange={(event) => setSelectedRecruiterId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500">
                  {recruiters.map((recruiter) => <option key={recruiter.id} value={recruiter.id}>{recruiter.name} · {recruiter.accent}</option>)}
                </select>
              </label>
            </div>
            <button type="button" onClick={() => void createSession()} disabled={sessionBusy} className="mt-5 w-full rounded-xl bg-blue-600 px-5 py-4 font-black text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-50">{sessionBusy ? "Creating classroom session…" : "Create Classroom Session"}</button>
            <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ${serverReady === "ready" ? "bg-emerald-50 text-emerald-700" : serverReady === "error" ? "bg-amber-50 text-amber-800" : "bg-slate-50 text-slate-500"}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${serverReady === "ready" ? "bg-emerald-500" : serverReady === "error" ? "bg-amber-500" : "animate-pulse bg-slate-400"}`} />
              {serverReady === "ready" ? "Classroom session service ready" : serverReady === "error" ? "Session service needs attention — production mode is recommended for LAN use" : "Checking classroom session service…"}
            </div>
            {message && <p className={`mt-3 rounded-xl p-3 text-sm ${sessionBusy ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"}`}>{message}</p>}
          </div>
        </section>
      </div>
    );
  }

  if (stage === "waiting" && session) {
    return (
      <div className="mx-auto w-full max-w-7xl py-4 sm:py-8">
        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Classroom session · {session.id}</p>
              <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Connect the three observer phones</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Each QR code is locked to one observer role. The phone will not show the other two rubrics.</p>
            </div>
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-right text-white"><p className="text-[10px] font-black uppercase tracking-[0.12em] text-blue-300">Candidate</p><p className="mt-1 font-black">{candidateName}</p></div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {OBSERVER_INDEXES.map((index, roleIndex) => {
              const role = OBSERVER_ROLES[roleIndex];
              const url = roleJoinUrl(index);
              const joined = session.joinedStudents.includes(index);
              return (
                <article key={index} className={`rounded-3xl border p-4 text-center ${joined ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">{session.studentNames[index]} · Observer {index}</p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">{CLASSROOM_ROLE_SHORT_LABELS[role]}</h2>
                  {url ? <LocalQrCode value={url} size={180} className="mx-auto mt-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" /> : <div className="mx-auto mt-3 flex h-[180px] w-[180px] items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">Waiting for LAN address…</div>}
                  <p className="mt-3 text-xs leading-5 text-slate-500">{CLASSROOM_ROLE_LABELS[role].split("·")[1]?.trim()}</p>
                  <p className={`mt-2 text-xs font-black ${joined ? "text-emerald-700" : "text-slate-400"}`}>{joined ? "Phone connected ✓" : "Waiting for phone"}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.8fr]">
            <div>
              <label className="block text-sm font-bold text-slate-700">Classroom network address
                {lanOptions.length > 1 ? <select value={observerBaseUrl} onChange={(event) => setObserverBaseUrl(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm font-normal outline-none focus:border-blue-500">{lanOptions.map((option) => <option key={`${option.interfaceName}-${option.address}`} value={option.origin}>{option.address} · {option.interfaceName}</option>)}</select> : <input value={observerBaseUrl} onChange={(event) => setObserverBaseUrl(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm font-normal outline-none focus:border-blue-500" />}
              </label>
              <div className="mt-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-5 text-emerald-800"><strong>Auto LAN:</strong> the app detects the laptop private IPv4 address each time it starts. If the venue changes, the QR URL is rebuilt from the current LAN address.</div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950"><strong>Role assignment:</strong> Observer 1 = Content, Observer 2 = English, Observer 3 = Professional. All three observe the same candidate through Q1 → Q2 → Q3.</div>
          </div>

          <button type="button" onClick={() => void startActivity()} className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-4 font-black text-white shadow-lg transition hover:bg-blue-700">Enter Interview Room →</button>
          <p className="mt-2 text-center text-xs text-slate-500">{session.joinedStudents.length}/3 observer phones connected. You may still start with a paper-rubric fallback if one phone cannot connect; the candidate interview and AI evaluation remain available.</p>
        </section>
      </div>
    );
  }

  if (stage === "opening" && session) {
    return (
      <div className="mx-auto w-full max-w-6xl py-3 sm:py-6">
        <SceneBackdrop scene="room" overlay="dark" className="rounded-[30px] border border-slate-700 text-white shadow-2xl">
          <div className="p-5 sm:p-7 lg:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">Interview Opening · Step {openingStep + 1} of 2</p>
                <p className="mt-1 text-sm text-slate-300">{selectedCompany.name} · {selectedJobRole.title}</p>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-2 text-xs font-black">{mmss(elapsedSeconds)}</span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
              <div className="text-center">
                <RecruiterAvatar recruiter={selectedRecruiter} state={recruiterSpeaking ? "speaking" : "listening"} size="xl" showStatusDot showWaveform priority />
                <p className="mt-3 font-black">{selectedRecruiter.name}</p>
                <p className="text-xs text-blue-200">{recruiterSpeaking ? "Recruiter is speaking…" : `Listening to ${candidateName}`}</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-5 backdrop-blur sm:p-7">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-100">{openingStep === 0 ? "Greeting & Welcome" : "Readiness to Begin"}</span>
                <p className="mt-4 text-xl font-black leading-relaxed sm:text-3xl">“{openingLines[openingStep]}”</p>
                <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200">{candidateName} · Your turn</p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">{candidateOpeningCues[openingStep]}</p>
                </div>
              </div>
            </div>
          </div>
        </SceneBackdrop>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-xl sm:p-7">
          {recruiterSpeaking ? (
            <><div className="mx-auto h-3 w-3 animate-pulse rounded-full bg-blue-600" /><p className="mt-3 font-black text-slate-950">Listen to the recruiter</p><p className="mt-1 text-sm text-slate-500">The candidate responds only after the recruiter finishes speaking.</p></>
          ) : openingStep === 0 ? (
            <>
              <p className="text-lg font-black text-slate-950">{candidateName}: greet the recruiter naturally now.</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">No button is needed. Step 2 starts automatically after this short response window.</p>
              <div className="mx-auto mt-5 inline-flex min-w-48 items-center justify-center rounded-xl bg-emerald-50 px-6 py-3 font-black text-emerald-800">
                Continuing automatically{openingReplyCountdown !== null ? ` in ${openingReplyCountdown}s` : "…"}
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-black text-slate-950">{candidateName}: respond naturally now.</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">This opening is observed for professional etiquette but is not sent to Gemini and is not scored as Q1.</p>
              <button type="button" onClick={() => void advanceOpening()} className="mt-5 rounded-xl bg-blue-600 px-7 py-4 font-black text-white shadow-lg hover:bg-blue-700">Candidate Ready · Begin Q1 →</button>
            </>
          )}
        </section>
      </div>
    );
  }

  if (stage === "closing" && session) {
    return (
      <div className="mx-auto w-full max-w-6xl py-3 sm:py-6">
        <SceneBackdrop scene="room" overlay="dark" className="rounded-[30px] border border-slate-700 text-white shadow-2xl">
          <div className="p-5 sm:p-7 lg:p-9">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">Interview Closing</p>
            <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
              <div className="text-center">
                <RecruiterAvatar recruiter={selectedRecruiter} state={recruiterSpeaking ? "speaking" : "listening"} size="xl" showStatusDot showWaveform priority />
                <p className="mt-3 font-black">{selectedRecruiter.name}</p>
                <p className="text-xs text-blue-200">{recruiterSpeaking ? "Recruiter is speaking…" : `Listening to ${candidateName}`}</p>
              </div>
              <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-5 backdrop-blur sm:p-7">
                <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-100">Professional Closing</span>
                <p className="mt-4 text-xl font-black leading-relaxed sm:text-3xl">“Thank you, Mr. Huy. That concludes your interview today. It was a pleasure speaking with you.”</p>
                <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-200">{candidateName} · Your turn</p>
                  <p className="mt-2 text-sm leading-6 text-slate-100">Thank the recruiter briefly and professionally.</p>
                </div>
              </div>
            </div>
          </div>
        </SceneBackdrop>

        <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-xl sm:p-7">
          {recruiterSpeaking ? (
            <><div className="mx-auto h-3 w-3 animate-pulse rounded-full bg-blue-600" /><p className="mt-3 font-black text-slate-950">Listen to the recruiter</p></>
          ) : (
            <><p className="text-lg font-black text-slate-950">{candidateName}: “Thank you for your time.”</p><p className="mt-2 text-sm text-slate-500">After the candidate closes the interview, open the teacher&apos;s multi-source summary.</p><button type="button" onClick={openTeacherSummary} className="mt-5 rounded-xl bg-slate-950 px-7 py-4 font-black text-white shadow-lg">Open Teacher Summary →</button></>
          )}
        </section>
      </div>
    );
  }

  if (stage === "completed" && session) {
    return (
      <div className="mx-auto w-full max-w-7xl py-4 sm:py-8">
        <section className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><p className="text-xs font-black uppercase tracking-[0.18em] text-blue-700">Teacher Summary · {session.id}</p><h1 className="mt-2 text-3xl font-black text-slate-950">Multi-source interview summary</h1><p className="mt-2 text-sm leading-6 text-slate-600">The report combines the three AI question evaluations with the three independent observer rubrics. No additional AI request is made here.</p></div>
            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-right text-white"><p className="text-[10px] font-black uppercase text-blue-300">Candidate</p><p className="mt-1 font-black">{candidateName}</p><p className="mt-1 text-xs text-slate-300">{selectedCompany.name} · {selectedJobRole.title}</p></div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {[...results].sort((a, b) => a.candidateIndex - b.candidateIndex).map((result) => (
              <article key={result.candidateIndex} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">Q{result.candidateIndex + 1}</p><span className={`rounded-full px-2.5 py-1 text-xs font-black ${scoreTone(result.evaluation.overall)}`}>{result.evaluation.overall}/10</span></div>
                <h2 className="mt-2 text-sm font-black text-slate-950">{result.questionTitle}</h2>
                <p className="mt-2 line-clamp-4 text-xs leading-5 text-slate-600">{result.evaluation.overallFeedback}</p>
                <p className={`mt-3 rounded-lg px-2.5 py-2 text-[11px] font-black ${result.aiState === "live" ? "bg-emerald-50 text-emerald-700" : result.aiState === "pending" ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"}`}>{result.aiState === "live" ? "Live AI ready ✓" : result.aiState === "pending" ? "AI processing in background" : "Backup Rubric active"}</p>
              </article>
            ))}
          </div>

          <section className="mt-6 grid gap-4 lg:grid-cols-3">
            {summary.observerRoleSummaries.map((item) => (
              <article key={item.role} className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">{item.label}</p>
                <div className="mt-2 flex items-end justify-between"><p className="text-3xl font-black text-slate-950">{item.totalScore === null ? "—" : `${item.totalScore}/10`}</p><p className="text-xs font-bold text-slate-500">{item.completedCriteria}/5 criteria</p></div>
                {item.strength && <p className="mt-3 text-xs leading-5 text-emerald-800"><strong>Strength:</strong> {item.strength}</p>}
                {item.improvement && <p className="mt-2 text-xs leading-5 text-amber-800"><strong>Improve:</strong> {item.improvement}</p>}
              </article>
            ))}
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="grid gap-4 sm:grid-cols-4"><div><p className="text-[10px] font-black uppercase text-blue-600">AI average</p><p className="mt-1 text-2xl font-black text-slate-950">{summary.averageOverall}/10</p></div><div><p className="text-[10px] font-black uppercase text-blue-600">Content coverage</p><p className="mt-1 text-2xl font-black text-slate-950">{summary.averageCoverage}%</p></div><div><p className="text-[10px] font-black uppercase text-blue-600">AI status</p><p className="mt-1 text-2xl font-black text-slate-950">{summary.liveAiCount}/{summary.completedAnswers}</p></div><div><p className="text-[10px] font-black uppercase text-blue-600">Observer rubric</p><p className="mt-1 text-2xl font-black text-slate-950">{summary.observerCriterionCount}/{summary.observerCriterionTotal}</p></div></div>
          </section>

          <section className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5"><h2 className="text-xl font-black text-slate-950">Confirmed strengths</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{summary.strengths.map((item) => <li key={item} className="rounded-xl bg-white/80 p-3">✓ {item}</li>)}</ul></div>
            <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5"><h2 className="text-xl font-black text-slate-950">Priority improvements</h2><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">{summary.improvements.map((item) => <li key={item} className="rounded-xl bg-white/80 p-3">△ {item}</li>)}</ul></div>
          </section>

          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-xs leading-5 text-blue-950"><strong>Teacher conclusion:</strong> use the AI indicators as supporting evidence, compare them with the three human observer rubrics, then make the final professional judgment. The app does not call Gemini again for this summary.</div>
          <button type="button" onClick={() => void deleteSessionAndReset()} className="mt-5 w-full rounded-xl bg-slate-950 px-6 py-4 font-black text-white">Start Another Classroom Session</button>
        </section>
      </div>
    );
  }

  if (!session) return null;

  const currentResult = results.find((item) => item.candidateIndex === currentQuestionIndex);
  const captured = Boolean(currentResult);
  const q3Captured = Boolean(results.find((item) => item.candidateIndex === 2));

  return (
    <div className="mx-auto w-full max-w-7xl py-3 sm:py-6">
      <SceneBackdrop scene="room" overlay="dark" className="rounded-[30px] border border-slate-700 text-white shadow-2xl">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="text-xs font-black uppercase tracking-[0.16em] text-blue-200">AI Rapid Interview · {candidateName}</p><p className="mt-1 text-sm text-slate-300">{selectedCompany.name} · {selectedJobRole.title}</p></div>
            <div className="flex gap-2 text-xs font-black"><span className="rounded-full bg-white/10 px-3 py-2">{mmss(elapsedSeconds)}</span><span className="rounded-full bg-white/10 px-3 py-2">Q{currentQuestionIndex + 1}/3</span><span className="rounded-full bg-emerald-500/15 px-3 py-2 text-emerald-200">Observers {observations.length}/3</span></div>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-[240px_1fr] lg:items-center">
            <div className="text-center"><RecruiterAvatar recruiter={selectedRecruiter} state={recruiterSpeaking ? "speaking" : captured ? "listening" : "idle"} size="xl" showStatusDot showWaveform priority /><p className="mt-3 font-black">{selectedRecruiter.name}</p><p className="text-xs text-blue-200">{recruiterSpeaking ? "Recruiter is speaking…" : captured ? "Answer captured" : "Ready for candidate"}</p></div>
            <div className="rounded-3xl border border-white/15 bg-slate-950/70 p-5 backdrop-blur sm:p-7"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs font-black text-blue-100">Question {currentQuestionIndex + 1} of 3</span><span className="text-xs font-bold text-slate-300">{currentQuestion.shortTitle}</span></div><h1 className="mt-4 text-2xl font-black leading-tight sm:text-4xl">“{currentQuestion.title}”</h1><p className="mt-3 text-sm leading-6 text-slate-300">Answer naturally for about 35–45 seconds. The next question starts immediately after capture while AI evaluates this answer in the background.</p></div>
          </div>
        </div>
      </SceneBackdrop>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-xl sm:p-6">
          {recruiterSpeaking ? (
            <div className="flex min-h-48 items-center justify-center rounded-2xl border border-blue-200 bg-blue-50 p-6 text-center"><div><div className="mx-auto h-3 w-3 animate-pulse rounded-full bg-blue-600" /><p className="mt-4 text-lg font-black text-slate-950">Listen to the recruiter</p><p className="mt-2 text-sm text-slate-600">Recording controls appear immediately after the question finishes.</p></div></div>
          ) : !captured && speechStatus === "finished" && !transcript.trim() ? (
            <div className="flex min-h-48 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center"><div><div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-xl">!</div><p className="mt-4 text-lg font-black text-slate-950">No transcript detected</p><p className="mt-2 text-sm leading-6 text-slate-600">The recording ended, but no usable transcript was captured. Retry this answer before continuing.</p><button type="button" onClick={() => resetSpeech()} className="mt-4 rounded-xl bg-amber-600 px-5 py-3 font-black text-white shadow-lg">Retry Recording</button></div></div>
          ) : !captured ? (
            <SpeechRecorder allowManualInput={false} compact hideTranscript showClearButton={false} title={`${candidateName}'s Q${currentQuestionIndex + 1} response`} />
          ) : (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">Captured ✓</p><h2 className="mt-1 text-xl font-black text-slate-950">Q{currentQuestionIndex + 1} answer saved</h2><p className="mt-2 text-sm leading-6 text-slate-600">Live AI is working in the background. The interview does not wait for the AI response.</p>{nextQuestionCountdown !== null && <p className="mt-3 inline-flex rounded-full bg-white/80 px-3 py-1.5 text-xs font-black text-emerald-800">Next question in {nextQuestionCountdown}s</p>}</div>{currentResult && <span className={`shrink-0 rounded-full px-3 py-2 text-sm font-black ${scoreTone(currentResult.evaluation.overall)}`}>{currentResult.evaluation.overall}/10</span>}</div></div>
          )}
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl">
          <h2 className="text-lg font-black text-slate-950">Live interview monitor</h2>
          <div className="mt-4 grid gap-2">
            {session.questionAssignments.map((questionId, index) => {
              const item = results.find((result) => result.candidateIndex === index);
              const active = index === currentQuestionIndex;
              return <div key={questionId} className={`rounded-xl border p-3 ${active ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50"}`}><div className="flex items-center justify-between gap-2"><p className="text-sm font-black text-slate-900">Q{index + 1} · {questionById(questionId).shortTitle}</p><span className="text-[11px] font-bold text-slate-500">{item ? `${item.evaluation.overall}/10` : active ? "Live" : "Waiting"}</span></div><p className="mt-1 text-xs text-slate-500">{item ? item.aiState === "live" ? "Live AI ready ✓" : item.aiState === "pending" ? "Backup shown · AI processing" : "Backup Rubric active" : active ? "Candidate is answering" : "Next"}</p></div>;
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Observer rubrics</p><div className="mt-3 grid grid-cols-3 gap-2">{OBSERVER_ROLES.map((role) => { const item = observations.find((observation) => observation.role === role); return <div key={role} className={`rounded-xl border p-2 text-center ${item?.totalScore !== null && item ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"}`}><p className="text-[10px] font-black uppercase text-slate-500">{CLASSROOM_ROLE_SHORT_LABELS[role]}</p><p className="mt-1 text-sm font-black text-slate-900">{item?.totalScore !== null && item ? `${item.totalScore}/10` : item ? `${item.scores.filter((score) => score !== null).length}/5` : "—"}</p></div>; })}</div><p className="mt-3 text-xs leading-5 text-slate-500">Observers can score during the interview. Their AI-independent rubrics remain separate from the live AI results.</p></div>

          {q3Captured && <button type="button" onClick={() => void startClosing()} className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-4 font-black text-white shadow-lg">Conclude Interview →</button>}
        </aside>
      </section>

      {message && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{message}</p>}
    </div>
  );
}
