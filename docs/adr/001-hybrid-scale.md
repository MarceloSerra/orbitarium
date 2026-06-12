# 001 - Hybrid Scale for Planet Sizes and Distances

**Status**: Accepted  
**Date**: 2026-06-11  
**Decision**: Use proportional real sizes with compressed distances for visualization

## Context
Real solar system scales make visualization impractical:
- Jupiter's radius is ~11x Earth's, but at real distances, planets would be invisible dots
- Using true AU distances requires extreme zooming to see multiple planets

## Alternatives Considered
1. **True scale**: Real sizes and distances - unusable for interaction
2. **Uniform compression**: Same scale for sizes and distances - loses visual distinction between planet types
3. **Hybrid scale** (chosen): Proportional real sizes + compressed distances - balances realism with usability

## Consequences
- Planet sizes maintain relative proportions (Jupiter >> Earth >> Mars)
- Distances are compressed to keep all planets visible without extreme zooming
- `scaledRadius` and `scaledDistance` constants in `data/planets.ts` document the transformation
- Users see a visually coherent system that doesn't match real astronomical ratios

## Implementation
Each planet data entry includes:
- Real values (mass, radius, distance) for informational display
- Scaled values (`scaledRadius`, `scaledDistance`) for rendering
