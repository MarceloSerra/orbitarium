import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface StarFieldProps {
  count?: number
  radius?: number
}

const starColors = [
  new THREE.Color(1, 1, 1),
  new THREE.Color(0.8, 0.9, 1),
  new THREE.Color(1, 0.95, 0.8),
  new THREE.Color(0.9, 0.85, 0.7)
]

export function StarField({ count = 2000, radius = 500 }: StarFieldProps) {
  const meshRef = useRef<THREE.Points>(null)
  const timeRef = useRef(0)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = radius + Math.random() * 50

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      const color = starColors[Math.floor(Math.random() * starColors.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      sizes[i] = Math.random() * 2 + 0.5
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

    return geo
  }, [count, radius])

  useFrame((_, delta) => {
    timeRef.current += delta
    const material = meshRef.current?.material as THREE.ShaderMaterial | undefined
    if (material && material.uniforms) {
      material.uniforms.uTime.value = timeRef.current
    }
  })

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={`
          attribute float size;
          varying vec3 vColor;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (200.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          
          void main() {
            float distance = length(gl_PointCoord - vec2(0.5));
            if (distance > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, distance);
            gl_FragColor = vec4(vColor, alpha);
          }
        `}
        uniforms={{ uTime: { value: 0 } }}
      />
    </points>
  )
}
