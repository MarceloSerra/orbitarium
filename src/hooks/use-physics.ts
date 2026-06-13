import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'
import type { PlanetData } from '../types/planet'
import type { OrbitalBody } from '../types/physics'
import { stepSimulation, createInitialConditions } from '../physics/orbital-engine'

const SUN_MASS = 1000

export function usePhysics(planets: Array<{ data: PlanetData; orbit?: any }>) {
  const physicsState = useStore((state) => state.physicsState)
  const setPhysicsState = useStore((state) => state.updatePhysicsState)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return

    const bodies: Record<string, OrbitalBody> = {}

    for (const planet of planets) {
      const body = createInitialConditions(
        planet.data.scaledDistance,
        planet.data.mass / 1000,
        Math.random() * Math.PI * 2,
        planet.data.eccentricity || 0.02
      )
      body.name = planet.data.name
      bodies[planet.data.name] = body
    }

    setPhysicsState({ bodies, time: 0, speedMultiplier: 1 })
    initializedRef.current = true
  }, [planets.length])

  useFrame(() => {
    const sunPosition = new THREE.Vector3(0, 0, 0)
    const result = stepSimulation(physicsState, SUN_MASS, sunPosition)

    setPhysicsState({
      bodies: result.updatedBodies,
      time: physicsState.time + result.deltaTime,
      speedMultiplier: physicsState.speedMultiplier
    })
  })
}
