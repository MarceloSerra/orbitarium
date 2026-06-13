import * as THREE from 'three'
import type { OrbitalBody, SimulationState, SimulationResult } from '../types/physics'

const GRAVITATIONAL_CONSTANT = 0.01

export function createInitialConditions(
  distance: number,
  mass: number,
  _angleOffset: number,
  eccentricity = 0.02
): OrbitalBody {
  const semiMajorAxis = distance * (1 - eccentricity)

  const x = semiMajorAxis
  const z = 0

  return {
    name: '',
    position: new THREE.Vector3(x, 0, z),
    velocity: new THREE.Vector3(0, 0, Math.sqrt(GRAVITATIONAL_CONSTANT * 1000 / distance) * (1 - eccentricity * 0.5)),
    mass
  }
}

export function stepSimulation(
  state: SimulationState,
  sunMass: number,
  sunPosition: THREE.Vector3,
  dt = 0.016
): SimulationResult {
  const { bodies } = state
  const deltaTime = dt * state.speedMultiplier

  const updatedBodies: Record<string, OrbitalBody> = {}

  for (const [name, body] of Object.entries(bodies)) {
    const pos = body.position.clone()
    const vel = body.velocity.clone()

    const toSun = new THREE.Vector3().subVectors(sunPosition, pos)
    const distSq = toSun.lengthSq() + 0.01

    const accel = toSun.normalize().multiplyScalar(GRAVITATIONAL_CONSTANT * sunMass / distSq / body.mass)

    vel.add(accel.multiplyScalar(deltaTime))

    for (const [otherName, otherBody] of Object.entries(bodies)) {
      if (name === otherName) continue
      const toOther = new THREE.Vector3().subVectors(otherBody.position, pos)
      const otherDistSq = toOther.lengthSq() + 0.01

      const otherAccel = toOther.normalize().multiplyScalar(GRAVITATIONAL_CONSTANT * otherBody.mass / otherDistSq / body.mass)
      vel.add(otherAccel.multiplyScalar(deltaTime))
    }

    const newPos = pos.add(vel.clone().multiplyScalar(deltaTime))

    updatedBodies[name] = {
      name,
      position: newPos,
      velocity: vel,
      mass: body.mass
    }
  }

  return { updatedBodies, deltaTime }
}
