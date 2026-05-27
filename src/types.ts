export type Schwierigkeit = 'einfach' | 'mittel' | 'schwer'

export interface ReferenzKarte {
  titel: string
  inhalt: string
}

export interface QuizFrage {
  frage: string
  optionen: string[]
  antwort: number
  erklaerung: string
}

export interface Aufgabe {
  id: string
  titel: string
  aufgabeText: string
  tipp?: string
  loesung: string
  schwierigkeit: Schwierigkeit
  kategorie?: string
}

export interface UebungsblattAufgabe {
  nr: number
  text: string
  aufgabeId: string
}

export interface Uebungsblatt {
  id: string
  nr: string
  typ: 'Hausaufgabe' | 'Präsenzaufgabe'
  beschreibung?: string
  aufgaben: UebungsblattAufgabe[]
}

export interface Thema {
  titel: string
  beschreibung?: string
  punkte?: string[]
}
