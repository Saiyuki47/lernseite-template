import { referenzKarten } from '../data/referenz'

export default function Cheatsheet() {
  return (
    <div>
      <div className="section-header">
        <h2>Referenz</h2>
        <p>Die wichtigsten Konzepte und Formeln auf einen Blick.</p>
      </div>
      <div className="cheat-grid">
        {referenzKarten.map(karte => (
          <div key={karte.titel} className="cheat-card">
            <h3>{karte.titel}</h3>
            <pre className="cheat-code">{karte.inhalt}</pre>
          </div>
        ))}
      </div>
    </div>
  )
}
