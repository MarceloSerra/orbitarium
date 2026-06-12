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