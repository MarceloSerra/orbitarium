# Agent Rules

Hard constraints for AI agents contributing to Orbitarium. These are enforceable, not suggestions.

## Documentation

- **Update `ai/current-state.md`** after any significant change (feature complete, bug fix, refactor)
- **Close tasks in `ai/tasks.md`** when complete, move to current-state
- **Add issues immediately** — don't wait, add to `ai/known-issues.md` when discovered
- **Create ADRs for architectural decisions** — not inline comments, proper `docs/adr/` entries
- **Use RFCs for proposals needing discussion** — `docs/rfc/` before implementing uncertain approaches

## Code

- **Read existing code before writing** — follow established patterns and conventions
- **Follow the spec** — implementation must match `docs/superpowers/specs/` documents
- **Match architecture docs** — don't deviate from `docs/architecture.md` without an ADR
- **Type safety** — no `any`, proper TypeScript interfaces, strict mode
- **No secrets in code** — never commit API keys, tokens, credentials

## Commits

- **Conventional commits required** — format: `<type>(<scope>): <description>`
- **Atomic commits** — one logical change per commit
- **Descriptive messages** — explain why, not just what
- **No partial implementations** — commit working code or don't commit

## Verification

- **Run tests before claiming completion** — verify changes work
- **Check linting** — run typecheck/lint after code changes
- **Update changelog** — document user-facing changes in `CHANGELOG.md`

## Handoff

- **Update `ai/handoff.md`** before ending a session
- **Leave context for next agent** — what was done, what's pending, known blockers
- **Don't leave broken state** — either complete the task or document why it can't be completed
