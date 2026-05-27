import { useState } from 'react'
import { uebungsblaetter } from '../data/uebungsblaetter'
import { aufgaben } from '../data/aufgaben'

export default function Uebungsblaetter() {
  const [selectedId, setSelectedId] = useState(uebungsblaetter[0]?.id ?? '')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [openTipps, setOpenTipps] = useState<Set<string>>(new Set())

  const blatt = uebungsblaetter.find(b => b.id === selectedId)

  const toggleTipp = (key: string) => {
    setOpenTipps(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const toggleSolution = (key: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div>
      <div className="section-header">
        <h2>Übungsblätter</h2>
        <p>Aufgaben und Musterlösungen nach Übungsblatt geordnet.</p>
      </div>

      {uebungsblaetter.length > 1 && (
        <div className="filter-row">
          {uebungsblaetter.map(b => (
            <button
              key={b.id}
              className={`filter-btn${selectedId === b.id ? ' on' : ''}`}
              onClick={() => setSelectedId(b.id)}
            >
              Blatt {b.nr}
            </button>
          ))}
        </div>
      )}

      {blatt && (
        <>
          <div className="ub-header card">
            <div className="ub-meta-row">
              <span className="ub-badge">{blatt.typ}</span>
            </div>
            <h3 className="ub-title">Übungsblatt {blatt.nr}</h3>
            {blatt.beschreibung && (
              <p className="ub-desc">{blatt.beschreibung}</p>
            )}
          </div>

          {blatt.aufgaben.map(task => {
            const aufgabe = aufgaben.find(a => a.id === task.aufgabeId)
            const key = `${blatt.id}-${task.nr}`
            const isOpen = openIds.has(key)
            const isTippOpen = openTipps.has(key)

            return (
              <div key={key} className="card">
                <p className="ub-task-nr">Aufgabe {task.nr}</p>
                <p className="q-title">{task.text}</p>
                {aufgabe && (
                  <>
                    {aufgabe.tipp && (
                      <>
                        <button className="toggle-btn" onClick={() => toggleTipp(key)}>
                          {isTippOpen ? '▼ Tipp verbergen' : '▶ Tipp anzeigen'}
                        </button>
                        {isTippOpen && (
                          <p className="tipp-block">{aufgabe.tipp}</p>
                        )}
                      </>
                    )}
                    <button className="toggle-btn" onClick={() => toggleSolution(key)}>
                      {isOpen ? '▼ Lösung verbergen' : '▶ Lösung anzeigen'}
                    </button>
                    {isOpen && (
                      <pre className="sql-block visible">{aufgabe.loesung}</pre>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

