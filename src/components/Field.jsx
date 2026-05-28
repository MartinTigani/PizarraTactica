import { useEffect, useState } from 'react'
import Player from './Player'
import './Field.css'

function Field({ players, onDragEnd, onRemovePlayer }) {
  const [draggingId, setDraggingId] = useState(null)

  useEffect(() => {
    if (draggingId === null) return

    const stopDragging = () => setDraggingId(null)

    window.addEventListener('mouseup', stopDragging)
    window.addEventListener('touchend', stopDragging)
    window.addEventListener('touchcancel', stopDragging)
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)
    window.addEventListener('blur', stopDragging)

    return () => {
      window.removeEventListener('mouseup', stopDragging)
      window.removeEventListener('touchend', stopDragging)
      window.removeEventListener('touchcancel', stopDragging)
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
      window.removeEventListener('blur', stopDragging)
    }
  }, [draggingId])

  const startDragging = (playerId) => {
    setDraggingId(playerId)
  }

  const updatePosition = (clientX, clientY, fieldElement) => {
    if (draggingId === null) return

    const rect = fieldElement.getBoundingClientRect()
    let x = ((clientX - rect.left) / rect.width) * 100
    let y = ((clientY - rect.top) / rect.height) * 100

    // Limitar posición dentro del campo
    x = Math.max(5, Math.min(95, x))
    y = Math.max(5, Math.min(95, y))

    const player = players.find(p => p.id === draggingId)
    if (player) {
      onDragEnd(draggingId, x, y)
    }
  }

  const handleMouseDown = (e, playerId) => {
    e.preventDefault()
    startDragging(playerId)
  }

  const handleTouchStart = (e, playerId) => {
    const touch = e.touches[0]
    if (!touch) return
    startDragging(playerId)
  }

  const handlePointerDown = (e, playerId) => {
    e.preventDefault()
    startDragging(playerId)
  }

  const handleMouseMove = (e) => {
    updatePosition(e.clientX, e.clientY, e.currentTarget)
  }

  const handleTouchMove = (e) => {
    if (draggingId === null) return
    const touch = e.touches[0]
    if (!touch) return
    e.preventDefault()
    updatePosition(touch.clientX, touch.clientY, e.currentTarget)
  }

  const handlePointerMove = (e) => {
    if (draggingId === null) return
    updatePosition(e.clientX, e.clientY, e.currentTarget)
  }

  const handleMouseUp = () => {
    setDraggingId(null)
  }

  const handleTouchEnd = () => {
    setDraggingId(null)
  }

  const getPlayerIcon = (position) => {
    switch (position) {
      case 'arquero':
        return '🧤'
      case 'base':
      case 'defensor':
        return '🛡️'
      case 'ala':
        return '🏃'
      case 'pivote':
      case 'delantero':
        return '⚽'
      default:
        return '👤'
    }
  }

  return (
    <div
      className="field"
      onMouseMove={handleMouseMove}
      onPointerMove={handlePointerMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <h2>Cancha</h2>
      <div className="field-container">
        {/* Líneas del campo */}
        <div className="field-center-line"></div>
        <div className="field-circle"></div>
        <div className="field-goal-area left"></div>
        <div className="field-goal-area right"></div>

        {/* Jugadores */}
        {players.map(player => (
          <div
            key={player.id}
            className={`player-wrapper ${draggingId === player.id ? 'dragging' : ''}`}
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
            }}
            onMouseDown={e => handleMouseDown(e, player.id)}
            onPointerDown={e => handlePointerDown(e, player.id)}
            onTouchStart={e => handleTouchStart(e, player.id)}
          >
            <Player
              player={player}
              icon={getPlayerIcon(player.position)}
              onRemove={() => onRemovePlayer(player.id)}
              isDragging={draggingId === player.id}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Field
