# Session 0.0 Debrief — Machine Setup
Date: June 8, 2026

## What shipped
Complete setup of the full stack:
- Local machine: Homebrew, Node.js, Git configured, Cursor, VS Code, Claude Code, SSH key
- Cloud accounts: GitHub reactivated (tookerjo), Anthropic API key created, Supabase confirmed, Vercel created and linked to GitHub
- Workspace folder structure: playground, thesis-tracker, deal-flow-crm, research-triage
- Claude.ai Project configured with all three syllabus files
- Smoke test passed: Claude Code created hello.md in playground, visible and correct in Cursor

## What broke / what was confusing
Cursor's newest version has a different interface than expected — the folder explorer wasn't where the session plan assumed it would be. Required multiple attempts to find the right editor view. Without Claude guiding the session, this would have been slow and frustrating. Key lesson: need to keep asking *why* I'm doing something, not just clicking through. Order of operations and understanding the purpose behind each step matters.

## What Claude Code did well
First real interaction (creating hello.md) showed how smooth the build loop is going to be. Even on a trivial task, the propose → review → approve model was clear and confidence-building.

## What Claude Code did badly
Insufficient data — revisit after Session 0.1 when there's more actual building to evaluate.

## Oversight catches I'm proud of
- Questioned which email to use for global Git config (personal vs Parchmount) and made a deliberate decision
- Made sure VS Code was set up alongside Cursor rather than skipping it
- Caught that I was in the wrong folder before running the smoke test
- Pushed to understand how the home folder differs from workspace folders

## One thing missed / to improve
Need to keep building the mental model for file system architecture — home folder vs workspace, where things live, why it matters. This will compound. Also need to stay focused on how each task scales and applies beyond the immediate step.

## Next session
Session 0.1 — Workspace & Tool Taxonomy. Practice the dual-loop on playground repo. Get comfortable with git, Terminal navigation, and Cursor as daily driver.

# Session 0.1-lite Debrief
Date: July 13-14, 2026

## What shipped
- hello-world Next.js app built via Plan Mode, pushed to github.com/tookerjo/playground
- ai-engineering-journey repo created and public, with README linking four planned project repos, plus lessons.md and prompts.md stubs
- projects-backlog-private.md created and gitignored, holding six parked project ideas
- Global git config set to GitHub no-reply email permanently
- Global ~/.claude/CLAUDE.md created with five standing rules
- Global ~/.claude/settings.json updated to auto-approve read-only commands (git status, git log, git diff, git show, git branch listing, ls, pwd, cat) while keeping manual approval for anything that writes, deletes, pushes, or is irreversible

## What broke / what was confusing
Claude Code login stalled mid-session and required /login. hello.md from Session 0.0 conflicted with create-next-app and was moved into docs/. GitHub blocked the first push twice (once in playground, once in ai-engineering-journey) because git was using a real email address; fixed per-repo both times before fixing it globally. Manual approval on every single command felt slow and frustrating at first.

## What Claude Code did well
Correctly proposed a full plan before touching files, caught the hello.md conflict itself and asked how to resolve it rather than failing silently, and validated its own settings.json edit with jq before declaring the auto-approval task done.

## What Claude Code did badly
None significant tonight — every failure mode encountered was environmental (auth, file conflict, email privacy) rather than the agent making a bad judgment call.

## Oversight catches I'm proud of
Caught that projects-backlog.md was about to be public with real business ideas in it, and restructured it into a public/private split before that became a problem. Fixed the email issue at the global level instead of repeating the per-repo fix a third time.

## One thing missed / to improve
Didn't do the Step 3 concept primer on Plan Mode until partway through the session, after already approving several commands on trust rather than understanding — went back and did it properly once I noticed I was just clicking through.

## Next session
Session 0.2, Spec Craft.

## Session-specific reflection
Approval fatigue is real, but it wasn't randomly distributed — it clustered exactly on the moment code left my machine and became public (the pushes), which is the correct place for friction to concentrate. Read-only commands are now auto-approved globally so future sessions won't repeat that specific fatigue.

## Terms I got stuck on
- Read-only vs. write commands — read-only commands (git status, git log, git diff, ls, cat) only look at files or information, they can't change anything, so they're safe to approve quickly. Write commands (git add, git commit, git push, anything with delete or force) actually change something — locally, or in the case of push, publicly and irreversibly — so they're worth reading closely before approving.
- Plan Mode — Claude Code explores and proposes a plan without touching files, then waits for approval before acting.
- No-reply email — a GitHub-provided placeholder email address that hides your real one from public commit history.
- .gitignore — a file that tells git which files to never track, commit, or push, even if they exist on disk.
- Auto-approve / allowlist — a list of specific commands Claude Code can run without asking permission each time, versus everything else which still prompts.

# Session 0.2 Debrief — Spec Craft
Date: July 14, 2026

