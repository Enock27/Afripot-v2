-- Run this once in Supabase → SQL Editor → New query

create table if not exists gallery (
  id          text primary key,
  title       text not null default '',
  category    text not null default 'Food',
  image       text not null,
  created_at  timestamptz not null default now()
);

-- Allow anyone to read (public gallery)
alter table gallery enable row level security;

create policy "Public read"
  on gallery for select
  using (true);

-- Only service role (our Netlify function) can insert/update/delete
-- No insert/update/delete policy = only service_role key can write
