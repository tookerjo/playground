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
