import { useState } from 'react'
import { aufgaben } from '../data/aufgaben'

const DIFF_LABEL: Record<string, string> = {
  einfach: 'Einfach',
  mittel: 'Mittel',
  schwer: 'Schwer',
}

const DIFF_CLASS: Record<string, string> = {
  einfach: 'badge-easy',
  mittel: 'badge-med',
  schwer: 'badge-hard',
}

export default function Aufgaben() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [openTipps, setOpenTipps] = useState<Set<string>>(new Set())

  const toggleTipp = (id: string) => {
    setOpenTipps(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <div className="section-header">
        <h2>Aufgaben mit Musterlösung</h2>
        <p>Klicke auf "Lösung anzeigen" nach eigenen Überlegungen.</p>
      </div>

      {aufgaben.map(a => {
        const isOpen = openIds.has(a.id)
        return (
          <div key={a.id} className="card">
            <div className="badge-row">
              {a.kategorie && (
                <span className="badge badge-pv">{a.kategorie}</span>
              )}
              <span className={`badge ${DIFF_CLASS[a.schwierigkeit]}`}>
                {DIFF_LABEL[a.schwierigkeit]}
              </span>
            </div>
            <p className="q-title">{a.titel}</p>
            <p className="q-text">{a.aufgabeText}</p>
            {a.tipp && (
              <>
                <button className="toggle-btn" onClick={() => toggleTipp(a.id)}>
                  {openTipps.has(a.id) ? '▼ Tipp verbergen' : '▶ Tipp anzeigen'}
                </button>
                {openTipps.has(a.id) && (
                  <p className="tipp-block">{a.tipp}</p>
                )}
              </>
            )}
            <button className="toggle-btn" onClick={() => toggle(a.id)}>
              {isOpen ? '▼ Lösung verbergen' : '▶ Lösung anzeigen'}
            </button>
            {isOpen && (
              <pre className="sql-block visible">{a.loesung}</pre>
            )}
          </div>
        )
      })}
    </div>
  )
}
