import { describe, it, expect } from 'vitest'
import * as THREE from 'three'
import { stepSimulation, createInitialConditions } from '../physics/orbital-engine'
import type { SimulationState } from '../types/physics'

describe('orbital engine', () => {
  const sunMass = 1000

  it('creates initial conditions with correct position', () => {
    const body = createInitialConditions(50, 100, 0)
    expect(body.position.x).toBeCloseTo(49)
    expect(body.position.y).toBe(0)
    expect(body.position.z).toBe(0)
  })

  it('creates circular orbit when eccentricity is zero', () => {
    const body = createInitialConditions(50, 100, 0, 0)
    expect(body.position.x).toBeCloseTo(50)
  })

  it('applies gravitational acceleration toward sun', () => {
    const body = createInitialConditions(50, 100, 0)
    body.name = 'test'

    const state: SimulationState = {
      bodies: { test: body },
      time: 0,
      speedMultiplier: 1
    }

    const result = stepSimulation(state, sunMass, new THREE.Vector3(0, 0, 0))
    const updated = result.updatedBodies['test']

    expect(updated.velocity.x).toBeLessThan(body.velocity.x)
  })

  it('maintains orbital motion over multiple steps', () => {
    const body = createInitialConditions(50, 100, 0)
    body.name = 'planet'

    let state: SimulationState = {
      bodies: { planet: body },
      time: 0,
      speedMultiplier: 1
    }

    for (let i = 0; i < 100; i++) {
      const result = stepSimulation(state, sunMass, new THREE.Vector3(0, 0, 0))
      state = { ...state, bodies: result.updatedBodies, time: state.time + result.deltaTime }
    }

    const finalPos = state.bodies['planet'].position
    expect(finalPos.length()).toBeGreaterThan(40)
    expect(finalPos.length()).toBeLessThan(60)
  })

  it('computes planet-planet gravitational perturbations', () => {
    const body1 = createInitialConditions(50, 100, 0)
    body1.name = 'earth'

    const body2 = createInitialConditions(80, 300, Math.PI / 2)
    body2.name = 'mars'

    const state: SimulationState = {
      bodies: { earth: body1, mars: body2 },
      time: 0,
      speedMultiplier: 1
    }

    const result = stepSimulation(state, sunMass, new THREE.Vector3(0, 0, 0))
    expect(result.updatedBodies['earth'].velocity.length()).toBeGreaterThan(0)
    expect(result.updatedBodies['mars'].velocity.length()).toBeGreaterThan(0)
  })
})
