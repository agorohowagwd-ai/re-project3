-- re:project MVP — Supabase schema
-- Run this once in Supabase SQL Editor.

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  service_id text not null,
  service_title text not null,
  price text,
  status text not null default 'new',
  name text,
  email text,
  phone text,
  message text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.visualizations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_name text,
  style text not null,
  messages jsonb not null default '[]'::jsonb,
  result_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists requests_user_id_created_at_idx on public.requests(user_id, created_at desc);
create index if not exists visualizations_user_id_created_at_idx on public.visualizations(user_id, created_at desc);

alter table public.requests enable row level security;
alter table public.visualizations enable row level security;

drop policy if exists "users can read their requests" on public.requests;
drop policy if exists "users can insert their requests" on public.requests;
drop policy if exists "users can read their visualizations" on public.visualizations;
drop policy if exists "users can insert their visualizations" on public.visualizations;

create policy "users can read their requests" on public.requests for select using (auth.uid() = user_id);
create policy "users can insert their requests" on public.requests for insert with check (auth.uid() = user_id);
create policy "users can read their visualizations" on public.visualizations for select using (auth.uid() = user_id);
create policy "users can insert their visualizations" on public.visualizations for insert with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('reproject-assets', 'reproject-assets', false)
on conflict (id) do nothing;

drop policy if exists "users can read own reproject assets" on storage.objects;
create policy "users can read own reproject assets" on storage.objects for select
using (bucket_id = 'reproject-assets' and (storage.foldername(name))[1] = auth.uid()::text);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id text,
  amount integer not null,
  description text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create index if not exists payments_user_id_created_at_idx on public.payments(user_id, created_at desc);
alter table public.payments enable row level security;
drop policy if exists "users can read their payments" on public.payments;
create policy "users can read their payments" on public.payments for select using (auth.uid() = user_id);

-- v16: roles, real project workspace and messages
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'client' check (role in ('client','designer','admin')),
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name')
  on conflict (id) do update set name = coalesce(excluded.name, public.profiles.name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, name)
select id, coalesce(raw_user_meta_data ->> 'name', email)
from auth.users
on conflict (id) do nothing;

alter table public.profiles enable row level security;
drop policy if exists "users can read own profile" on public.profiles;
create policy "users can read own profile" on public.profiles for select using (auth.uid() = id);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid references public.requests(id) on delete cascade,
  body text not null,
  sender_role text not null default 'client' check (sender_role in ('client','designer','admin')),
  created_at timestamptz not null default now()
);
create index if not exists messages_request_id_created_at_idx on public.messages(request_id, created_at asc);
create index if not exists messages_user_id_created_at_idx on public.messages(user_id, created_at asc);
alter table public.messages enable row level security;
drop policy if exists "users can read own messages" on public.messages;
drop policy if exists "users can insert own messages" on public.messages;
create policy "users can read own messages" on public.messages for select using (auth.uid() = user_id);
create policy "users can insert own messages" on public.messages for insert with check (auth.uid() = user_id);

alter table public.payments add column if not exists request_id uuid references public.requests(id) on delete set null;
create index if not exists payments_request_id_idx on public.payments(request_id);

-- After registering on the site, promote the owner's account to admin:
-- update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'YOUR_EMAIL');


-- v19: paid digital education access
alter table public.payments add column if not exists product_type text;
alter table public.payments add column if not exists product_slug text;
alter table public.payments add column if not exists metadata jsonb not null default '{}'::jsonb;
create index if not exists payments_product_slug_idx on public.payments(product_slug);

create table if not exists public.education_access (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_slug text not null,
  payment_id uuid references public.payments(id) on delete set null,
  granted_at timestamptz not null default now(),
  unique(user_id, product_slug)
);
create index if not exists education_access_user_id_idx on public.education_access(user_id);
alter table public.education_access enable row level security;
drop policy if exists "users can read own education access" on public.education_access;
create policy "users can read own education access" on public.education_access for select using (auth.uid() = user_id);
