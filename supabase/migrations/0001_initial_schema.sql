-- ClaimCraft initial schema
-- Run in Supabase SQL Editor (New query → paste → Run)
--
-- Assumes the "claim-documents" storage bucket already exists
-- (created manually in the dashboard with a 25 MB file-size limit).

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------

create table if not exists public.organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  plan        text not null default 'trial',  -- trial, solo, firm, contractor
  created_at  timestamptz not null default now()
);

create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text not null,
  full_name        text,
  organization_id  uuid references public.organizations(id),
  license_number   text,
  license_state    text,
  created_at       timestamptz not null default now()
);

create table if not exists public.claims (
  id                              uuid primary key default gen_random_uuid(),
  organization_id                 uuid not null references public.organizations(id) on delete cascade,
  created_by_user_id              uuid not null references public.profiles(id),
  property_address                text not null,
  loss_type                       text not null,
  loss_date                       date,
  carrier_name                    text,
  policy_number                   text,
  claim_number                    text,
  initial_offer_cents             bigint,
  estimated_rightful_value_cents  bigint,
  status                          text not null default 'new',  -- new, documenting, analyzing, supplementing, closed
  created_at                      timestamptz not null default now(),
  updated_at                      timestamptz not null default now()
);

create table if not exists public.claim_documents (
  id               uuid primary key default gen_random_uuid(),
  claim_id         uuid not null references public.claims(id) on delete cascade,
  document_type    text not null,  -- policy, declarations, carrier_estimate, photo, correspondence
  file_path        text not null,  -- path inside the claim-documents storage bucket
  file_name        text not null,
  file_size_bytes  bigint,
  mime_type        text,
  extracted_data   jsonb,
  uploaded_at      timestamptz not null default now()
);

create table if not exists public.claim_findings (
  id                    uuid primary key default gen_random_uuid(),
  claim_id              uuid not null references public.claims(id) on delete cascade,
  severity              text not null,  -- high, medium, low
  category              text,            -- scope_omission, code_upgrade, pricing, matching, other
  item_name             text not null,
  detail                text not null,
  citation              text,
  estimated_value_cents bigint,
  source_document_id    uuid references public.claim_documents(id),
  created_at            timestamptz not null default now()
);

