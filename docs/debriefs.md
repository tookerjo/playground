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
