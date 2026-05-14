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
    <button key={label} onClick={onClick} className={`p-4 text-xl font-bold rounded-xl transition-all active:scale-95 ${cls}`}>{label}</button>
  )

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="bg-gray-50 border-2 border-gray-200 text-gray-800 p-6 rounded-2xl mb-4 text-right">
          <div className="text-5xl font-mono truncate tracking-tight">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {btn('C', clear, 'bg-red-100 text-red-600 hover:bg-red-200 col-span-2')}
          {btn('⌫', backspace, 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
          {btn('÷', () => setOperation('/'), 'bg-orange-100 text-orange-600 hover:bg-orange-200')}
          {btn('7', () => inputDigit('7'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('8', () => inputDigit('8'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('9', () => inputDigit('9'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('×', () => setOperation('*'), 'bg-orange-100 text-orange-600 hover:bg-orange-200')}
          {btn('4', () => inputDigit('4'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('5', () => inputDigit('5'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('6', () => inputDigit('6'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('−', () => setOperation('-'), 'bg-orange-100 text-orange-600 hover:bg-orange-200')}
          {btn('1', () => inputDigit('1'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('2', () => inputDigit('2'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('3', () => inputDigit('3'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('+', () => setOperation('+'), 'bg-orange-100 text-orange-600 hover:bg-orange-200')}
          {btn('±', negate, 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
          {btn('0', () => inputDigit('0'), 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200 shadow-sm')}
          {btn('.', inputDot, 'bg-gray-100 text-gray-600 hover:bg-gray-200')}
          {btn('=', equals, 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:opacity-90 row-span-2 text-3xl')}
        </div>
      </div>
      {history.length > 0 && (
        <div className="md:w-72 bg-gray-50 p-5 rounded-2xl max-h-96 overflow-y-auto border border-gray-200">
          <h3 className="text-base font-bold text-gray-700 mb-3">계산 기록</h3>
          {history.slice().reverse().map((h, i) => (
            <div key={i} className="text-sm text-gray-500 py-1.5 border-b border-gray-200">{h}</div>
          ))}
          <button onClick={() => setHistory([])} className="text-sm text-red-500 mt-3 hover:text-red-600 font-medium">지우기</button>
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