create table if not exists public.supplement_letters (
  id          uuid primary key default gen_random_uuid(),
  claim_id    uuid not null references public.claims(id) on delete cascade,
  content     text not null,
  status      text not null default 'draft',  -- draft, sent, approved, denied
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. Enable RLS on every table
-- ---------------------------------------------------------------------------

alter table public.organizations       enable row level security;
alter table public.profiles            enable row level security;
alter table public.claims              enable row level security;
alter table public.claim_documents     enable row level security;
alter table public.claim_findings      enable row level security;
alter table public.supplement_letters  enable row level security;

-- ---------------------------------------------------------------------------
-- 3. RLS policies
--
-- The (select auth.uid()) / (select ... where id = auth.uid()) form is
-- Supabase's recommended performance pattern: Postgres caches the result
-- for the duration of the statement rather than re-evaluating per row.
-- ---------------------------------------------------------------------------

-- organizations: a user sees only their own org
drop policy if exists "organizations_select_own" on public.organizations;
create policy "organizations_select_own"
  on public.organizations
  for select
  to authenticated
  using (
    id = (select organization_id from public.profiles where id = (select auth.uid()))
  );

-- profiles: a user sees and updates only their own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Helper predicate expressed inline for each claim-scoped table:
--   organization_id = (select organization_id from profiles where id = auth.uid())

-- claims
drop policy if exists "claims_select_own_org" on public.claims;
create policy "claims_select_own_org"
  on public.claims
  for select
  to authenticated
  using (
    organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
  );

drop policy if exists "claims_insert_own_org" on public.claims;
create policy "claims_insert_own_org"
  on public.claims
  for insert
  to authenticated
  with check (
    organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
  );

drop policy if exists "claims_update_own_org" on public.claims;
create policy "claims_update_own_org"
  on public.claims
  for update
  to authenticated
  using (
    organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
  )
  with check (
    organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
  );

drop policy if exists "claims_delete_own_org" on public.claims;
create policy "claims_delete_own_org"
  on public.claims
  for delete
  to authenticated
  using (
    organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
  );

-- claim_documents (scope via parent claim's organization_id)
drop policy if exists "claim_documents_select_own_org" on public.claim_documents;
create policy "claim_documents_select_own_org"
  on public.claim_documents
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = claim_documents.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "claim_documents_insert_own_org" on public.claim_documents;
create policy "claim_documents_insert_own_org"
  on public.claim_documents
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.claims c
      where c.id = claim_documents.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "claim_documents_update_own_org" on public.claim_documents;
create policy "claim_documents_update_own_org"
  on public.claim_documents
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = claim_documents.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  )
  with check (
    exists (
      select 1
      from public.claims c
      where c.id = claim_documents.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "claim_documents_delete_own_org" on public.claim_documents;
create policy "claim_documents_delete_own_org"
  on public.claim_documents
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = claim_documents.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

-- claim_findings
drop policy if exists "claim_findings_select_own_org" on public.claim_findings;
create policy "claim_findings_select_own_org"
  on public.claim_findings
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = claim_findings.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "claim_findings_insert_own_org" on public.claim_findings;
create policy "claim_findings_insert_own_org"
  on public.claim_findings
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.claims c
      where c.id = claim_findings.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "claim_findings_update_own_org" on public.claim_findings;
create policy "claim_findings_update_own_org"
  on public.claim_findings
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = claim_findings.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  )
  with check (
    exists (
      select 1
      from public.claims c
      where c.id = claim_findings.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "claim_findings_delete_own_org" on public.claim_findings;
create policy "claim_findings_delete_own_org"
  on public.claim_findings
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = claim_findings.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

-- supplement_letters
drop policy if exists "supplement_letters_select_own_org" on public.supplement_letters;
create policy "supplement_letters_select_own_org"
  on public.supplement_letters
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = supplement_letters.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "supplement_letters_insert_own_org" on public.supplement_letters;
create policy "supplement_letters_insert_own_org"
  on public.supplement_letters
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.claims c
      where c.id = supplement_letters.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "supplement_letters_update_own_org" on public.supplement_letters;
create policy "supplement_letters_update_own_org"
  on public.supplement_letters
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = supplement_letters.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  )
  with check (
    exists (
      select 1
      from public.claims c
      where c.id = supplement_letters.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

drop policy if exists "supplement_letters_delete_own_org" on public.supplement_letters;
create policy "supplement_letters_delete_own_org"
  on public.supplement_letters
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.claims c
      where c.id = supplement_letters.claim_id
        and c.organization_id = (select organization_id from public.profiles where id = (select auth.uid()))
    )
  );

-- ---------------------------------------------------------------------------
-- 4. Storage policies on the claim-documents bucket
--
-- Path convention: <organization_id>/<claim_id>/<document_type>/<uuid>.<ext>
-- storage.foldername(name)[1] returns the first path segment, which is the
-- organization_id. RLS on storage.objects is already enabled by Supabase —
-- we just add the policies.
-- ---------------------------------------------------------------------------

drop policy if exists "claim_documents_bucket_select" on storage.objects;
create policy "claim_documents_bucket_select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'claim-documents'
    and (storage.foldername(name))[1]::uuid = (select organization_id from public.profiles where id = (select auth.uid()))
  );

drop policy if exists "claim_documents_bucket_insert" on storage.objects;
create policy "claim_documents_bucket_insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'claim-documents'
    and (storage.foldername(name))[1]::uuid = (select organization_id from public.profiles where id = (select auth.uid()))
  );

drop policy if exists "claim_documents_bucket_update" on storage.objects;
create policy "claim_documents_bucket_update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'claim-documents'
    and (storage.foldername(name))[1]::uuid = (select organization_id from public.profiles where id = (select auth.uid()))
  )
  with check (
    bucket_id = 'claim-documents'
    and (storage.foldername(name))[1]::uuid = (select organization_id from public.profiles where id = (select auth.uid()))
  );

drop policy if exists "claim_documents_bucket_delete" on storage.objects;
create policy "claim_documents_bucket_delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'claim-documents'
    and (storage.foldername(name))[1]::uuid = (select organization_id from public.profiles where id = (select auth.uid()))
  );
