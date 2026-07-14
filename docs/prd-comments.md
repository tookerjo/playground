# PRD: Hello World Comments

Author: Josh | Date: 2026-07-14 | Status: draft

## 1. Summary

Users sign in with Google to read and write in the comment section on the Hello World app. The rest of the page remains publicly visible. Comments support full nested replies. Any user can delete their own comment. An admin role can delete any comment. This gets Josh feedback from real visitors instead of a static page.

## 2. Goals

- Signed-in users can read the comment thread.
- Signed-in users can post a comment.
- Signed-in users can reply to any comment, at any depth.
- Users can delete their own comments.
- An admin can delete any comment.
- Comments persist and display in a threaded view.

## 3. Non-Goals

- No editing of comments after posting.
- No upvotes, reactions, or ranking.
- No email notifications on reply.
- No rich text or markdown formatting in comments.
- No anonymous commenting or anonymous reading of comments.
- No comment reporting/flagging workflow.
- No gating of the rest of the Hello World page — only the comment section is gated.

## 4. Users & Use Cases

**Visitor with a Google account.** Reads the Hello World page freely. To view or participate in the comment section, signs in with Google. Leaves a comment or replies to an existing thread. Comes back later to see responses.

**Josh (admin).** Reads comments as they come in. Replies to engage directly. Removes spam or off-topic comments using admin delete.

## 5. User Flows

**Flow A: Signed-in user posts a top-level comment**
1. User visits page, sees the rest of the page content normally.
2. Where the comment section would be, user sees a message that sign-in is required to read and write comments.
3. User clicks "Sign in with Google."
4. Once signed in, the comment thread loads and the user can see existing comments.
5. User types a comment in the top-level input box.
6. User clicks "Post."
7. Comment appears at the top or bottom of the thread (ordering: newest first).

**Flow B: User replies to a comment**
1. Signed-in user clicks "Reply" under any existing comment, at any nesting depth.
2. Reply input appears inline under that comment.
3. User types and submits.
4. Reply renders nested one level deeper than its parent.

**Flow C: User deletes own comment**
1. Signed-in user sees a "Delete" option only on their own comments.
2. User clicks it, confirms.
3. Comment is removed (or shows as "[deleted]" if it has replies — flagged below as an open question).

**Flow D: Admin deletes any comment**
1. Admin sees "Delete" on every comment, not just their own.
2. Admin clicks it, confirms.
3. Comment removed following the same deletion rule as Flow C.

## 6. Data Model (high-level)

Users have many Comments. Each Comment belongs to one User. Each Comment optionally has one parent Comment (self-referential), enabling unlimited nesting. A Comment has many child Comments.

## 7. Edge Cases & Open Questions

- What happens when a comment with replies is deleted? Options: hard delete cascades to children, or soft delete shows "[deleted]" and preserves the thread. **Open — needs a decision before build.**
- How is "admin" determined? **Resolved — see ADR-001: role column.**
- Is there a max nesting depth in practice, or does the UI need to handle arbitrarily deep threads visually? **Open.**
- What happens if a user deletes their Google account or revokes access? Do their past comments remain, orphaned?
- Rate limiting: what stops a signed-in user from spam-posting hundreds of comments in a loop?
- What does a signed-out user see in place of the comment thread? Just the sign-in prompt, or also a comment count ("12 comments — sign in to view")?

## 8. Success Criteria

- [ ] A signed-out user can view the rest of the Hello World page normally.
- [ ] A signed-out user cannot see comment content, only a sign-in prompt where the comment section sits.
- [ ] A signed-in user can view the full comment thread.
- [ ] A signed-in user can post a top-level comment and see it persist on reload.
- [ ] A signed-in user can reply to a comment at any existing depth.
- [ ] A user can delete their own comment; a non-owner cannot.
- [ ] An admin can delete any comment.
- [ ] Two different Google accounts see the same shared comment thread (this is a public-to-signed-in-users feature, not per-user isolated data).

## 9. Out of Scope (this version)

- Comment editing.
- Reactions, likes, upvotes.
- Notifications.
- Reporting/flagging.
- Anonymous or non-Google auth.
- Rich text formatting.
- Gating any part of the page outside the comment section.
