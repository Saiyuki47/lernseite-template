import { useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Cheatsheet from './components/Cheatsheet'
import Schema from './components/Schema'
import Uebungsblaetter from './components/Uebungsblaetter'
import { Quiz, useTheme } from 'lernseiten-ui'
import { quizFragen } from './data/quiz'

export type TabId = 'uebung' | 'themen' | 'referenz' | 'quiz'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('uebung')
  const { theme, toggle } = useTheme()

  return (
    <>
      <Header theme={theme} onToggleTheme={toggle} />
      <div className="container">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'referenz' && <Cheatsheet />}
        {activeTab === 'themen' && <Schema />}
        {activeTab === 'quiz' && <Quiz fragen={quizFragen} />}
        {activeTab === 'uebung' && <Uebungsblaetter />}
      </div>
    </>
  )
}

export default App
