import { useState } from 'react'
import './Bench.css'

function Bench({ players, onAddPlayer }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null)

  const handleSelectPosition = (position) => {
    onAddPlayer(selectedPlayer.id, position)
    setSelectedPlayer(null)
  }

  return (
    <div className="bench">
      <h2>Banca de Suplentes</h2>
      <div className="bench-container">
        {players.length === 0 ? (
          <p className="no-players">No hay suplentes disponibles</p>
        ) : (
          players.map(player => (
            <div key={player.id} className="bench-player">
              <div className="bench-player-icon">
                👤
              </div>
              <div className="bench-player-info">
                <p className="bench-player-name">{player.name}</p>
              </div>
              <button
                className="add-btn"
                onClick={() => setSelectedPlayer(player)}
                title="Agregar a la cancha"
              >
                ➕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Modal de selección de posición */}
      {selectedPlayer && (
        <div className="position-modal">
          <div className="position-modal-content">
            <h3>Seleccionar posición para {selectedPlayer.name}</h3>
            <div className="position-buttons">
              <button 
                className="position-btn arquero"
                onClick={() => handleSelectPosition('arquero')}
              >
                🧤 Arquero
              </button>
              <button 
                className="position-btn base"
                onClick={() => handleSelectPosition('base')}
              >
                🛡️ Base
              </button>
              <button 
                className="position-btn ala"
                onClick={() => handleSelectPosition('ala')}
              >
                🏃 Ala
              </button>
              <button 
                className="position-btn pivote"
                onClick={() => handleSelectPosition('pivote')}
              >
                ⚽ Pivote
              </button>
            </div>
            <button 
              className="position-close"
              onClick={() => setSelectedPlayer(null)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bench
