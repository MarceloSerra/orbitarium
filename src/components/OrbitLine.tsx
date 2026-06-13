import * as THREE from 'three'
import { useMemo } from 'react'

interface OrbitLineProps {
  radius: number
  color?: string
}

export default function OrbitLine({ radius, color = '#ffffff' }: OrbitLineProps) {
  const geometry = useMemo(() => {
    const segments = 128
    const positions = new Float32Array((segments + 1) * 3)
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      positions[i * 3] = Math.cos(angle) * radius
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = Math.sin(angle) * radius
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return geo
  }, [radius])

  const material = useMemo(() => {
    return new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.15, depthWrite: false })
  }, [color])

  return <primitive object={new THREE.Line(geometry, material)} />
}
