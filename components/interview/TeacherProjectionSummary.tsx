"use client";

import { useMemo, useState } from "react";
import { InterviewAttempt, RecruiterReport } from "@/types/interviewReport";

type ObserverKey = "content" | "language" | "professional";

type ScoreMap = Record<ObserverKey, number[]>;
type NoteMap = Record<ObserverKey, string>;

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
  subtitle: string;
  criteria: string[];
}> = [
  {
    key: "content",
    title: "Observer 1 · Content & Structure",
    subtitle: "Nội dung và cấu trúc câu trả lời",
    criteria: [
      "Answers the three interview questions directly and stays on topic.",
      "Q1 includes personal background, education/major, career goal, and contribution.",
      "Q2 states a strength, explains it, and supports it with an example/action/result.",
      "Q3 shows company research, role fit, contribution, and willingness to grow.",
      "Ideas are logically organized, concise, and easy to follow.",
    ],
  },
  {
    key: "language",
    title: "Observer 2 · English Language",
    subtitle: "Ngôn ngữ tiếng Anh",
    criteria: [
      "Uses understandable and mostly accurate grammar.",
      "Uses suitable job-interview and professional vocabulary.",
      "Connects ideas with appropriate linking words.",
      "Speaks fluently with limited fillers and unnecessary repetition.",
      "Pronunciation and spoken clarity are understandable to the listener.",
    ],
  },
  {
    key: "professional",
    title: "Observer 3 · Professional Performance",
    subtitle: "Tác phong phỏng vấn",
    criteria: [
      "Maintains appropriate posture and eye contact.",
      "Uses an audible voice and an appropriate speaking pace.",
      "Shows confidence and remains calm while answering.",
      "Shows a polite, positive, and professional attitude.",
      "Listens carefully and responds naturally without reading the whole answer.",
    ],
  },
];

function average(values: number[]) {
  if (!values.length) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
}

function metricAverage(attempts: InterviewAttempt[], selector: (attempt: InterviewAttempt) => number) {
  return average(attempts.map(selector));
}

function ScoreSelector({ value, onChange }: { value: number; onChange: (value: number) => void }) {
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
  const [scores, setScores] = useState<ScoreMap>({
    content: [0, 0, 0, 0, 0],
    language: [0, 0, 0, 0, 0],
    professional: [0, 0, 0, 0, 0],
  });
  const [notes, setNotes] = useState<NoteMap>({ content: "", language: "", professional: "" });

  const aiSummary = useMemo(() => {
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
      confidence: metricAverage(evaluatedAttempts, (attempt) => attempt.evaluation.confidence.score),
      pace: speechAttempts.length
        ? average(speechAttempts.map((attempt) => attempt.speechMetrics?.wordsPerMinute ?? 0).filter(Boolean))
        : 0,
      evaluatedCount: evaluatedAttempts.length,
      fillers: speechAttempts.length
        ? speechAttempts.reduce((sum, attempt) => sum + (attempt.speechMetrics?.fillerWordCount ?? 0), 0)
        : 0,
    };
  }, [attempts]);

  if (attempts.length < 3) return null;

  const setCriterionScore = (key: ObserverKey, index: number, value: number) => {
    setScores((current) => ({
      ...current,
      [key]: current[key].map((score, criterionIndex) => criterionIndex === index ? value : score),
    }));
  };

  const observerTotal = (key: ObserverKey) => scores[key].reduce((sum, value) => sum + value, 0);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-xl bg-indigo-600 px-6 py-3 text-center font-bold text-white shadow-sm transition hover:bg-indigo-700"
      >
        Teacher Summary · Trình chiếu & đối chiếu
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/80 p-2 sm:p-5 print:static print:bg-white print:p-0">
          <section className="mx-auto min-h-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl print:shadow-none">
            <header className="bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-950 p-5 text-white sm:p-8 print:bg-white print:text-slate-950">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-blue-200 print:text-slate-500">Teacher projection summary</p>
                  <h1 className="mt-2 text-2xl font-black sm:text-4xl">Multi-source Interview Feedback</h1>
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
              <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <SummaryMetric label="Overall" value={aiSummary.evaluatedCount ? `${report.overallScore}/10` : "Unavailable"} />
                <SummaryMetric label="Coverage" value={`${aiSummary.coverage}%`} />
                <SummaryMetric label="Evidence" value={`${aiSummary.evidence}%`} />
                <SummaryMetric label="Relevance" value={`${aiSummary.relevance}/10`} />
                <SummaryMetric label="Readiness" value={report.readiness} />
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="bg-slate-100 px-4 py-3">
                  <h2 className="font-black text-slate-900">AI summary by question</h2>
                  <p className="mt-1 text-xs text-slate-600">Use this evidence to compare with the three observers. AI feedback is advisory, not the final judgement.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-white text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Question</th>
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

              <section className="grid gap-4 lg:grid-cols-3">
                {observerRubrics.map((rubric) => (
                  <article key={rubric.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="font-black text-slate-950">{rubric.title}</h2>
                        <p className="mt-1 text-xs text-slate-500">{rubric.subtitle}</p>
                      </div>
                      <div className="rounded-xl bg-indigo-600 px-3 py-2 text-center text-white">
                        <p className="text-xl font-black">{observerTotal(rubric.key)}/10</p>
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

                    <label className="mt-4 block text-xs font-bold uppercase tracking-wide text-slate-500">
                      One strong point / One suggestion
                      <textarea
                        value={notes[rubric.key]}
                        onChange={(event) => setNotes((current) => ({ ...current, [rubric.key]: event.target.value }))}
                        rows={3}
                        className="mt-2 w-full resize-none rounded-xl border border-slate-300 bg-white p-3 text-sm font-normal normal-case tracking-normal text-slate-800 outline-none focus:border-indigo-500"
                        placeholder="Write one strength and one improvement..."
                      />
                    </label>
                  </article>
                ))}
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <h2 className="font-black text-emerald-900">AI-identified strengths</h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-emerald-950">
                    {report.strengths.map((item) => <li key={item}>✓ {item}</li>)}
                  </ul>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                  <h2 className="font-black text-amber-900">Priority improvements</h2>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-amber-950">
                    {report.improvements.map((item) => <li key={item}>→ {item}</li>)}
                  </ul>
                </div>
              </section>

              <section className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
                <h2 className="font-black text-indigo-950">Teacher conclusion</h2>
                <p className="mt-2 text-sm leading-7 text-indigo-900">
                  Compare the three observer scores with the AI evidence, resolve any differences, then state one confirmed strength and one priority action for the candidate’s next practice.
                </p>
                <p className="mt-3 text-xs leading-5 text-indigo-700">
                  Important: eye contact, posture, facial expression, and professional presence must be judged by human observers. The AI summary does not reliably assess these behaviours.
                </p>
              </section>

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
