import { useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Cheatsheet from './components/Cheatsheet'
import Schema from './components/Schema'
import Quiz from './components/Quiz'
import Uebungsblaetter from './components/Uebungsblaetter'
import { useTheme } from './hooks/useTheme'

export type TabId = 'referenz' | 'themen' | 'quiz' | 'aufgaben'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('aufgaben')
  const { theme, toggle } = useTheme()

  return (
    <>
      <Header theme={theme} onToggleTheme={toggle} />
      <div className="container">
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'referenz' && <Cheatsheet />}
        {activeTab === 'themen' && <Schema />}
        {activeTab === 'quiz' && <Quiz />}
        {activeTab === 'aufgaben' && <Uebungsblaetter />}
      </div>
    </>
  )
}

export default App
