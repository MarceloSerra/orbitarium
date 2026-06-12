# AGENTS.md

## AI Collaboration Guidelines for Orbitarium

### Context
Orbitarium is a 3D interactive solar system explorer built with React Three Fiber, Zustand, and Framer Motion. This document guides AI agents contributing to the project.

### Documentation Structure

| Path | Purpose | When to Update |
|------|---------|----------------|
| `ai/current-state.md` | Progress tracking (done/in progress/pending) | After any significant change |
| `ai/tasks.md` | Action items with priority and ownership | When adding or completing tasks |
| `ai/known-issues.md` | Bugs, edge cases, technical debt | When discovering issues |
| `ai/handoff.md` | Context for next contributor | Before ending a session |
| `docs/architecture.md` | System-wide design truth | When architecture changes |
| `docs/adr/` | Architecture decisions with rationale | When making architectural decisions |
| `docs/rfc/` | Proposals needing discussion | When proposing new approaches |
| `docs/superpowers/specs/` | Implementation specifications | Before implementation starts |

### Rules

1. **Read before writing** — Check `ai/current-state.md` and existing docs before starting work
2. **Update state after changes** — Modify `ai/current-state.md` when completing tasks
3. **Document decisions** — Architectural decisions become ADRs, not inline comments
4. **Track issues immediately** — Add to `ai/known-issues.md` when discovered, not later
5. **Handoff context** — Update `ai/handoff.md` before ending a session

### Development Strategy

**Subagent-Driven Development:** Tasks are dispatched to fresh subagents per plan step, with review checkpoints between each. This ensures focused context, atomic commits, and quality gates.

**Lifecycle:** Brainstorming → Spec Writing → Implementation Plan → Subagent Execution → Verification

1. **Brainstorming** — Explore requirements, propose approaches, validate design
2. **Spec Writing** — Save validated spec to `docs/superpowers/specs/`
3. **Implementation Plan** — Bite-sized tasks with exact code, saved to `docs/superpowers/plans/`
4. **Subagent Execution** — Fresh subagent per task, review between tasks, frequent commits
5. **Verification** — Run tests/lint before claiming completion

### Workflow

1. Read `ai/current-state.md` for current progress
2. Check `ai/tasks.md` for pending work
3. Review relevant specs in `docs/superpowers/specs/`
4. Implement following the spec and architecture docs
5. Update documentation after changes
6. Run verification before claiming completion

### Tech Stack Reference

- Vite + TypeScript (build)
- React 18+ (UI framework)
- React Three Fiber (@react-three/fiber, @react-three/drei) (3D rendering)
- React Spring (@react-spring/three) (orbital animations)
- Zustand (global state)
- Framer Motion (UI animations)
