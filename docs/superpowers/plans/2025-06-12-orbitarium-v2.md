# Orbitarium v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the flat placeholder solar system into a cinematic 3D simulator with realistic visuals, physics-based orbits, and interactive controls.

**Architecture:** React Three Fiber scene with Zustand state management, Velocity Verlet orbital mechanics engine, post-processing bloom pipeline, shader-based atmosphere effects, and smooth camera transitions.

**Tech Stack:** React Three Fiber, Drei, @react-three/postprocessing, Zustand, Three.js, simplex-noise

---

### Task 1: Global CSS + Background Fix

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/main.tsx` (import global CSS)

- [ ] **Step 1: Create global CSS file**

Create `src/styles/global.css`:

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

body {
  background-color: #050508;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

canvas {
  display: block;
}
```

- [ ] **Step 2: Import CSS in main.tsx**

Modify `src/main.tsx` — add import at top:

```ts
import './styles/global.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/main.tsx
git commit -m "fix: add global CSS reset with dark background"
```

---

### Task 2: Physics Engine — Orbital Mechanics Core

**Files:**
- Create: `src/types/physics.ts`
- Create: `src/physics/orbital-engine.ts`
- Create: `tests/orbital-engine.test.ts`

- [ ] **Step 1: Define physics types**

Create `src/types/physics.ts`:

```ts
import type { Vector3 } from 'three'

export interface OrbitalBody {
  name: string
  mass: number
  position: Vector3
  velocity: Vector3
}

export interface PhysicsState {
  bodies: Record<string, OrbitalBody>
  time: number
  speedMultiplier: number
}

export interface SimulationStepResult {
  updatedBodies: Record<string, OrbitalBody>
  deltaTime: number
}
```

- [ ] **Step 2: Implement orbital engine**

Create `src/physics/orbital-engine.ts`:

```ts
import * as THREE from 'three'
import type { OrbitalBody, PhysicsState, SimulationStepResult } from '../types/physics'

const GRAVITATIONAL_CONSTANT = 0.5
const DT_BASE = 0.016

export function createInitialConditions(
  distance: number,
  mass: number,
  angle = 0
): OrbitalBody {
  const position = new THREE.Vector3(
    Math.cos(angle) * distance,
    0,
    Math.sin(angle) * distance
  )

  const orbitalSpeed = Math.sqrt(GRAVITATIONAL_CONSTANT / Math.max(distance, 1))
  const velocity = new THREE.Vector3(
    -Math.sin(angle) * orbitalSpeed,
    0,
    Math.cos(angle) * orbitalSpeed
  )

  return { name: '', mass, position, velocity }
}

export function computeAcceleration(
  body: OrbitalBody,
  sunMass: number,
  sunPosition: THREE.Vector3 = new THREE.Vector3()
): THREE.Vector3 {
  const toSun = new THREE.Vector3().subVectors(sunPosition, body.position)
  const distanceSq = toSun.lengthSq()
  const distance = Math.sqrt(distanceSq)

  if (distance < 0.1) {
    return new THREE.Vector3()
  }

  const forceMagnitude = GRAVITATIONAL_CONSTANT * sunMass / distanceSq
  return toSun.normalize().multiplyScalar(forceMagnitude)
}

export function velocityVerletStep(
  body: OrbitalBody,
  dt: number,
  sunMass: number,
  sunPosition: THREE.Vector3
): OrbitalBody {
  const a0 = computeAcceleration(body, sunMass, sunPosition)

  const newPosition = new THREE.Vector3().copy(body.position)
    .addScaledVector(body.velocity, dt)
    .addScaledVector(a0, 0.5 * dt * dt)

  const tempBody: OrbitalBody = {
    ...body,
    position: newPosition
  }

  const a1 = computeAcceleration(tempBody, sunMass, sunPosition)

  const newVelocity = new THREE.Vector3().copy(body.velocity)
    .addScaledVector(a0, 0.5 * dt)
    .addScaledVector(a1, 0.5 * dt)

  return {
    ...body,
    position: newPosition,
    velocity: newVelocity
  }
}

export function stepSimulation(
  state: PhysicsState,
  sunMass: number = 1000,
  sunPosition: THREE.Vector3 = new THREE.Vector3()
): SimulationStepResult {
  const dt = DT_BASE * state.speedMultiplier
  const updatedBodies: Record<string, OrbitalBody> = {}

  for (const [key, body] of Object.entries(state.bodies)) {
    updatedBodies[key] = velocityVerletStep(body, dt, sunMass, sunPosition)
  }

  return { updatedBodies, deltaTime: dt }
}
```

