# Orbitarium v2 — Solar System Simulator Spec

## Overview

Transform the current flat-colored placeholder into a cinematic 3D solar system simulator with realistic visuals, physics-based orbital mechanics, and interactive controls. Target aesthetic: **Space Engine** quality — deep space atmosphere, textured planets, bloom/glow effects, smooth camera transitions.

---

## Section 1: Visual Overhaul

### 1.1 Background & Star Field

**Current:** White background (no CSS), basic `<Stars>` from drei with uniform color.

**Target:**
- Deep black/dark navy background (`#000000` or `#050508`) via global CSS reset on body/html
- Enhanced star field: 30,000+ stars with color temperature variation (warm white to blue-white), varying brightness, some twinkling
- Optional distant nebula effect via shader-based background gradient (subtle purple/blue gradients in dark regions)
- Distant galaxy clusters as small colored dots for depth

**Implementation:**
- Create `src/styles/global.css` — reset margins, set body background, overflow hidden
- Replace drei `<Stars>` with custom shader-based star field component (`StarField.tsx`) using point cloud + vertex colors
- Add optional nebula background plane with procedural noise texture

### 1.2 Planet Textures & Materials

**Current:** Flat fallbackColor spheres, texture-manager exists but never imported.

**Target:**
- Load NASA Blue Marble textures for each planet (high-res where available)
- Procedural fallback per planet type: rocky (noise-based), gas giant (banded stripes), ice giant (smooth gradient with haze)
- Proper material properties: roughness, metalness mapped per planet type
- Earth: specular water map + cloud layer overlay

**Implementation:**
- Wire `texture-manager.ts` into Planet component — load texture on mount, show fallback color during loading
- Enhance procedural fallbacks in texture-manager with proper noise patterns (Simplex/Perlin via `simplex-noise` package)
- Add material props: roughness (0.8 for rocky, 0.4 for gas giants), metalness (0.1 for most)

### 1.3 Atmospheric Effects

**Current:** None — planets are hard spheres.

**Target:**
- Atmospheric glow/halo ring around Earth, Venus, Mars, Jupiter via custom shader
- Subtle rim lighting effect on all planets (fresnel-based edge highlight toward sun)
- Cloud layer for Earth (semi-transparent sphere slightly larger than base)

**Implementation:**
- Create `Atmosphere.tsx` component with custom GLSL shader: fresnel-based rim glow, configurable color/thickness
- Wrap eligible planets in atmosphere wrapper
- Earth gets additional cloud mesh layer

### 1.4 Sun Rendering

**Current:** Static emissive sphere, no glow, no corona.

**Target:**
- Dynamic sun surface texture (procedural noise animation)
- Corona/bloom effect via post-processing bloom pass
- Subtle pulsing emissive intensity for "alive" feel

**Implementation:**
- Replace static material with animated procedural texture in `Sun.tsx` component
- Add UnrealBloomPass to EffectComposer for sun glow bleed

### 1.5 Post-Processing

**Current:** None.

**Target:**
- Bloom pass (UnrealBloomPass) — threshold ~0.8, strength ~0.4, soft glow on bright objects
- Tone mapping (ACES Filmic) for cinematic color response
- Subtle vignette effect at screen edges

**Implementation:**
- Add `<EffectComposer>` with UnrealBloomPass + ToneMapping in App.tsx Canvas wrapper
- Configure bloom: threshold 0.8, strength 0.4, radius 1.5

---

## Section 2: Physics Engine — Gravitational Orbits

### 2.1 Core Mechanics

**Current:** Pre-baked circular orbits with fixed speed multiplier. No gravitational calculation.

**Target:** First-principles orbital mechanics using Newtonian gravity:
- Force: `F = G * (m₁ * m₂) / r²` — direction toward sun center
- Velocity integration: Velocity Verlet method (symplectic, energy-conserving)
- Position update: `x(t+dt) = x(t) + v(t)*dt + 0.5*a(t)*dt²`
- Velocity update: `v(t+dt) = v(t) + 0.5*(a(t) + a(t+dt))*dt`

**Implementation:**
- Create `src/physics/orbital-engine.ts`:
  - Constants: gravitational parameter μ for sun (GM ≈ 1.327×10¹¹ km²/s², scaled to simulation units)
  - Initial velocity calculation from orbital radius: `v = sqrt(GM/r)` for circular orbits
  - Per-planet state: position Vector3, velocity Vector3, mass
  - Step function: given dt, compute acceleration → update velocity → update position
  - Return updated position + velocity

### 2.2 Orbital Parameters

| Planet | Semi-major axis (scaled) | Initial velocity direction | Eccentricity |
|--------|--------------------------|----------------------------|--------------|
| Mercury | 6.0 | tangential, prograde | 0.14 (slight elliptical) |
| Venus | 8.5 | tangential, prograde | 0.01 (near circular) |
| Earth | 10.0 | tangential, prograde | 0.02 (near circular) |
| Mars | 13.0 | tangential, prograde | 0.09 (slight elliptical) |
| Jupiter | 25.0 | tangential, prograde | 0.05 |
| Saturn | 38.0 | tangential, prograde | 0.06 |
| Uranus | 55.0 | tangential, prograde | 0.05 |
| Neptune | 72.0 | tangential, prograde | 0.01 |

**Note:** Scaled distances use logarithmic compression to maintain visual separation while keeping outer planets visible in same frame. Eccentricity applied via initial velocity perturbation (not full elliptical orbit calculation — simplified for performance).

