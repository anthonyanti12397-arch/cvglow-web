-- CVGlow Supabase Schema
-- Run this in the Supabase SQL editor: https://supabase.com/dashboard/project/_/sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- USERS
-- =============================================
create table if not exists public.users (
  id            uuid primary key default uuid_generate_v4(),
  email         text unique not null,
  full_name     text,
  subscription_status text not null default 'free', -- free | premium | premium_canceling
  subscription_id text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================
-- RESUMES
-- =============================================
create table if not exists public.resumes (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  title         text not null default 'My Resume',
  content       jsonb not null default '{}',
  template_id   text not null default 'classic',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists resumes_user_id_idx on public.resumes(user_id);

-- =============================================
-- RESUME SHARE LINKS
-- =============================================
create table if not exists public.resume_shares (
  id            uuid primary key default uuid_generate_v4(),
  slug          text unique not null,
  resume_id     uuid not null references public.resumes(id) on delete cascade,
  template_id   text not null default 'classic',
  view_count    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists resume_shares_slug_idx on public.resume_shares(slug);

-- =============================================
-- APPLICATIONS (Job Tracker)
-- =============================================
create table if not exists public.applications (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  job_title     text not null,
  company       text not null,
  location      text,
  salary        text,
  source        text,
  url           text,
  status        text not null default 'saved', -- saved | applied | interview | offer | rejected
  applied_date  date,
  notes         text,
  resume_id     uuid references public.resumes(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists applications_user_id_idx on public.applications(user_id);
create index if not exists applications_status_idx on public.applications(status);

-- =============================================
-- COVER LETTERS
-- =============================================
create table if not exists public.cover_letters (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  resume_id     uuid not null references public.resumes(id) on delete cascade,
  job_title     text not null,
  company_name  text,
  content       text not null,
  word_count    integer,
  created_at    timestamptz not null default now()
);

create index if not exists cover_letters_resume_id_idx on public.cover_letters(resume_id);

-- =============================================
-- INTERVIEW SESSIONS
-- =============================================
create table if not exists public.interview_sessions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  resume_id     uuid references public.resumes(id) on delete set null,
  job_title     text not null,
  messages      jsonb not null default '[]',
  avg_score     numeric(4,2),
  completed     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================
alter table public.users enable row level security;
alter table public.resumes enable row level security;
alter table public.resume_shares enable row level security;
alter table public.applications enable row level security;
alter table public.cover_letters enable row level security;
alter table public.interview_sessions enable row level security;

-- Users can only access their own data
create policy "users_own" on public.users for all using (auth.uid() = id);
create policy "resumes_own" on public.resumes for all using (auth.uid() = user_id);
create policy "applications_own" on public.applications for all using (auth.uid() = user_id);
create policy "cover_letters_own" on public.cover_letters for all using (auth.uid() = user_id);
create policy "interview_sessions_own" on public.interview_sessions for all using (auth.uid() = user_id);

-- Resume shares are public reads, owner writes
create policy "resume_shares_public_read" on public.resume_shares for select using (true);
create policy "resume_shares_owner_write" on public.resume_shares for insert using (
  auth.uid() = (select user_id from public.resumes where id = resume_id)
);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger resumes_updated_at before update on public.resumes
  for each row execute procedure public.set_updated_at();

create trigger applications_updated_at before update on public.applications
  for each row execute procedure public.set_updated_at();

create trigger interview_sessions_updated_at before update on public.interview_sessions
  for each row execute procedure public.set_updated_at();
