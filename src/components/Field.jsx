import { useEffect, useRef, useState } from 'react'
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
    // add global move listeners so drag continues when pointer leaves the field
    window.addEventListener('pointermove', windowPointerMove)
    window.addEventListener('mousemove', windowPointerMove)
    // touchmove must be non-passive to allow preventDefault()
    window.addEventListener('touchmove', windowTouchMove, { passive: false })

    return () => {
      window.removeEventListener('mouseup', stopDragging)
      window.removeEventListener('touchend', stopDragging)
      window.removeEventListener('touchcancel', stopDragging)
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
      window.removeEventListener('blur', stopDragging)
      window.removeEventListener('pointermove', windowPointerMove)
      window.removeEventListener('mousemove', windowPointerMove)
      window.removeEventListener('touchmove', windowTouchMove, { passive: false })
    }
  }, [draggingId])

  const startDragging = (playerId) => {
    setDraggingId(playerId)
  }

  const fieldRef = useRef(null)

  // Window-level move handlers (defined here so we can add/remove in effect)
  const windowPointerMove = (e) => {
    // pointer & mouse
    updatePosition(e.clientX, e.clientY, fieldRef.current)
  }

  const windowTouchMove = (e) => {
    const touch = e.touches && e.touches[0]
    if (!touch) return
    e.preventDefault()
    updatePosition(touch.clientX, touch.clientY, fieldRef.current)
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
    e.preventDefault()
    startDragging(playerId)
  }

  const handlePointerDown = (e, playerId) => {
    e.preventDefault()
    // try to capture the pointer so moves continue even if it leaves the element
    try {
      e.currentTarget.setPointerCapture && e.currentTarget.setPointerCapture(e.pointerId)
    } catch (err) {}
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
      ref={fieldRef}
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
