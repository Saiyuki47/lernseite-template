import { lazy, Suspense } from 'react'
import Tabs from './components/Tabs'
import { Header, GlobalSearch, useTheme, useHashTab } from 'lernseiten-ui'
import { quizFragen } from './data/quiz'
import { karteikarten } from './data/karteikarten'
import { searchIndex } from './data/searchIndex'

const Cheatsheet = lazy(() => import('./components/Cheatsheet'))
const Schema = lazy(() => import('./components/Schema'))
const Uebungsblaetter = lazy(() => import('./components/Uebungsblaetter'))
const Quiz = lazy(() => import('lernseiten-ui').then(m => ({ default: m.Quiz })))
const Flashcards = lazy(() => import('lernseiten-ui').then(m => ({ default: m.Flashcards })))

export type TabId = 'uebung' | 'themen' | 'referenz' | 'quiz' | 'karten'

const TABS: readonly TabId[] = ['uebung', 'themen', 'referenz', 'quiz', 'karten']

function App() {
  const [activeTab, setActiveTab] = useHashTab(TABS, 'uebung')
  const { theme, toggle } = useTheme()

  return (
    <>
      <Header logo={<>Lern<span>.</span>Seite</>} subtitle="Dein Thema — Dein Untertitel" theme={theme} onToggleTheme={toggle} />
      <div className="container">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
          <GlobalSearch index={searchIndex} onNavigate={t => setActiveTab(t as TabId)} />
        </div>
        <Suspense fallback={<div className="card"><p className="quiz-hint">Lädt …</p></div>}>
          {activeTab === 'referenz' && <Cheatsheet />}
          {activeTab === 'themen' && <Schema />}
          {activeTab === 'quiz' && <Quiz fragen={quizFragen} />}
          {activeTab === 'karten' && <Flashcards cards={karteikarten} />}
          {activeTab === 'uebung' && <Uebungsblaetter />}
        </Suspense>
      </div>
    </>
  )
}

export default App
