export interface PlanetData {
  name: string
  type: 'rocky' | 'gas' | 'ice'
  mass: number
  radius: number
  scaledRadius: number
  distanceFromSun: number
  scaledDistance: number
  orbitalPeriod: number
  rotationPeriod: number
  temperature: number
  atmosphere: string[]
  moons: number
  facts: string[]
  textureUrl: string
  fallbackColor: string
}

export interface OrbitConfig {
  radius: number
  speed: number
  angle: number
  color?: string
  opacity?: number
  thickness?: number
}

export interface CelestialInfo extends PlanetData {
  description?: string
}
