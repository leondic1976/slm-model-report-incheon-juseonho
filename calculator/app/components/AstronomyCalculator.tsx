'use client'

import { useState } from 'react'

const planets = [
  { name: 'Mercury', mass: 3.301e23, radius: 2439.7e3, period: 87.969, distance: 57.9e9, gravity: 3.7, temp: 167 },
  { name: 'Venus', mass: 4.867e24, radius: 6051.8e3, period: 224.701, distance: 108.2e9, gravity: 8.87, temp: 464 },
  { name: 'Earth', mass: 5.972e24, radius: 6371e3, period: 365.256, distance: 149.6e9, gravity: 9.807, temp: 15 },
  { name: 'Mars', mass: 6.417e23, radius: 3389.5e3, period: 686.971, distance: 227.9e9, gravity: 3.721, temp: -65 },
  { name: 'Jupiter', mass: 1.898e27, radius: 69911e3, period: 4332.59, distance: 778.5e9, gravity: 24.79, temp: -110 },
  { name: 'Saturn', mass: 5.683e26, radius: 58232e3, period: 10759.22, distance: 1.434e12, gravity: 10.44, temp: -140 },
  { name: 'Uranus', mass: 8.681e25, radius: 25362e3, period: 30688.5, distance: 2.871e12, gravity: 8.69, temp: -195 },
  { name: 'Neptune', mass: 1.024e26, radius: 24622e3, period: 60182, distance: 4.495e12, gravity: 11.15, temp: -200 },
]

const moons = [
  { name: 'Moon', planet: 'Earth', mass: 7.342e22, radius: 1737.4e3, gravity: 1.62, period: 27.322 },
  { name: 'Io', planet: 'Jupiter', mass: 8.932e22, radius: 1821.3e3, gravity: 1.796, period: 1.769 },
  { name: 'Europa', planet: 'Jupiter', mass: 4.799e22, radius: 1560.8e3, gravity: 1.314, period: 3.551 },
  { name: 'Ganymede', planet: 'Jupiter', mass: 1.482e23, radius: 2634.1e3, gravity: 1.428, period: 7.155 },
  { name: 'Callisto', planet: 'Jupiter', mass: 1.076e23, radius: 2410.3e3, gravity: 1.235, period: 16.689 },
  { name: 'Titan', planet: 'Saturn', mass: 1.345e23, radius: 2574.7e3, gravity: 1.352, period: 15.945 },
  { name: 'Enceladus', planet: 'Saturn', mass: 1.080e20, radius: 252.1e3, gravity: 0.113, period: 1.370 },
  { name: 'Triton', planet: 'Neptune', mass: 2.139e22, radius: 1353.4e3, gravity: 0.779, period: 5.877 },
]

const G = 6.67430e-11
const AU = 1.496e11
const LY = 9.461e15
const PC = 3.086e16
const SOLAR_MASS = 1.989e30
const SOLAR_RADIUS = 6.957e8
const SOLAR_LUMINOSITY = 3.828e26

