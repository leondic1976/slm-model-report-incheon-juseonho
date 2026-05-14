'use client'

import { useState } from 'react'
import BasicCalculator from './components/BasicCalculator'
import ScientificCalculator from './components/ScientificCalculator'
import FunctionPlotter from './components/FunctionPlotter'
import EngineeringCalculator from './components/EngineeringCalculator'
import AstronomyCalculator from './components/AstronomyCalculator'

const tabs = [
  { id: 'basic', label: 'Basic', icon: '🔢' },
  { id: 'scientific', label: 'Scientific', icon: '🧮' },
  { id: 'functions', label: 'Graph', icon: '📈' },
  { id: 'engineering', label: 'Engineering', icon: '⚙' },
  { id: 'astronomy', label: 'Astronomy', icon: '🌌' },
] as const

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('basic')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Advanced Calculator
          </h1>
          <p className="text-gray-500 text-sm mt-1">Multi-function scientific calculator with graphing &amp; astronomy</p>
        </header>

        <nav className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <main className="bg-gray-900/50 rounded-2xl p-4 md:p-6 border border-gray-800/50">
          {activeTab === 'basic' && <BasicCalculator />}
          {activeTab === 'scientific' && <ScientificCalculator />}
          {activeTab === 'functions' && <FunctionPlotter />}
          {activeTab === 'engineering' && <EngineeringCalculator />}
          {activeTab === 'astronomy' && <AstronomyCalculator />}
        </main>

        <footer className="text-center text-xs text-gray-600 mt-8">
          Built with Next.js &amp; Tailwind CSS
        </footer>
      </div>
    </div>
  )
}
