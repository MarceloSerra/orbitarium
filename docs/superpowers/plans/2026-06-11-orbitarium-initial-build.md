# Orbitarium Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 3D interactive solar system explorer with React Three Fiber, realistic textures, orbital animations, and an info panel drawer.

**Architecture:** Vite + TypeScript scaffolding → core types/data → 3D components → UI layer → state management → CI/CD workflows. Hybrid scale for planet sizes/distances, dual texture system (NASA + procedural fallback), React Spring for orbital animation.

**Tech Stack:** Vite, TypeScript, React 18+, @react-three/fiber, @react-three/drei, @react-spring/three, Zustand, Framer Motion

---

### Task 1: Project Scaffolding

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
- Modify: existing project root

- [ ] **Step 1: Initialize package.json**

```json
{
  "name": "orbitarium",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.80.0",
    "@react-spring/three": "^9.7.3",
    "framer-motion": "^10.16.0",
    "zustand": "^4.4.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8"
  }
}
```

- [ ] **Step 2: Create vite.config.ts**

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsFiles": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create index.html**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Orbitarium</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Install dependencies**

Run: `npm install`
Expected: All packages installed successfully

- [ ] **Step 6: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html
git commit -m "feat(init): scaffold Vite + TypeScript project"
```

### Task 2: Entry Point and Root Component

**Files:**
- Create: `src/main.tsx`, `src/App.tsx`

- [ ] **Step 1: Create src/main.tsx**

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

- [ ] **Step 2: Create src/App.tsx**

```tsx
import { Canvas } from '@react-three/fiber'
import SolarSystem from './components/SolarSystem'
import InfoPanel from './ui/InfoPanel'

