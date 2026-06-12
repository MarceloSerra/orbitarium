import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { SolarSystem, InfoPanel } from './components'
import { planets } from './data/planets'
import { useStore } from './store'

function Scene() {
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet)
  return <SolarSystem planets={planets.map(p => ({ data: p, orbit: { radius: p.scaledDistance, speed: 1, angle: 0 } }))} onSelect={setSelectedPlanet} />
}

export default function App() {
  const autoRotate = useStore((state) => state.autoRotate)
  return (
    <>
      <Canvas camera={{ position: [0, 50, 100], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[0, 0, 0]} intensity={2} />
        <Scene />
        <OrbitControls autoRotate autoRotateSpeed={0.5 * (autoRotate ? 1 : 0)} />
      </Canvas>
      <InfoPanel />
    </>
  )
}
