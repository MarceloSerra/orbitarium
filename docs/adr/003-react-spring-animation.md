# 003 - React Spring for Orbital Animation

**Status**: Accepted  
**Date**: 2026-06-11  
**Decision**: Use React Spring for smooth orbital animation interpolation

## Context
Planets need continuous orbital motion with:
- Smooth interpolation between positions
- Proportional speeds (Mercury fast, Neptune slow)
- Pause/resume capability via UI controls

## Alternatives Considered
1. **requestAnimationFrame manual loop**: More control but more boilerplate, harder to pause/resume cleanly
2. **CSS animations**: Not suitable for 3D orbital calculations
3. **React Spring** (chosen): Declarative spring physics, built-in pause/resume, integrates with R3F

## Consequences
- `use-orbit` hook encapsulates animation logic
- React Spring handles interpolation and timing
- Orbit speeds are proportional to real orbital periods
- Pause/resume controlled via Zustand store (`orbitSpeed`)

## Implementation
- Custom hook returns animated orbit angle
- Each planet uses its orbital period to calculate speed multiplier
- Centralized pause/resume through global state
