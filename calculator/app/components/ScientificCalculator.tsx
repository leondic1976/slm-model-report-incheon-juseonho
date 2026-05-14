'use client'

import { useState } from 'react'

export default function ScientificCalculator() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG')
  const [history, setHistory] = useState<string[]>([])

  const toRad = (v: number) => angleMode === 'DEG' ? v * Math.PI / 180 : v
  const fromRad = (v: number) => angleMode === 'DEG' ? v * 180 / Math.PI : v

  const append = (s: string) => setInput(prev => prev + s)

  const calc = () => {
    try {
      const raw = input.replace(/π/g, String(Math.PI)).replace(/e(?![xp])/g, String(Math.E))
      const val = Function('"use strict"; return (' + raw + ')')()
      const r = String(val)
      setResult(r)
      setHistory(h => [`= ${r}`, ...h.slice(0, 49)])
    } catch { setResult('오류') }
  }

  const unary = (fn: (v: number) => number, label: string) => {
    try {
      const raw = input.replace(/π/g, String(Math.PI)).replace(/e(?![xp])/g, String(Math.E))
      const val = Function('"use strict"; return (' + raw + ')')()
      const v = fn(val)
      const r = String(v)
      setResult(r)
      setHistory(h => [`${label}(${input}) = ${r}`, ...h.slice(0, 49)])
    } catch { setResult('오류') }
  }

  const cls = (extra = '') =>
    `p-4 text-base font-bold rounded-xl transition-all active:scale-95 ${extra}`

  return (
    <div>
      <div className="bg-gray-50 border-2 border-gray-200 text-gray-800 p-5 rounded-2xl mb-4">
        <div className="text-sm text-gray-400 mb-1 font-mono">{input || '\u00A0'}</div>
        <div className="text-4xl font-mono truncate">{result ?? '0'}</div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setAngleMode('DEG')} className={`px-4 py-1.5 text-sm font-bold rounded-lg ${angleMode === 'DEG' ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>DEG</button>
        <button onClick={() => setAngleMode('RAD')} className={`px-4 py-1.5 text-sm font-bold rounded-lg ${angleMode === 'RAD' ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>RAD</button>
        <div className="flex-1" />
        <button onClick={() => { setInput(''); setResult(null) }} className="px-4 py-1.5 text-sm font-bold bg-red-100 text-red-500 rounded-lg hover:bg-red-200">AC</button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {btn('sin', () => unary(v => Math.sin(toRad(v)), 'sin'), cls('bg-purple-100 text-purple-700 hover:bg-purple-200'))}
        {btn('cos', () => unary(v => Math.cos(toRad(v)), 'cos'), cls('bg-purple-100 text-purple-700 hover:bg-purple-200'))}
        {btn('tan', () => unary(v => Math.tan(toRad(v)), 'tan'), cls('bg-purple-100 text-purple-700 hover:bg-purple-200'))}
        {btn('ln', () => unary(Math.log, 'ln'), cls('bg-purple-100 text-purple-700 hover:bg-purple-200'))}
        {btn('log', () => unary(v => Math.log10(v), 'log'), cls('bg-purple-100 text-purple-700 hover:bg-purple-200'))}

        {btn('asin', () => unary(v => fromRad(Math.asin(v)), 'asin'), cls('bg-indigo-100 text-indigo-700 hover:bg-indigo-200'))}
        {btn('acos', () => unary(v => fromRad(Math.acos(v)), 'acos'), cls('bg-indigo-100 text-indigo-700 hover:bg-indigo-200'))}
        {btn('atan', () => unary(v => fromRad(Math.atan(v)), 'atan'), cls('bg-indigo-100 text-indigo-700 hover:bg-indigo-200'))}
        {btn('√', () => unary(Math.sqrt, '√'), cls('bg-indigo-100 text-indigo-700 hover:bg-indigo-200'))}
        {btn('x²', () => unary(v => v ** 2, 'x²'), cls('bg-indigo-100 text-indigo-700 hover:bg-indigo-200'))}

        {btn('x³', () => unary(v => v ** 3, 'x³'), cls('bg-indigo-100 text-indigo-700 hover:bg-indigo-200'))}
        {btn('xⁿ', () => append('**'), cls('bg-indigo-100 text-indigo-700 hover:bg-indigo-200'))}
        {btn('1/x', () => unary(v => 1 / v, '1/x'), cls('bg-violet-100 text-violet-700 hover:bg-violet-200'))}
        {btn('n!', () => unary(factorial, 'n!'), cls('bg-violet-100 text-violet-700 hover:bg-violet-200'))}
        {btn('|x|', () => unary(Math.abs, '|x|'), cls('bg-violet-100 text-violet-700 hover:bg-violet-200'))}

        {btn('π', () => append('π'), cls('bg-gray-100 text-gray-600 hover:bg-gray-200'))}
        {btn('e', () => append('e'), cls('bg-gray-100 text-gray-600 hover:bg-gray-200'))}
        {btn('EXP', () => append('e'), cls('bg-gray-100 text-gray-600 hover:bg-gray-200'))}
        {btn('(', () => append('('), cls('bg-gray-100 text-gray-600 hover:bg-gray-200'))}
        {btn(')', () => append(')'), cls('bg-gray-100 text-gray-600 hover:bg-gray-200'))}

        {btn('7', () => append('7'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('8', () => append('8'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('9', () => append('9'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('DEL', () => setInput(p => p.slice(0, -1)), cls('bg-red-100 text-red-500 hover:bg-red-200'))}
        {btn('AC', () => { setInput(''); setResult(null) }, cls('bg-red-100 text-red-500 hover:bg-red-200'))}

        {btn('4', () => append('4'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('5', () => append('5'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('6', () => append('6'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('+', () => append('+'), cls('bg-orange-100 text-orange-600 hover:bg-orange-200'))}
        {btn('−', () => append('-'), cls('bg-orange-100 text-orange-600 hover:bg-orange-200'))}

        {btn('1', () => append('1'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('2', () => append('2'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('3', () => append('3'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('×', () => append('*'), cls('bg-orange-100 text-orange-600 hover:bg-orange-200'))}
        {btn('÷', () => append('/'), cls('bg-orange-100 text-orange-600 hover:bg-orange-200'))}

        {btn('0', () => append('0'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('00', () => append('00'), cls('bg-white text-gray-800 border border-gray-200 shadow-sm hover:bg-gray-50'))}
        {btn('.', () => append('.'), cls('bg-gray-100 text-gray-600 hover:bg-gray-200'))}
        {btn('=', calc, cls('bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90 col-span-2 text-2xl'))}
      </div>

      {history.length > 0 && (
        <div className="mt-5 bg-gray-50 p-4 rounded-2xl max-h-48 overflow-y-auto border border-gray-200">
          <h3 className="text-base font-bold text-gray-700 mb-2">계산 기록</h3>
          {history.map((h, i) => (
            <div key={i} className="text-sm text-gray-500 py-1">{h}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function btn(label: string, onClick: () => void, className: string) {
  return <button onClick={onClick} className={className}>{label}</button>
}

function factorial(n: number): number {
  if (n < 0) return NaN
  if (n === 0 || n === 1) return 1
  if (n > 170) return Infinity
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}
