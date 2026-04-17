-- Run this BEFORE schema.sql, or in addition to it.
-- This replaces Supabase Auth with a self-managed users table.

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'patient' check (role in ('patient', 'admin')),
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists users_email_idx on users(email);
create index if not exists users_username_idx on users(username);

-- Drop old FK from reports → profiles/auth.users and point to users instead
alter table reports drop constraint if exists reports_user_id_fkey;
alter table reports
  add constraint reports_user_id_fkey
  foreign key (user_id) references users(id) on delete cascade;

-- Auto-update trigger
create or replace function update_users_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_users_updated_at on users;
create trigger update_users_updated_at
  before update on users
  for each row execute procedure update_users_updated_at();
