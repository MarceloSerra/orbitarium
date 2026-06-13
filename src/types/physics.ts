import * as THREE from 'three'

export interface OrbitalBody {
  name: string
  position: THREE.Vector3
  velocity: THREE.Vector3
  mass: number
}

export interface SimulationState {
  bodies: Record<string, OrbitalBody>
  time: number
  speedMultiplier: number
}

export interface SimulationResult {
  updatedBodies: Record<string, OrbitalBody>
  deltaTime: number
}
