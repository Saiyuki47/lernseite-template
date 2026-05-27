# Lernseite Template

Ein wiederverwendbares React-Template für interaktive Lernseiten zu beliebigen Themen – z. B. für Lehrveranstaltungen, Kurse oder Selbststudium.

## Features

| Tab | Beschreibung |
|-----|-------------|
| **Übungsblätter** | Aufgaben nach Blatt geordnet, mit optionalem Tipp und aufklappbarer Musterlösung |
| **Aufgaben** | Alle Aufgaben nach Schwierigkeit gefiltert, ebenfalls mit Tipp & Lösung |
| **Quiz** | Multiple-Choice-Quiz mit Fortschrittsbalken, Feedback und Ergebnisauswertung |
| **Referenz** | Cheatsheet-Karten als schnelle Nachschlagereferenz |
| **Themen** | Strukturierte Übersicht der Lernthemen mit Stichpunkten |

## Quickstart

```bash
npm install
npm run dev
```

## Eigene Inhalte eintragen

Alle Inhalte befinden sich in `src/data/`. Ersetze die Platzhalterwerte mit deinen eigenen:

| Datei | Inhalt |
|-------|--------|
| `src/data/aufgaben.ts` | Aufgaben mit Titel, Text, optionalem Tipp und Musterlösung |
| `src/data/uebungsblaetter.ts` | Übungsblätter, die Aufgaben per ID referenzieren |
| `src/data/quiz.ts` | Multiple-Choice-Fragen mit Antworten und Erklärungen |
| `src/data/referenz.ts` | Cheatsheet-Karten (Titel + Inhalt) |
| `src/data/themen.ts` | Lernthemen mit Beschreibung und Stichpunkten |

### Beispiel: Aufgabe hinzufügen

```ts
// src/data/aufgaben.ts
{
  id: 'a1',
  titel: 'Aufgabe 1',
  aufgabeText: 'Was ist ...?',
  tipp: 'Denke an ...', // optional
  loesung: 'Die Antwort lautet ...',
  schwierigkeit: 'einfach', // 'einfach' | 'mittel' | 'schwer'
  kategorie: 'Grundlagen', // optional
}
```

### Beispiel: Quiz-Frage hinzufügen

```ts
// src/data/quiz.ts
{
  frage: 'Was bedeutet ...?',
  optionen: ['Option A', 'Option B', 'Option C', 'Option D'],
  antwort: 0, // Index der richtigen Antwort (0-basiert)
  erklaerung: 'Option A ist richtig, weil ...',
}
```

## Projektstruktur

```
src/
├── components/       # UI-Komponenten (Tabs, Quiz, Aufgaben, …)
├── data/             # Inhalte – hier trägst du deine Daten ein
├── types.ts          # TypeScript-Typdefinitionen
└── index.css         # Globales Styling
```

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) als Build-Tool
