# Architecture

## System Overview

Orbitarium is a 3D interactive solar system explorer built with React Three Fiber. The architecture separates concerns into three layers: data, rendering, and interaction.

## Layers

### Data Layer
- **Planet data** (`src/data/planets.ts`): Real astronomical data with hybrid scaling constants
- **Type definitions** (`src/types/planet.ts`): Interfaces for PlanetData, OrbitConfig, CelestialInfo
- **Texture management** (`src/textures/texture-manager.ts`): NASA URL loading with procedural fallback

### Rendering Layer
- **SolarSystem** (`src/components/SolarSystem.tsx`): Root scene component (Sun + planets + orbits)
- **Planet** (`src/components/Planet.tsx`): Reusable planet component with texture, rings, axial rotation
- **Sun** (`src/components/Sun.tsx`): Custom glow/corona shader with central point light
- **OrbitPath** (`src/components/OrbitPath.tsx`): Visible orbital radius lines
- **SpaceBackground** (`src/components/SpaceBackground.tsx`): Black background + Stars from drei + galaxy particles

### Interaction Layer
- **InfoPanel** (`src/ui/InfoPanel.tsx`): Animated drawer with planet details (Framer Motion)
- **OrbitControls** (`src/ui/OrbitControls.tsx`): Camera controls (rotate, zoom, pan)
- **use-orbit hook** (`src/hooks/use-orbit.ts`): Orbital animation with React Spring

### State Management
- **Zustand store**: Minimal global state
  - `selectedPlanet`: Currently selected planet or null
  - `orbitSpeed`: Animation speed multiplier
  - `setSelectedPlanet()`, `setOrbitSpeed()` actions

## Key Architectural Decisions

| Decision | Rationale | Reference |
|----------|-----------|------------|
| Hybrid scale | Real sizes compressed distances for visualization | Design spec |
| Dual textures | NASA primary with procedural fallback for reliability | Design spec |
| React Spring | Smooth interpolation for orbital animations | Design spec |
| Zustand | Minimal boilerplate for simple state needs | Design spec |

## Component Relationships

```
App
├── SolarSystem (R3F Canvas)
│   ├── Sun
│   ├── Planet × 8
│   │   └── OrbitPath (per planet)
│   └── SpaceBackground
├── InfoPanel (conditional, based on selectedPlanet)
└── OrbitControls (always visible)
```
