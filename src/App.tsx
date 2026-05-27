import { useState } from 'react'
import Header from './components/Header'
import Tabs from './components/Tabs'
import Cheatsheet from './components/Cheatsheet'
import Schema from './components/Schema'
import Quiz from './components/Quiz'
import Uebungsblaetter from './components/Uebungsblaetter'

export type TabId = 'referenz' | 'themen' | 'quiz' | 'aufgaben'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('aufgaben')

  return (
    <>
      <Header />
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
