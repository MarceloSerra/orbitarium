import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

interface ConstellationSphereProps {
  radius?: number
}

const constellationData: Array<{ name: string; points: [number, number][] }> = [
  {
    name: 'Orion',
    points: [[0.1, 0.2], [0.15, 0.18], [0.12, 0.15], [0.14, 0.12], [0.16, 0.14], [0.13, 0.16]]
  },
  {
    name: 'Ursa Major',
    points: [[-0.3, 0.4], [-0.25, 0.38], [-0.28, 0.35], [-0.32, 0.37], [-0.26, 0.42], [-0.31, 0.44], [-0.29, 0.41]]
  },
  {
    name: 'Cassiopeia',
    points: [[-0.5, -0.2], [-0.48, -0.25], [-0.52, -0.22], [-0.49, -0.18], [-0.53, -0.2]]
  },
  {
    name: 'Cygnus',
    points: [[0.4, 0.5], [0.38, 0.45], [0.42, 0.48], [0.41, 0.42], [0.39, 0.5]]
  },
  {
    name: 'Leo',
    points: [[-0.6, -0.5], [-0.55, -0.48], [-0.58, -0.52], [-0.62, -0.49], [-0.57, -0.46]]
  },
  {
    name: 'Scorpius',
    points: [[0.6, -0.3], [0.58, -0.35], [0.62, -0.32], [0.59, -0.28], [0.61, -0.34]]
  },
  {
    name: 'Crux',
    points: [[-0.2, -0.7], [-0.18, -0.65], [-0.22, -0.68], [-0.19, -0.72]]
  },
  {
    name: 'Pleiades',
    points: [[-0.4, 0.6], [-0.38, 0.58], [-0.42, 0.62], [-0.39, 0.59], [-0.41, 0.61]]
  }
]

export function ConstellationSphere({ radius = 150 }: ConstellationSphereProps) {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  const constellationObjects = useMemo(() => {
    return constellationData.map((constellation) => {
      // Convert spherical coordinates to 3D positions on sphere surface
      const points3D = constellation.points.map(([lat, lon]) => {
        const phi = lat * Math.PI
        const theta = lon * Math.PI * 2
        return new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        )
      })

      // Create line geometry connecting the stars
      const linePoints = points3D.map(p => new THREE.Vector3(p.x, p.y, p.z))
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints)

      // Create star points
      const starPositions = new Float32Array(points3D.length * 3)
      for (let i = 0; i < points3D.length; i++) {
        starPositions[i * 3] = points3D[i].x
        starPositions[i * 3 + 1] = points3D[i].y
        starPositions[i * 3 + 2] = points3D[i].z
      }

      const starGeometry = new THREE.BufferGeometry()
      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))

      return { lineGeometry, starGeometry, name: constellation.name }
    })
  }, [radius])

  useFrame((_, delta) => {
    timeRef.current += delta
    if (groupRef.current) {
      groupRef.current.rotation.y = timeRef.current * 0.01
    }
  })

  return (
    <group ref={groupRef}>
      {constellationObjects.map((obj, index) => (
        <group key={`constellation-${index}`}>
      {/* Connection lines */}
      <primitive object={new THREE.Line(obj.lineGeometry, new THREE.LineBasicMaterial({ color: '#88aacc', transparent: true, opacity: 0.3, depthWrite: false }))} />

      {/* Star points */}
      <points geometry={obj.starGeometry}>
        <pointsMaterial
          color="#ffffff"
          size={2}
          transparent
          opacity={0.8}
          depthTest={false}
        />
      </points>
        </group>
      ))}
    </group>
  )
}
