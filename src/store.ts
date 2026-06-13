import { create } from 'zustand'
import type { PlanetData } from './types/planet'
import type { OrbitalBody, SimulationState } from './types/physics'

type ViewMode = 'helio' | 'earth' | 'free'

interface SolarSystemState {
  selectedPlanet: PlanetData | null
  showInfoPanel: boolean
  cameraDistance: number
  autoRotate: boolean
  viewMode: ViewMode
  simulationSpeed: number
  physicsState: SimulationState & { bodies: Record<string, OrbitalBody> }
  setSelectedPlanet: (planet: PlanetData | null) => void
  toggleInfoPanel: () => void
  setCameraDistance: (distance: number) => void
  toggleAutoRotate: () => void
  setViewMode: (mode: ViewMode) => void
  setSimulationSpeed: (speed: number) => void
  updatePhysicsState: (state: SimulationState & { bodies: Record<string, OrbitalBody> }) => void
}

export const useStore = create<SolarSystemState>((set) => ({
  selectedPlanet: null,
  showInfoPanel: false,
  cameraDistance: 60,
  autoRotate: true,
  viewMode: 'helio',
  simulationSpeed: 1,
  physicsState: { bodies: {}, time: 0, speedMultiplier: 1 },
  setSelectedPlanet: (planet) => set({
    selectedPlanet: planet,
    showInfoPanel: planet !== null
  }),
  toggleInfoPanel: () => set((state) => ({ showInfoPanel: !state.showInfoPanel })),
  setCameraDistance: (distance) => set({ cameraDistance: distance }),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setViewMode: (mode) => set({ viewMode: mode }),
  setSimulationSpeed: (speed) => set({ simulationSpeed: speed }),
  updatePhysicsState: (state) => set({ physicsState: state })
}))