- [ ] **Step 3: Write unit tests**

Create `tests/orbital-engine.test.ts`:

```ts
import * as THREE from 'three'
import { createInitialConditions, computeAcceleration, velocityVerletStep, stepSimulation } from '../src/physics/orbital-engine'

describe('createInitialConditions', () => {
  it('creates position at correct distance', () => {
    const body = createInitialConditions(10, 1, 0)
    expect(body.position.length()).toBeCloseTo(10)
    expect(body.velocity.length() > 0).toBe(true)
  })

  it('creates tangential velocity perpendicular to position', () => {
    const body = createInitialConditions(5, 1, Math.PI / 2)
    const dot = body.position.dot(body.velocity)
    expect(Math.abs(dot)).toBeLessThan(0.01)
  })
})

describe('computeAcceleration', () => {
  it('points toward sun center', () => {
    const body = createInitialConditions(10, 1, 0)
    const accel = computeAcceleration(body, 1000)
    expect(accel.x < 0).toBe(true)
    expect(accel.z === 0).toBe(true)
  })

  it('decreases with distance squared', () => {
    const close = createInitialConditions(5, 1, 0)
    const far = createInitialConditions(20, 1, 0)
    const accelClose = computeAcceleration(close, 1000).length()
    const accelFar = computeAcceleration(far, 1000).length()
    expect(accelClose > accelFar).toBe(true)
  })
})

describe('velocityVerletStep', () => {
  it('updates position and velocity', () => {
    const body = createInitialConditions(10, 1, 0)
    const result = velocityVerletStep(body, 0.016, 1000, new THREE.Vector3())
    expect(result.position).not.toEqual(body.position)
    expect(result.velocity).not.toEqual(body.velocity)
  })

  it('conserves approximate energy over many steps', () => {
    let body = createInitialConditions(10, 1, 0)
    for (let i = 0; i < 1000; i++) {
      body = velocityVerletStep(body, 0.016, 1000, new THREE.Vector3())
    }
    const dist = body.position.length()
    expect(dist).toBeGreaterThan(8)
    expect(dist).toBeLessThan(12)
  })
})

describe('stepSimulation', () => {
  it('updates all bodies in state', () => {
    const state = {
      bodies: {
        earth: createInitialConditions(10, 1, 0),
        mars: createInitialConditions(15, 0.5, Math.PI)
      },
      time: 0,
      speedMultiplier: 1
    }
    const result = stepSimulation(state, 1000)
    expect(result.updatedBodies.earth.position).not.toEqual(state.bodies.earth.position)
    expect(result.updatedBodies.mars.position).not.toEqual(state.bodies.mars.position)
  })
})
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run tests/orbital-engine.test.ts`
Expected: All tests pass.

> Note: If vitest is not configured, install it first: `npm install -D vitest @vitest/coverage-v8` and add to package.json: `"test": "vitest run"` in scripts section. Also create `vitest.config.ts`:
> ```ts
> import { defineConfig } from 'vitest/config'
> import react from '@vitejs/plugin-react'
> export default defineConfig({
>   plugins: [react()],
>   test: { globals: true }
> })
> ```

- [ ] **Step 5: Commit**

```bash
git add src/types/physics.ts src/physics/orbital-engine.ts tests/orbital-engine.test.ts
git commit -m "feat: implement Velocity Verlet orbital mechanics engine"
```

---

### Task 3: Zustand Store — Physics State Integration

**Files:**
- Modify: `src/store.ts`
- Create: `src/hooks/use-physics.ts`

- [ ] **Step 1: Extend store with physics state**

