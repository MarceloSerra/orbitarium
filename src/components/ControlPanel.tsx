import { motion } from 'framer-motion'
import { useStore } from '../store'
import type { PlanetData } from '../types/planet'

interface ControlPanelProps {
  planets: Array<{ data: PlanetData }>
}

export default function ControlPanel({ planets }: ControlPanelProps) {
  const autoRotate = useStore((state) => state.autoRotate)
  const simulationSpeed = useStore((state) => state.simulationSpeed)
  const toggleAutoRotate = useStore((state) => state.toggleAutoRotate)
  const setSimulationSpeed = useStore((state) => state.setSimulationSpeed)

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 240,
        height: '100vh',
        background: 'rgba(10, 10, 30, 0.95)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        padding: '24px',
        color: 'white',
        zIndex: 1000
      }}
    >
      <h2 style={{ fontSize: 18, marginBottom: 20 }}>Controls</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 14, color: '#aaa', marginBottom: 8 }}>
          Simulation Speed
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={simulationSpeed}
          onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
        <span style={{ fontSize: 12, color: '#88aaff' }}>{simulationSpeed.toFixed(1)}x</span>
      </div>

      <button
        onClick={toggleAutoRotate}
        style={{
          width: '100%',
          padding: '10px',
          background: autoRotate ? 'rgba(136, 170, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          borderRadius: 4,
          color: 'white',
          cursor: 'pointer',
          marginBottom: 20
        }}
      >
        {autoRotate ? 'Stop Rotation' : 'Start Rotation'}
      </button>

      <div style={{ marginTop: 30 }}>
        <h3 style={{ fontSize: 16, marginBottom: 12, color: '#88aaff' }}>Planets</h3>
        {planets.map((planet) => (
          <PlanetButton key={planet.data.name} planet={planet.data} />
        ))}
      </div>
    </motion.div>
  )
}

function PlanetButton({ planet }: { planet: PlanetData }) {
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet)

  return (
    <button
      onClick={() => setSelectedPlanet(planet)}
      style={{
        display: 'block',
        width: '100%',
        padding: '8px 12px',
        marginBottom: 4,
        background: 'rgba(255, 255, 255, 0.05)',
        border: 'none',
        borderRadius: 4,
        color: 'white',
        cursor: 'pointer',
        textAlign: 'left'
      }}
    >
      <span style={{ marginRight: 8 }}>{planet.fallbackColor}</span>
      {planet.name}
    </button>
  )
}
