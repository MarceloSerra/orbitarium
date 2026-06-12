# Git Conventions

## Commit Format

Conventional Commits with FAANG-style scoping:

```
<type>(<scope>): <description>
```

### Types

| Type | Use For |
|------|---------|
| `feat` | New features or functionality |
| `fix` | Bug fixes |
| `refactor` | Code restructuring without behavior change |
| `docs` | Documentation only changes |
| `chore` | Build processes, dependencies, tooling |
| `perf` | Performance improvements |
| `test` | Adding or modifying tests |
| `ci` | CI/CD configuration changes |

### Scopes

Use component or module names:

- `init` — project initialization, scaffolding
- `core` — core application logic
- `component/<name>` — specific UI components (Planet, Sun, InfoPanel)
- `data` — data layer, types, constants
- `texture` — texture management, fallback system
- `animation` — orbital animations, React Spring hooks
- `state` — Zustand store, global state
- `docs` — documentation structure
- `agents` — AI collaboration files

### Examples

```
feat(init): add orbit scaffolding
fix(component/planet): handle texture loading failure
refactor(data): normalize planet data interfaces
docs(adr): add hybrid scale decision record
chore(deps): update react-three-fiber to v6
perf(animation): optimize orbital calculation loop
test(state): add Zustand store tests
ci(workflow): add build and lint pipeline
```

## Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feat/<short-description>` | `feat/planet-textures` |
| Bug fix | `fix/<short-description>` | `fix/orbit-collision` |
| Documentation | `docs/<short-description>` | `docs/project-structure` |
| ADR/RFC | `<type>/<number>-<title>` | `adr/001-hybrid-scale` |

## Versioning

Semantic Versioning (SemVer): `MAJOR.MINOR.PATCH`

| Change Type | Bump |
|-------------|------|
| Incompatible API/architecture change | MAJOR |
| New feature/backward compatible | MINOR |
| Bug fix, documentation, chore | PATCH |

### Release Tags

```
v0.1.0 — initial release with core functionality
v0.2.0 — new planet interaction features
v0.2.1 — texture loading bug fix
```

Pre-release for experimental work: `v0.1.0-alpha`, `v0.1.0-beta`
