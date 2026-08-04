"use client";

import { companies } from "@/data/interviewProfiles";
import { useInterviewContext } from "@/context/InterviewContext";

interface Props { onContinue: () => void; }

export default function InterviewPositionSetup({ onContinue }: Props) {
  const {
    selectedCompany,
    selectedJobRole,
    setSelectedCompanyId,
    setSelectedJobRoleId,
  } = useInterviewContext();

  return (
    <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
      <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-5 py-8 text-white sm:px-9 sm:py-10">
        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">Interview application</span>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">Choose the company and position you are applying for.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">Your recruiter will use this context during the interview and include it in the final report.</p>
      </div>

      <div className="space-y-7 p-4 sm:p-7 lg:p-9">
        <div>
          <div className="flex items-end justify-between gap-3">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Step 1</p><h2 className="mt-1 text-xl font-bold text-slate-900">Select a company</h2></div>
            <span className="text-xs text-slate-500">3 simulated employers</span>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {companies.map((company) => {
              const active = company.id === selectedCompany.id;
              return (
                <button key={company.id} type="button" onClick={() => setSelectedCompanyId(company.id)} aria-pressed={active}
                  className={`rounded-2xl border-2 p-4 text-left transition active:scale-[.99] ${active ? "border-blue-500 bg-blue-50 ring-4 ring-blue-100" : "border-slate-200 bg-white hover:border-blue-200"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${company.gradient} text-2xl text-white shadow`}>{company.emoji}</div>
                    <div className="min-w-0"><p className="font-bold text-slate-900">{company.name}</p><p className="mt-1 text-xs text-blue-700">{company.industry}</p></div>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-700">{company.tagline}</p>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{company.description}</p>
                  <span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{active ? "✓ Selected company" : "Select company"}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Step 2</p>
          <h2 className="mt-1 text-xl font-bold text-slate-900">Select a position at {selectedCompany.name}</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {selectedCompany.roles.map((role) => {
              const active = role.id === selectedJobRole.id;
              return (
                <button key={role.id} type="button" onClick={() => setSelectedJobRoleId(role.id)} aria-pressed={active}
                  className={`rounded-2xl border-2 p-4 text-left transition active:scale-[.99] ${active ? "border-emerald-500 bg-emerald-50 ring-4 ring-emerald-100" : "border-slate-200 hover:border-emerald-200"}`}>
                  <div className="flex flex-wrap items-start justify-between gap-2"><div><p className="font-bold text-slate-900">{role.title}</p><p className="mt-1 text-xs text-slate-500">{role.department} • {role.level}</p></div><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}>{active ? "✓ Selected" : "Choose"}</span></div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{role.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">{role.skills.map((skill) => <span key={skill} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200">{skill}</span>)}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 sm:flex sm:items-center sm:justify-between sm:gap-5">
          <div><p className="text-xs font-bold uppercase tracking-wide text-blue-700">Your application</p><p className="mt-1 font-bold text-slate-900">{selectedJobRole.title}</p><p className="mt-1 text-sm text-slate-600">{selectedCompany.name} • {selectedCompany.industry}</p></div>
          <button type="button" onClick={onContinue} className="mt-4 min-h-12 w-full rounded-xl bg-blue-600 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-[.99] sm:mt-0 sm:w-auto">Continue to Recruiter Setup →</button>
        </div>
      </div>
    </section>
  );
}
