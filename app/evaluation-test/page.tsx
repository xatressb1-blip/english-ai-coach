"use client";

import { useMemo, useState } from "react";
import { evaluationTestCases, ExpectedLevel } from "@/data/evaluationTestCases";
import { interviewQuestions } from "@/data/interviewQuestions";
import type { EvaluationResult } from "@/types/evaluation";
import { evaluateInterview } from "@/services/evaluationService";
import {
  EVALUATION_VERSION,
  runEvaluationReliabilityChecks,
} from "@/services/evaluationReliability";

function expectedRange(level?: ExpectedLevel) {
  if (level === "low") return "0–39";
  if (level === "medium") return "40–74";
  if (level === "high") return "75–100";
  return "Not specified";
}

export default function EvaluationTestPage() {
  const [selectedId, setSelectedId] = useState(evaluationTestCases[0].id);
  const [transcript, setTranscript] = useState(evaluationTestCases[0].transcript);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const testCase = useMemo(
    () => evaluationTestCases.find((item) => item.id === selectedId)!,
    [selectedId]
  );
  const question = interviewQuestions.find((item) => item.id === testCase.questionId)!;
  const checks = result ? runEvaluationReliabilityChecks(result) : [];

  const selectCase = (id: string) => {
    const next = evaluationTestCases.find((item) => item.id === id)!;
    setSelectedId(id);
    setTranscript(next.transcript);
    setResult(null);
    setError("");
  };

  const runTest = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const evaluation = await evaluateInterview(question, transcript);
      setResult(evaluation);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Evaluation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-3 py-5 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">Internal development tool</p>
          <h1 className="mt-2 text-2xl font-black text-slate-950 sm:text-3xl">Evaluation Reliability Lab</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Run approved transcripts against the live evaluation API, compare the outcome with expected ranges, and inspect consistency warnings before changing scoring rules.
          </p>
          <div className="mt-4 inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
            Evaluation version: {EVALUATION_VERSION}
          </div>
        </header>

        <div className="mt-5 grid gap-5 lg:grid-cols-[340px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="text-sm font-bold text-slate-800" htmlFor="test-case">Approved test case</label>
            <select
              id="test-case"
              value={selectedId}
              onChange={(event) => selectCase(event.target.value)}
              className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900"
            >
              {evaluationTestCases.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>

            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-bold text-slate-900">Expected ranges</p>
              <dl className="mt-3 grid grid-cols-2 gap-2">
                <dt>Coverage</dt><dd className="font-semibold">{expectedRange(testCase.expectations.coverage)}</dd>
                <dt>Evidence</dt><dd className="font-semibold">{expectedRange(testCase.expectations.evidence)}</dd>
                <dt>Relevance</dt><dd className="font-semibold">{expectedRange(testCase.expectations.relevance)}</dd>
              </dl>
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold text-slate-900">Human review notes</p>
              <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-600">
                {testCase.expectations.notes.map((note) => <li key={note}>• {note}</li>)}
              </ul>
            </div>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Question {question.id}</p>
              <h2 className="mt-1 font-bold text-slate-950">{question.title}</h2>
            </div>

            <label className="mt-5 block text-sm font-bold text-slate-800" htmlFor="transcript">Test transcript</label>
            <textarea
              id="transcript"
              value={transcript}
              onChange={(event) => setTranscript(event.target.value)}
              className="mt-2 min-h-40 w-full rounded-xl border border-slate-300 p-4 text-sm leading-6 text-slate-900"
            />
            <button
              type="button"
              onClick={runTest}
              disabled={loading || !transcript.trim()}
              className="mt-4 min-h-12 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white disabled:bg-slate-300 sm:w-auto"
            >
              {loading ? "Running evaluation..." : "Run reliability test"}
            </button>

            {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

            {result && (
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric label="Overall" value={`${result.overall}/10`} />
                  <Metric label="Relevance" value={`${result.relevance.score}/10`} />
                  <Metric label="Coverage" value={`${result.focusAnalysis.coverageScore}%`} />
                  <Metric label="Evidence" value={`${result.focusAnalysis.evidenceQualityScore}%`} />
                </div>

                <div>
                  <h3 className="font-black text-slate-950">Automated consistency checks</h3>
                  <div className="mt-3 space-y-2">
                    {checks.map((check) => (
                      <div key={check.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-full px-2 py-1 text-xs font-bold ${check.severity === "pass" ? "bg-emerald-100 text-emerald-800" : check.severity === "warning" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                            {check.severity.toUpperCase()}
                          </span>
                          <strong>{check.label}</strong>
                        </div>
                        <p className="mt-2 text-slate-600">{check.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-black text-slate-950">Criterion result</h3>
                  <div className="mt-3 space-y-2">
                    {result.focusAnalysis.ideaAssessments.length === 0 ? (
                      <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No question-specific criteria for this question.</p>
                    ) : result.focusAnalysis.ideaAssessments.map((idea) => (
                      <div key={idea.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                        <div className="flex items-center justify-between gap-3">
                          <strong>{idea.label}</strong>
                          <span className="text-xs font-bold uppercase text-slate-500">{idea.status}</span>
                        </div>
                        {idea.evidence && <p className="mt-2 text-slate-600">Evidence: {idea.evidence}</p>}
                        {idea.coachingTip && <p className="mt-1 text-blue-700">Coach: {idea.coachingTip}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center">
      <div className="text-lg font-black text-slate-950">{value}</div>
      <div className="mt-1 text-xs font-semibold text-slate-500">{label}</div>
    </div>
  );
}
