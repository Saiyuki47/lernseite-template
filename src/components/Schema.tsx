import { useState } from 'react'
import { themen } from '../data/themen'

export default function Schema() {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set())

  const toggle = (idx: number) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(idx) ? next.delete(idx) : next.add(idx)
      return next
    })
  }

  return (
    <div>
      <div className="section-header">
        <h2>Themen</h2>
        <p>Übersicht aller behandelten Themen und Inhalte.</p>
      </div>

      {themen.map((thema, idx) => {
        const isOpen = openIds.has(idx)
        return (
          <div key={idx} className="card">
            <button className="schema-data-toggle" onClick={() => toggle(idx)}>
              <span className="schema-data-arrow">{isOpen ? '▼' : '▶'}</span>
              <span className="schema-data-name">{thema.titel}</span>
            </button>
            {isOpen && (
              <div className="thema-detail">
                {thema.beschreibung && (
                  <p className="q-text">{thema.beschreibung}</p>
                )}
                {thema.punkte && thema.punkte.length > 0 && (
                  <ul className="thema-punkte">
                    {thema.punkte.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