export default function AstronomyCalculator() {
  const [activeTab, setActiveTab] = useState<'planets' | 'gravity' | 'light' | 'orbital'>('planets')

  // Gravity calculator
  const [gMass, setGMass] = useState('5.972e24')
  const [gRadius, setGRadius] = useState('6371000')
  const [gResult, setGResult] = useState<string | null>(null)

  // Light distance
  const [lyValue, setLyValue] = useState('1')
  const [lightResult, setLightResult] = useState<string | null>(null)

  // Orbital
  const [orbitalMass, setOrbitalMass] = useState('1.989e30')
  const [orbitalRadius, setOrbitalRadius] = useState('1.496e11')
  const [orbitalResult, setOrbitalResult] = useState<string | null>(null)

  const calcGravity = () => {
    const m = parseFloat(gMass); const r = parseFloat(gRadius)
    if (isNaN(m) || isNaN(r) || r === 0) { setGResult('Invalid input'); return }
    const g = G * m / (r * r)
    setGResult(`g = ${g.toExponential(4)} m/s² (${(g / 9.807 * 100).toFixed(2)}% of Earth gravity)`)
  }

  const calcLight = () => {
    const v = parseFloat(lyValue)
    if (isNaN(v)) { setLightResult('Invalid input'); return }
    setLightResult(`${v} ly = ${(v * LY / AU).toExponential(4)} AU = ${(v * LY / PC).toExponential(4)} pc = ${(v * 9.461e15).toExponential(4)} m`)
  }

  const calcOrbital = () => {
    const m = parseFloat(orbitalMass); const r = parseFloat(orbitalRadius)
    if (isNaN(m) || isNaN(r) || r === 0) { setOrbitalResult('Invalid input'); return }
    const T = 2 * Math.PI * Math.sqrt(r ** 3 / (G * m))
    const days = T / 86400
    const v = 2 * Math.PI * r / T
    setOrbitalResult(`Orbital period = ${days.toExponential(4)} days (${(days / 365.25).toFixed(4)} years)
Velocity = ${v.toFixed(0)} m/s (${(v / 1000).toFixed(2)} km/s)`)
  }

  const formatNum = (n: number) => {
    if (n >= 1e12) return n.toExponential(3)
    if (n >= 1e9) return (n / 1e9).toFixed(2) + ' B'
    if (n >= 1e6) return (n / 1e6).toFixed(2) + ' M'
    if (n >= 1e3) return n.toLocaleString()
    return n.toFixed(4)
  }

  const tabs = [
    { key: 'planets', label: 'Planets & Moons' },
    { key: 'gravity', label: 'Gravity' },
    { key: 'orbital', label: 'Orbital' },
    { key: 'light', label: 'Light Distance' },
  ] as const

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium ${activeTab === t.key ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'planets' && (
        <>
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Planets</h3>
            <table className="w-full text-xs text-gray-300 font-mono">
              <thead>
                <tr className="text-gray-500 border-b border-gray-700">
                  <th className="text-left py-1 pr-3">Name</th>
                  <th className="text-right px-2 py-1">Mass (kg)</th>
                  <th className="text-right px-2 py-1">Radius (km)</th>
                  <th className="text-right px-2 py-1">Gravity (m/s²)</th>
                  <th className="text-right px-2 py-1">Period (days)</th>
                  <th className="text-right px-2 py-1">Temp (°C)</th>
                </tr>
              </thead>
              <tbody>
                {planets.map(p => (
                  <tr key={p.name} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-1.5 pr-3 font-semibold text-purple-300">{p.name}</td>
                    <td className="text-right px-2 py-1.5">{formatNum(p.mass)}</td>
                    <td className="text-right px-2 py-1.5">{(p.radius / 1000).toLocaleString()}</td>
                    <td className="text-right px-2 py-1.5">{p.gravity}</td>
                    <td className="text-right px-2 py-1.5">{p.period.toLocaleString()}</td>
                    <td className="text-right px-2 py-1.5">{p.temp > 0 ? '+' : ''}{p.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Notable Moons</h3>
            <table className="w-full text-xs text-gray-300 font-mono">
              <thead>
                <tr className="text-gray-500 border-b border-gray-700">
                  <th className="text-left py-1 pr-3">Name</th>
                  <th className="text-left px-2 py-1">Planet</th>
                  <th className="text-right px-2 py-1">Mass (kg)</th>
                  <th className="text-right px-2 py-1">Radius (km)</th>
                  <th className="text-right px-2 py-1">Gravity (m/s²)</th>
                  <th className="text-right px-2 py-1">Period (days)</th>
                </tr>
              </thead>
              <tbody>
                {moons.map(m => (
                  <tr key={m.name} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-1.5 pr-3 font-semibold text-indigo-300">{m.name}</td>
                    <td className="px-2 py-1.5 text-gray-500">{m.planet}</td>
                    <td className="text-right px-2 py-1.5">{formatNum(m.mass)}</td>
                    <td className="text-right px-2 py-1.5">{(m.radius / 1000).toLocaleString()}</td>
                    <td className="text-right px-2 py-1.5">{m.gravity}</td>
                    <td className="text-right px-2 py-1.5">{m.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'gravity' && (
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Surface Gravity Calculator</h3>
          <p className="text-xs text-gray-500 mb-3">g = G × M / r²</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mass (kg)</label>
              <input value={gMass} onChange={e => setGMass(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Radius (m)</label>
              <input value={gRadius} onChange={e => setGRadius(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <button onClick={calcGravity} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 h-fit mt-5">Calculate</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {planets.map(p => (
              <button key={p.name} onClick={() => { setGMass(String(p.mass)); setGRadius(String(p.radius)); setGResult(null) }}
                className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">{p.name}</button>
            ))}
          </div>
          {gResult && (
            <div className="mt-3 bg-gray-800 p-3 rounded-lg">
              <p className="text-sm font-mono text-purple-300 whitespace-pre-line">{gResult}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orbital' && (
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Orbital Period Calculator (Kepler&apos;s 3rd Law)</h3>
          <p className="text-xs text-gray-500 mb-3">T = 2π × √(r³ / GM)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Central Mass (kg)</label>
              <input value={orbitalMass} onChange={e => setOrbitalMass(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Orbit Radius (m)</label>
              <input value={orbitalRadius} onChange={e => setOrbitalRadius(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <button onClick={calcOrbital} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 h-fit mt-5">Calculate</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setOrbitalMass(String(SOLAR_MASS)); setOrbitalRadius(String(AU)); setOrbitalResult(null) }} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Earth around Sun</button>
            <button onClick={() => { setOrbitalMass(String(5.972e24)); setOrbitalRadius(String(3.844e8)); setOrbitalResult(null) }} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Moon around Earth</button>
            <button onClick={() => { setOrbitalMass(String(SOLAR_MASS)); setOrbitalRadius(String(57.9e9)); setOrbitalResult(null) }} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Mercury around Sun</button>
            <button onClick={() => { setOrbitalMass(String(1.898e27)); setOrbitalRadius(String(4.217e8)); setOrbitalResult(null) }} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Io around Jupiter</button>
            <button onClick={() => { setOrbitalMass(String(SOLAR_MASS)); setOrbitalRadius(String(778.5e9)); setOrbitalResult(null) }} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Jupiter around Sun</button>
          </div>
          {orbitalResult && (
            <div className="mt-3 bg-gray-800 p-3 rounded-lg">
              <p className="text-sm font-mono text-purple-300 whitespace-pre-line">{orbitalResult}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'light' && (
        <div className="bg-gray-900 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Light Distance Converter</h3>
          <p className="text-xs text-gray-500 mb-3">1 ly = 9.461×10¹⁵ m = 63,241 AU = 0.3066 pc</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Light Years</label>
              <input value={lyValue} onChange={e => setLyValue(e.target.value)} className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <button onClick={calcLight} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 h-fit mt-5">Convert</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setLyValue('4.246')} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Proxima Centauri</button>
            <button onClick={() => setLyValue('8.6')} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Sirius</button>
            <button onClick={() => setLyValue('640')} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Betelgeuse</button>
            <button onClick={() => setLyValue('25300')} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Center of Milky Way</button>
            <button onClick={() => setLyValue('2.5e6')} className="px-2 py-1 bg-gray-800 text-xs text-gray-400 rounded hover:bg-gray-700">Andromeda Galaxy</button>
          </div>
          {lightResult && (
            <div className="mt-3 bg-gray-800 p-3 rounded-lg">
              <p className="text-sm font-mono text-purple-300">{lightResult}</p>
            </div>
          )}
          <div className="mt-4 bg-gray-800/50 p-3 rounded-lg">
            <h4 className="text-xs font-semibold text-gray-400 mb-2">Astronomical Distance Units</h4>
            <div className="text-xs text-gray-500 space-y-1">
              <p>1 AU (Astronomical Unit) = {AU.toExponential(3)} m (Earth-Sun distance)</p>
              <p>1 ly (Light Year) = {LY.toExponential(3)} m</p>
              <p>1 pc (Parsec) = {PC.toExponential(3)} m = 3.2616 ly</p>
              <p>1 Solar Mass = {SOLAR_MASS.toExponential(3)} kg</p>
              <p>1 Solar Radius = {(SOLAR_RADIUS / 1e6).toFixed(0)} km</p>
              <p>1 Solar Luminosity = {SOLAR_LUMINOSITY.toExponential(3)} W</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
