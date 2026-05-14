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

  const calc = (fn: string) => {
    try {
      const raw = input.replace(/π/g, String(Math.PI)).replace(/e(?![xp])/g, String(Math.E))
      const val = Function('"use strict"; return (' + raw + ')')()
      const r = String(val)
      setResult(r)
      setHistory(h => [`${fn}(${input}) = ${r}`, ...h.slice(0, 49)])
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

  const cls = (s: string, extra = '') =>
    `p-3 text-sm font-semibold rounded-lg transition-colors ${extra}`

  return (
    <div>
      <div className="bg-gray-900 text-white p-4 rounded-xl mb-3">
        <div className="text-xs text-gray-500 mb-1 font-mono">{input || '\u00A0'}</div>
        <div className="text-3xl font-mono truncate">{result ?? '0'}</div>
      </div>

      <div className="flex gap-2 mb-3">
        <button onClick={() => setAngleMode('DEG')} className={`px-3 py-1 text-xs rounded ${angleMode === 'DEG' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>DEG</button>
        <button onClick={() => setAngleMode('RAD')} className={`px-3 py-1 text-xs rounded ${angleMode === 'RAD' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}>RAD</button>
        <div className="flex-1" />
        <button onClick={() => { setInput(''); setResult(null) }} className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded">AC</button>
      </div>

      <div className="grid grid-cols-5 gap-1.5">
        {btn('sin', () => unary(v => Math.sin(toRad(v)), 'sin'), cls('sin', 'bg-purple-700/30 text-purple-300 hover:bg-purple-700/50'))}
        {btn('cos', () => unary(v => Math.cos(toRad(v)), 'cos'), cls('cos', 'bg-purple-700/30 text-purple-300 hover:bg-purple-700/50'))}
        {btn('tan', () => unary(v => Math.tan(toRad(v)), 'tan'), cls('tan', 'bg-purple-700/30 text-purple-300 hover:bg-purple-700/50'))}
        {btn('ln', () => unary(Math.log, 'ln'), cls('ln', 'bg-purple-700/30 text-purple-300 hover:bg-purple-700/50'))}
        {btn('log', () => unary(v => Math.log10(v), 'log'), cls('log', 'bg-purple-700/30 text-purple-300 hover:bg-purple-700/50'))}

        {btn('asin', () => unary(v => fromRad(Math.asin(v)), 'asin'), cls('asin', 'bg-indigo-700/30 text-indigo-300 hover:bg-indigo-700/50'))}
        {btn('acos', () => unary(v => fromRad(Math.acos(v)), 'acos'), cls('acos', 'bg-indigo-700/30 text-indigo-300 hover:bg-indigo-700/50'))}
        {btn('atan', () => unary(v => fromRad(Math.atan(v)), 'atan'), cls('atan', 'bg-indigo-700/30 text-indigo-300 hover:bg-indigo-700/50'))}
        {btn('√', () => unary(Math.sqrt, '√'), cls('sqrt', 'bg-indigo-700/30 text-indigo-300 hover:bg-indigo-700/50'))}
        {btn('x²', () => unary(v => v ** 2, 'x²'), cls('pow2', 'bg-indigo-700/30 text-indigo-300 hover:bg-indigo-700/50'))}

        {btn('x³', () => unary(v => v ** 3, 'x³'), cls('pow3', 'bg-indigo-700/30 text-indigo-300 hover:bg-indigo-700/50'))}
        {btn('xⁿ', () => append('**'), cls('pown', 'bg-indigo-700/30 text-indigo-300 hover:bg-indigo-700/50'))}
        {btn('1/x', () => unary(v => 1 / v, '1/x'), cls('inv', 'bg-violet-700/30 text-violet-300 hover:bg-violet-700/50'))}
        {btn('n!', () => unary(factorial, 'n!'), cls('fact', 'bg-violet-700/30 text-violet-300 hover:bg-violet-700/50'))}
        {btn('|x|', () => unary(Math.abs, '|x|'), cls('abs', 'bg-violet-700/30 text-violet-300 hover:bg-violet-700/50'))}

        {btn('π', () => append('π'), cls('pi', 'bg-gray-700 hover:bg-gray-600'))}
        {btn('e', () => append('e'), cls('euler', 'bg-gray-700 hover:bg-gray-600'))}
        {btn('EXP', () => append('e'), cls('exp', 'bg-gray-700 hover:bg-gray-600'))}
        {btn('(', () => append('('), cls('paren', 'bg-gray-700 hover:bg-gray-600'))}
        {btn(')', () => append(')'), cls('paren', 'bg-gray-700 hover:bg-gray-600'))}

        {btn('7', () => append('7'), cls('n7', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('8', () => append('8'), cls('n8', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('9', () => append('9'), cls('n9', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('DEL', () => setInput(p => p.slice(0, -1)), cls('del', 'bg-red-500/20 text-red-400 hover:bg-red-500/40'))}
        {btn('AC', () => { setInput(''); setResult(null) }, cls('ac', 'bg-red-500/20 text-red-400 hover:bg-red-500/40'))}

        {btn('4', () => append('4'), cls('n4', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('5', () => append('5'), cls('n5', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('6', () => append('6'), cls('n6', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('+', () => append('+'), cls('plus', 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40'))}
        {btn('−', () => append('-'), cls('minus', 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40'))}

        {btn('1', () => append('1'), cls('n1', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('2', () => append('2'), cls('n2', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('3', () => append('3'), cls('n3', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('×', () => append('*'), cls('mul', 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40'))}
        {btn('÷', () => append('/'), cls('div', 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40'))}

        {btn('0', () => append('0'), cls('n0', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('00', () => append('00'), cls('n00', 'bg-gray-800 hover:bg-gray-700'))}
        {btn('.', () => append('.'), cls('dot', 'bg-gray-700 hover:bg-gray-600'))}
        {btn('=', () => calc('='), cls('eq', 'bg-orange-500 text-white hover:bg-orange-600 col-span-2'))}
      </div>

      {history.length > 0 && (
        <div className="mt-4 bg-gray-900/50 p-3 rounded-xl max-h-48 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">계산 기록</h3>
          {history.map((h, i) => (
            <div key={i} className="text-xs text-gray-500 py-0.5">{h}</div>
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
