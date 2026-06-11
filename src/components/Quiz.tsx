import { useState, useCallback, useRef, useEffect } from 'react'
import { quizFragen } from '../data/quiz'

type QuizState = 'playing' | 'answered' | 'finished'

export default function Quiz() {
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [quizState, setQuizState] = useState<QuizState>('playing')

  const q = quizFragen[qi]!
  const progress = Math.round((qi / quizFragen.length) * 100)
  const isAnswered = quizState === 'answered'

  const handleAnswer = useCallback((idx: number) => {
    if (quizState !== 'playing') return
    setSelected(idx)
    setQuizState('answered')
    if (idx === q.antwort) setScore(s => s + 1)
  }, [quizState, q.antwort])

  const handleNext = useCallback(() => {
    if (qi + 1 >= quizFragen.length) {
      setQuizState('finished')
    } else {
      setQi(i => i + 1)
      setSelected(null)
      setQuizState('playing')
    }
  }, [qi])

  const handleReset = useCallback(() => {
    setQi(0)
    setScore(0)
    setSelected(null)
    setQuizState('playing')
  }, [])

  const barRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    barRef.current?.style.setProperty('--bar-w', `${progress}%`)
  }, [progress])

  const header = (
    <div className="section-header">
      <h2>Quiz</h2>
      <p>Teste dein Wissen mit {quizFragen.length} Fragen.</p>
    </div>
  )

  if (quizState === 'finished') {
    const pct = Math.round((score / quizFragen.length) * 100)
    const msg =
      score >= Math.ceil(quizFragen.length * 0.8)
        ? 'Ausgezeichnet! Du hast das Thema gut verstanden.'
        : score >= Math.ceil(quizFragen.length * 0.5)
        ? 'Gut! Mit etwas mehr Übung schaffst du es.'
        : 'Schau nochmal in die Referenz und die Aufgaben!'
    return (
      <div>
        {header}
        <div className="card">
          <div className="progress-wrap">
            <div className="progress-bar progress-bar--full" />
          </div>
          <div className="result-box">
            <div className="result-score">{score}/{quizFragen.length}</div>
            <p className="result-label">{pct}% richtig &mdash; {msg}</p>
            <button type="button" className="nav-btn" onClick={handleReset}>↺ Nochmal starten</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {header}
      <div className="card">
        <div className="progress-wrap">
          <div className="progress-bar" ref={barRef} />
        </div>
        <p className="quiz-num">Frage {qi + 1} / {quizFragen.length}</p>
        <p className="quiz-q">{q.frage}</p>
        <div className="options">
          {q.optionen.map((opt, i) => {
            let cls = 'opt-btn'
            if (isAnswered) {
              if (i === q.antwort) cls += ' correct'
              else if (i === selected) cls += ' wrong'
            }
            return (
              <button
                type="button"
                key={opt}
                className={cls}
                disabled={isAnswered}
                onClick={() => handleAnswer(i)}
              >
                {opt}
              </button>
            )
          })}
        </div>
        <p
          className={`quiz-feedback${isAnswered ? (selected === q.antwort ? ' quiz-feedback--correct' : ' quiz-feedback--wrong') : ''}`}
        >
          {isAnswered
            ? (selected === q.antwort ? '✓ Richtig! ' : '✗ Nicht ganz. ') + q.erklaerung
            : ''}
        </p>
        <div className="quiz-nav">
          <span className="score-pill">{score} / {qi} richtig</span>
          <button type="button" className="nav-btn" disabled={!isAnswered} onClick={handleNext}>
            Weiter →
          </button>
        </div>
      </div>
    </div>
  )
}