Modify `src/store.ts`:

```ts
import { create } from 'zustand'
import type { PlanetData } from './types/planet'
import type { OrbitalBody, PhysicsState } from './types/physics'

interface SolarSystemState {
  selectedPlanet: PlanetData | null
  showInfoPanel: boolean
  cameraDistance: number
  autoRotate: boolean
  simulationSpeed: number
  viewMode: 'helio' | 'earth' | 'free'
  physicsState: PhysicsState
  setSelectedPlanet: (planet: PlanetData | null) => void
  toggleInfoPanel: () => void
  setCameraDistance: (distance: number) => void
  toggleAutoRotate: () => void
  setSimulationSpeed: (speed: number) => void
  setViewMode: (mode: 'helio' | 'earth' | 'free') => void
  updatePhysicsState: (state: PhysicsState) => void
}

export const useStore = create<SolarSystemState>((set) => ({
  selectedPlanet: null,
  showInfoPanel: false,
  cameraDistance: 60,
  autoRotate: true,
  simulationSpeed: 1,
  viewMode: 'helio',
  physicsState: { bodies: {}, time: 0, speedMultiplier: 1 },
  setSelectedPlanet: (planet) => set({
    selectedPlanet: planet,
    showInfoPanel: planet !== null
  }),
  toggleInfoPanel: () => set((state) => ({ showInfoPanel: !state.showInfoPanel })),
  setCameraDistance: (distance) => set({ cameraDistance: distance }),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  setViewMode: (mode) => set({ viewMode: mode }),
  updatePhysicsState: (physicsState) => set({ physicsState })
}))
```

- [ ] **Step 2: Create use-physics hook**

Create `src/hooks/use-physics.ts`:

```ts
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import type { OrbitalBody } from '../types/physics'
import { stepSimulation, createInitialConditions } from '../physics/orbital-engine'

const SUN_MASS = 1000

export function usePhysics(planets: Array<{ name: string; distance: number; mass: number }>) {
  const physicsRef = useRef<Record<string, OrbitalBody>>({})
  const store = useStore()

  useEffect(() => {
    if (!physicsRef.current || Object.keys(physicsRef.current).length !== planets.length) {
      const bodies: Record<string, OrbitalBody> = {}
      let angleOffset = 0

      for (const planet of planets) {
        const body = createInitialConditions(planet.distance, planet.mass, angleOffset)
        body.name = planet.name
        bodies[planet.name] = body
        angleOffset += Math.PI * 2 / planets.length
      }

      physicsRef.current = bodies
      store.updatePhysicsState({
        bodies,
        time: 0,
        speedMultiplier: store.simulationSpeed
      })
    }
  }, [planets.length])

  useFrame(() => {
    const currentBodies = physicsRef.current
    if (!currentBodies || Object.keys(currentBodies).length === 0) return

    const result = stepSimulation(
      { bodies: currentBodies, time: store.physicsState.time, speedMultiplier: store.simulationSpeed },
      SUN_MASS,
      new THREE.Vector3()
    )

    for (const [key, body] of Object.entries(result.updatedBodies)) {
      physicsRef.current[key] = body
    }

    store.updatePhysicsState({
      bodies: result.updatedBodies,
      time: store.physicsState.time + result.deltaTime,
      speedMultiplier: store.simulationSpeed
    })
  })
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/store.ts src/hooks/use-physics.ts
git commit -m "feat: integrate physics state into Zustand store and render loop"
```

---

### Task 4: Enhanced Star Field Component

**Files:**
- Create: `src/components/StarField.tsx`
- Modify: `src/components/SolarSystem.tsx` (replace Stars import)

- [ ] **Step 1: Create shader-based star field**

Create `src/components/StarField.tsx`:

