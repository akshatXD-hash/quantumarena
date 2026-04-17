create extension if not exists vector;
create extension if not exists pg_trgm;

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  role text not null default 'patient' check (role in ('patient', 'admin')),
  email text unique not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  filename text not null,
  blob_url text not null,
  file_type text not null check (file_type in ('pdf', 'image')),
  mime_type text not null,
  file_size_bytes bigint not null,
  raw_text text,
  page_count integer,
  status text not null default 'processing' check (status in ('processing', 'complete', 'error')),
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists summaries (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references reports(id) on delete cascade not null,
  section_name text not null,
  summary_text text not null,
  abnormal_flags jsonb not null default '[]'::jsonb,
  citations jsonb not null default '[]'::jsonb,
  next_steps jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists medical_kb (
  id bigserial primary key,
  content text not null,
  embedding vector(1536),
  category text not null check (category in ('lab_range', 'icd10', 'drug', 'glossary', 'procedure')),
  source text not null,
  term text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists medical_kb_embedding_idx on medical_kb
  using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create index if not exists medical_kb_term_trgm_idx on medical_kb
  using gin (term gin_trgm_ops);

create index if not exists reports_user_id_idx on reports(user_id);
create index if not exists reports_status_idx on reports(status);
create index if not exists reports_created_at_idx on reports(created_at desc);
create index if not exists summaries_report_id_idx on summaries(report_id);

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'patient'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_reports_updated_at on reports;
create trigger update_reports_updated_at
  before update on reports
  for each row execute procedure update_updated_at_column();

create or replace function match_medical_kb(
  query_embedding vector(1536),
  match_count integer,
  match_threshold float
)
returns table (
  id bigint,
  content text,
  category text,
  source text,
  term text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    id,
    content,
    category,
    source,
    term,
    metadata,
    1 - (embedding <=> query_embedding) as similarity
  from medical_kb
  where 1 - (embedding <=> query_embedding) > match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;

create or replace function get_admin_stats()
returns jsonb
language sql stable
as $$
  select jsonb_build_object(
    'total_reports', (select count(*) from reports),
    'reports_today', (select count(*) from reports where created_at >= current_date),
    'reports_this_week', (select count(*) from reports where created_at >= date_trunc('week', now())),
    'total_patients', (select count(*) from profiles where role = 'patient'),
    'reports_by_status', (
      select jsonb_object_agg(status, cnt)
      from (select status, count(*) as cnt from reports group by status) s
    ),
    'reports_by_file_type', (
      select jsonb_object_agg(file_type, cnt)
      from (select file_type, count(*) as cnt from reports group by file_type) ft
    ),
    'total_summaries', (select count(*) from summaries),
    'total_abnormal_flags', (
      select coalesce(sum(jsonb_array_length(abnormal_flags)), 0) from summaries
    ),
    'avg_sections_per_report', (
      select coalesce(
        (select count(*)::float from summaries) /
        nullif((select count(*) from reports where status = 'complete'), 0),
        0
      )
    )
  );
$$;

alter table profiles enable row level security;
alter table reports enable row level security;
alter table summaries enable row level security;
alter table medical_kb enable row level security;

create policy "patients_select_own_profile"
  on profiles for select
  using (auth.uid() = id or exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "patients_update_own_profile"
  on profiles for update
  using (auth.uid() = id);

create policy "patients_select_own_reports"
  on reports for select
  using (user_id = auth.uid() or exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "patients_insert_own_reports"
  on reports for insert
  with check (user_id = auth.uid());

create policy "patients_update_own_reports"
  on reports for update
  using (user_id = auth.uid() or exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "patients_delete_own_reports"
  on reports for delete
  using (user_id = auth.uid() or exists (
    select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

create policy "patients_select_own_summaries"
  on summaries for select
  using (
    exists (
      select 1 from reports r
      where r.id = summaries.report_id
      and (r.user_id = auth.uid() or exists (
        select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
      ))
    )
  );

create policy "authenticated_select_kb"
  on medical_kb for select
  using (auth.role() = 'authenticated');
