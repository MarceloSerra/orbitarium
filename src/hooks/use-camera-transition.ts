import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { useStore } from '../store'

export function useCameraTransition() {
  const selectedPlanet = useStore((state) => state.selectedPlanet)
  const controlsRef = useRef<CameraControls>(null)

  useEffect(() => {
    if (selectedPlanet && controlsRef.current) {
      const position = new THREE.Vector3(
        Math.cos(selectedPlanet.scaledDistance * 0.1) * selectedPlanet.scaledDistance,
        0,
        Math.sin(selectedPlanet.scaledDistance * 0.1) * selectedPlanet.scaledDistance
      )

      controlsRef.current.setLookAt(
        position.x,
        position.y,
        position.z,
        position.x,
        position.y,
        position.z
      )
    }
  }, [selectedPlanet])

  useFrame((_, delta) => {
    if (controlsRef.current) {
      controlsRef.current.update(delta)
    }
  })

  return controlsRef
}