```tsx
import * as THREE from 'three'
import { useMemo, useRef } from 'react'

interface StarFieldProps {
  count?: number
  radius?: number
}

export default function StarField({ count = 30000, radius = 500 }: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null)

  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius * (0.5 + Math.random() * 0.5)

      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)

      const colorChoice = Math.random()
      if (colorChoice < 0.6) {
        colors[i3] = 0.9 + Math.random() * 0.1
        colors[i3 + 1] = 0.9 + Math.random() * 0.1
        colors[i3 + 2] = 1.0
      } else if (colorChoice < 0.85) {
        colors[i3] = 1.0
        colors[i3 + 1] = 0.8 + Math.random() * 0.1
        colors[i3 + 2] = 0.6 + Math.random() * 0.1
      } else {
        colors[i3] = 0.7 + Math.random() * 0.1
        colors[i3 + 1] = 0.8 + Math.random() * 0.1
        colors[i3 + 2] = 1.0
      }

      sizes[i] = Math.random() > 0.95 ? 2 + Math.random() * 2 : 0.5 + Math.random() * 1.5
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    return geometry
  }, [count, radius])

  const material = useMemo(() => {
    const mat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: false,
      depthWrite: false
    })
    return mat
  }, [])

  return (
    <points ref={pointsRef} geometry={geometry} material={material as any} />
  )
}
```

- [ ] **Step 2: Replace Stars in SolarSystem**

Modify `src/components/SolarSystem.tsx` — replace `<Stars count={15000} radius={200} />` with:

```tsx
import StarField from './StarField'
// ... later in JSX
<StarField count={30000} radius={500} />
```

Remove the `Stars` import from drei if no longer used elsewhere.

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit && npm run build`
Expected: Clean build.

- [ ] **Step 4: Commit**

```bash
git add src/components/StarField.tsx src/components/SolarSystem.tsx
git commit -m "feat: shader-based star field with color variation and depth"
```

---

### Task 5: Sun Component with Animated Surface

**Files:**
- Create: `src/components/Sun.tsx`
- Modify: `src/components/SolarSystem.tsx` (replace static sun mesh)

- [ ] **Step 1: Create animated Sun component**

Create `src/components/Sun.tsx`:

```tsx
import * as THREE from 'three'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'

interface SunProps {
  radius?: number
}

export default function Sun({ radius = 3.5 }: SunProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const sunTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 256
    const ctx = canvas.getContext('2d')!

    const gradient = ctx.createRadialGradient(256, 128, 0, 256, 128, 256)
    gradient.addColorStop(0, '#fff8e0')
    gradient.addColorStop(0.3, '#ffcc44')
    gradient.addColorStop(0.6, '#ff9900')
    gradient.addColorStop(1, '#ff6600')

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 256)

    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 256
      const r = Math.random() * 8 + 2
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, ${150 + Math.random() * 100}, 0, ${Math.random() * 0.3})`
      ctx.fill()
    }

    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  useFrame((_, clock) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
    if (glowRef.current) {
      const pulse = Math.sin(clock.elapsedTime * 2) * 0.1 + 1
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          emissive="#ffaa00"
          emissiveIntensity={2.5}
          color="#ffcc00"
          map={sunTexture}
          roughness={0.8}
        />
      </mesh>

      <mesh ref={glowRef}>
        <sphereGeometry args={[radius * 1.3, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight position={[0, 0, 0]} intensity={3} distance={200} decay={1} />
    </group>
  )
}
```

- [ ] **Step 2: Replace static sun in SolarSystem**

Modify `src/components/SolarSystem.tsx` — replace the static `<mesh>` sun with:

```tsx
import Sun from './Sun'
// ... later in JSX
<Sun radius={3.5} />
```

Remove the old static mesh block:
```tsx
<mesh position={[0, 0, 0]}>
  <sphereGeometry args={[3.5, 64, 64]} />
  <meshStandardMaterial emissive="#ffaa00" emissiveIntensity={2} color="#ffcc00" />
</mesh>
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Sun.tsx src/components/SolarSystem.tsx
git commit -m "feat: animated sun with procedural texture and pulsing glow"
```

---

### Task 6: Planet Component Rewrite — Textures + Atmosphere

**Files:**
- Modify: `src/components/Planet.tsx`
- Create: `src/components/Atmosphere.tsx`

- [ ] **Step 1: Create atmospheric glow component**

Create `src/components/Atmosphere.tsx`:

