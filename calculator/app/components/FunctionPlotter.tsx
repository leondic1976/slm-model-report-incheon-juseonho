'use client'

import { useState, useRef, useEffect } from 'react'

function safeEval(expr: string, x: number): number | null {
  try {
    const fn = new Function('x', `"use strict"; return (${expr})`)
    const r = fn(x)
    return typeof r === 'number' && isFinite(r) ? r : null
  } catch {
    return null
  }
}

export default function FunctionPlotter() {
  const [expr, setExpr] = useState('sin(x)')
  const [expr2, setExpr2] = useState('')
  const [expr3, setExpr3] = useState('')
  const [xMin, setXMin] = useState('-10')
  const [xMax, setXMax] = useState('10')
  const [yMin, setYMin] = useState('-5')
  const [yMax, setYMax] = useState('5')
  const colors = ['#06b6d4', '#eab308', '#a78bfa']
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [table, setTable] = useState<{ x: number; vals: (number | null)[] }[]>([])

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const x0 = parseFloat(xMin) || -10
    const x1 = parseFloat(xMax) || 10
    const y0 = parseFloat(yMin) || -5
    const y1 = parseFloat(yMax) || 5

    const xs = (x: number) => ((x - x0) / (x1 - x0)) * W
    const ys = (y: number) => H - ((y - y0) / (y1 - y0)) * H

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, W, H)

    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 0.5
    for (let gx = Math.ceil(x0); gx <= x1; gx++) {
      if (gx === 0) continue
      ctx.beginPath(); ctx.moveTo(xs(gx), 0); ctx.lineTo(xs(gx), H); ctx.stroke()
    }
    for (let gy = Math.ceil(y0); gy <= y1; gy++) {
      if (gy === 0) continue
      ctx.beginPath(); ctx.moveTo(0, ys(gy)); ctx.lineTo(W, ys(gy)); ctx.stroke()
    }

    ctx.strokeStyle = '#94a3b8'
    ctx.lineWidth = 1.5
    if (x0 <= 0 && x1 >= 0) { ctx.beginPath(); ctx.moveTo(xs(0), 0); ctx.lineTo(xs(0), H); ctx.stroke() }
    if (y0 <= 0 && y1 >= 0) { ctx.beginPath(); ctx.moveTo(0, ys(0)); ctx.lineTo(W, ys(0)); ctx.stroke() }

    const exprs = [expr, expr2, expr3].filter(e => e.trim())
    const steps = W * 2

    exprs.forEach((e, idx) => {
      ctx.strokeStyle = colors[idx]
      ctx.lineWidth = 2.5
      ctx.beginPath()
      let started = false
      for (let i = 0; i <= steps; i++) {
        const x = x0 + (i / steps) * (x1 - x0)
        const y = safeEval(e, x)
        if (y === null || y < y0 - 10 || y > y1 + 10) {
          started = false; continue
        }
        const px = xs(x), py = ys(y)
        if (!started) { ctx.moveTo(px, py); started = true }
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    })
  }

  useEffect(() => { draw() })

  const generateTable = () => {
    const x0 = parseFloat(xMin) || -10
    const x1 = parseFloat(xMax) || 10
    const exprs = [expr, expr2, expr3].filter(e => e.trim())
    const rows: { x: number; vals: (number | null)[] }[] = []
    for (let x = x0; x <= x1; x += 1) {
      if (x > x1) break
      const vals = exprs.map(e => safeEval(e, Math.round(x * 1e6) / 1e6))
      rows.push({ x: Math.round(x * 1e6) / 1e6, vals })
    }
    setTable(rows)
  }

  const activeExprs = [expr, expr2, expr3].filter(e => e.trim())

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[0, 1, 2].map(i => (
            <div key={i}>
              <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: colors[i] }} />
                f<sub>{i + 1}</sub>(x) =
              </label>
              <input
                value={[expr, expr2, expr3][i]}
                onChange={e => {
                  const v = e.target.value
                  if (i === 0) setExpr(v)
                  else if (i === 1) setExpr2(v)
                  else setExpr3(v)
                }}
                placeholder="예: x**2 + 2*x + 1"
                className="w-full bg-white text-gray-800 border border-gray-300 px-4 py-3 rounded-xl text-base font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          {[['X 최소', xMin, setXMin], ['X 최대', xMax, setXMax], ['Y 최소', yMin, setYMin], ['Y 최대', yMax, setYMax]].map(([label, val, set]) => (
            <div key={label as string}>
              <label className="text-sm font-semibold text-gray-600">{label as string}</label>
              <input value={val as string} onChange={e => (set as Function)(e.target.value)} className="w-full bg-white text-gray-800 border border-gray-300 px-3 py-2.5 rounded-xl text-base font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={draw} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl text-base font-bold hover:opacity-90">그리기</button>
          <button onClick={generateTable} className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl text-base font-bold hover:bg-gray-50">값 표 생성</button>
          <button onClick={() => { setExpr('sin(x)'); setExpr2(''); setExpr3(''); setXMin('-10'); setXMax('10'); setYMin('-5'); setYMax('5'); setTable([]) }} className="px-6 py-3 bg-red-50 text-red-500 border border-red-200 rounded-xl text-base font-bold hover:bg-red-100">초기화</button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <canvas ref={canvasRef} width={900} height={500} className="w-full h-auto" style={{ aspectRatio: '900/500' }} />
      </div>

      {activeExprs.length > 0 && (
        <div className="flex gap-6 text-sm text-gray-500 justify-center">
          {activeExprs.map((e, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: colors[i] }} />
              f<sub>{i + 1}</sub>(x) = {e}
            </span>
          ))}
        </div>
      )}

      {table.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 overflow-x-auto">
          <h3 className="text-base font-bold text-gray-700 mb-3">값 표</h3>
          <table className="w-full text-sm text-gray-600 font-mono">
            <thead>
              <tr className="text-gray-500 border-b border-gray-300">
                <th className="text-left py-2 pr-4">x</th>
                {activeExprs.map((_, i) => <th key={i} className="text-right px-3 py-2">f<sub>{i + 1}</sub>(x)</th>)}
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => (
                <tr key={i} className="border-b border-gray-200">
                  <td className="py-2 pr-4 text-gray-400">{row.x}</td>
                  {row.vals.map((v, j) => <td key={j} className="text-right px-3 py-2">{v !== null ? v : '—'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
