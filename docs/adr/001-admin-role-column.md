# ADR-001: Admin access granted via a role column with user/admin values

Status: proposed
Date: 7/14/26

## Context
Need admin access requirements for comment system that distinguishes owner (Josh) from other signed-in users.

## Decision
Admin status determined by role column that matches "admin" value in the users table.

## Alternatives Considered
- Option A: Email allowlist. Rejected because it requires a code change and redeploy to add or remove an admin, while a role column is a data update.
- Option B: Hardcoded user ID. Rejected because it requires editing code and redeploying to change who's admin, same as Option A.

## Consequences
Unblocks the DELETE RLS policy, which was previously undecided pending this decision.
Cost: requires a migration adding a `role` column to `users`, plus a one-time manual `UPDATE` setting Josh's row to `admin`.
