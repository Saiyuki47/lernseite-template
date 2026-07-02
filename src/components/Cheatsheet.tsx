import { Referenz, type ReferenzKarte } from 'lernseiten-ui'
import { referenzKarten } from '../data/referenz'

// Slug aus dem Titel – Fallback für Inhaltsverzeichnis + Deep-Link (#referenz/<id>),
// falls eine Karte kein explizites `id` mitbringt.
const slug = (s: string, i: number) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9äöü]+/g, '-')
    .replace(/^-+|-+$/g, '') || `thema-${i}`

// Template ohne KaTeX: Inhalt wird als vorformatierter Text gerendert.
const renderBlock = (t: string) => (
  <div style={{ whiteSpace: 'pre-wrap' }}>{t}</div>
)

const karten: ReferenzKarte[] = referenzKarten.map((k, i) => ({
  id: slug(k.titel, i),
  titel: k.titel,
  inhalt: k.inhalt,
}))

export default function Cheatsheet() {
  return <Referenz karten={karten} render={renderBlock} />
}
