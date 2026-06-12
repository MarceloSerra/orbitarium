import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'

export default function InfoPanel() {
  const selectedPlanet = useStore((state) => state.selectedPlanet)
  const showInfoPanel = useStore((state) => state.showInfoPanel)
  const setSelectedPlanet = useStore((state) => state.setSelectedPlanet)

  return (
    <AnimatePresence>
      {showInfoPanel && selectedPlanet && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 320,
            height: '100vh',
            background: 'rgba(10, 10, 30, 0.95)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '24px',
            color: 'white',
            overflowY: 'auto',
            zIndex: 1000
          }}
        >
          <button
            onClick={() => setSelectedPlanet(null)}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: 24,
              cursor: 'pointer'
            }}
          >
            ×
          </button>

          <h1 style={{ fontSize: 28, marginBottom: 8 }}>{selectedPlanet.name}</h1>
          <span style={{
            display: 'block',
            fontSize: 14,
            color: '#aaa',
            textTransform: 'uppercase',
            marginBottom: 20
          }}>
            {selectedPlanet.type} planet
          </span>

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8, color: '#88aaff' }}>Physical Data</h3>
            <p>Radius: {selectedPlanet.radius.toLocaleString()} km</p>
            <p>Distance from Sun: {selectedPlanet.distanceFromSun} AU</p>
            <p>Orbital Period: {selectedPlanet.orbitalPeriod} days</p>
            <p>Temperature: {selectedPlanet.temperature}°C</p>
          </div>

          {selectedPlanet.atmosphere.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, marginBottom: 8, color: '#88aaff' }}>Atmosphere</h3>
              <p>{selectedPlanet.atmosphere.join(', ')}</p>
            </div>
          )}

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, marginBottom: 8, color: '#88aaff' }}>Moons</h3>
            <p>{selectedPlanet.moons}</p>
          </div>

          {selectedPlanet.facts.length > 0 && (
            <div>
              <h3 style={{ fontSize: 16, marginBottom: 8, color: '#88aaff' }}>Fun Facts</h3>
              <ul style={{ paddingLeft: 20 }}>
                {selectedPlanet.facts.map((fact) => (
                  <li key={fact} style={{ marginBottom: 4 }}>{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}