-- FIX 43.3 · Centralized Classroom Results & Teacher Dashboard
-- Run this once in Supabase SQL Editor for the project used by English AI Coach.

create extension if not exists pgcrypto;

create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(),
  session_code text not null unique,
  session_name text not null default 'Job Interview Teaching Demo',
  expected_candidates integer not null default 4 check (expected_candidates between 1 and 12),
  status text not null default 'open' check (status in ('open', 'completed', 'closed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz null
);

create table if not exists public.candidate_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.interview_sessions(id) on delete cascade,
  candidate_key text not null,
  candidate_name text not null,
  company_name text not null default '',
  job_title text not null default '',
  recruiter_name text not null default '',
  overall_score numeric(3,1) not null default 0,
  evaluation_mode text not null default 'unavailable' check (evaluation_mode in ('live_ai', 'mixed', 'backup_rubric', 'unavailable')),
  q1_result jsonb null,
  q2_result jsonb null,
  q3_result jsonb null,
  strengths jsonb not null default '[]'::jsonb,
  improvements jsonb not null default '[]'::jsonb,
  recommended_next_practice jsonb not null default '[]'::jsonb,
  score_breakdown jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint candidate_results_session_candidate_unique unique (session_id, candidate_key)
);

create index if not exists candidate_results_session_id_idx
  on public.candidate_results(session_id);

alter table public.interview_sessions enable row level security;
alter table public.candidate_results enable row level security;

-- No anon/authenticated policies are created intentionally.
-- Fix 43.3 accesses these tables only from trusted Next.js server routes
-- using SUPABASE_SECRET_KEY. The secret key stays server-side.

revoke all on table public.interview_sessions from anon, authenticated;
revoke all on table public.candidate_results from anon, authenticated;

grant all on table public.interview_sessions to service_role;
grant all on table public.candidate_results to service_role;