### 2.3 Integration with React Three Fiber

- Physics state stored in Zustand store (`usePhysicsStore`)
- Each planet component reads its current position from physics engine each frame
- `useFrame` hook calls `physicsEngine.step(dt)` once per frame, distributes positions to planets
- Simulation time multiplier exposed via UI control (0.1x to 100x)

---

## Section 3: Controls & Dashboard

### 3.1 Simulation Speed Control

**UI:** Slider component in bottom-left corner panel.
- Range: 0.1x (slow motion) → 1.0x (real-time) → 10x → 50x → 100x (fast forward)
- Pause button (0x speed)
- Display current multiplier value

**Implementation:**
- `useStore` adds `simulationSpeed` state (default: 1.0)
- Slider maps to log scale for intuitive control
- Physics engine multiplies dt by simulationSpeed each step

### 3.2 Viewing Mode Toggle

**Modes:**
- **Heliocentric** (default): Camera orbits around sun, free OrbitControls
- **Earth-centric**: Camera locked relative to Earth's position, shows inner planets orbiting Earth perspective
- **Free fly**: No constraints, WASD/arrow key movement + mouse look

**Implementation:**
- `useStore` adds `viewMode: 'helio' | 'earth' | 'free'` state
- Mode switch triggers smooth camera transition (lerp over 1-2 seconds)
- Earth-centric mode: camera target = earth position, OrbitControls enabled around that point

### 3.3 Real-time Data Dashboard

**UI:** Collapsible panel showing selected planet's live data:
- Distance from Sun (current orbital radius in scaled km)
- Orbital velocity (magnitude of velocity vector)
- Orbital period elapsed / total
- Surface temperature (from data layer)
- Mass, diameter reference values

**Implementation:**
- Extend InfoPanel component to show real-time physics data
- Data updates each frame from physics engine state
- Format numbers with appropriate units and significant figures

### 3.4 Planet Selection & Camera Focus

**Interaction:** Click planet → camera smoothly transitions to focus on that planet.
- Zoom distance: planet radius * 5 (close enough to see surface detail)
- OrbitControls re-center on selected planet
- Double-click or ESC returns to heliocentric view

**Implementation:**
- `useStore` adds `cameraTarget: Vector3 | null`, `cameraFocusDistance` state
- Camera transition uses lerp animation in useFrame (0.1 smoothing factor per frame)
- OrbitControls target updated dynamically

---

## Section 4: Architecture & File Structure

### Target Structure

```
src/
├── main.tsx                    # Entry point (unchanged)
├── App.tsx                     # Root: Canvas + EffectComposer + Controls UI
├── store.ts                    # Zustand stores (UI state + physics state)
├── styles/
│   └── global.css              # CSS reset, background, typography
├── types/
│   ├── planet.ts               # PlanetData, OrbitConfig interfaces
│   └── physics.ts              # PhysicsState, OrbitalBody interfaces
├── data/
│   └── planets.ts              # Planet constants (mass, radius, distance, texture URL)
├── physics/
│   ├── orbital-engine.ts        # Core gravitational simulation engine
│   └── initial-conditions.ts    # Initial velocity/direction calculations
├── textures/
│   ├── texture-manager.ts       # NASA loader + procedural fallback (enhanced)
│   └── procedural-textures.ts   # Noise-based texture generators per planet type
├── components/
│   ├── Sun.tsx                  # Animated sun with corona effect
│   ├── Planet.tsx               # Individual planet mesh + atmosphere wrapper
│   ├── Atmosphere.tsx           # GLSL atmospheric glow shader
│   ├── StarField.tsx            # Shader-based star field with color variation
│   ├── SolarSystem.tsx          # Scene composition: stars, sun, planets
│   ├── InfoPanel.tsx             # Extended with real-time physics data
│   ├── ControlPanel.tsx         # Speed slider, view mode toggle, pause
│   └── index.ts                 # Barrel exports
└── hooks/
    ├── usePhysics.ts            # Hook to connect physics engine to render loop
    └── useCameraTransition.ts   # Smooth camera movement hook
```

### New Dependencies

| Package | Purpose |
|---------|---------|
| `@react-three/postprocessing` | Bloom, tone mapping, vignette effects |
| `simplex-noise` | Procedural texture generation for fallbacks |
| `maath` | Vector math utilities (already transitive via R3F) |

---

## Section 5: Implementation Order

1. **Global CSS + Background** — Fix white background, add proper reset
2. **Physics Engine Core** — Orbital mechanics calculation (unit-tested independently)
3. **Store Integration** — Wire physics state into Zustand, connect to render loop
4. **Planet Component Rewrite** — Use physics positions, load textures, add atmosphere
5. **Sun Component** — Animated surface + bloom effect
6. **Star Field Enhancement** — Color variation, increased density
7. **Post-Processing Pipeline** — Bloom, tone mapping in Canvas
8. **Control Panel UI** — Speed slider, view modes, pause/resume
9. **Camera Transitions** — Smooth focus on selected planets
10. **Dashboard Integration** — Real-time physics data display

---

## Constraints & Trade-offs

- **Performance:** Physics simulation runs at 60fps; if frame rate drops, reduce star count or simplify atmosphere shaders
- **Scale vs Visibility:** Logarithmic distance compression balances realism with usability — outer planets remain visible without extreme zooming
- **Texture Loading:** Async loading means brief fallback color display during load; no skeleton/placeholder needed given fast CDN responses
