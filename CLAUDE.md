@AGENTS.md

# Project: Playground — Hello World Comments

## Purpose
Add a persistent, threaded comment system to the Hello World page.
Comment reading and writing are gated behind Google sign-in. The rest
of the page stays public. See docs/prd-comments.md and
docs/tech-design-comments.md.

## Core Constraints (Claude Code must respect these — NEVER violate)
1. All primary keys are UUIDs. NEVER derive a primary key from email,
   username, or any user-provided or mutable field.
2. User identity is `users.id` (UUID), populated by Supabase Auth at
   first Google sign-in. NEVER key identity lookups by email.
3. Every comment has a `user_id` FK. No cross-user write access —
   a user can only create/edit their own comments.
4. Admin status is determined ONLY by the `role` column on `users`
   (see ADR-001). NEVER hardcode an admin user ID or email allowlist.
5. Comment deletion is soft delete: set `deleted_at`, retain the row,
   render as "[deleted]" in the thread. NEVER hard-delete a comment
   that has replies.
6. RLS enforces: SELECT requires `auth.uid() IS NOT NULL` (any signed-in
   user can read the thread). DELETE requires `user_id = auth.uid()`
   OR `role = 'admin'`. Enforce both at the database (RLS) AND in
   application logic — never rely on one alone.
7. `/api/comments*` routes require auth by default. The rest of the
   site (`/`) has NO auth requirement. Do not gate the page itself,
   only the comment routes and comment UI component.
8. Tests required for: cross-user delete attempts, unauthenticated
   access to `/api/comments`, and admin-vs-non-admin delete paths.

## Decisions Log
- ADR-001: Admin access via role column (docs/adr/001-admin-role-column.md)

## Current Phase
Session 0.3 — Loop dry run. Building comments feature from
docs/prd-comments.md and docs/tech-design-comments.md.