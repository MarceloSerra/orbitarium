import { useRef, useState, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import type { PlanetData, OrbitConfig } from '../types/planet'

interface PlanetProps {
  data: PlanetData
  orbit: OrbitConfig
  onSelect?: (planet: PlanetData) => void
}

export default function Planet({ data, orbit, onSelect }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const [hovered, setHovered] = useState(false)

  const orbitPoints = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      points.push(new THREE.Vector3(
        Math.cos(angle) * orbit.radius,
        0,
        Math.sin(angle) * orbit.radius
      ))
    }
    return points
  }, [orbit.radius])

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

  return (
    <group>
      <Line points={orbitPoints} color={orbit.color} lineWidth={1} />

      <mesh
        ref={meshRef}
        onClick={() => onSelect?.(data)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[data.scaledRadius, 32, 32]} />
        <meshStandardMaterial color={hovered ? 0xffffff : data.fallbackColor} />
        <Html center>
          <div style={{
            color: 'white',
            fontSize: '12px',
            textShadow: '0 0 4px black',
            pointerEvents: 'none'
          }}>
            {data.name}
          </div>
        </Html>
      </mesh>
    </group>
  )
}