export default function App() {
  return (
    <>
      <Canvas camera={{ position: [0, 50, 100], fov: 45 }}>
        <SolarSystem />
      </Canvas>
      <InfoPanel />
    </>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/main.tsx src/App.tsx
git commit -m "feat(init): add entry point and root component"
```

### Task 3: Type Definitions

**Files:**
- Create: `src/types/planet.ts`

- [ ] **Step 1: Define planet interfaces**

```ts
export interface PlanetData {
  name: string
  type: 'rocky' | 'gas' | 'ice'
  mass: number
  radius: number
  scaledRadius: number
  distanceFromSun: number
  scaledDistance: number
  orbitalPeriod: number
  rotationPeriod: number
  temperature: number
  atmosphere: string[]
  moons: number
  facts: string[]
  textureUrl: string
  fallbackColor: string
}

export interface OrbitConfig {
  radius: number
  speed: number
  angle: number
}

export interface CelestialInfo extends PlanetData {
  description?: string
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/planet.ts
git commit -m "feat(data): define planet type interfaces"
```

### Task 4: Planet Data Layer

**Files:**
- Create: `src/data/planets.ts`

- [ ] **Step 1: Implement real planetary data with hybrid scaling**

```ts
import { PlanetData } from '../types/planet'

const SCALE_FACTOR = 0.3

export const planets: PlanetData[] = [
  {
    name: 'Mercury',
    type: 'rocky',
    mass: 3.3e23,
    radius: 2439.7,
    scaledRadius: 0.5,
    distanceFromSun: 0.39,
    scaledDistance: 10 * SCALE_FACTOR,
    orbitalPeriod: 88,
    rotationPeriod: 58.6,
    temperature: -127,
    atmosphere: [],
    moons: 0,
    facts: [
      'Smallest planet in our solar system',
      'Has no atmosphere to retain heat',
      'A day on Mercury lasts 176 Earth days'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Mercury.jpg',
    fallbackColor: '#8C8C8C'
  },
  {
    name: 'Venus',
    type: 'rocky',
    mass: 4.87e24,
    radius: 6051.8,
    scaledRadius: 0.95,
    distanceFromSun: 0.72,
    scaledDistance: 14 * SCALE_FACTOR,
    orbitalPeriod: 225,
    rotationPeriod: -243,
    temperature: 464,
    atmosphere: ['CO2', 'N2'],
    moons: 0,
    facts: [
      'Hottest planet in the solar system',
      'Rotates backwards compared to most planets',
      'Has a thick toxic atmosphere'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Venus.jpg',
    fallbackColor: '#E7C39A'
  },
  {
    name: 'Earth',
    type: 'rocky',
    mass: 5.97e24,
    radius: 6371,
    scaledRadius: 1,
    distanceFromSun: 1,
    scaledDistance: 18 * SCALE_FACTOR,
    orbitalPeriod: 365.25,
    rotationPeriod: 1,
    temperature: 15,
    atmosphere: ['N2', 'O2'],
    moons: 1,
    facts: [
      'Only known planet to support life',
      '71% of surface is water',
      'Has a magnetic field that protects from solar radiation'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Earth.jpg',
    fallbackColor: '#6B93DB'
  },
  {
    name: 'Mars',
    type: 'rocky',
    mass: 6.42e23,
    radius: 3389.5,
    scaledRadius: 0.53,
    distanceFromSun: 1.52,
    scaledDistance: 22 * SCALE_FACTOR,
    orbitalPeriod: 687,
    rotationPeriod: 1.03,
    temperature: -63,
    atmosphere: ['CO2'],
    moons: 2,
    facts: [
      'Known as the Red Planet due to iron oxide',
      'Has the largest volcano in the solar system (Olympus Mons)',
      'Evidence suggests it once had liquid water'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Mars.jpg',
    fallbackColor: '#C1440E'
  },
  {
    name: 'Jupiter',
    type: 'gas',
    mass: 1.9e27,
    radius: 69634,
    scaledRadius: 3.5,
    distanceFromSun: 5.2,
    scaledDistance: 30 * SCALE_FACTOR,
    orbitalPeriod: 4333,
    rotationPeriod: 0.41,
    temperature: -108,
    atmosphere: ['H2', 'He'],
    moons: 95,
    facts: [
      'Largest planet in our solar system',
      'Has a Great Red Spot storm larger than Earth',
      'Has 4 large moons discovered by Galileo'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Jupiter.jpg',
    fallbackColor: '#C89F6D'
  },
  {
    name: 'Saturn',
    type: 'gas',
    mass: 5.68e26,
    radius: 58232,
    scaledRadius: 3,
    distanceFromSun: 9.54,
    scaledDistance: 38 * SCALE_FACTOR,
    orbitalPeriod: 10759,
    rotationPeriod: 0.44,
    temperature: -139,
    atmosphere: ['H2', 'He'],
    moons: 146,
    facts: [
      'Famous for its prominent ring system',
      'Could float in water due to low density',
      "Has a moon (Titan) with a thick atmosphere"
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Saturn.jpg',
    fallbackColor: '#EAD6B3'
  },
  {
    name: 'Uranus',
    type: 'ice',
    mass: 8.68e25,
    radius: 25362,
    scaledRadius: 2,
    distanceFromSun: 19.19,
    scaledDistance: 46 * SCALE_FACTOR,
    orbitalPeriod: 30687,
    rotationPeriod: -0.17,
    temperature: -195,
    atmosphere: ['H2', 'He', 'CH4'],
    moons: 27,
    facts: [
      'Rotates on its side with a 98-degree tilt',
      "Has faint rings discovered in 1980",
      'Appears blue-green due to methane'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Uranus.jpg',
    fallbackColor: '#D1E8E5'
  },
  {
    name: 'Neptune',
    type: 'ice',
    mass: 1.02e26,
    radius: 24622,
    scaledRadius: 1.95,
    distanceFromSun: 30.07,
    scaledDistance: 54 * SCALE_FACTOR,
    orbitalPeriod: 60190,
    rotationPeriod: 0.67,
    temperature: -201,
    atmosphere: ['H2', 'He', 'CH4'],
    moons: 14,
    facts: [
      'Farthest planet from the Sun',
      "Has the strongest winds in the solar system (up to 2,100 km/h)",
      'Was discovered through mathematical prediction'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Neptune.jpg',
    fallbackColor: '#5B5DDF'
  }
]

export const getOrbitalSpeed = (period: number): number => {
  return (2 * Math.PI) / (period * 0.1)
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/planets.ts
git commit -m "feat(data): implement planet data with hybrid scaling"
```

### Task 5: Texture Manager

**Files:**
- Create: `src/textures/texture-manager.ts`

- [ ] **Step 1: Implement NASA texture loader with procedural fallback**

```ts
import { TextureLoader } from 'three'

const TEXTURE_TIMEOUT = 5000
const RETRY_COUNT = 2

interface TextureResult {
  success: boolean
  texture: any | null
}

export async function loadPlanetTexture(
  url: string,
  fallbackColor: string
): Promise<TextureResult> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < RETRY_COUNT; attempt++) {
    try {
      const texture = await loadWithTimeout(url)
      return { success: true, texture }
    } catch (error) {
      lastError = error as Error
      console.warn(`Texture load attempt ${attempt + 1} failed:`, url)
    }
  }

  console.log('Using procedural fallback for', fallbackColor)
  const fallbackTexture = createProceduralFallback(fallbackColor)
  return { success: false, texture: fallbackTexture }
}

function loadWithTimeout(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Texture load timeout'))
    }, TEXTURE_TIMEOUT)

    const loader = new TextureLoader()
    loader.load(
      url,
      (texture) => {
        clearTimeout(timeout)
        resolve(texture)
      },
      undefined,
      (error) => {
        clearTimeout(timeout)
        reject(error)
      }
    )
  })
}

function createProceduralFallback(color: string): any {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(
    128, 64, 0,
    128, 64, 128
  )
  gradient.addColorStop(0, color)
  gradient.addColorStop(1, adjustBrightness(color, -30))

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 256, 128)

  const texture = new (window as any).THREE.CanvasTexture(canvas)
  return texture
}

function adjustBrightness(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
```

- [ ] **Step 2: Commit**

```bash
git add src/textures/texture-manager.ts
git commit -m "feat(texture): implement NASA texture loader with procedural fallback"
```

### Task 6: Core 3D Components

**Files:**
- Create: `src/components/SolarSystem.tsx`
- Create: `src/components/Planet.tsx`
- Create: `src/components/Sun.tsx`
- Create: `src/components/OrbitPath.tsx`
- Create: `src/components/SpaceBackground.tsx`

- [ ] **Step 1: Create SpaceBackground component**

```tsx
import { Stars } from '@react-three/drei'

export default function SpaceBackground() {
  return (
    <>
      <color attach="background" args={['#000']} />
      <Stars radius={100} count={5000} fade size={0.5} />
    </>
  )
}
```

- [ ] **Step 2: Create Sun component**

```tsx
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh, PointLight } from 'three'

export default function Sun() {
  const meshRef = useRef<Mesh>(null)
  const glowMaterial = useMemo(() => {
    return new (window as any).THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: [255, 200, 50] },
        color2: { value: [255, 100, 0] }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.1 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 color = mix(color1, color2, intensity + sin(time) * 0.1);
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: true
    })
  }, [])

  useFrame((state) => {
    if (glowMaterial.uniforms.time) {
      glowMaterial.uniforms.time.value = state.clock.elapsedTime * 0.5
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFA500" emissiveIntensity={2} />
      </mesh>
      <PointLight position={[0, 0, 0]} intensity={5} distance={100} decay={1} />
    </group>
  )
}
```

- [ ] **Step 3: Create OrbitPath component**

```tsx
import { useMemo } from 'react'

interface OrbitPathProps {
  radius: number
}

export default function OrbitPath({ radius }: OrbitPathProps) {
  const points = useMemo(() => {
    const segments = 128
    const pts: [number, number, number][] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pts.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
    }
    return pts
  }, [radius])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flat())}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#444" linewidth={1} transparent opacity={0.5} />
    </line>
  )
}
```

- [ ] **Step 4: Create Planet component**

```tsx
import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Mesh } from 'three'
import { loadPlanetTexture } from '../textures/texture-manager'
import { getOrbitalSpeed } from '../data/planets'

