import { useState } from 'react'
import './App.css'
import Field from './components/Field'
import Bench from './components/Bench'

function App() {
  const [fieldPlayers, setFieldPlayers] = useState([])

  const [benchPlayers, setBenchPlayers] = useState([
    { id: 1, name: 'Gonzalo' },
    { id: 2, name: 'Lucas' },
    { id: 3, name: 'Negro' },
    { id: 4, name: 'Tincho' },
    { id: 5, name: 'Mono' },
    { id: 6, name: 'Pollo' },
    { id: 7, name: 'Nacho' },
    { id: 8, name: 'Melli' },
    { id: 9, name: 'Leo' },
    { id: 10, name: 'Fer' },
  ])

  const handleDragEnd = (playerId, newX, newY) => {
    setFieldPlayers(prev =>
      prev.map(p =>
        p.id === playerId ? { ...p, x: newX, y: newY } : p
      )
    )
  }

  const handleRemoveFromField = (playerId) => {
    const player = fieldPlayers.find(p => p.id === playerId)
    if (player) {
      setFieldPlayers(prev => prev.filter(p => p.id !== playerId))
      setBenchPlayers(prev => [...prev, { id: player.id, name: player.name, position: player.position }])
    }
  }

  const handleAddToField = (playerId, position) => {
    const player = benchPlayers.find(p => p.id === playerId)
    if (player) {
      setBenchPlayers(prev => prev.filter(p => p.id !== playerId))
      const newX = position === 'arquero' ? 50 : (position === 'delantero' ? 50 : 50)
      const newY = position === 'arquero' ? 10 : (position === 'delantero' ? 70 : 30)
      setFieldPlayers(prev => [...prev, { ...player, position, x: newX, y: newY }])
    }
  }

  return (
    <div className="app-container">
      <h1>⚽ Alineación de Fútbol</h1>
      <div className="main-content">
        <Field players={fieldPlayers} onDragEnd={handleDragEnd} onRemovePlayer={handleRemoveFromField} />
        <Bench players={benchPlayers} onAddPlayer={handleAddToField} />
      </div>
    </div>
  )
}

export default App
