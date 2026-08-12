"use client";

import { useEffect, useMemo, useState } from "react";
import { InterviewAttempt, RecruiterReport } from "@/types/interviewReport";
import {
  buildIntegratedTeacherFeedback,
  ObserverKey,
  ObserverNoteMap,
  ObserverScoreMap,
  PriorityArea,
  TeacherDecision,
} from "@/services/teacherFeedbackService";

interface TeacherProjectionSummaryProps {
  attempts: InterviewAttempt[];
  report: RecruiterReport;
  candidateName: string;
  companyName: string;
  jobTitle: string;
  recruiterName: string;
}

const observerRubrics: Array<{
  key: ObserverKey;
  title: string;
  focus: string;
  criteria: string[];
}> = [
  {
    key: "content",
    title: "Observer 1 · Content & Response Structure",
    focus: "Focus on relevance, required ideas, examples, evidence, and job connection.",
    criteria: [
      "Answers all three interview questions directly and stays on topic.",
      "Q1 includes education/major, career direction, and potential contribution.",
      "Q2 states a clear strength and supports it with an explanation, example, action, and result.",
      "Q3 shows company research, role fit, relevant skills, contribution, and willingness to grow.",
      "Ideas are logically organized, specific enough, and easy to follow.",
    ],
  },
  {
    key: "language",
    title: "Observer 2 · English Language Performance",
    focus: "Focus on understandable English, vocabulary, fluency, clarity, and spoken control.",
    criteria: [
      "Uses understandable and mostly accurate grammar.",
      "Uses suitable professional and job-interview vocabulary.",
      "Connects ideas clearly with appropriate linking words.",
      "Speaks fluently with limited fillers and unnecessary repetition.",
      "Pronunciation and spoken clarity are understandable to the listener.",
    ],
  },
  {
    key: "professional",
    title: "Observer 3 · Professional Interview Performance",
    focus: "Focus on visible professional behavior that AI cannot reliably judge from a transcript.",
    criteria: [
      "Maintains appropriate posture and eye contact.",
      "Uses an audible voice and an appropriate speaking pace.",
      "Shows confidence and remains calm while answering.",
      "Shows a polite, positive, and professional attitude.",
      "Listens carefully and responds naturally without reading the whole answer.",
    ],
  },
];

const emptyScores = (): ObserverScoreMap => ({
  content: [null, null, null, null, null],
  language: [null, null, null, null, null],
  professional: [null, null, null, null, null],
});

const emptyNotes = (): ObserverNoteMap => ({
  content: { strength: "", improvement: "" },
  language: { strength: "", improvement: "" },
  professional: { strength: "", improvement: "" },
});