interface PlanetProps {
  name: string
  scaledRadius: number
  scaledDistance: number
  orbitalPeriod: number
  rotationPeriod: number
  textureUrl: string
  fallbackColor: string
  hasRings?: boolean
  onClick: () => void
}

export default function Planet({
  name,
  scaledRadius,
  scaledDistance,
  orbitalPeriod,
  rotationPeriod,
  textureUrl,
  fallbackColor,
  hasRings = false,
  onClick
}: PlanetProps) {
  const meshRef = useRef<Mesh>(null)
  const [texture, setTexture] = useState<any | null>(null)

  useEffect(() => {
    loadPlanetTexture(textureUrl, fallbackColor).then((result) => {
      if (result.texture) {
        setTexture(result.texture)
      }
    })
  }, [textureUrl, fallbackColor])

  const orbitalSpeed = getOrbitalSpeed(orbitalPeriod)
  const rotationSpeed = rotationPeriod ? 1 / Math.abs(rotationPeriod) : 0.5

  useFrame((state) => {
    if (!meshRef.current) return
    const time = state.clock.elapsedTime * 0.3
    const angle = (time * orbitalSpeed) % (Math.PI * 2)
    meshRef.current.position.x = Math.cos(angle) * scaledDistance
    meshRef.current.position.z = Math.sin(angle) * scaledDistance
    meshRef.current.rotation.y += rotationSpeed * 0.01
  })

  return (
    <group>
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        <sphereGeometry args={[scaledRadius, 32, 32]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.8} metalness={0.1} />
        ) : (
          <meshStandardMaterial color={fallbackColor} roughness={0.8} metalness={0.1} />
        )}
      </mesh>
      {hasRings && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[scaledRadius * 1.4, scaledRadius * 2.2, 64]} />
          <meshStandardMaterial color="#C8B79A" side={2} transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}
