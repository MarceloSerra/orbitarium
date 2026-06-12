# 002 - Dual Texture System with Procedural Fallback

**Status**: Accepted  
**Date**: 2026-06-11  
**Decision**: Primary NASA textures with procedural shader fallback on failure

## Context
NASA texture URLs provide high-quality realistic planet surfaces, but:
- URLs may fail due to CORS restrictions, network issues, or URL changes
- External dependency creates reliability concerns
- Users should see a functional experience even without external textures

## Alternatives Considered
1. **Local textures only**: Bundled textures increase bundle size, lose realism
2. **Remote-only**: Risk of broken experience if URLs fail
3. **Dual system** (chosen): NASA primary + procedural fallback - best of both worlds

## Consequences
- `texture-manager.ts` handles loading with retry logic and timeout
- On failure, procedural shaders generate colors based on real planet data
- Fallback textures are less realistic but maintain functional experience
- Additional complexity in texture loading pipeline

## Implementation
- Primary: Load from NASA URLs (https://svs.gsfc.nasa.gov/)
- Retry: Attempt reload on failure with timeout
- Fallback: Procedural shader using planet's real color data
- Cache: Local `public/textures/` for successful loads