function average(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function metricAverage(attempts: InterviewAttempt[], selector: (attempt: InterviewAttempt) => number) {
  return average(attempts.map(selector));
}

function ScoreSelector({ value, onChange }: { value: number | null; onChange: (value: number) => void }) {
  return (
    <div className="flex shrink-0 gap-1" aria-label="Observer score">
      {[0, 1, 2].map((score) => (
        <button
          key={score}
          type="button"
          onClick={() => onChange(score)}
          className={`h-9 w-9 rounded-lg border text-sm font-black transition ${
            value === score
              ? "border-blue-600 bg-blue-600 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-blue-400"
          }`}
          title={score === 2 ? "Achieved" : score === 1 ? "Partly achieved" : "Not yet achieved"}
        >
          {score}
        </button>
      ))}
    </div>
  );
}

export default function TeacherProjectionSummary({
  attempts,
  report,
  candidateName,
  companyName,
  jobTitle,
  recruiterName,
}: TeacherProjectionSummaryProps) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<ObserverScoreMap>(emptyScores);
  const [notes, setNotes] = useState<ObserverNoteMap>(emptyNotes);
  const [teacherFeedback, setTeacherFeedback] = useState("");
  const [priorityArea, setPriorityArea] = useState<PriorityArea>("Content");
  const [decision, setDecision] = useState<TeacherDecision>("Ready for further practice");
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [draftLoaded, setDraftLoaded] = useState(false);

  const storageKey = useMemo(
    () => `teacher-summary-v39:${candidateName}:${companyName}:${jobTitle}`,
    [candidateName, companyName, jobTitle],
  );

  const assessmentSummary = useMemo(() => {
    const evaluatedAttempts = attempts.filter((attempt) => attempt.evaluation.evaluationStatus !== "unavailable");
    const focusAttempts = evaluatedAttempts.filter((attempt) => attempt.evaluation.focusAnalysis);
    const speechAttempts = attempts.filter((attempt) => attempt.speechMetrics);

    return {
      coverage: focusAttempts.length
        ? metricAverage(focusAttempts, (attempt) => attempt.evaluation.focusAnalysis.coverageScore)
        : 0,
      evidence: focusAttempts.length
        ? metricAverage(focusAttempts, (attempt) => attempt.evaluation.focusAnalysis.evidenceQualityScore)
        : 0,
      structure: focusAttempts.length
        ? metricAverage(focusAttempts, (attempt) => attempt.evaluation.focusAnalysis.structureScore)
        : 0,
      grammar: metricAverage(evaluatedAttempts, (attempt) => attempt.evaluation.grammar.score),
      vocabulary: metricAverage(evaluatedAttempts, (attempt) => attempt.evaluation.vocabulary.score),
      fluency: metricAverage(evaluatedAttempts, (attempt) => attempt.evaluation.fluency.score),
      relevance: metricAverage(evaluatedAttempts, (attempt) => attempt.evaluation.relevance.score),
      pace: speechAttempts.length
        ? average(speechAttempts.map((attempt) => attempt.speechMetrics?.wordsPerMinute ?? 0).filter(Boolean))
        : 0,
      evaluatedCount: evaluatedAttempts.length,
      liveAiCount: evaluatedAttempts.filter((attempt) => attempt.evaluation.evaluationSource !== "backup_rubric").length,
      backupCount: evaluatedAttempts.filter((attempt) => attempt.evaluation.evaluationSource === "backup_rubric").length,
      fillers: speechAttempts.length
        ? speechAttempts.reduce((sum, attempt) => sum + (attempt.speechMetrics?.fillerWordCount ?? 0), 0)
        : 0,
    };
  }, [attempts]);

  const integrated = useMemo(
    () => buildIntegratedTeacherFeedback(attempts, report, scores, notes),
    [attempts, report, scores, notes],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        setDraftLoaded(true);
        return;
      }
      const parsed = JSON.parse(saved) as {
        scores?: ObserverScoreMap;
        notes?: ObserverNoteMap;
        teacherFeedback?: string;
        priorityArea?: PriorityArea;
        decision?: TeacherDecision;
      };
      if (parsed.scores) setScores(parsed.scores);
      if (parsed.notes) setNotes(parsed.notes);
      if (parsed.teacherFeedback) setTeacherFeedback(parsed.teacherFeedback);
      if (parsed.priorityArea) setPriorityArea(parsed.priorityArea);
      if (parsed.decision) setDecision(parsed.decision);
    } catch {
      // Presentation safety: corrupted local draft must never block the report.
    } finally {
      setDraftLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined" || !draftLoaded) return;
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ scores, notes, teacherFeedback, priorityArea, decision }),
      );
    } catch {
      // Saving observer notes is helpful but not required for the live lesson.
    }
  }, [decision, draftLoaded, notes, priorityArea, scores, storageKey, teacherFeedback]);

  if (attempts.length < 3) return null;

  const setCriterionScore = (key: ObserverKey, index: number, value: number) => {
    setScores((current) => ({
      ...current,
      [key]: current[key].map((score, criterionIndex) => (criterionIndex === index ? value : score)),
    }));
  };

  const observerTotal = (key: ObserverKey) => {
    const values = scores[key];
    if (values.some((value) => value === null)) return null;
    return values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
  };

  const generateTeacherFeedback = () => {
    setTeacherFeedback(integrated.finalFeedback);
    setPriorityArea(integrated.priorityArea);
    setDecision(integrated.suggestedDecision);
    setActiveStep(5);
  };

  const copyFeedback = async () => {
    if (!teacherFeedback.trim() || typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(teacherFeedback);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-center font-bold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Teacher Summary · Present & Compare
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 p-2 sm:p-5 print:static print:bg-white print:p-0">
          <section className="mx-auto min-h-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl print:shadow-none">
            <header className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-5 text-white sm:p-8 print:bg-white print:text-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200 print:text-slate-500">Teacher projection summary · Fix 39</p>
                  <h1 className="mt-2 text-2xl font-black sm:text-4xl">Observer + AI/Backup + Teacher Judgment</h1>
                  <p className="mt-2 text-sm text-slate-300 print:text-slate-600">
                    {candidateName} · {jobTitle} at {companyName} · Recruiter: {recruiterName}
                  </p>
                </div>
                <div className="flex gap-2 print:hidden">
                  <button type="button" onClick={() => window.print()} className="rounded-xl bg-white/10 px-4 py-2 font-bold hover:bg-white/20">Print / PDF</button>
                  <button type="button" onClick={() => setOpen(false)} className="rounded-xl bg-white px-4 py-2 font-bold text-slate-950">Close</button>
                </div>
              </div>
            </header>

            <div className="space-y-6 p-4 sm:p-8">
              <nav className="flex flex-wrap gap-2 print:hidden" aria-label="Presentation reveal steps">
                {["Candidate", "Observers", "Assessment", "Compare", "Teacher"].map((label, index) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setActiveStep(index + 1)}
                    className={`rounded-full px-4 py-2 text-sm font-bold ${activeStep === index + 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"}`}
                  >
                    {index + 1}. {label}
                  </button>
                ))}
              </nav>

              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <SummaryMetric label="Overall" value={assessmentSummary.evaluatedCount ? `${report.overallScore}/10` : "Unavailable"} />
                <SummaryMetric label="Coverage" value={`${assessmentSummary.coverage}%`} />
                <SummaryMetric label="Evidence" value={`${assessmentSummary.evidence}%`} />
                <SummaryMetric label="Relevance" value={`${assessmentSummary.relevance}/10`} />
                <SummaryMetric label="Readiness" value={report.readiness} />
              </section>

              {(activeStep === 1 || activeStep === 3 || activeStep === 4 || activeStep === 5) && (
                <section className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="bg-slate-100 px-4 py-3">
                    <h2 className="font-black text-slate-900">Live AI / Backup Rubric evidence by question</h2>
                    <p className="mt-1 text-xs text-slate-600">Backup Rubric is a transparent local fallback and is never presented as a live AI result.</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-800">Live AI: {assessmentSummary.liveAiCount}</span>
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">Backup Rubric: {assessmentSummary.backupCount}</span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-white text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-4 py-3">Question</th>
                          <th className="px-4 py-3">Source</th>
                          <th className="px-4 py-3">Overall</th>
                          <th className="px-4 py-3">Coverage</th>
                          <th className="px-4 py-3">Evidence</th>
                          <th className="px-4 py-3">Structure</th>
                          <th className="px-4 py-3">Speech</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {attempts.slice(0, 3).map((attempt, index) => (
                          <tr key={`${attempt.questionId}-${index}`}>
                            <td className="px-4 py-3 font-semibold text-slate-900">Q{index + 1}. {attempt.questionTitle}</td>
                            <td className="px-4 py-3">
                              {attempt.evaluation.evaluationStatus === "unavailable" ? (
                                <SourceBadge kind="unavailable" />
                              ) : attempt.evaluation.evaluationSource === "backup_rubric" ? (
                                <SourceBadge kind="backup" />
                              ) : (
                                <SourceBadge kind="live" />
                              )}
                            </td>
                            <td className="px-4 py-3 font-black">{attempt.evaluation.evaluationStatus === "unavailable" ? "Unavailable" : `${attempt.evaluation.overall}/10`}</td>
                            <td className="px-4 py-3">{attempt.evaluation.evaluationStatus === "unavailable" ? "Teacher review" : `${attempt.evaluation.focusAnalysis.coverageScore}%`}</td>
                            <td className="px-4 py-3">{attempt.evaluation.evaluationStatus === "unavailable" ? "Teacher review" : `${attempt.evaluation.focusAnalysis.evidenceQualityScore}%`}</td>
                            <td className="px-4 py-3">{attempt.evaluation.evaluationStatus === "unavailable" ? "Teacher review" : `${attempt.evaluation.focusAnalysis.structureScore}%`}</td>
                            <td className="px-4 py-3">
                              {attempt.speechMetrics
                                ? `${attempt.speechMetrics.wordsPerMinute ?? "—"} WPM · ${attempt.speechMetrics.fillerWordCount} fillers`
                                : "Not captured"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {(activeStep === 2 || activeStep === 4 || activeStep === 5) && (
                <section className="grid gap-4 lg:grid-cols-3">
                  {observerRubrics.map((rubric) => (
                    <article key={rubric.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h2 className="font-black text-slate-950">{rubric.title}</h2>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{rubric.focus}</p>
                        </div>
                        <div className="rounded-xl bg-indigo-600 px-3 py-2 text-center text-white">
                          <p className="text-xl font-black">{observerTotal(rubric.key) ?? "—"}/10</p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {rubric.criteria.map((criterion, index) => (
                          <div key={criterion} className="rounded-xl border border-slate-200 bg-white p-3">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-sm leading-6 text-slate-700">{index + 1}. {criterion}</p>
                              <ScoreSelector
                                value={scores[rubric.key][index]}
                                onChange={(value) => setCriterionScore(rubric.key, index, value)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 grid gap-3">
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                          One strong point
                          <textarea
                            value={notes[rubric.key].strength}
                            onChange={(event) => setNotes((current) => ({
                              ...current,
                              [rubric.key]: { ...current[rubric.key], strength: event.target.value },
                            }))}
                            rows={2}
                            className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm font-normal normal-case tracking-normal text-slate-800 outline-none focus:border-indigo-500"
                            placeholder="Example: The answer was relevant and well organized."
                          />
                        </label>
                        <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                          One area for improvement
                          <textarea
                            value={notes[rubric.key].improvement}
                            onChange={(event) => setNotes((current) => ({
                              ...current,
                              [rubric.key]: { ...current[rubric.key], improvement: event.target.value },
                            }))}
                            rows={2}
                            className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm font-normal normal-case tracking-normal text-slate-800 outline-none focus:border-indigo-500"
                            placeholder="Example: Make the result more specific."
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </section>
              )}

              {(activeStep === 4 || activeStep === 5) && (
                <section className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <h2 className="font-black text-emerald-900">Agreements</h2>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
                      {integrated.agreements.map((item) => <li key={item}>✓ {item}</li>)}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-violet-200 bg-violet-50 p-5">
                    <h2 className="font-black text-violet-900">Differences / Human judgment</h2>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-violet-950">
                      {integrated.differences.map((item) => <li key={item}>→ {item}</li>)}
                    </ul>
                  </div>
                </section>
              )}

              {(activeStep === 5 || activeStep === 4) && (
                <section className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-black text-indigo-950">Teacher’s Final Feedback</h2>
                      <p className="mt-1 text-sm text-indigo-800">Generate a concise English comment from the available evidence, then edit it before presenting.</p>
                    </div>
                    <button type="button" onClick={generateTeacherFeedback} className="rounded-xl bg-indigo-600 px-4 py-2 font-bold text-white print:hidden">
                      Generate Teacher Feedback
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-2">
                    <label className="text-sm font-bold text-indigo-950">
                      Priority improvement
                      <select
                        value={priorityArea}
                        onChange={(event) => setPriorityArea(event.target.value as PriorityArea)}
                        className="mt-2 w-full rounded-xl border border-indigo-200 bg-white p-3 font-normal text-slate-800"
                      >
                        <option>Content</option>
                        <option>Evidence</option>
                        <option>Language</option>
                        <option>Fluency</option>
                        <option>Professional performance</option>
                      </select>
                    </label>
                    <label className="text-sm font-bold text-indigo-950">
                      Teacher’s final decision
                      <select
                        value={decision}
                        onChange={(event) => setDecision(event.target.value as TeacherDecision)}
                        className="mt-2 w-full rounded-xl border border-indigo-200 bg-white p-3 font-normal text-slate-800"
                      >
                        <option>Ready for further practice</option>
                        <option>Needs targeted improvement</option>
                        <option>Ready for a full mock interview</option>
                      </select>
                    </label>
                  </div>

                  <label className="mt-4 block text-sm font-bold text-indigo-950">
                    Final English feedback
                    <textarea
                      value={teacherFeedback}
                      onChange={(event) => setTeacherFeedback(event.target.value)}
                      rows={6}
                      className="mt-2 w-full resize-y rounded-xl border border-indigo-200 bg-white p-4 font-normal leading-7 text-slate-900 outline-none focus:border-indigo-500"
                      placeholder="Click Generate Teacher Feedback, then edit the final comment if needed."
                    />
                  </label>

                  <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                    <button type="button" onClick={copyFeedback} disabled={!teacherFeedback.trim()} className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">
                      {copied ? "Copied" : "Copy Final Feedback"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTeacherFeedback("");
                        setScores(emptyScores());
                        setNotes(emptyNotes());
                        setPriorityArea("Content");
                        setDecision("Ready for further practice");
                      }}
                      className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-bold text-slate-700"
                    >
                      Reset Observer Draft
                    </button>
                  </div>

                  <div className="mt-4 rounded-xl bg-white/70 p-4 text-sm leading-6 text-indigo-950">
                    <p><strong>Confirmed strength:</strong> {integrated.confirmedStrength}</p>
                    <p className="mt-1"><strong>Selected priority:</strong> {priorityArea}</p>
                    <p className="mt-1"><strong>Final decision:</strong> {decision}</p>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-indigo-700">
                    Teacher judgment remains final. Eye contact, posture, facial expression, and professional presence must be judged by human observers. Backup Rubric results are local transcript-based estimates and must never be presented as live AI results.
                  </p>
                </section>
              )}

              <div className="flex justify-center print:hidden">
                <button type="button" onClick={() => setOpen(false)} className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white">Return to full report</button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function SourceBadge({ kind }: { kind: "live" | "backup" | "unavailable" }) {
  const config = {
    live: { label: "Live AI", className: "bg-emerald-100 text-emerald-800" },
    backup: { label: "Backup Rubric", className: "bg-amber-100 text-amber-800" },
    unavailable: { label: "Unavailable", className: "bg-slate-100 text-slate-700" },
  }[kind];

  return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${config.className}`}>{config.label}</span>;
}
