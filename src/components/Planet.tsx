import { useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import type { PlanetData } from '../types/planet'
import { useStore } from '../store'

interface PlanetProps {
  data: PlanetData
  onSelect?: (planet: PlanetData) => void
}

const atmosphereColors: Record<string, string> = {
  rocky: '#4488ff',
  gas: '#ffaa44',
  ice: '#66ccff'
}

export default function Planet({ data, onSelect }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const physicsState = useStore((state) => state.physicsState)
  const body = physicsState.bodies[data.name]

  const rotationSpeed = (2 * Math.PI) / (Math.abs(data.rotationPeriod) * 50 || 1)

  useFrame(() => {
    if (!meshRef.current || !body) return

    meshRef.current.position.copy(body.position)
    meshRef.current.rotation.y += rotationSpeed * 0.016

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y = meshRef.current.rotation.y
    }
  })

  const isGasGiant = data.type === 'gas'
  const hasRings = data.name === 'Saturn' || data.name === 'Uranus'

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={() => onSelect?.(data)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[data.scaledRadius, 32, 32]} />
        <meshStandardMaterial color={hovered ? '#ffffff' : data.fallbackColor} />

        {isGasGiant && (
          <mesh ref={atmosphereRef}>
            <sphereGeometry args={[data.scaledRadius * 1.05, 32, 32]} />
            <shaderMaterial
              transparent
              vertexShader={`
                varying vec3 vNormal;
                void main() {
                  vNormal = normalize(normalMatrix * normal);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `}
              fragmentShader={`
                varying vec3 vNormal;
                uniform vec3 uColor;
                void main() {
                  float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                  gl_FragColor = vec4(uColor, intensity * 0.5);
                }
              `}
              uniforms={{ uColor: { value: new THREE.Color(atmosphereColors[data.type]) } }}
            />
          </mesh>
        )}

        {hasRings && (
          <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[data.scaledRadius * 1.4, data.scaledRadius * 2.2, 64]} />
            <meshStandardMaterial
              color="#ccaa88"
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}

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