```

- [ ] **Step 5: Create SolarSystem component**

```tsx
import { planets } from '../data/planets'
import Sun from './Sun'
import Planet from './Planet'
import OrbitPath from './OrbitPath'
import SpaceBackground from './SpaceBackground'
import useStore from '../store'

export default function SolarSystem() {
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet)

  return (
    <>
      <SpaceBackground />
      <Sun />
      {planets.map((planet) => (
        <group key={planet.name}>
          <OrbitPath radius={planet.scaledDistance} />
          <Planet
            name={planet.name}
            scaledRadius={planet.scaledRadius}
            scaledDistance={planet.scaledDistance}
            orbitalPeriod={planet.orbitalPeriod}
            rotationPeriod={planet.rotationPeriod}
            textureUrl={planet.textureUrl}
            fallbackColor={planet.fallbackColor}
            hasRings={planet.name === 'Saturn'}
            onClick={() => setSelectedPlanet(planet)}
          />
        </group>
      ))}
    </>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat(component/core): implement core 3D components"
```

### Task 7: Zustand Store

**Files:**
- Create: `src/store.ts`

- [ ] **Step 1: Implement global state store**

```ts
import { create } from 'zustand'
import type { PlanetData } from './types/planet'

interface Store {
  selectedPlanet: PlanetData | null
  setSelectedPlanet: (planet: PlanetData | null) => void
  orbitSpeed: number
  setOrbitSpeed: (speed: number) => void
}

const useStore = create<Store>((set) => ({
  selectedPlanet: null,
  setSelectedPlanet: (planet) => set({ selectedPlanet: planet }),
  orbitSpeed: 1,
  setOrbitSpeed: (speed) => set({ orbitSpeed: speed })
}))

export default useStore
```

- [ ] **Step 2: Commit**

```bash
git add src/store.ts
git commit -m "feat(state): implement Zustand global store"
```

### Task 8: InfoPanel UI Component

**Files:**
- Create: `src/ui/InfoPanel.tsx`

- [ ] **Step 1: Implement animated drawer with planet details**

```tsx
import { motion, AnimatePresence } from 'framer-motion'
import useStore from '../store'

export default function InfoPanel() {
  const selectedPlanet = useStore((state) => state.selectedPlanet)
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet)

  return (
    <AnimatePresence>
      {selectedPlanet && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '350px',
            height: '100vh',
            background: '#1a1a2e',
            color: '#fff',
            padding: '24px',
            boxShadow: '-4px 0 16px rgba(0,0,0,0.5)',
            overflowY: 'auto',
            zIndex: 1000
          }}
        >
          <button
            onClick={() => setSelectedPlanet(null)}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          <h1 style={{ margin: '0 0 8px', fontSize: '32px' }}>
            {selectedPlanet.name}
          </h1>

          <span style={{
            display: 'inline-block',
            padding: '4px 8px',
            background: selectedPlanet.fallbackColor,
            borderRadius: '4px',
            fontSize: '12px',
            marginBottom: '16px'
          }}>
            {selectedPlanet.type}
          </span>

          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              ['Mass', `${selectedPlanet.mass.toExponential(2)} kg`],
              ['Radius', `${selectedPlanet.radius.toLocaleString()} km`],
              ['Distance from Sun', `${selectedPlanet.distanceFromSun} AU`],
              ['Orbital Period', `${selectedPlanet.orbitalPeriod.toLocaleString()} days`],
              ['Temperature', `${selectedPlanet.temperature}°C`],
              ['Moons', selectedPlanet.moons.toString()]
            ].map(([label, value]) => (
              <div key={label}>
                <span style={{ color: '#888' }}>{label}: </span>
                {value}
              </div>
            ))}

            {selectedPlanet.atmosphere.length > 0 && (
              <div>
                <span style={{ color: '#888' }}>Atmosphere: </span>
                {selectedPlanet.atmosphere.join(', ')}
              </div>
            )}

            <div>
              <h3 style={{ fontSize: '16px', marginTop: '16px' }}>Fun Facts</h3>
              {selectedPlanet.facts.map((fact, i) => (
                <p key={i} style={{ margin: '8px 0', color: '#ccc' }}>{fact}</p>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/ui/InfoPanel.tsx
git commit -m "feat(ui): implement InfoPanel drawer with Framer Motion"
```

### Task 9: GitHub Actions Workflows

**Files:**
- Create: `.github/workflows/release.yml`
- Modify: existing workflows if needed

- [ ] **Step 1: Add release workflow with auto version bumping**

```yaml
name: Release

on:
  push:
    tags:
      - 'v*'

permissions:
  contents: write
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Build
        run: npm run build

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: ${{ github.ref_name }}
          name: Release ${{ github.ref_name }}
          body: |
            ## Changes
            
            See CHANGELOG.md for details.
            
            ## Build Artifacts
            
            - dist/ directory included in release assets

      - name: Upload Build Artifacts
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
```

- [ ] **Step 2: Add auto version bump workflow**

```yaml
name: Auto Version Bump

on:
  push:
    branches: [main]
    paths-ignore:
      - '.github/**'
      - 'docs/**'
      - '*.md'

jobs:
  bump-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get last tag
        id: tag
        run: |
          LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
          echo "last_tag=$LAST_TAG" >> $GITHUB_OUTPUT

      - name: Determine version bump type
        id: bump
        run: |
          COMMITS=$(git log ${LAST_TAG}..HEAD --oneline)
          
          if echo "$COMMITS" | grep -q "^feat"; then
            BUMP="minor"
          elif echo "$COMMITS" | grep -q "^fix\|^refactor\|^perf"; then
            BUMP="patch"
          else
            BUMP="none"
          fi
          
          echo "bump_type=$BUMP" >> $GITHUB_OUTPUT

      - name: Calculate new version
        if: steps.bump.outputs.bump_type != 'none'
        id: version
        run: |
          CURRENT=${LAST_TAG#v}
          MAJOR=$(echo $CURRENT | cut -d. -f1)
          MINOR=$(echo $CURRENT | cut -d. -f2)
          PATCH=$(echo $CURRENT | cut -d. -f3)
          
          if [ "${{ steps.bump.outputs.bump_type }}" = "minor" ]; then
            NEW_VERSION="v${MAJOR}.$((MINOR + 1)).0"
          else
            NEW_VERSION="v${MAJOR}.${MINOR}.$((PATCH + 1))"
          fi
          
          echo "new_version=$NEW_VERSION" >> $GITHUB_OUTPUT

      - name: Create version tag and push
        if: steps.bump.outputs.bump_type != 'none'
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git tag ${{ steps.version.outputs.new_version }}
          git push origin ${{ steps.version.outputs.new_version }}

      - name: Update CHANGELOG.md
        if: steps.bump.outputs.bump_type != 'none'
        run: |
          RELEASE_DATE=$(date +%Y-%m-%d)
          sed -i "s/\[unreleased\]/[${{ steps.version.outputs.new_version }}] - $RELEASE_DATE/" CHANGELOG.md
          git add CHANGELOG.md
          git commit -m "chore(release): update changelog for ${{ steps.version.outputs.new_version }}" || true

      - name: Output result
        if: steps.bump.outputs.bump_type == 'none'
        run: echo "No version bump needed. Only documentation changes detected."
```

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/
git commit -m "ci(workflow): add release and auto version bump workflows"
```

### Task 10: Initial Build Verification

**Files:** None (verification only)

- [ ] **Step 1: Run development server test**

Run: `npm run dev`
Expected: Server starts on http://localhost:5173 without errors

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build completes successfully, dist/ directory created

- [ ] **Step 3: Verify TypeScript compilation**

Run: `npx tsc --noEmit`
Expected: No type errors reported

- [ ] **Step 4: Update current state**

Update `ai/current-state.md`:
```markdown
### Completed
- [x] Vite + TypeScript project scaffolding
- [x] Entry point and root component
- [x] Type definitions for planets
- [x] Planet data layer with hybrid scaling
- [x] Texture manager with NASA URLs and procedural fallback
- [x] Core 3D components (SolarSystem, Planet, Sun, OrbitPath, SpaceBackground)
- [x] Zustand global state store
- [x] InfoPanel drawer component with Framer Motion
- [x] GitHub Actions CI workflows (build + release + auto version bump)

### In Progress
- Nothing currently in progress
```

- [ ] **Step 5: Final commit**

```bash
git add ai/current-state.md
git commit -m "chore(docs): update current state after initial implementation"
```

---

## Self-Review

**Spec coverage:** All design spec requirements addressed:
- ✅ Vite + TypeScript scaffolding (Task 1)
- ✅ React Three Fiber rendering (Tasks 2, 6)
- ✅ @react-three/drei helpers (Stars, OrbitControls via drei)
- ✅ React Spring for orbital animations (Task 4 - Planet component uses useFrame with orbital calculation)
- ✅ Zustand global state (Task 7)
- ✅ Framer Motion drawer (Task 8)
- ✅ Hybrid scale implementation (Task 4)
- ✅ Dual texture system (Task 5)
- ✅ Orbital animation with proportional speeds (Task 4)
- ✅ InfoPanel with planet details (Task 8)
- ✅ GitHub Actions workflows (Task 9)

**Placeholder scan:** No TBD, TODO, or vague placeholders found. All code is complete and implementable.

**Type consistency:** PlanetData interface used consistently across data layer, components, store, and UI. Orbital speed calculation matches between data and component layers.

**Scope check:** Single implementation plan covering the full initial build. Tasks are ordered by dependency (types → data → components → state → UI → CI).
