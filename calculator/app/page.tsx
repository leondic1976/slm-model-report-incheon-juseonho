'use client'

import { useState } from 'react'
import BasicCalculator from './components/BasicCalculator'
import ScientificCalculator from './components/ScientificCalculator'
import FunctionPlotter from './components/FunctionPlotter'
import EngineeringCalculator from './components/EngineeringCalculator'
import AstronomyCalculator from './components/AstronomyCalculator'

const tabs = [
  { id: 'basic', label: '기본', icon: '🔢' },
  { id: 'scientific', label: '공학용', icon: '🧮' },
  { id: 'functions', label: '함수·그래프', icon: '📈' },
  { id: 'engineering', label: '공학 변환', icon: '⚙' },
  { id: 'astronomy', label: '천문학', icon: '🌌' },
] as const

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('basic')

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#1a1a2e]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            고급 계산기
          </h1>
          <p className="text-gray-500 text-base mt-2">공학용 · 그래프 · 단위변환 · 천문학 올인원 계산기</p>
        </header>

        <nav className="flex gap-1 mb-6 bg-white rounded-xl p-1.5 shadow-sm border border-gray-200 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-base font-medium transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <main className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          {activeTab === 'basic' && <BasicCalculator />}
          {activeTab === 'scientific' && <ScientificCalculator />}
          {activeTab === 'functions' && <FunctionPlotter />}
          {activeTab === 'engineering' && <EngineeringCalculator />}
          {activeTab === 'astronomy' && <AstronomyCalculator />}
        </main>

        <footer className="text-center text-sm text-gray-400 mt-8">
          Next.js &amp; Tailwind CSS로 제작
        </footer>
      </div>
    </div>
  )
}
