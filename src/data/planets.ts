import { PlanetData } from '../types/planet'

const SCALE_FACTOR = 0.3

export const planets: PlanetData[] = [
  {
    name: 'Mercury',
    type: 'rocky',
    mass: 3.3e23,
    radius: 2439.7,
    scaledRadius: 0.5,
    distanceFromSun: 0.39,
    scaledDistance: 10 * SCALE_FACTOR,
    orbitalPeriod: 88,
    rotationPeriod: 58.6,
    temperature: -127,
    atmosphere: [],
    moons: 0,
    facts: [
      'Smallest planet in our solar system',
      'Has no atmosphere to retain heat',
      'A day on Mercury lasts 176 Earth days'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Mercury.jpg',
    fallbackColor: '#8C8C8C'
  },
  {
    name: 'Venus',
    type: 'rocky',
    mass: 4.87e24,
    radius: 6051.8,
    scaledRadius: 0.95,
    distanceFromSun: 0.72,
    scaledDistance: 14 * SCALE_FACTOR,
    orbitalPeriod: 225,
    rotationPeriod: -243,
    temperature: 464,
    atmosphere: ['CO2', 'N2'],
    moons: 0,
    facts: [
      'Hottest planet in the solar system',
      'Rotates backwards compared to most planets',
      'Has a thick toxic atmosphere'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Venus.jpg',
    fallbackColor: '#E7C39A'
  },
  {
    name: 'Earth',
    type: 'rocky',
    mass: 5.97e24,
    radius: 6371,
    scaledRadius: 1,
    distanceFromSun: 1,
    scaledDistance: 18 * SCALE_FACTOR,
    orbitalPeriod: 365.25,
    rotationPeriod: 1,
    temperature: 15,
    atmosphere: ['N2', 'O2'],
    moons: 1,
    facts: [
      'Only known planet to support life',
      '71% of surface is water',
      'Has a magnetic field that protects from solar radiation'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Earth.jpg',
    fallbackColor: '#6B93DB'
  },
  {
    name: 'Mars',
    type: 'rocky',
    mass: 6.42e23,
    radius: 3389.5,
    scaledRadius: 0.53,
    distanceFromSun: 1.52,
    scaledDistance: 22 * SCALE_FACTOR,
    orbitalPeriod: 687,
    rotationPeriod: 1.03,
    temperature: -63,
    atmosphere: ['CO2'],
    moons: 2,
    facts: [
      'Known as the Red Planet due to iron oxide',
      'Has the largest volcano in the solar system (Olympus Mons)',
      'Evidence suggests it once had liquid water'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Mars.jpg',
    fallbackColor: '#C1440E'
  },
  {
    name: 'Jupiter',
    type: 'gas',
    mass: 1.9e27,
    radius: 69634,
    scaledRadius: 3.5,
    distanceFromSun: 5.2,
    scaledDistance: 30 * SCALE_FACTOR,
    orbitalPeriod: 4333,
    rotationPeriod: 0.41,
    temperature: -108,
    atmosphere: ['H2', 'He'],
    moons: 95,
    facts: [
      'Largest planet in our solar system',
      'Has a Great Red Spot storm larger than Earth',
      'Has 4 large moons discovered by Galileo'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Jupiter.jpg',
    fallbackColor: '#C89F6D'
  },
  {
    name: 'Saturn',
    type: 'gas',
    mass: 5.68e26,
    radius: 58232,
    scaledRadius: 3,
    distanceFromSun: 9.54,
    scaledDistance: 38 * SCALE_FACTOR,
    orbitalPeriod: 10759,
    rotationPeriod: 0.44,
    temperature: -139,
    atmosphere: ['H2', 'He'],
    moons: 146,
    facts: [
      'Famous for its prominent ring system',
      'Could float in water due to low density',
      "Has a moon (Titan) with a thick atmosphere"
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Saturn.jpg',
    fallbackColor: '#EAD6B3'
  },
  {
    name: 'Uranus',
    type: 'ice',
    mass: 8.68e25,
    radius: 25362,
    scaledRadius: 2,
    distanceFromSun: 19.19,
    scaledDistance: 46 * SCALE_FACTOR,
    orbitalPeriod: 30687,
    rotationPeriod: -0.17,
    temperature: -195,
    atmosphere: ['H2', 'He', 'CH4'],
    moons: 27,
    facts: [
      'Rotates on its side with a 98-degree tilt',
      "Has faint rings discovered in 1980",
      'Appears blue-green due to methane'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Uranus.jpg',
    fallbackColor: '#D1E8E5'
  },
  {
    name: 'Neptune',
    type: 'ice',
    mass: 1.02e26,
    radius: 24622,
    scaledRadius: 1.95,
    distanceFromSun: 30.07,
    scaledDistance: 54 * SCALE_FACTOR,
    orbitalPeriod: 60190,
    rotationPeriod: 0.67,
    temperature: -201,
    atmosphere: ['H2', 'He', 'CH4'],
    moons: 14,
    facts: [
      'Farthest planet from the Sun',
      "Has the strongest winds in the solar system (up to 2,100 km/h)",
      'Was discovered through mathematical prediction'
    ],
    textureUrl: 'https://svs.gsfc.nasa.gov/vis/aidsvra_114/Neptune.jpg',
    fallbackColor: '#5B5DDF'
  }
]

export const getOrbitalSpeed = (period: number): number => {
  return (2 * Math.PI) / (period * 0.1)
}