## What shipped
Practice PRD, tech design, and ADR-001 for a fictional "Hello World Comments" feature — Google-auth-gated comment threading with nested replies, admin delete via a role column. All three saved to docs/ and pushed.

## What broke / what was confusing
No real friction with the PRD or tech design — when an ambiguity surfaced (I'd over-gated reading, not just writing, comments behind sign-in), one correction fixed both documents cleanly. The ADR was genuinely hard: took three drafts, and I explicitly didn't know how to fill in Alternatives or Consequences without help walking through the mechanics first.

## What Claude Code did well
Not applicable — this was Claude.ai drafting work, no Claude Code build involved.

## What Claude Code did badly
Not applicable — no Claude Code build this session.

## Oversight catches I'm proud of
Caught that the read-gate had been extended beyond what I asked for (gating reads, not just writes) and corrected it in one line. The PRD and tech design correctly left the soft-delete-vs-hard-delete question open instead of quietly deciding it.

## One thing missed / to improve
My first ADR draft was missing Status/Date, had only one alternative instead of the two the template implies, no concrete type for the role column, and one place where my stated reason for rejecting an alternative didn't actually match the decision I made. Needed a structured walkthrough before I could write a clean version.

## Next session
Session 0.3, Loop Dry Run.

## Session-specific reflection
The PRD is clear to me — I understand it's the what and why, and I can tell when it's good. The Tech Design and the ADR are different. I understood their purpose in the abstract, but in the moment, the Tech Design just read as technical stuff placed in front of me — I didn't know what the content actually meant, and that made me tune out and get distracted faster than I expected. I was starting cold, with no sense of what "good" looks like for these two artifacts specifically, unlike the PRD where I already had a feel for it.

The ADR was harder in a different way: not just unfamiliar content, but not knowing the universe of what should or shouldn't be included. Writing the PRD, I know what I want. Writing the ADR, I had to imagine alternatives I never seriously considered because I'd already decided — that's a different mental motion, and I don't yet have a sense of what's thorough versus what's missing.

The real gap isn't understanding why these documents matter — I get that. It's bridging from "I understand the purpose" to "I know what good content looks like and can produce it with less help." That's especially true if I want this to hold up in a job context, where I'll need to know what belongs in a Tech Design or ADR without someone walking me through it each time. For now, I expect I'll need heavy Claude assistance on Tech Design and ADR content specifically, while the PRD is something I can already drive mostly on my own. Building the habit of always starting from a PRD, then leaning on help for the other two, is the workflow I need going into Project 1.

## Terms I got stuck on
- PRD (Product Requirements Doc) vs. Tech Design Doc vs. ADR — the PRD covers what's being built and why, no code. The Tech Design Doc covers how it's being built — stack, schema, routes. The ADR (Architecture Decision Record) documents one specific decision in four short sections: Context, Decision, Alternatives, Consequences.
- ADR specifically — I understood the format but not how to generate real content for Alternatives and Consequences from scratch.

## Session 0.3 Debrief — Comments Feature (Dry Run)
Date: July 15-16, 2026 (spanned two days, two chat windows)
Final commit: 98415cf

### What shipped
Full dual-loop dry run on a throwaway "comments" feature in playground,
across five build tasks plus a sixth verification task:

- Task 1: Local setup (Supabase JS, Tailwind v4, shadcn/ui, gitignored
  env files), a real Supabase project, a real Google Cloud OAuth app
  under the parchmount.com org, verified end-to-end via an actual curl
  call against the REST endpoint.
- Task 2: DB schema (users mirroring auth.users, comments), RLS
  policies, an is_admin() helper, an anti-edit trigger enforcing the
  no-editing non-goal at the database layer. Verified by deliberately
  querying as anonymous and confirming a real 42501 block, not just a
  clean exit code.
- Task 3: Real Google OAuth sign-in end-to-end — browser/server
  Supabase clients, proxy.ts, sign-in/out actions, callback route,
  CommentSignInGate. Tested with an actual sign-in, not just code
  review.
- Task 4: API routes (GET/POST/DELETE) with server-side depth-3
  resolution (lib/comments.ts), closing off a client-side bypass. Found
  and fixed a real bug: RLS existed but the table-level GRANT to
  authenticated was missing — diagnosed via logging, fixed via a new
  migration (not editing the applied one), reverified by rerunning the
  actual test script rather than accepting "fixed."
- Task 5: UI components (form, recursive CommentNode, CommentThread)
  wired into page.tsx. A visual nesting bug took two rounds of
  pushback to actually fix.
- Task 6: Manual verification of four permission paths — non-admin
  cross-user delete blocked (403), unauthenticated access blocked
  (401), admin cross-user delete allowed, own-comment delete allowed.
- Post-Task-6: Oversight Checklist pass (Design Sanity + Code Hygiene),
  which found and fixed real auth/admin-check duplication across 4
  call sites via a lib/auth.ts extraction. Build verified clean,
  committed and pushed to origin/main.

### What broke / what was confusing
The GRANT bug (Task 4) was the most significant real bug — a genuine
500 on first live POST, root-caused correctly as RLS-vs-GRANT being
separate permission layers, not a hypothetical exercise. The
nesting-indentation bug (Task 5) was caught by the user, not the
agent — the data was correct but visually unreadable, and it took two
rounds of pushback ("too modest") to get a real fix. During Task 6,
lost track of which browser window was signed in vs. out, causing a
few stray test comments — confusing in the moment, not a real bug.

### What Claude Code did brilliantly (heavily-RL'd capability)
Diagnosing the GRANT bug correctly and treating live migrations like
git history (append, never rewrite). Moving depth-resolution logic
server-side without being asked, closing a client-bypass vector
proactively. Being honest about its own verification limits ("I
haven't confirmed the OAuth handshake actually completes") rather than
overclaiming. In this session specifically: the Oversight Checklist
pass found real duplication, gave honest uncertain answers where
warranted, and self-corrected a labeling error rather than silently
complying with a wrong instruction.

### What Claude Code did badly (RL gap)
The real one: across tasks 1-5, Claude Code never once checked its own
work against Session 0.3's actual stated scope (task 1, optionally
task 2) until directly asked "why did you build it to scope creep?"
two days in. That's a real process failure, not a minor note — it
happened on the very first real working session, on exactly the
failure mode flagged as the core risk going in. This session's
standing instruction (state scope up front, check in after each task)
exists because of this.

### Oversight catches I'm proud of
Insisting on real verification-script output twice rather than
accepting "fixed" at face value — this is what caught the GRANT bug's
true state and confirmed the depth-cap logic actually worked. Refusing
to let "start on task 3" get sent before its prerequisite was actually
committed to disk. Pausing to ask whether the Google Cloud org should
be Parchmount's real org or separate, rather than clicking past an
identity/scope question. Explicitly checking for hidden cost before
proceeding on OAuth setup. In this session: stopping mid-refactor to
ask "what are we actually doing here" when a nice-to-have code cleanup
started to feel like unnecessary depth.

### One oversight I missed (caught in review)
Didn't initially question whether the Supabase client was typed —
assumed TypeScript was catching query errors when createBrowserClient/
createServerClient default to any without a generated Database type.
Claude Code caught this in the Oversight Checklist, not proactively.

### Terms I got stuck on
Reading vs. writing commands; Tailwind + shadcn/ui; Supabase anon/
service_role → publishable/secret key rename; OAuth redirect URI
exact-match; RLS vs. table-level GRANTs (the real bug); Postgres error
codes as signal; migrations as append-only; OAuth 2.0 vs. JWTs; the
two-hop OAuth callback chain (initially modeled incorrectly as "one
for sign-in, one for database writing" — corrected to both being
identity/session handoffs); what a .ts file actually is (asked plainly
after several had already been reviewed); what Postgres itself is
(asked late, after two tasks of working with RLS); MCP; /compact vs
/clear; terminal vs. Claude Code state confusion (twice, including
pasting an old screenshot from the wrong task).

### Session-specific reflection
"Today took way longer than expected. This is day three of the
syllabus. Previous days (0.1, 0.2) were individual parts — installation,
PRD/tech design practice. Today was the first soup-to-nuts loop: adding
a comment section with Google auth to the Hello World page.

What's working: I'm not just clicking through what the agent tells me
to do — I'm trying to actually understand what things mean before
approving them. Pasting a screenshot and getting told exactly what to
do next still feels a little unreal. I was intentional about applying
real rigor to this process rather than rushing.

What's hard: today made clear this isn't the 'built an app in three
hours' experience. One feature, with real security around it, done the
right way, takes real time. I'm not naturally that interested in the
subject matter itself, which affects engagement — but I remain
confident that understanding the fundamentals (even without needing to
write Python) matters for knowing what the agent is actually doing once
I'm running more automated loops later.

Six months out, I expect to mostly be doing the design work — PRDs,
collaborating with Claude on tech designs and ADRs — and to be
managing intention and activity rather than execution. That's probably
where I actually shine.

The hardest part right now is the terminal/nomenclature layer — all
the different terms for what I'm typing and why. Looking forward to
getting past that into the stuff I'm actually curious about, especially
adversarial agent testing (getting agents to test against each other) —
that feels like where the real leverage will be once things get more
automated."

### Next session
Proceeding directly to Session 1.1 (Thesis Tracker) — no Session 0.4
needed. Session 0.3's actual verification checklist (felt every step,
used both tools correctly, ran a real Oversight Checklist pass, caught
real issues) was clearly met. Deferred to Project 1: generated Supabase
types from the start (not retrofitted), and Playwright/Vitest test
infrastructure (Session 1.6). Standing process fix now in place: state
scope explicitly before building, check in task-by-task rather than
after the fact.
