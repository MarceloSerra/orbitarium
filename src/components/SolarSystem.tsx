import { Stars } from '@react-three/drei'
import type { PlanetData, OrbitConfig } from '../types/planet'
import Planet from './Planet'

interface SolarSystemProps {
  planets: Array<{ data: PlanetData; orbit: OrbitConfig }>
  onSelect?: (planet: PlanetData) => void
}

export default function SolarSystem({ planets, onSelect }: SolarSystemProps) {
  return (
    <group>
      <Stars count={15000} radius={200} />

      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[3.5, 64, 64]} />
        <meshStandardMaterial emissive="#ffaa00" emissiveIntensity={2} color="#ffcc00" />
      </mesh>

      {planets.map((planet) => (
        <Planet
          key={planet.data.name}
          data={planet.data}
          orbit={planet.orbit}
          onSelect={onSelect}
        />
      ))}
    </group>
  )
}
