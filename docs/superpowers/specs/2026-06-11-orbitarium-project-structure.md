# Orbitarium Project Structure Design

## Overview

Documentation structure for AI-human collaborative development of Orbitarium, a 3D interactive solar system explorer.

## Structure

```
orbitarium/
├── docs/
│   ├── architecture.md         # Single source of truth for system design
│   ├── adr/                    # Architecture Decision Records (numbered)
│   │   └── 001-*.md            # Decisions with rationale
│   ├── rfc/                    # Requests for Comments (proposals)
│   │   └── 001-*.md            # Pre-implementation proposals
│   └── superpowers/
│       └── specs/              # Implementation specs
├── ai/
│   ├── current-state.md        # What's done, what's in progress
│   ├── tasks.md                # Action items with status and owners
│   ├── known-issues.md         # Bugs, edge cases, technical debt
│   └── handoff.md              # Context for agent/human transitions
├── src/                        # Source code
└── public/                     # Static assets
```

## Principles

### AI Folder (Collaboration Layer)
- **Lightweight** - frequently updated, low ceremony
- **Single files** - easier to maintain than dated entries
- **Current-state** - what's implemented vs planned
- **Tasks** - actionable items with priority and ownership
- **Known-issues** - bugs, edge cases, technical debt tracking
- **Handoff** - context for next agent/human working on the project

### Docs Folder (Reference Layer)
- **Architecture.md** - single source of truth for system design
- **ADR** - decisions with rationale, numbered sequentially
- **RFC** - proposals requiring discussion before implementation
- **Specs** - detailed implementation specifications

## When to Use Each

| Situation | Document | Action |
|-----------|----------|--------|
| Making an architectural decision | ADR | Write rationale, alternatives considered |
| Proposing a new feature/approach | RFC | Draft proposal, gather feedback |
| Starting implementation | Spec | Detailed requirements and design |
| Tracking progress | ai/current-state.md | Update status |
| Adding a task | ai/tasks.md | Add with priority and owner |
| Discovering an issue | ai/known-issues.md | Document bug or edge case |
| Handing off work | ai/handoff.md | Context for next contributor |

## ADR Format

```markdown
# [Number] - Title

**Status**: Proposed | Accepted | Deprecated | Superseded
**Date**: YYYY-MM-DD
**Decision**: Summary of the decision
**Context**: Why this decision was needed
**Alternatives Considered**: Options evaluated
**Consequences**: Impact of the decision
```

## RFC Format

```markdown
# [Number] - Title

**Status**: Draft | Accepted | Rejected | Superseded
**Author**: Name/Agent
**Problem**: What problem this solves
**Proposal**: How we solve it
**Alternatives**: Other approaches considered
**Implementation Plan**: Steps to implement
```

## Maintenance

- Update `ai/current-state.md` after each significant change
- Close tasks in `ai/tasks.md` when complete, move to current-state
- Add issues as they're discovered, not later
- Create ADRs for decisions that affect architecture
- Use RFCs only when multiple approaches are viable and need discussion
