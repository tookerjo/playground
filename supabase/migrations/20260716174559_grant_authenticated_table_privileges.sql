-- Task 2's migration created RLS policies but never granted the underlying
-- table-level privileges those policies depend on. RLS only restricts which
-- *rows* a role can touch; Postgres still requires a base GRANT before a
-- role can attempt the operation at all. Discovered via a real POST
-- /api/comments 500: "permission denied for table comments" (42501).
--
-- No DELETE grant on comments: hard deletes are intentionally impossible
-- (see the comments_update_own_or_admin policy note in the task 2
-- migration). No INSERT/UPDATE grant on users: the only writer is the
-- security definer handle_new_user() trigger, which runs as its owner and
-- doesn't need a grant to the authenticated role.
grant select, insert, update on public.comments to authenticated;
grant select on public.users to authenticated;