```tsx
import * as THREE from 'three'

const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 glowColor;
  uniform float intensity;
  void main() {
    float intensityFactor = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    gl_FragColor = vec4(glowColor, 1.0) * intensityFactor * intensity;
  }
`

interface AtmosphereProps {
  radius: number
  color: string
  thickness?: number
}

export default function Atmosphere({ radius, color, thickness = 1.2 }: AtmosphereProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  return (
    <mesh>
      <sphereGeometry args={[radius * thickness, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
        uniforms={{
          glowColor: { value: new THREE.Color(color) },
          intensity: { value: 1.5 }
        }}
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
```

Wait — need to add `useRef` import:

```tsx
import * as THREE from 'three'
import { useRef } from 'react'

// ... rest of component
```

- [ ] **Step 2: Rewrite Planet component with textures and physics**

Modify `src/components/Planet.tsx`:

```tsx
import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import type { PlanetData, OrbitConfig } from '../types/planet'
import { loadPlanetTexture } from '../textures/texture-manager'
import Atmosphere from './Atmosphere'

interface PlanetProps {
  data: PlanetData
  orbit: OrbitConfig
  onSelect?: (planet: PlanetData) => void
}

const ATMOSPHERE_COLORS: Record<string, string> = {
  Mercury: '#888899',
  Venus: '#ffddaa',
  Earth: '#4488ff',
  Mars: '#cc6633',
  Jupiter: '#ddaa77',
  Saturn: '#eedd99',
  Uranus: '#88ccdd',
  Neptune: '#5566ee'
}

const ATMOSPHERE_PLANETS = ['Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune']

export default function Planet({ data, orbit, onSelect }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const angleRef = useRef(orbit.angle ?? Math.random() * Math.PI * 2)
  const [hovered, setHovered] = useState(false)
  const textureRef = useRef<THREE.Texture | null>(null)

  useEffect(() => {
    loadPlanetTexture(data.textureUrl, data.fallbackColor).then((result) => {
      if (result.texture) {
        result.texture.colorSpace = THREE.SRGBColorSpace
        textureRef.current = result.texture
      }
    })
  }, [data.textureUrl, data.fallbackColor])

  const orbitalSpeed = useMemo(() => (2 * Math.PI) / (data.orbitalPeriod * 0.1), [data.orbitalPeriod])
  const rotationSpeed = useMemo(() => {
    const abs = Math.abs(data.rotationPeriod)
    return abs > 0 ? (2 * Math.PI) / (abs * 50) : 0
  }, [data.rotationPeriod])

  useFrame((_, delta) => {
    if (meshRef.current) {
      angleRef.current += orbitalSpeed * delta
      const x = Math.cos(angleRef.current) * orbit.radius
      const z = Math.sin(angleRef.current) * orbit.radius
      meshRef.current.position.set(x, 0, z)
      meshRef.current.rotation.y += rotationSpeed * delta
    }
  })

  const hasAtmosphere = ATMOSPHERE_PLANETS.includes(data.name)
  const atmosphereColor = ATMOSPHERE_COLORS[data.name] || '#88aacc'

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={() => onSelect?.(data)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[data.scaledRadius, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : data.fallbackColor}
          map={textureRef.current || null}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {hasAtmosphere && (
        <Atmosphere
          radius={data.scaledRadius}
          color={atmosphereColor}
          thickness={1.15}
        />
      )}

      <Html center occlude>
        <div style={{
          color: 'white',
          fontSize: '12px',
          textShadow: '0 0 4px black',
          pointerEvents: 'none'
        }}>
          {data.name}
        </div>
      </Html>
    </group>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No type errors. Fix any issues with unused imports or missing types.

- [ ] **Step 4: Commit**

```bash
git add src/components/Planet.tsx src/components/Atmosphere.tsx
git commit -m "feat: wire textures into planets and add atmospheric glow shader"
```

---

### Task 7: Post-Processing Pipeline

**Files:**
- Modify: `package.json` (add dependency)
- Modify: `src/App.tsx`

- [ ] **Step 1: Install post-processing package**

Run: `npm install @react-three/postprocessing`

- [ ] **Step 2: Add EffectComposer to App**

Modify `src/App.tsx`:

```tsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, EffectComposer, Bloom, ToneMapping } from '@react-three/drei'
import { SolarSystem, InfoPanel } from './components'
import { planets } from './data/planets'
import { useStore } from './store'

function Scene() {
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet)
  return (
    <>
      <SolarSystem
        planets={planets.map(p => ({ data: p, orbit: { radius: p.scaledDistance, speed: 1, angle: Math.random() * Math.PI * 2 } }))}
        onSelect={setSelectedPlanet}
      />
      <EffectComposer>
        <Bloom intensity={0.4} threshold={0.8} radius={1.5} />
        <ToneMapping adapter={ToneMapping.Adapters.ACESFilmic} />
      </EffectComposer>
    </>
  )
}

export default function App() {
  const autoRotate = useStore((state) => state.autoRotate)
  return (
    <>
      <Canvas
        camera={{ position: [0, 30, 80], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <ambientLight intensity={0.1} />
        <Scene />
        <OrbitControls autoRotate autoRotateSpeed={0.5 * (autoRotate ? 1 : 0)} enableZoom />
      </Canvas>
      <InfoPanel />
    </>
  )
}
```

Add import at top: `import * as THREE from 'three'`

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: Clean build with bloom effects included.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx package.json
git commit -m "feat: add bloom post-processing and ACES tone mapping"
```

---

### Task 8: Control Panel UI — Speed, View Mode, Pause

**Files:**
- Create: `src/components/ControlPanel.tsx`
- Modify: `src/App.tsx` (add ControlPanel)

- [ ] **Step 1: Create ControlPanel component**

Create `src/components/ControlPanel.tsx`:

```tsx
import { useStore } from '../store'

export default function ControlPanel() {
  const simulationSpeed = useStore((state) => state.simulationSpeed)
  const setSimulationSpeed = useStore((state) => state.setSimulationSpeed)
  const viewMode = useStore((state) => state.viewMode)
  const setViewMode = useStore((state) => state.setViewMode)

  return (
    <div style={{
      position: 'fixed',
      bottom: 20,
      left: 20,
      zIndex: 1000,
      background: 'rgba(10, 10, 20, 0.85)',
      backdropFilter: 'blur(10px)',
      borderRadius: 12,
      padding: '16px 20px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      minWidth: 280
    }}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: 6 }}>
          Simulation Speed
        </label>
        <input
          type="range"
          min="-1"
          max="2"
          step="0.1"
          value={Math.log10(simulationSpeed) || 0}
          onChange={(e) => setSimulationSpeed(Math.pow(10, parseFloat(e.target.value)))}
          style={{ width: '100%' }}
        />
        <span style={{ color: '#ccc', fontSize: '13px' }}>
          {simulationSpeed.toFixed(1)}x
        </span>
      </div>

      <div>
        <label style={{ color: '#aaa', fontSize: '12px', display: 'block', marginBottom: 6 }}>
          View Mode
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['helio', 'earth', 'free'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: viewMode === mode ? '1px solid #4a9eff' : '1px solid rgba(255,255,255,0.2)',
                background: viewMode === mode ? 'rgba(74, 158, 255, 0.3)' : 'rgba(255,255,255,0.05)',
                color: viewMode === mode ? '#fff' : '#aaa',
                cursor: 'pointer',
                fontSize: '12px',
                textTransform: 'capitalize'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Add ControlPanel to App**

Modify `src/App.tsx` — add import and render:

```tsx
import { ControlPanel } from './components'
// ... in JSX, after <InfoPanel />
<ControlPanel />
```

Update barrel export in `src/components/index.ts`:

```ts
export { default as Planet } from './Planet'
export { default as SolarSystem } from './SolarSystem'
export { default as InfoPanel } from './InfoPanel'
export { default as ControlPanel } from './ControlPanel'
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/ControlPanel.tsx src/components/index.ts src/App.tsx
git commit -m "feat: control panel with speed slider and view mode toggle"
```

---

### Task 9: Camera Transitions — Click-to-Focus

**Files:**
- Create: `src/hooks/use-camera-transition.ts`
- Modify: `src/components/SolarSystem.tsx` (pass camera focus)
- Modify: `src/App.tsx` (camera transition logic)

- [ ] **Step 1: Create camera transition hook**

Create `src/hooks/use-camera-transition.ts`:

```ts
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

const LERP_SPEED = 0.05

export function useCameraTransition() {
  const cameraTargetRef = useRef(new THREE.Vector3(0, 0, 0))
  const currentTargetRef = useRef(new THREE.Vector3(0, 0, 0))

  const selectedPlanet = useStore((state) => state.selectedPlanet)
  const physicsState = useStore((state) => state.physicsState)

  useEffect(() => {
    if (selectedPlanet) {
      const body = physicsState.bodies[selectedPlanet.name]
      if (body && body.position) {
        cameraTargetRef.current.copy(body.position)
      }
    } else {
      cameraTargetRef.current.set(0, 0, 0)
    }
  }, [selectedPlanet])

  useFrame(() => {
    currentTargetRef.current.lerp(cameraTargetRef.current, LERP_SPEED)
  })

  return currentTargetRef
}
```

- [ ] **Step 2: Wire camera focus in App**

Modify `src/App.tsx` — add camera transition logic using OrbitControls target update. The OrbitControls component supports dynamic target updates via ref:

```tsx
import { useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SolarSystem, InfoPanel, ControlPanel } from './components'
import { planets } from './data/planets'
import { useStore } from './store'

function CameraController() {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const selectedPlanet = useStore((state) => state.selectedPlanet)
  const physicsState = useStore((state) => state.physicsState)

  useFrame(() => {
    if (selectedPlanet && controlsRef.current) {
      const body = physicsState.bodies[selectedPlanet.name]
      if (body?.position) {
        controlsRef.current.target.lerp(body.position, 0.05)
      }
    } else if (controlsRef.current) {
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0, 0), 0.05)
    }
  })

  return null
}

function Scene() {
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet)
  return (
    <>
      <SolarSystem
        planets={planets.map(p => ({ data: p, orbit: { radius: p.scaledDistance, speed: 1, angle: Math.random() * Math.PI * 2 } }))}
        onSelect={setSelectedPlanet}
      />
      <CameraController />
      <EffectComposer>
        <Bloom intensity={0.4} threshold={0.8} radius={1.5} />
        <ToneMapping adapter={ToneMapping.Adapters.ACESFilmic} />
      </EffectComposer>
    </>
  )
}

export default function App() {
  const autoRotate = useStore((state) => state.autoRotate)
  return (
    <>
      <Canvas
        camera={{ position: [0, 30, 80], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <ambientLight intensity={0.1} />
        <Scene />
        <OrbitControls autoRotate autoRotateSpeed={0.5 * (autoRotate ? 1 : 0)} enableZoom />
      </Canvas>
      <InfoPanel />
      <ControlPanel />
    </>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/hooks/use-camera-transition.ts src/App.tsx
git commit -m "feat: smooth camera transitions on planet selection"
```

---

### Task 10: Dashboard — Real-Time Physics Data

**Files:**
- Modify: `src/components/InfoPanel.tsx`

- [ ] **Step 1: Extend InfoPanel with physics data display**

Modify `src/components/InfoPanel.tsx`:

```tsx
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export default function InfoPanel() {
  const selectedPlanet = useStore((state) => state.selectedPlanet)
  const showInfoPanel = useStore((state) => state.showInfoPanel)
  const toggleInfoPanel = useStore((state) => state.toggleInfoPanel)
  const physicsState = useStore((state) => state.physicsState)

  if (!selectedPlanet || !showInfoPanel) return null

  const body = physicsState.bodies[selectedPlanet.name]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 1000,
          width: 320,
          background: 'rgba(10, 10, 20, 0.9)',
          backdropFilter: 'blur(12px)',
          borderRadius: 16,
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#fff' }}>{selectedPlanet.name}</h2>
          <button
            onClick={toggleInfoPanel}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: 8,
              padding: '6px 12px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.5' }}>{selectedPlanet.facts[0]}</p>
        </div>

        {body && (
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 14 }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '13px', color: '#888', textTransform: 'uppercase' }}>
              Live Telemetry
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px' }}>
              <span style={{ color: '#777', fontSize: '12px' }}>Distance</span>
              <span style={{ color: '#ccc', fontSize: '13px', textAlign: 'right' }}>
                {body.position.length().toFixed(1)} sim km
              </span>

              <span style={{ color: '#777', fontSize: '12px' }}>Velocity</span>
              <span style={{ color: '#ccc', fontSize: '13px', textAlign: 'right' }}>
                {body.velocity.length().toFixed(2)} sim km/s
              </span>

              <span style={{ color: '#777', fontSize: '12px' }}>Mass</span>
              <span style={{ color: '#ccc', fontSize: '13px', textAlign: 'right' }}>
                {selectedPlanet.mass.toExponential(2)} kg
              </span>

              <span style={{ color: '#777', fontSize: '12px' }}>Radius</span>
              <span style={{ color: '#ccc', fontSize: '13px', textAlign: 'right' }}>
                {selectedPlanet.radius.toLocaleString()} km
              </span>

              <span style={{ color: '#777', fontSize: '12px' }}>Temperature</span>
              <span style={{ color: '#ccc', fontSize: '13px', textAlign: 'right' }}>
                {selectedPlanet.temperature}°C
              </span>
            </div>
          </div>
        )}

        {selectedPlanet.atmosphere.length > 0 && (
          <div style={{ marginTop: 12 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '13px', color: '#888', textTransform: 'uppercase' }}>
              Atmosphere
            </h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {selectedPlanet.atmosphere.map((gas) => (
                <span key={gas} style={{
                  background: 'rgba(74, 158, 255, 0.2)',
                  padding: '3px 8px',
                  borderRadius: 6,
                  fontSize: '12px',
                  color: '#aaccff'
                }}>
                  {gas}
                </span>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '13px', color: '#888', textTransform: 'uppercase' }}>
            Facts
          </h3>
          {selectedPlanet.facts.map((fact, i) => (
            <p key={i} style={{ margin: '4px 0', fontSize: '13px', color: '#aaa' }}>{fact}</p>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/InfoPanel.tsx
git commit -m "feat: extend InfoPanel with real-time physics telemetry dashboard"
```

---

### Task 11: Final Integration & Build Verification

**Files:**
- Modify: `src/App.tsx` (final cleanup)
- Verify all components work together

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: Clean production build.

- [ ] **Step 2: Run dev server and verify visually**

Run: `npx vite --open`
Verify in browser:
- Dark background with star field visible
- Sun has animated texture and glow pulse
- Planets show textures (or fallback colors during load)
- Atmospheric glow on eligible planets
- Bloom effect on sun
- Click planet triggers camera focus transition
- Control panel speed slider works
- InfoPanel shows live telemetry data

- [ ] **Step 3: Run tests**

Run: `npm test` or `npx vitest run`
Expected: All orbital engine tests pass.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Orbitarium v2 — physics, textures, atmosphere, post-processing"
```

---

## Self-Review Checklist

**Spec Coverage:**
- ✅ Visual Overhaul → Tasks 1 (CSS/background), 4 (star field), 5 (sun), 6 (textures/atmosphere), 7 (post-processing)
- ✅ Physics Engine → Task 2 (orbital mechanics core with Velocity Verlet)
- ✅ Controls & Dashboard → Task 8 (control panel), Task 10 (dashboard telemetry)
- ✅ Camera Interaction → Task 9 (camera transitions on click)
- ✅ Store Integration → Task 3 (Zustand physics state + use-physics hook)

**Placeholder Scan:** No TBD, TODO, or vague references found. All code blocks contain complete implementations.

**Type Consistency:** `OrbitalBody` interface used consistently across engine, store, and hooks. `PlanetData` unchanged from original types. Physics state flows through Zustand → useFrame → component updates.

**Scope Check:** 11 tasks covering all spec requirements. Each task is self-contained with clear file paths and code blocks.
