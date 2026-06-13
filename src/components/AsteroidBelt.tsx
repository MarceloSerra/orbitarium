import { useMemo } from 'react'
import * as THREE from 'three'

interface AsteroidBeltProps {
  innerRadius?: number
  outerRadius?: number
  count?: number
}

export default function AsteroidBelt({ innerRadius = 28, outerRadius = 40, count = 500 }: AsteroidBeltProps) {
  const meshRef = useMemo(() => {
    // Create base geometry for asteroids
    const baseGeo = new THREE.IcosahedronGeometry(1, 1)
    
    // Material
    const material = new THREE.MeshStandardMaterial({
      color: '#665544',
      roughness: 0.9,
      metalness: 0.1
    })
    
    // Create instanced mesh
    const mesh = new THREE.InstancedMesh(baseGeo, material, count)
    
    // Set instance transforms
    const dummy = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
      // Random position in belt ring
      const angle = Math.random() * Math.PI * 2
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius)
      const height = (Math.random() - 0.5) * 1.5
      
      dummy.position.set(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      )
      
      // Random rotation and scale
      dummy.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      )
      
      const scale = 0.3 + Math.random() * 0.8
      dummy.scale.set(scale, scale, scale)
      
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    
    return mesh
  }, [innerRadius, outerRadius, count])

  return <primitive object={meshRef} />
}
