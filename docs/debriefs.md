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
