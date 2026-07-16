-- users: profile + role, mirrors auth.users, populated by a trigger at first sign-in.
-- id is never derived from email/username; it's the same UUID Supabase Auth assigns.
create table public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Users can read only their own profile row. Broader role checks (e.g. "is this
-- other user an admin?") go through is_admin() below, not a direct SELECT grant,
-- to avoid needing to expose other users' rows just so RLS subqueries can see role.
create policy "users_select_own"
  on public.users
  for select
  to authenticated
  using (id = auth.uid());

-- No insert/update/delete policies: the only writer is the trigger below, which
-- runs as security definer and bypasses RLS. Clients never write to this table directly.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.email),
    'user'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- security definer function so the admin check in comments' RLS policy can read
-- role without needing a broad SELECT policy on public.users.
create function public.is_admin(uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.users u
    where u.id = uid and u.role = 'admin'
  );
$$;

-- comments: UUID PK, self-referential parent for threading, soft delete only.
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users (id),
  parent_comment_id uuid references public.comments (id),
  body text not null check (btrim(body) <> ''),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index comments_parent_comment_id_idx on public.comments (parent_comment_id);
create index comments_created_at_idx on public.comments (created_at);

alter table public.comments enable row level security;

-- Any signed-in user can read the shared thread.
create policy "comments_select_authenticated"
  on public.comments
  for select
  to authenticated
  using (auth.uid() is not null);

-- A user can only create comments/replies attributed to themselves.
create policy "comments_insert_own"
  on public.comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- "Delete" is implemented as an update (deleted_at set), restricted to owner or
-- admin. There is no delete policy at all below, so hard deletes are blocked by
-- RLS regardless of what application code does -- comments with replies (or
-- without) are never hard-deleted.
create policy "comments_update_own_or_admin"
  on public.comments
  for update
  to authenticated
  using (user_id = auth.uid() or public.is_admin(auth.uid()))
  with check (user_id = auth.uid() or public.is_admin(auth.uid()));

-- Comments have no edit feature (PRD non-goal). This trigger enforces that at
-- the DB layer: the only allowed change via UPDATE is setting deleted_at once,
-- from null to non-null. Everything else -- including un-deleting -- is blocked
-- even if the RLS policy above would otherwise permit the write.
create function public.comments_restrict_update()
returns trigger
language plpgsql
as $$
begin
  if new.id <> old.id
     or new.user_id <> old.user_id
     or new.parent_comment_id is distinct from old.parent_comment_id
     or new.body <> old.body
     or new.created_at <> old.created_at then
    raise exception 'only deleted_at may be updated on comments';
  end if;

  if old.deleted_at is not null and new.deleted_at is distinct from old.deleted_at then
    raise exception 'deleted_at cannot be changed once set';
  end if;

  return new;
end;
$$;

create trigger comments_restrict_update_trigger
  before update on public.comments
  for each row execute function public.comments_restrict_update();
