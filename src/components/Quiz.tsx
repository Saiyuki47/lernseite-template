import { useState, useRef, useCallback, useMemo, type CSSProperties } from 'react'
import { quizFragen } from '../data/quiz'
import { useQuizProgress } from '../hooks/useQuizProgress'
import type {
  QuizFrage,
  QuizSingle,
  QuizMulti,
  QuizZuordnung,
  QuizReihenfolge,
  QuizKategorien,
  QuizEingabe,
  QuizWahrFalsch,
} from '../types'

// ---------------------------------------------------------------------------
// Fortschritts-Badges (Streak / heute / gestern)
// ---------------------------------------------------------------------------
function ProgressBadges({ streak, today, yesterday }: { streak: number; today: number; yesterday: number }) {
  return (
    <div className="quiz-stats">
      <span className="quiz-stat">
        <span className="quiz-stat-num">🔥 {streak}</span>
        <span className="quiz-stat-label">Tage-Streak</span>
      </span>
      <span className="quiz-stat">
        <span className="quiz-stat-num">{today}</span>
        <span className="quiz-stat-label">heute richtig</span>
      </span>
      <span className="quiz-stat">
        <span className="quiz-stat-num">{yesterday}</span>
        <span className="quiz-stat-label">gestern richtig</span>
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Feedback-Boxen
// ---------------------------------------------------------------------------
function SingleFeedback({ q, picked }: { q: QuizSingle; picked: number }) {
  const correct = picked === q.richtige
  return (
    <div className={`quiz-feedback-box ${correct ? 'is-correct' : 'is-wrong'}`}>
      <p className="quiz-feedback-head">{correct ? '✓ Richtig!' : '✗ Leider falsch'}</p>
      {!correct && q.optionen[picked].warumFalsch && (
        <p className="quiz-feedback-why">Deine Antwort „{q.optionen[picked].text}": {q.optionen[picked].warumFalsch}</p>
      )}
      {!correct && (
        <p className="quiz-feedback-correct">Richtig wäre: {q.optionen[q.richtige].text}</p>
      )}
      <p className="quiz-feedback-exp">{q.erklaerung}</p>
    </div>
  )
}

function MultiFeedback({ q, sel }: { q: QuizMulti; sel: Set<number> }) {
  const correctSet = new Set(q.richtige)
  const allCorrect = sel.size === correctSet.size && [...sel].every(i => correctSet.has(i))
  const falschGewaehlt = [...sel].filter(i => !correctSet.has(i))
  const verpasst = q.richtige.filter(i => !sel.has(i))
  return (
    <div className={`quiz-feedback-box ${allCorrect ? 'is-correct' : 'is-wrong'}`}>
      <p className="quiz-feedback-head">{allCorrect ? '✓ Alles richtig!' : '✗ Nicht ganz'}</p>
      {falschGewaehlt.map(i =>
        q.optionen[i].warumFalsch ? (
          <p className="quiz-feedback-why" key={q.optionen[i].text}>
            Falsch gewählt „{q.optionen[i].text}": {q.optionen[i].warumFalsch}
          </p>
        ) : null,
      )}
      {verpasst.length > 0 && (
        <p className="quiz-feedback-correct">
          Fehlend: {verpasst.map(i => q.optionen[i].text).join(', ')}
        </p>
      )}
      <p className="quiz-feedback-exp">{q.erklaerung}</p>
    </div>
  )
}

function ZuordnungFeedback({ q, correct }: { q: QuizZuordnung; correct: boolean }) {
  return (
    <div className={`quiz-feedback-box ${correct ? 'is-correct' : 'is-wrong'}`}>
      <p className="quiz-feedback-head">{correct ? '✓ Alles richtig zugeordnet!' : '✗ Nicht ganz – richtige Zuordnung:'}</p>
      <ul className="quiz-feedback-list">
        {q.paare.map(p => (
          <li key={p.begriff}><strong>{p.begriff}</strong> → {p.ziel}</li>
        ))}
      </ul>
      <p className="quiz-feedback-exp">{q.erklaerung}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Fragetyp: Single-Choice
// ---------------------------------------------------------------------------
function SingleQuestion({ q, onDone }: { q: QuizSingle; onDone: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null)
  const revealed = picked !== null

  const pick = (i: number) => {
    if (revealed) return
    setPicked(i)
    onDone(i === q.richtige)
  }

  return (
    <>
      <div className="options">
        {q.optionen.map((opt, i) => {
          let cls = 'opt-btn'
          if (revealed) {
            if (i === q.richtige) cls += ' correct'
            else if (i === picked) cls += ' wrong'
          }
          return (
            <button type="button" key={opt.text} className={cls} disabled={revealed} onClick={() => pick(i)}>
              {opt.text}
            </button>
          )
        })}
      </div>
      {picked !== null && <SingleFeedback q={q} picked={picked} />}
    </>
  )
}

// ---------------------------------------------------------------------------
// Fragetyp: Mehrfachauswahl
// ---------------------------------------------------------------------------
function MultiQuestion({ q, onDone }: { q: QuizMulti; onDone: (correct: boolean) => void }) {
  const [sel, setSel] = useState<Set<number>>(new Set())
  const [revealed, setRevealed] = useState(false)
  const correctSet = useMemo(() => new Set(q.richtige), [q.richtige])

  const toggle = (i: number) => {
    if (revealed) return
    setSel(prev => {
      const n = new Set(prev)
      if (n.has(i)) n.delete(i)
      else n.add(i)
      return n
    })
  }

  const check = () => {
    if (revealed || sel.size === 0) return
    setRevealed(true)
    onDone(sel.size === correctSet.size && [...sel].every(i => correctSet.has(i)))
  }

  return (
    <>
      <p className="quiz-hint">Mehrere Antworten möglich – alle richtigen auswählen, dann prüfen.</p>
      <div className="options">
        {q.optionen.map((opt, i) => {
          const isSel = sel.has(i)
          let cls = 'opt-btn opt-btn--check'
          if (isSel && !revealed) cls += ' selected'
          if (revealed) {
            if (correctSet.has(i)) cls += ' correct'
            else if (isSel) cls += ' wrong'
          }
          return (
            <button
              type="button"
              key={opt.text}
              className={cls}
              disabled={revealed}
              aria-pressed={isSel}
              onClick={() => toggle(i)}
            >
              <span className="opt-check" aria-hidden="true">{isSel ? '☑' : '☐'}</span> {opt.text}
            </button>
          )
        })}
      </div>
      {!revealed ? (
        <button type="button" className="nav-btn quiz-check-btn" disabled={sel.size === 0} onClick={check}>
          Prüfen
        </button>
      ) : (
        <MultiFeedback q={q} sel={sel} />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Fragetyp: Zuordnung (Drag & Drop + Klick-Zuordnung als barrierearme Alternative)
// ---------------------------------------------------------------------------
function ZuordnungQuestion({ q, onDone }: { q: QuizZuordnung; onDone: (correct: boolean) => void }) {
  const begriffe = q.paare.map(p => p.begriff)
  const ziele = q.paare.map(p => p.ziel)
  // assign: ziel -> Index des dort abgelegten Begriffs
  const [assign, setAssign] = useState<Record<string, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const placed = new Set(Object.values(assign))
  const pool = begriffe.flatMap((_, i) => (placed.has(i) ? [] : [i]))
  const allAssigned = pool.length === 0

  const place = (begriffIdx: number, ziel: string) => {
    if (revealed) return
    setAssign(prev => {
      const next: Record<string, number> = {}
      for (const [z, b] of Object.entries(prev)) {
        if (b === begriffIdx || z === ziel) continue // alten Slot räumen / Ziel freimachen
        next[z] = b
      }
      next[ziel] = begriffIdx
      return next
    })
    setSelected(null)
  }

  const toPool = (begriffIdx: number) => {
    if (revealed) return
    setAssign(prev => {
      const next: Record<string, number> = {}
      for (const [z, b] of Object.entries(prev)) if (b !== begriffIdx) next[z] = b
      return next
    })
    setSelected(null)
  }

  const clickBegriff = (i: number) => {
    if (revealed) return
    setSelected(s => (s === i ? null : i))
  }

  const clickZiel = (ziel: string) => {
    if (revealed || selected === null) return
    place(selected, ziel)
  }

  const check = () => {
    if (revealed || !allAssigned) return
    setRevealed(true)
    onDone(q.paare.every((p, i) => assign[p.ziel] === i))
  }

  return (
    <>
      <p className="quiz-hint">Ziehe jeden Begriff auf sein Ziel (oder klicke Begriff &amp; Ziel nacheinander an).</p>

      <div
        className="zuordnung-pool"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          const idx = Number(e.dataTransfer.getData('text/plain'))
          if (!Number.isNaN(idx)) toPool(idx)
        }}
      >
        {pool.length === 0 && <span className="zuordnung-pool-empty">Alle zugeordnet</span>}
        {pool.map(i => (
          <button
            type="button"
            key={begriffe[i]}
            className={`zuordnung-chip${selected === i ? ' selected' : ''}`}
            draggable={!revealed}
            onDragStart={e => e.dataTransfer.setData('text/plain', String(i))}
            onClick={() => clickBegriff(i)}
          >
            {begriffe[i]}
          </button>
        ))}
      </div>

      <div className="zuordnung-targets">
        {ziele.map((ziel, zi) => {
          const here = assign[ziel]
          const filled = here !== undefined
          let cls = 'zuordnung-slot'
          if (revealed && filled) cls += assign[ziel] === zi ? ' correct' : ' wrong'
          return (
            <div
              key={ziel}
              className={cls}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                const idx = Number(e.dataTransfer.getData('text/plain'))
                if (!Number.isNaN(idx)) place(idx, ziel)
              }}
            >
              <span className="zuordnung-slot-label">{ziel}</span>
              <button
                type="button"
                className={`zuordnung-slot-drop${filled ? ' filled' : ''}`}
                onClick={() => (filled ? (revealed ? undefined : clickBegriff(here)) : clickZiel(ziel))}
                draggable={filled && !revealed}
                onDragStart={e => filled && e.dataTransfer.setData('text/plain', String(here))}
              >
                {filled ? begriffe[here] : 'hierher'}
              </button>
            </div>
          )
        })}
      </div>

      {!revealed ? (
        <button type="button" className="nav-btn quiz-check-btn" disabled={!allAssigned} onClick={check}>
          Prüfen
        </button>
      ) : (
        <ZuordnungFeedback q={q} correct={q.paare.every((p, i) => assign[p.ziel] === i)} />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Fragetyp: Reihenfolge (Items per Drag/Pfeile sortieren)
// ---------------------------------------------------------------------------
function shuffleIndices(n: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  // Nicht bereits in korrekter Reihenfolge starten (sofern möglich).
  if (n > 1 && arr.every((v, i) => v === i)) {
    ;[arr[0], arr[1]] = [arr[1], arr[0]]
  }
  return arr
}

function ReihenfolgeQuestion({ q, onDone }: { q: QuizReihenfolge; onDone: (correct: boolean) => void }) {
  const [order, setOrder] = useState<number[]>(() => shuffleIndices(q.schritte.length))
  const [revealed, setRevealed] = useState(false)
  const dragPos = useRef<number | null>(null)
  const richtig = !order.some((v, i) => v !== i)

  const move = (from: number, to: number) => {
    if (revealed || from === to || to < 0 || to >= order.length) return
    setOrder(prev => {
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  const check = () => {
    if (revealed) return
    setRevealed(true)
    onDone(richtig)
  }

  return (
    <>
      <p className="quiz-hint">In die richtige Reihenfolge bringen – ziehen oder mit ▲▼ verschieben.</p>
      <ol className="reihenfolge-list">
        {order.map((schrittIdx, pos) => {
          let cls = 'reihenfolge-item'
          if (revealed) cls += schrittIdx === pos ? ' correct' : ' wrong'
          return (
            <li
              key={q.schritte[schrittIdx]}
              className={cls}
              draggable={!revealed}
              onDragStart={() => { dragPos.current = pos }}
              onDragOver={e => e.preventDefault()}
              onDrop={() => { if (dragPos.current !== null) move(dragPos.current, pos); dragPos.current = null }}
            >
              <span className="reihenfolge-num">{pos + 1}</span>
              <span className="reihenfolge-text">{q.schritte[schrittIdx]}</span>
              {!revealed && (
                <span className="reihenfolge-arrows">
                  <button type="button" aria-label="nach oben" disabled={pos === 0} onClick={() => move(pos, pos - 1)}>▲</button>
                  <button type="button" aria-label="nach unten" disabled={pos === order.length - 1} onClick={() => move(pos, pos + 1)}>▼</button>
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {!revealed ? (
        <button type="button" className="nav-btn quiz-check-btn" onClick={check}>Prüfen</button>
      ) : (
        <div className={`quiz-feedback-box ${richtig ? 'is-correct' : 'is-wrong'}`}>
          <p className="quiz-feedback-head">{richtig ? '✓ Richtige Reihenfolge!' : '✗ Nicht ganz – richtig wäre:'}</p>
          <ol className="quiz-feedback-list quiz-feedback-list--ol">
            {q.schritte.map(s => <li key={s}>{s}</li>)}
          </ol>
          <p className="quiz-feedback-exp">{q.erklaerung}</p>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Fragetyp: Kategorisieren (Items in Töpfe einsortieren)
// ---------------------------------------------------------------------------
function KategorienQuestion({ q, onDone }: { q: QuizKategorien; onDone: (correct: boolean) => void }) {
  const [placement, setPlacement] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const pool = q.items.flatMap((_, i) => (placement[i] === undefined ? [i] : []))
  const allPlaced = pool.length === 0
  const richtig = !q.items.some((it, i) => placement[i] !== it.kategorie)

  const placeItem = (itemIdx: number, kat: string) => {
    if (revealed) return
    setPlacement(prev => ({ ...prev, [itemIdx]: kat }))
    setSelected(null)
  }
  const removeItem = (itemIdx: number) => {
    if (revealed) return
    setPlacement(prev => {
      const next = { ...prev }
      delete next[itemIdx]
      return next
    })
    setSelected(null)
  }

  const check = () => {
    if (revealed || !allPlaced) return
    setRevealed(true)
    onDone(richtig)
  }

  return (
    <>
      <p className="quiz-hint">Jedes Item in seine Kategorie ziehen – oder Item &amp; Kategorie anklicken.</p>
      <div
        className="kategorien-pool"
        onDragOver={e => e.preventDefault()}
        onDrop={e => { const idx = Number(e.dataTransfer.getData('text/plain')); if (!Number.isNaN(idx)) removeItem(idx) }}
      >
        {pool.length === 0 && <span className="zuordnung-pool-empty">Alle einsortiert</span>}
        {pool.map(i => (
          <button
            type="button"
            key={q.items[i].text}
            className={`zuordnung-chip${selected === i ? ' selected' : ''}`}
            draggable={!revealed}
            onDragStart={e => e.dataTransfer.setData('text/plain', String(i))}
            onClick={() => setSelected(s => (s === i ? null : i))}
          >
            {q.items[i].text}
          </button>
        ))}
      </div>
      <div className="kategorien-buckets">
        {q.kategorien.map(kat => {
          const inHere = q.items.flatMap((_, i) => (placement[i] === kat ? [i] : []))
          return (
            <div
              key={kat}
              className="kategorien-bucket"
              onDragOver={e => e.preventDefault()}
              onDrop={e => { const idx = Number(e.dataTransfer.getData('text/plain')); if (!Number.isNaN(idx)) placeItem(idx, kat) }}
            >
              <button
                type="button"
                className="kategorien-bucket-label"
                disabled={revealed}
                onClick={() => { if (selected !== null) placeItem(selected, kat) }}
              >
                {kat}
              </button>
              <div className="kategorien-bucket-items">
                {inHere.map(i => {
                  let cls = 'zuordnung-chip'
                  if (revealed) cls += q.items[i].kategorie === kat ? ' correct' : ' wrong'
                  return (
                    <button
                      type="button"
                      key={q.items[i].text}
                      className={cls}
                      draggable={!revealed}
                      onDragStart={e => e.dataTransfer.setData('text/plain', String(i))}
                      onClick={e => { e.stopPropagation(); removeItem(i) }}
                    >
                      {q.items[i].text}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      {!revealed ? (
        <button type="button" className="nav-btn quiz-check-btn" disabled={!allPlaced} onClick={check}>Prüfen</button>
      ) : (
        <div className={`quiz-feedback-box ${richtig ? 'is-correct' : 'is-wrong'}`}>
          <p className="quiz-feedback-head">{richtig ? '✓ Alles korrekt einsortiert!' : '✗ Nicht ganz – richtige Zuordnung:'}</p>
          <ul className="quiz-feedback-list">
            {q.items.map(it => <li key={it.text}><strong>{it.text}</strong> → {it.kategorie}</li>)}
          </ul>
          <p className="quiz-feedback-exp">{q.erklaerung}</p>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Fragetyp: Freie Eingabe (Text / Zahl mit Toleranz)
// ---------------------------------------------------------------------------
function normalizeText(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ')
}
function toNumber(s: string): number {
  return Number(s.replace(/\s/g, '').replace(',', '.'))
}
function eingabeRichtig(q: QuizEingabe, value: string): boolean {
  if (q.toleranz !== undefined) {
    const v = toNumber(value)
    return Number.isFinite(v) && q.loesungen.some(l => Math.abs(v - toNumber(l)) <= (q.toleranz ?? 0))
  }
  const nv = normalizeText(value)
  return q.loesungen.some(l => normalizeText(l) === nv)
}

function EingabeQuestion({ q, onDone }: { q: QuizEingabe; onDone: (correct: boolean) => void }) {
  const [value, setValue] = useState('')
  const [revealed, setRevealed] = useState(false)
  const richtig = eingabeRichtig(q, value)

  const check = () => {
    if (revealed || value.trim() === '') return
    setRevealed(true)
    onDone(richtig)
  }

  return (
    <>
      <p className="quiz-hint">{q.toleranz !== undefined ? 'Zahl eingeben.' : 'Antwort eintippen.'}</p>
      <form className="eingabe-form" onSubmit={e => { e.preventDefault(); check() }}>
        <input
          className="eingabe-input"
          type="text"
          value={value}
          disabled={revealed}
          placeholder={q.platzhalter ?? 'Deine Antwort…'}
          aria-label="Antwort"
          onChange={e => setValue(e.target.value)}
        />
        {!revealed && (
          <button type="submit" className="nav-btn quiz-check-btn" disabled={value.trim() === ''}>Prüfen</button>
        )}
      </form>
      {revealed && (
        <div className={`quiz-feedback-box ${richtig ? 'is-correct' : 'is-wrong'}`}>
          <p className="quiz-feedback-head">{richtig ? '✓ Richtig!' : '✗ Leider falsch'}</p>
          {!richtig && <p className="quiz-feedback-correct">Richtige Antwort: {q.loesungen[0]}</p>}
          <p className="quiz-feedback-exp">{q.erklaerung}</p>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Fragetyp: Wahr/Falsch-Aussagen
// ---------------------------------------------------------------------------
function WahrFalschQuestion({ q, onDone }: { q: QuizWahrFalsch; onDone: (correct: boolean) => void }) {
  const [answers, setAnswers] = useState<Record<number, boolean>>({})
  const [revealed, setRevealed] = useState(false)
  const allAnswered = !q.aussagen.some((_, i) => answers[i] === undefined)
  const richtig = !q.aussagen.some((a, i) => answers[i] !== a.wahr)

  const setAns = (i: number, val: boolean) => {
    if (revealed) return
    setAnswers(prev => ({ ...prev, [i]: val }))
  }
  const check = () => {
    if (revealed || !allAnswered) return
    setRevealed(true)
    onDone(richtig)
  }

  return (
    <>
      <p className="quiz-hint">Für jede Aussage „Wahr" oder „Falsch" wählen.</p>
      <div className="wf-list">
        {q.aussagen.map((a, i) => {
          const ans = answers[i]
          const isWrong = revealed && ans !== undefined && ans !== a.wahr
          let rowCls = 'wf-row'
          if (revealed) rowCls += ans === a.wahr ? ' correct' : ' wrong'
          return (
            <div key={a.text} className={rowCls}>
              <div className="wf-line">
                <span className="wf-text">{a.text}</span>
                <span className="wf-buttons">
                  <button type="button" className={`wf-btn${ans === true ? ' on' : ''}`} disabled={revealed} onClick={() => setAns(i, true)}>Wahr</button>
                  <button type="button" className={`wf-btn${ans === false ? ' on' : ''}`} disabled={revealed} onClick={() => setAns(i, false)}>Falsch</button>
                </span>
              </div>
              {isWrong && a.warum && <p className="wf-why">{a.warum}</p>}
            </div>
          )
        })}
      </div>
      {!revealed ? (
        <button type="button" className="nav-btn quiz-check-btn" disabled={!allAnswered} onClick={check}>Prüfen</button>
      ) : (
        <div className={`quiz-feedback-box ${richtig ? 'is-correct' : 'is-wrong'}`}>
          <p className="quiz-feedback-head">{richtig ? '✓ Alles richtig!' : '✗ Nicht alles richtig – siehe Markierungen oben.'}</p>
          <p className="quiz-feedback-exp">{q.erklaerung}</p>
        </div>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Quiz-Hauptkomponente
// ---------------------------------------------------------------------------
type Phase = 'playing' | 'answered'

export default function Quiz() {
  const { streak, today, yesterday, recordCorrect } = useQuizProgress()
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('playing')
  const [finished, setFinished] = useState(false)

  const total = quizFragen.length
  const q = quizFragen[qi]
  const progress = total > 0 ? Math.round((qi / total) * 100) : 0

  const handleDone = useCallback((correct: boolean) => {
    setPhase('answered')
    if (correct) {
      setScore(s => s + 1)
      recordCorrect()
    }
  }, [recordCorrect])

  const handleNext = useCallback(() => {
    if (qi + 1 >= total) {
      setFinished(true)
    } else {
      setQi(i => i + 1)
      setPhase('playing')
    }
  }, [qi, total])

  const handleReset = useCallback(() => {
    setQi(0)
    setScore(0)
    setPhase('playing')
    setFinished(false)
  }, [])

  const header = (
    <div className="section-header">
      <h2>Quiz</h2>
      <p>Teste dein Wissen mit {total} Fragen in verschiedenen Aufgabentypen.</p>
    </div>
  )

  if (total === 0 || !q) {
    return (
      <div>
        {header}
        <div className="card"><p className="quiz-hint">Noch keine Quizfragen vorhanden.</p></div>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / total) * 100)
    const msg =
      score >= Math.ceil(total * 0.8)
        ? 'Ausgezeichnet! Du hast das Thema gut verstanden.'
        : score >= Math.ceil(total * 0.5)
        ? 'Gut! Mit etwas mehr Übung schaffst du es.'
        : 'Schau nochmal in die Aufgaben und Lösungen!'
    return (
      <div>
        {header}
        <ProgressBadges streak={streak} today={today} yesterday={yesterday} />
        <div className="card">
          <div className="progress-wrap"><div className="progress-bar progress-bar--full" /></div>
          <div className="result-box">
            <div className="result-score">{score}/{total}</div>
            <p className="result-label">{pct}% richtig &mdash; {msg}</p>
            <button type="button" className="nav-btn" onClick={handleReset}>↺ Nochmal starten</button>
          </div>
        </div>
      </div>
    )
  }

  const answered = phase === 'answered'

  return (
    <div>
      {header}
      <ProgressBadges streak={streak} today={today} yesterday={yesterday} />
      <div className="card">
        <div className="progress-wrap">
          <div className="progress-bar" style={{ '--bar-w': `${progress}%` } as CSSProperties} />
        </div>
        <p className="quiz-num">Frage {qi + 1} / {total} · {labelFor(q.art)}</p>
        <p className="quiz-q">{q.frage}</p>

        {q.art === 'single' && <SingleQuestion key={qi} q={q} onDone={handleDone} />}
        {q.art === 'multi' && <MultiQuestion key={qi} q={q} onDone={handleDone} />}
        {q.art === 'zuordnung' && <ZuordnungQuestion key={qi} q={q} onDone={handleDone} />}
        {q.art === 'reihenfolge' && <ReihenfolgeQuestion key={qi} q={q} onDone={handleDone} />}
        {q.art === 'kategorien' && <KategorienQuestion key={qi} q={q} onDone={handleDone} />}
        {q.art === 'eingabe' && <EingabeQuestion key={qi} q={q} onDone={handleDone} />}
        {q.art === 'wahrfalsch' && <WahrFalschQuestion key={qi} q={q} onDone={handleDone} />}

        <div className="quiz-nav">
          <span className="score-pill">{score} / {qi + (answered ? 1 : 0)} richtig{q.quelle ? ` · ${q.quelle}` : ''}</span>
          <button type="button" className="nav-btn" disabled={!answered} onClick={handleNext}>
            {qi + 1 >= total ? 'Ergebnis →' : 'Weiter →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Kurzlabel für den Fragetyp (im Frage-Zähler angezeigt).
const TYP_LABEL: Record<QuizFrage['art'], string> = {
  single: 'Single-Choice',
  multi: 'Mehrfachauswahl',
  zuordnung: 'Zuordnung',
  reihenfolge: 'Reihenfolge',
  kategorien: 'Kategorisieren',
  eingabe: 'Eingabe',
  wahrfalsch: 'Wahr/Falsch',
}
function labelFor(art: QuizFrage['art']): string {
  return TYP_LABEL[art]
}
