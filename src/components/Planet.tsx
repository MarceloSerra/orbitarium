import { useRef, useState, useMemo } from 'react'
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
  Mercury: '#888899',
  Venus: '#ffddaa',
  Earth: '#4488ff',
  Mars: '#cc6633',
  Jupiter: '#ddaa77',
  Saturn: '#eedd99',
  Uranus: '#88ccdd',
  Neptune: '#5566ee'
}

const atmosphereVertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const atmosphereFragmentShader = `
  varying vec3 vNormal;
  uniform vec3 uColor;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
    gl_FragColor = vec4(uColor, intensity * 0.8);
  }
`

export default function Planet({ data, onSelect }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const ringRef = useRef<THREE.Mesh>(null)
  const labelRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const physicsState = useStore((state) => state.physicsState)
  const body = physicsState.bodies[data.name]

  const rotationSpeed = (2 * Math.PI) / (Math.abs(data.rotationPeriod) * 50 || 1)

  // Calculate label visibility based on distance and collision avoidance
  const labelVisibility = useMemo(() => {
    if (!body) return false
    
    // Show labels for inner planets always, outer planets only when close
    const isInnerPlanet = data.scaledDistance < 25
    return isInnerPlanet || hovered
  }, [body, data.scaledDistance, hovered])

  useFrame(() => {
    if (!meshRef.current || !body) return

    meshRef.current.position.copy(body.position)
    meshRef.current.rotation.y += rotationSpeed * 0.016

    if (atmosphereRef.current) {
      atmosphereRef.current.position.copy(meshRef.current.position)
      atmosphereRef.current.rotation.y = meshRef.current.rotation.y
    }

    if (ringRef.current) {
      ringRef.current.position.copy(meshRef.current.position)
    }
    
    // Update label position to always face camera
    if (labelRef.current && meshRef.current) {
      labelRef.current.position.copy(meshRef.current.position)
      labelRef.current.position.y += data.scaledRadius + 1.5
    }
  })

  const hasRings = data.name === 'Saturn' || data.name === 'Uranus'
  const atmosphereColor = atmosphereColors[data.name] || '#88aacc'

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
          roughness={0.7}
          metalness={0.1}
        />

        {/* Atmosphere glow */}
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[data.scaledRadius * 1.15, 32, 32]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={atmosphereVertexShader}
            fragmentShader={atmosphereFragmentShader}
            uniforms={{ uColor: { value: new THREE.Color(atmosphereColor) } }}
          />
        </mesh>

        {/* Planetary rings */}
        {hasRings && (
          <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
            <ringGeometry args={[data.scaledRadius * 1.4, data.scaledRadius * 2.2, 64]} />
            <meshStandardMaterial
              color="#ccaa88"
              side={THREE.DoubleSide}
              transparent
              opacity={0.7}
              roughness={0.9}
            />
          </mesh>
        )}

        {/* Label with collision avoidance */}
        {labelVisibility && (
          <group ref={labelRef}>
            <Html center occlude>
              <div style={{
                color: 'white',
                fontSize: data.scaledDistance < 25 ? '14px' : '12px',
                fontWeight: 'bold',
                textShadow: '0 0 6px black, 0 0 3px rgba(0,0,0,0.8)',
                pointerEvents: 'none',
                textAlign: 'center'
              }}>
                {data.name}
              </div>
            </Html>
          </group>
        )}
      </mesh>
    </group>
  )
}
