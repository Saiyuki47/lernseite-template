import { useState } from 'react'
import { themen } from '../data/themen'

export default function Schema() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <div>
      <div className="section-header">
        <h2>Themen</h2>
        <p>Übersicht aller behandelten Themen und Inhalte.</p>
      </div>

      {themen.map(thema => {
        const isOpen = openIds.has(thema.titel)
        return (
          <div key={thema.titel} className="card">
            <button type="button" className="schema-data-toggle" onClick={() => toggle(thema.titel)}>
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
                    {thema.punkte.map(p => (
                      <li key={`${thema.titel}-${p}`}>{p}</li>
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
