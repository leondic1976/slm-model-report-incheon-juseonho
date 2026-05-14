'use client'

import { useState } from 'react'

type Op = '+' | '-' | '*' | '/' | null

export default function BasicCalculator() {
  const [display, setDisplay] = useState('0')
  const [prev, setPrev] = useState<number | null>(null)
  const [op, setOp] = useState<Op>(null)
  const [waiting, setWaiting] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const inputDigit = (d: string) => {
    if (waiting) { setDisplay(d); setWaiting(false); return }
    setDisplay(display === '0' ? d : display + d)
  }

  const inputDot = () => {
    if (waiting) { setDisplay('0.'); setWaiting(false); return }
    if (!display.includes('.')) setDisplay(display + '.')
  }

  const clear = () => { setDisplay('0'); setPrev(null); setOp(null); setWaiting(false) }
  const clearE = () => setDisplay('0')

  const negate = () => setDisplay(String(parseFloat(display) * -1))

  const percent = () => setDisplay(String(parseFloat(display) / 100))

  const setOperation = (next: Op) => {
    const n = parseFloat(display)
    if (prev !== null && !waiting) {
      const r = compute(prev, n, op!)
      setDisplay(String(r))
      setHistory(h => [...h, `${prev} ${op} ${n} = ${r}`])
      setPrev(r)
    } else {
      setPrev(n)
    }
    setOp(next)
    setWaiting(true)
  }

  const equals = () => {
    const n = parseFloat(display)
    if (prev === null || op === null) return
    const r = compute(prev, n, op)
    setDisplay(String(r))
    setHistory(h => [...h, `${prev} ${op} ${n} = ${r}`])
    setPrev(null); setOp(null); setWaiting(true)
  }

  const backspace = () => {
    if (display.length > 1) setDisplay(display.slice(0, -1))
    else setDisplay('0')
  }

  const btn = (label: string, onClick: () => void, cls = '') => (
    <button key={label} onClick={onClick} className={`p-3 text-lg font-semibold rounded-lg transition-colors ${cls}`}>{label}</button>
  )

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        <div className="bg-gray-900 text-white p-4 rounded-xl mb-3 text-right">
          <div className="text-3xl font-mono truncate">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {btn('C', clear, 'bg-red-500/20 text-red-400 hover:bg-red-500/40 col-span-2')}
          {btn('⌫', backspace, 'bg-gray-700 hover:bg-gray-600')}
          {btn('÷', () => setOperation('/'), 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40')}
          {btn('7', () => inputDigit('7'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('8', () => inputDigit('8'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('9', () => inputDigit('9'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('×', () => setOperation('*'), 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40')}
          {btn('4', () => inputDigit('4'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('5', () => inputDigit('5'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('6', () => inputDigit('6'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('−', () => setOperation('-'), 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40')}
          {btn('1', () => inputDigit('1'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('2', () => inputDigit('2'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('3', () => inputDigit('3'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('+', () => setOperation('+'), 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/40')}
          {btn('±', negate, 'bg-gray-700 hover:bg-gray-600')}
          {btn('0', () => inputDigit('0'), 'bg-gray-800 hover:bg-gray-700')}
          {btn('.', inputDot, 'bg-gray-700 hover:bg-gray-600')}
          {btn('=', equals, 'bg-orange-500 text-white hover:bg-orange-600 row-span-2')}
        </div>
      </div>
      {history.length > 0 && (
        <div className="md:w-64 bg-gray-900/50 p-4 rounded-xl max-h-96 overflow-y-auto">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">History</h3>
          {history.slice().reverse().map((h, i) => (
            <div key={i} className="text-xs text-gray-500 py-1 border-b border-gray-800">{h}</div>
          ))}
          <button onClick={() => setHistory([])} className="text-xs text-red-400 mt-2 hover:text-red-300">Clear</button>
        </div>
      )}
    </div>
  )
}

function compute(a: number, b: number, op: Op): number {
  switch (op) {
    case '+': return a + b
    case '-': return a - b
    case '*': return a * b
    case '/': return b !== 0 ? a / b : NaN
    default: return b
  }
}
