'use client'

import { useState } from 'react'

type UnitCategory = 'length' | 'mass' | 'temperature' | 'pressure' | 'energy' | 'power' | 'area' | 'volume' | 'speed'

const units: Record<UnitCategory, { label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[]> = {
  length: [
    { label: 'Meter (m)', toBase: v => v, fromBase: v => v },
    { label: 'Kilometer (km)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'Centimeter (cm)', toBase: v => v / 100, fromBase: v => v * 100 },
    { label: 'Millimeter (mm)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'Mile (mi)', toBase: v => v * 1609.344, fromBase: v => v / 1609.344 },
    { label: 'Yard (yd)', toBase: v => v * 0.9144, fromBase: v => v / 0.9144 },
    { label: 'Foot (ft)', toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
    { label: 'Inch (in)', toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    { label: 'Nautical mile (nmi)', toBase: v => v * 1852, fromBase: v => v / 1852 },
  ],
  mass: [
    { label: 'Kilogram (kg)', toBase: v => v, fromBase: v => v },
    { label: 'Gram (g)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'Milligram (mg)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { label: 'Metric ton (t)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'Pound (lb)', toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
    { label: 'Ounce (oz)', toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
    { label: 'Stone (st)', toBase: v => v * 6.35029, fromBase: v => v / 6.35029 },
  ],
  temperature: [
    { label: 'Celsius (°C)', toBase: v => v, fromBase: v => v },
    { label: 'Fahrenheit (°F)', toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
    { label: 'Kelvin (K)', toBase: v => v - 273.15, fromBase: v => v + 273.15 },
  ],
  pressure: [
    { label: 'Pascal (Pa)', toBase: v => v, fromBase: v => v },
    { label: 'Kilopascal (kPa)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'Bar', toBase: v => v * 100000, fromBase: v => v / 100000 },
    { label: 'Atmosphere (atm)', toBase: v => v * 101325, fromBase: v => v / 101325 },
    { label: 'PSI', toBase: v => v * 6894.76, fromBase: v => v / 6894.76 },
    { label: 'mmHg (Torr)', toBase: v => v * 133.322, fromBase: v => v / 133.322 },
  ],
  energy: [
    { label: 'Joule (J)', toBase: v => v, fromBase: v => v },
    { label: 'Kilojoule (kJ)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'Calorie (cal)', toBase: v => v * 4.184, fromBase: v => v / 4.184 },
    { label: 'Kilocalorie (kcal)', toBase: v => v * 4184, fromBase: v => v / 4184 },
    { label: 'Watt-hour (Wh)', toBase: v => v * 3600, fromBase: v => v / 3600 },
    { label: 'Kilowatt-hour (kWh)', toBase: v => v * 3.6e6, fromBase: v => v / 3.6e6 },
    { label: 'Electronvolt (eV)', toBase: v => v * 1.602e-19, fromBase: v => v / 1.602e-19 },
    { label: 'BTU', toBase: v => v * 1055.06, fromBase: v => v / 1055.06 },
  ],
  power: [
    { label: 'Watt (W)', toBase: v => v, fromBase: v => v },
    { label: 'Kilowatt (kW)', toBase: v => v * 1000, fromBase: v => v / 1000 },
    { label: 'Megawatt (MW)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { label: 'Horsepower (hp)', toBase: v => v * 745.7, fromBase: v => v / 745.7 },
    { label: 'BTU/h', toBase: v => v * 0.293071, fromBase: v => v / 0.293071 },
  ],
  area: [
    { label: 'Square meter (m²)', toBase: v => v, fromBase: v => v },
    { label: 'Square km (km²)', toBase: v => v * 1e6, fromBase: v => v / 1e6 },
    { label: 'Square cm (cm²)', toBase: v => v / 1e4, fromBase: v => v * 1e4 },
    { label: 'Hectare (ha)', toBase: v => v * 1e4, fromBase: v => v / 1e4 },
    { label: 'Acre', toBase: v => v * 4046.86, fromBase: v => v / 4046.86 },
    { label: 'Square foot (ft²)', toBase: v => v * 0.092903, fromBase: v => v / 0.092903 },
    { label: 'Square inch (in²)', toBase: v => v * 0.00064516, fromBase: v => v / 0.00064516 },
  ],
  volume: [
    { label: 'Cubic meter (m³)', toBase: v => v, fromBase: v => v },
    { label: 'Liter (L)', toBase: v => v / 1000, fromBase: v => v * 1000 },
    { label: 'Milliliter (mL)', toBase: v => v / 1e6, fromBase: v => v * 1e6 },
    { label: 'Gallon (US gal)', toBase: v => v * 0.00378541, fromBase: v => v / 0.00378541 },
    { label: 'Quart (qt)', toBase: v => v * 0.000946353, fromBase: v => v / 0.000946353 },
    { label: 'Cubic foot (ft³)', toBase: v => v * 0.0283168, fromBase: v => v / 0.0283168 },
    { label: 'Cup', toBase: v => v * 0.000236588, fromBase: v => v / 0.000236588 },
    { label: 'Fluid ounce (fl oz)', toBase: v => v * 2.9574e-5, fromBase: v => v / 2.9574e-5 },
  ],
  speed: [
    { label: 'Meter/second (m/s)', toBase: v => v, fromBase: v => v },
    { label: 'Kilometer/hour (km/h)', toBase: v => v / 3.6, fromBase: v => v * 3.6 },
    { label: 'Miles/hour (mph)', toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
    { label: 'Knot (kn)', toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    { label: 'Mach (at 20°C)', toBase: v => v * 343, fromBase: v => v / 343 },
    { label: 'Speed of light (c)', toBase: v => v * 299792458, fromBase: v => v / 299792458 },
  ],
}

const formulas = [
  { name: 'Ohm\'s Law (V = IR)', fields: ['Current (I, A)', 'Resistance (R, Ω)'], fn: (v: number[]) => v[0] * v[1], unit: 'V' },
  { name: 'Power (P = VI)', fields: ['Voltage (V)', 'Current (I, A)'], fn: (v: number[]) => v[0] * v[1], unit: 'W' },
  { name: 'Force (F = ma)', fields: ['Mass (m, kg)', 'Acceleration (a, m/s²)'], fn: (v: number[]) => v[0] * v[1], unit: 'N' },
  { name: 'Kinetic Energy (KE = ½mv²)', fields: ['Mass (m, kg)', 'Velocity (v, m/s)'], fn: (v: number[]) => 0.5 * v[0] * v[1] ** 2, unit: 'J' },
  { name: 'Gravitational PE (PE = mgh)', fields: ['Mass (m, kg)', 'Height (h, m)'], fn: (v: number[]) => v[0] * 9.80665 * v[1], unit: 'J' },
  { name: 'Pressure (P = F/A)', fields: ['Force (F, N)', 'Area (A, m²)'], fn: (v: number[]) => v[0] / v[1], unit: 'Pa' },
  { name: 'Density (ρ = m/V)', fields: ['Mass (m, kg)', 'Volume (V, m³)'], fn: (v: number[]) => v[0] / v[1], unit: 'kg/m³' },
  { name: 'Work (W = Fd)', fields: ['Force (F, N)', 'Distance (d, m)'], fn: (v: number[]) => v[0] * v[1], unit: 'J' },
  { name: 'Frequency (f = 1/T)', fields: ['Period (T, s)'], fn: (v: number[]) => 1 / v[0], unit: 'Hz' },
  { name: 'Wavelength (λ = v/f)', fields: ['Speed (v, m/s)', 'Frequency (f, Hz)'], fn: (v: number[]) => v[0] / v[1], unit: 'm' },
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

  const convert = () => {
    const cat = units[category]
    const inputVal = parseFloat(val)
    if (isNaN(inputVal)) { setResult('Invalid input'); return }
    const base = cat[fromIdx].toBase(inputVal)
    const converted = cat[toIdx].fromBase(base)
    setResult(`${inputVal} ${cat[fromIdx].label.split(' (')[1]?.replace(')', '') ?? ''} = ${converted.toExponential(6)} ${cat[toIdx].label.split(' (')[1]?.replace(')', '') ?? ''}`)
  }

  const calcFormula = () => {
    const f = formulas[formulaIdx]
    const nums = formulaVals.map(v => parseFloat(v))
    if (nums.some(isNaN)) { setFormulaResult('Invalid input'); return }
    const r = f.fn(nums)
    setFormulaResult(`${r.toExponential(6)} ${f.unit}`)
  }

  return (
    <div className="space-y-6">
      {/* Unit Converter */}
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Unit Converter</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
          {(Object.keys(units) as UnitCategory[]).map(c => (
            <button key={c} onClick={() => { setCategory(c); setFromIdx(0); setToIdx(1); setResult(null) }}
              className={`px-3 py-2 rounded-lg text-xs font-medium ${category === c ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Value</label>
            <input value={val} onChange={e => setVal(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">From</label>
            <select value={fromIdx} onChange={e => setFromIdx(Number(e.target.value))} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500">
              {units[category].map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">To</label>
            <select value={toIdx} onChange={e => setToIdx(Number(e.target.value))} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500">
              {units[category].map((u, i) => <option key={i} value={i}>{u.label}</option>)}
            </select>
          </div>
          <button onClick={convert} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 h-fit">Convert</button>
        </div>

        {result && (
          <div className="mt-3 bg-gray-800 p-3 rounded-lg">
            <p className="text-sm font-mono text-cyan-300">{result}</p>
          </div>
        )}
      </div>

      {/* Engineering Formulas */}
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Engineering Formulas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Formula</label>
            <select value={formulaIdx} onChange={e => { setFormulaIdx(Number(e.target.value)); setFormulaVals(['', '']); setFormulaResult(null) }} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500">
              {formulas.map((f, i) => <option key={i} value={i}>{f.name}</option>)}
            </select>
          </div>
          {formulas[formulaIdx].fields.map((field, i) => (
            <div key={i}>
              <label className="text-xs text-gray-500 mb-1 block">{field}</label>
              <input value={formulaVals[i] || ''} onChange={e => { const v = [...formulaVals]; v[i] = e.target.value; setFormulaVals(v) }} placeholder={`Enter ${field.split('(')[0].trim()}`} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500" />
            </div>
          ))}
          <button onClick={calcFormula} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 h-fit">Calculate</button>
        </div>

        {formulaResult && (
          <div className="mt-3 bg-gray-800 p-3 rounded-lg">
            <p className="text-sm font-mono text-cyan-300">{formulas[formulaIdx].name} = {formulaResult}</p>
          </div>
        )}
      </div>
    </div>
  )
}
