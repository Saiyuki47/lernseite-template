import type { QuizFrage } from '../types'

// TODO: Ersetze die Beispielfragen mit deinen eigenen Quiz-Fragen
export const quizFragen: QuizFrage[] = [
  {
    frage: 'Was ist die richtige Antwort auf diese Beispielfrage?',
    optionen: ['Antwort A', 'Antwort B', 'Antwort C', 'Antwort D'],
    antwort: 0,
    erklaerung: 'Antwort A ist korrekt, weil ...',
  },
  {
    frage: 'Welche der folgenden Aussagen ist falsch?',
    optionen: ['Aussage 1', 'Aussage 2', 'Aussage 3', 'Aussage 4'],
    antwort: 2,
    erklaerung: 'Aussage 3 ist falsch, weil ...',
  },
  {
    frage: 'Was beschreibt das Konzept X am besten?',
    optionen: ['Definition A', 'Definition B', 'Definition C', 'Definition D'],
    antwort: 1,
    erklaerung: 'Definition B ist am treffendsten, weil ...',
  },
]
