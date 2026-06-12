import { create } from 'zustand'
import type { PlanetData } from './types/planet'

interface SolarSystemState {
  selectedPlanet: PlanetData | null
  showInfoPanel: boolean
  cameraDistance: number
  autoRotate: boolean
  setSelectedPlanet: (planet: PlanetData | null) => void
  toggleInfoPanel: () => void
  setCameraDistance: (distance: number) => void
  toggleAutoRotate: () => void
}

export const useStore = create<SolarSystemState>((set) => ({
  selectedPlanet: null,
  showInfoPanel: false,
  cameraDistance: 60,
  autoRotate: true,
  setSelectedPlanet: (planet) => set({ 
    selectedPlanet: planet,
    showInfoPanel: planet !== null
  }),
  toggleInfoPanel: () => set((state) => ({ showInfoPanel: !state.showInfoPanel })),
  setCameraDistance: (distance) => set({ cameraDistance: distance }),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate }))
}))