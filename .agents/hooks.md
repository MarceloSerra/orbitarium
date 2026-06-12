# Agent Hooks

Lifecycle triggers for AI agents. Execute at the specified moments.

## Pre-Session

Before starting work:

1. Read `ai/current-state.md` — understand what's been done
2. Check `ai/tasks.md` — identify pending work and priorities
3. Review relevant specs in `docs/superpowers/specs/`
4. Check `ai/known-issues.md` — avoid known pitfalls

## Post-Change

After implementing a feature or fix:

1. Update `ai/current-state.md` — mark completed, note what's next
2. Close tasks in `ai/tasks.md` — move to completed section
3. Run verification — tests, linting, typecheck
4. Commit with conventional commit message
5. Update `CHANGELOG.md` if user-facing change

## Pre-Commit

Before creating a commit:

1. Verify the change matches its spec
2. Ensure no secrets or credentials are included
3. Confirm documentation is updated (current-state, tasks)
4. Check changelog entry exists for user-facing changes

## Post-Session

Before ending work:

1. Update `ai/handoff.md` — summarize what was done and what's pending
2. Document any blockers or decisions needed from humans
3. Note any issues discovered during work (`ai/known-issues.md`)
4. Leave the project in a working state or document why it isn't

## On Error

When encountering unexpected behavior:

1. Add to `ai/known-issues.md` immediately
2. Don't silently ignore — document the failure mode
3. If blocking progress, note in handoff and stop
