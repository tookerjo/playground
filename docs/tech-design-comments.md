# Tech Design: Hello World Comments

Author: Josh | Date: 2026-07-14 | Reviewed by: Josh, with Claude.ai

## 1. Context

Hello World is currently a static page. This adds a persistent, threaded comment system where the comment section — reading and writing both — is gated behind Google sign-in. The rest of the page stays public. Link to PRD above.

## 2. Stack

- Framework: Next.js (App Router) + TypeScript
- DB: Supabase (Postgres + auth + RLS)
- Auth: Supabase Auth with Google OAuth provider
- Hosting: Vercel
- Styling: Tailwind CSS + shadcn/ui

## 3. Data Model (schema-level)

**users** (managed by Supabase Auth, not hand-rolled)
- `id` (UUID, PK)
- `email`
- `display_name`
- `role` (text, values: `"user"` | `"admin"`, default `"user"` — see ADR-001)

**comments**
- `id` (UUID, PK)
- `user_id` (UUID, FK → users.id)
- `parent_comment_id` (UUID, FK → comments.id, nullable — null means top-level)
- `body` (text)
- `created_at` (timestamp)
- `deleted_at` (timestamp, nullable — supports soft delete if that's the decision from the open question above)

Index on `parent_comment_id` for fast thread reconstruction. Index on `created_at` for ordering.

## 4. API / Route Shape

- `GET /api/comments` — return the full comment tree (auth required; unauthenticated requests get a 401, not partial data)
- `POST /api/comments` — create a comment or reply (auth required; body includes `parent_comment_id` if it's a reply)
- `DELETE /api/comments/:id` — delete a comment (auth required; must be owner OR `role = 'admin'`)

Note: the rest of the page (`/`) has no auth requirement. Only the `/api/comments*` routes and the comment UI component are gated.

## 5. Identity & Tenancy

- User identity is `users.id` (UUID), populated by Supabase Auth at first Google sign-in. Never keyed by email.
- Every comment has a `user_id` FK. No cross-user write access.
- The comment thread is shared and visible to any signed-in user, not per-user isolated data. RLS policy: `SELECT` requires `auth.uid() IS NOT NULL` (any authenticated user, not just the comment's owner). `DELETE` is restricted to `user_id = auth.uid()` OR `role = 'admin'` (see ADR-001).
- Distinction from an earlier version of this design: `SELECT` requires auth too, not just `DELETE`.

## 6. File / Folder Structure

playground/
  app/
    api/
      comments/
        route.ts
        [id]/
          route.ts
    page.tsx
  components/
    CommentThread.tsx
    CommentForm.tsx
    CommentNode.tsx
    CommentSignInGate.tsx
  docs/
    prd-comments.md
    tech-design-comments.md
    adr/
      001-admin-role-column.md

## 7. Key Decisions (linked to ADRs)

- Comment primary key: UUID, not auto-increment.
- Soft delete vs hard delete for comments with children. **Still open.**
- Admin role determination mechanism: role column. **ADR-001, resolved.**
- Comment section read access gated behind auth, while the rest of the page stays public.

## 8. Risks & Open Questions

- Unlimited nesting depth could produce a recursive query that's slow or a UI that's unreadable at depth 10+. No depth cap is specified yet.
- No rate limiting specified on `POST /api/comments`. A signed-in user could spam-post.
- Deletion semantics (soft vs hard) are unresolved and block a clean build.
- Gating `GET /api/comments` means a signed-out visitor gets zero visibility into engagement (no comment count, no preview). If the goal is visible social proof to encourage sign-in, this cuts against it. Worth a second look, but not a blocker for this exercise.
