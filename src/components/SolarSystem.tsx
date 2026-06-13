import { useRef } from 'react'
import type { PlanetData, OrbitConfig } from '../types/planet'
import Planet from './Planet'
import { StarField } from './StarField'
import { Sun } from './Sun'
import { usePhysics } from '../hooks/use-physics'
import { CameraControls } from '@react-three/drei'

interface SolarSystemProps {
  planets: Array<{ data: PlanetData; orbit?: OrbitConfig }>
  onSelect?: (planet: PlanetData) => void
}

export default function SolarSystem({ planets, onSelect }: SolarSystemProps) {
  usePhysics(planets)
  const controlsRef = useRef<CameraControls>(null)

  return (
    <group>
      <StarField count={2000} radius={500} />

      <Sun />

      {planets.map((planet) => (
        <Planet
          key={planet.data.name}
          data={planet.data}
          onSelect={onSelect}
        />
      ))}

      <CameraControls ref={controlsRef} />
    </group>
  )
}
