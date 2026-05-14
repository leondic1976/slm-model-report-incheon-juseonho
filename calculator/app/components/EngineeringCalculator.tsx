'use client'

import { useState } from 'react'

type UnitCategory = 'length' | 'mass' | 'temperature' | 'pressure' | 'energy' | 'power' | 'area' | 'volume' | 'speed'

const unitNames: Record<UnitCategory, string> = {
  length: '길이', mass: '질량', temperature: '온도', pressure: '압력',
  energy: '에너지', power: '전력', area: '넓이', volume: '부피', speed: '속도'
}

const units: Record<UnitCategory, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { label: '미터 (m)', toBase: v => v, fromBase: v => v },
    { label: '킬로미터 (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: '센티미터 (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
    { label: '밀리미터 (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: '마일 (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { label: '야드 (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { label: '피트 (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: '인치 (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { label: '해리 (nmi)', toBase: v => v * 1852, fromBase: v => v / 1852 },
  ],
  mass: [
    { label: '킬로그램 (kg)', toBase: v => v, fromBase: v => v },
    { label: '그램 (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: '밀리그램 (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { label: '톤 (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: '파운드 (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: '온스 (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    { label: '스톤 (st)', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
  ],
  temperature: [
    { label: '섭씨 (°C)', toBase: v => v, fromBase: v => v },
    { label: '화씨 (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { label: '켈빈 (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  pressure: [
    { label: '파스칼 (Pa)', toBase: v => v, fromBase: v => v },
    { label: '킬로파스칼 (kPa)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: '바 (Bar)', toBase: v => v * 100000, fromBase: v => v / 100000 },
    { label: '기압 (atm)', toBase: v => v * 101325, fromBase: v => v / 101325 },
    { label: 'PSI', toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
    { label: '수은주밀리미터 (mmHg)', toBase: v => v * 133.322, fromBase: v => v / 133.322 },
  ],
  energy: [
    { label: '줄 (J)', toBase: v => v, fromBase: v => v },
    { label: '킬로줄 (kJ)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: '칼로리 (cal)', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
    { label: '킬로칼로리 (kcal)', toBase: v => v * 4184, fromBase: v => v / 4184 },
    { label: '와트시 (Wh)', toBase: v => v * 3600, fromBase: v => v / 3600 },
    { label: '킬로와트시 (kWh)', toBase: v => v * 3.6e6, fromBase: v => v / 3.6e6 },
    { label: '전자볼트 (eV)', toBase: v => v * 1.602e-19, fromBase: v => v / 1.602e-19 },
    { label: 'BTU', toBase: v => v * 1055.06, fromBase: v => v / 1055.06 },
  ],
  power: [
    { label: '와트 (W)', toBase: v => v, fromBase: v => v },
    { label: '킬로와트 (kW)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: '메가와트 (MW)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { label: '마력 (hp)', toBase: v => v * 745.7, fromBase: v => v / 745.7 },
    { label: 'BTU/h', toBase: v => v * 0.293071, fromBase: v => v / 0.293071 },
  ],
  area: [
    { label: '제곱미터 (m²)', toBase: v => v, fromBase: v => v },
    { label: '제곱킬로미터 (km²)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { label: '제곱센티미터 (cm²)', toBase: v => v / 1e4, fromBase: v => v * 1e4 },
    { label: '헥타르 (ha)', toBase: v => v * 1e4, fromBase: v => v / 1e4 },
    { label: '에이커 (ac)', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    { label: '제곱피트 (ft²)', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    { label: '제곱인치 (in²)', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
  ],
  volume: [
    { label: '세제곱미터 (m³)', toBase: v => v, fromBase: v => v },
    { label: '리터 (L)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: '밀리리터 (mL)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { label: '갤런 (gal)', toBase: v => v * 0.00378541, fromBase: v => v / 0.00378541 },
    { label: '쿼트 (qt)', toBase: v => v * 0.000946353, fromBase: v => v / 0.000946353 },
    { label: '세제곱피트 (ft³)', toBase: v => v * 0.0283168, fromBase: v => v / 0.0283168 },
    { label: '컵 (cup)', toBase: v => v * 0.000236588, fromBase: v => v / 0.000236588 },
    { label: '액량온스 (fl oz)', toBase: v => v * 2.9574e-5, fromBase: v => v / 2.9574e-5 },
  ],
  speed: [
    { label: '미터/초 (m/s)', toBase: v => v, fromBase: v => v },
    { label: '킬로미터/시 (km/h)', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { label: '마일/시 (mph)', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { label: '노트 (kn)', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    { label: '마하 (20°C)', toBase: v => v * 343, fromBase: v => v / 343 },
    { label: '광속 (c)', toBase: v => v * 299792458, fromBase: v => v / 299792458 },
  ],
}

const formulas = [
  { name: '옴의 법칙 (V = IR)', fields: ['전류 I (A)', '저항 R (Ω)'], fn: (v: number[]) => v[0] * v[1], unit: 'V' },
  { name: '전력 (P = VI)', fields: ['전압 V (V)', '전류 I (A)'], fn: (v: number[]) => v[0] * v[1], unit: 'W' },
  { name: '힘 (F = ma)', fields: ['질량 m (kg)', '가속도 a (m/s²)'], fn: (v: number[]) => v[0] * v[1], unit: 'N' },
  { name: '운동에너지 (KE = ½mv²)', fields: ['질량 m (kg)', '속도 v (m/s)'], fn: (v: number[]) => 0.5 * v[0] * v[1] ** 2, unit: 'J' },
  { name: '중력 위치에너지 (PE = mgh)', fields: ['질량 m (kg)', '높이 h (m)'], fn: (v: number[]) => v[0] * 9.80665 * v[1], unit: 'J' },
  { name: '압력 (P = F/A)', fields: ['힘 F (N)', '넓이 A (m²)'], fn: (v: number[]) => v[0] / v[1], unit: 'Pa' },
  { name: '밀도 (ρ = m/V)', fields: ['질량 m (kg)', '부피 V (m³)'], fn: (v: number[]) => v[0] / v[1], unit: 'kg/m³' },
  { name: '일 (W = Fd)', fields: ['힘 F (N)', '거리 d (m)'], fn: (v: number[]) => v[0] * v[1], unit: 'J' },
  { name: '진동수 (f = 1/T)', fields: ['주기 T (s)'], fn: (v: number[]) => 1 / v[0], unit: 'Hz' },
  { name: '파장 (λ = v/f)', fields: ['속력 v (m/s)', '진동수 f (Hz)'], fn: (v: number[]) => v[0] / v[1], unit: 'm' },
]

export default function EngineeringCalculator() {
  const [category, setCategory] = useState<UnitCategory>('length')
  const [fromIdx, setFromIdx] = useState(0)
  const [toIdx, setToIdx] = useState(1)
  const [val, setVal] = useState('1')
  const [result, setResult] = useState<string | null>(null)

  const [formulaIdx, setFormulaIdx] = useState(0)
  const [formulaVals, setFormulaVals] = useState<string[]>(['', ''])
  const [formulaResult, setFormulaResult] = useState<string | null>(null)

  const extractUnit = (label: string) => {
    const m = label.match(/\(([^)]+)\)/)
    return m ? m[1] : label
  }

  const convert = () => {
    const cat = units[category]
    const inputVal = parseFloat(val)
    if (isNaN(inputVal)) { setResult('잘못된 입력'); return }
    const base = cat[fromIdx].toBase(inputVal)
    const converted = cat[toIdx].fromBase(base)
    setResult(`${inputVal} ${extractUnit(cat[fromIdx].label)} = ${converted.toExponential(6)} ${extractUnit(cat[toIdx].label)}`)
  }

  const calcFormula = () => {
    const f = formulas[formulaIdx]
    const nums = formulaVals.map(v => parseFloat(v))
    if (nums.some(isNaN)) { setFormulaResult('잘못된 입력'); return }
    const r = f.fn(nums)
    setFormulaResult(`${r.toExponential(6)} ${f.unit}`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">단위 변환기</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-5">
          {(Object.keys(units) as UnitCategory[]).map(c => (
            <button key={c} onClick={() => { setCategory(c); setFromIdx(0); setToIdx(1); setResult(null) }}
              className={`px-4 py-2.5 rounded-xl text-base font-bold ${category === c ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
              {unitNames[c]}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">값</label>
            <input value={val} onChange={e => setVal(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">변환할 단위</label>
            <select value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
              {units[category].map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">변환될 단위</label>
            <select value={toIdx} onChange={e => setToIdx(Number(e.target.value))} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
              {units[category].map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
          <button onClick={convert} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl text-base font-bold hover:opacity-90 h-fit">변환</button>
        </div>

        {result && (
          <div className="mt-4 bg-white border border-gray-200 p-4 rounded-xl">
            <p className="text-lg font-mono text-cyan-700">{result}</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">공학 공식</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1.5 block">공식 선택</label>
            <select value={formulaIdx} onChange={e => { setFormulaIdx(Number(e.target.value)); setFormulaVals(['', '']); setFormulaResult(null) }} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-cyan-400">
              {formulas.map((f, i) => <option key={i} value={i}>{f.name}</option>)}
            </select>
          </div>
          {formulas[formulaIdx].fields.map((field, i) => (
            <div key={i}>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">{field}</label>
              <input value={formulaVals[i] || ''} onChange={e => { const v = [...formulaVals]; v[i] = e.target.value; setFormulaVals(v) }} placeholder={`${field} 입력`} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400" />
            </div>
          ))}
          <button onClick={calcFormula} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl text-base font-bold hover:opacity-90 h-fit">계산</button>
        </div>

        {formulaResult && (
          <div className="mt-4 bg-white border border-gray-200 p-4 rounded-xl">
            <p className="text-lg font-mono text-cyan-700">{formulas[formulaIdx].name} = {formulaResult}</p>
          </div>
        )}
      </div>
    </div>
  )
}
