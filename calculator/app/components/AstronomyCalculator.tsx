'use client'

import { useState } from 'react'

const planets = [
  { name: 'Mercury', nameKr: '수성', mass: 3.301e23, radius: 2439.7e3, period: 87.969, distance: 57.9e9, gravity: 3.7, temp: 167 },
  { name: 'Venus', nameKr: '금성', mass: 4.867e24, radius: 6051.8e3, period: 224.701, distance: 108.2e9, gravity: 8.87, temp: 464 },
  { name: 'Earth', nameKr: '지구', mass: 5.972e24, radius: 6371e3, period: 365.256, distance: 149.6e9, gravity: 9.807, temp: 15 },
  { name: 'Mars', nameKr: '화성', mass: 6.417e23, radius: 3389.5e3, period: 686.971, distance: 227.9e9, gravity: 3.721, temp: -65 },
  { name: 'Jupiter', nameKr: '목성', mass: 1.898e27, radius: 69911e3, period: 4332.59, distance: 778.5e9, gravity: 24.79, temp: -110 },
  { name: 'Saturn', nameKr: '토성', mass: 5.683e26, radius: 58232e3, period: 10759.22, distance: 1.434e12, gravity: 10.44, temp: -140 },
  { name: 'Uranus', nameKr: '천왕성', mass: 8.681e25, radius: 25362e3, period: 30688.5, distance: 2.871e12, gravity: 8.69, temp: -195 },
  { name: 'Neptune', nameKr: '해왕성', mass: 1.024e26, radius: 24622e3, period: 60182, distance: 4.495e12, gravity: 11.15, temp: -200 },
]

const moons = [
  { name: 'Moon', nameKr: '달', planet: '지구', mass: 7.342e22, radius: 1737.4e3, gravity: 1.62, period: 27.322 },
  { name: 'Io', nameKr: '이오', planet: '목성', mass: 8.932e22, radius: 1821.3e3, gravity: 1.796, period: 1.769 },
  { name: 'Europa', nameKr: '유로파', planet: '목성', mass: 4.799e22, radius: 1560.8e3, gravity: 1.314, period: 3.551 },
  { name: 'Ganymede', nameKr: '가니메데', planet: '목성', mass: 1.482e23, radius: 2634.1e3, gravity: 1.428, period: 7.155 },
  { name: 'Callisto', nameKr: '칼리스토', planet: '목성', mass: 1.076e23, radius: 2410.3e3, gravity: 1.235, period: 16.689 },
  { name: 'Titan', nameKr: '타이탄', planet: '토성', mass: 1.345e23, radius: 2574.7e3, gravity: 1.352, period: 15.945 },
  { name: 'Enceladus', nameKr: '엔셀라두스', planet: '토성', mass: 1.080e20, radius: 252.1e3, gravity: 0.113, period: 1.370 },
  { name: 'Triton', nameKr: '트리톤', planet: '해왕성', mass: 2.139e22, radius: 1353.4e3, gravity: 0.779, period: 5.877 },
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

  const [gMass, setGMass] = useState('5.972e24')
  const [gRadius, setGRadius] = useState('6371000')
  const [gResult, setGResult] = useState<string | null>(null)

  const [lyValue, setLyValue] = useState('1')
  const [lightResult, setLightResult] = useState<string | null>(null)

  const [orbitalMass, setOrbitalMass] = useState('1.989e30')
  const [orbitalRadius, setOrbitalRadius] = useState('1.496e11')
  const [orbitalResult, setOrbitalResult] = useState<string | null>(null)

  const calcGravity = () => {
    const m = parseFloat(gMass); const r = parseFloat(gRadius)
    if (isNaN(m) || isNaN(r) || r === 0) { setGResult('잘못된 입력'); return }
    const g = G * m / (r * r)
    setGResult(`g = ${g.toExponential(4)} m/s² (지구 중력의 ${(g / 9.807 * 100).toFixed(2)}%)`)
  }

  const calcLight = () => {
    const v = parseFloat(lyValue)
    if (isNaN(v)) { setLightResult('잘못된 입력'); return }
    setLightResult(`${v} ly = ${(v * LY / AU).toExponential(4)} AU = ${(v * LY / PC).toExponential(4)} pc = ${(v * 9.461e15).toExponential(4)} m`)
  }

  const calcOrbital = () => {
    const m = parseFloat(orbitalMass); const r = parseFloat(orbitalRadius)
    if (isNaN(m) || isNaN(r) || r === 0) { setOrbitalResult('잘못된 입력'); return }
    const T = 2 * Math.PI * Math.sqrt(r ** 3 / (G * m))
    const days = T / 86400
    const v = 2 * Math.PI * r / T
    setOrbitalResult(`공전 주기 = ${days.toExponential(4)} 일 (${(days / 365.25).toFixed(4)} 년)\n궤도 속도 = ${v.toFixed(0)} m/s (${(v / 1000).toFixed(2)} km/s)`)
  }

  const formatNum = (n: number) => {
    if (n >= 1e12) return n.toExponential(3)
    if (n >= 1e9) return (n / 1e9).toFixed(2) + ' B'
    if (n >= 1e6) return (n / 1e6).toFixed(2) + ' M'
    if (n >= 1e3) return n.toLocaleString()
    return n.toFixed(4)
  }

  const tabs = [
    { key: 'planets', label: '행성·위성' },
    { key: 'gravity', label: '중력 계산' },
    { key: 'orbital', label: '궤도 계산' },
    { key: 'light', label: '광거리 변환' },
  ] as const

  return (
    <div className="space-y-5">
      <div className="flex gap-2 flex-wrap">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`px-5 py-2.5 rounded-xl text-base font-bold ${activeTab === t.key ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'planets' && (
        <>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-700 mb-4">태양계 행성</h3>
            <table className="w-full text-base text-gray-600 font-mono">
              <thead>
                <tr className="text-gray-500 border-b border-gray-300">
                  <th className="text-left py-2 pr-4">이름</th>
                  <th className="text-right px-3 py-2">질량 (kg)</th>
                  <th className="text-right px-3 py-2">반지름 (km)</th>
                  <th className="text-right px-3 py-2">중력 (m/s²)</th>
                  <th className="text-right px-3 py-2">공전 주기 (일)</th>
                  <th className="text-right px-3 py-2">온도 (°C)</th>
                </tr>
              </thead>
              <tbody>
                {planets.map(p => (
                  <tr key={p.name} className="border-b border-gray-200 hover:bg-white">
                    <td className="py-2.5 pr-4 font-bold text-purple-700">{p.nameKr} ({p.name})</td>
                    <td className="text-right px-3 py-2.5">{formatNum(p.mass)}</td>
                    <td className="text-right px-3 py-2.5">{(p.radius / 1000).toLocaleString()}</td>
                    <td className="text-right px-3 py-2.5">{p.gravity}</td>
                    <td className="text-right px-3 py-2.5">{p.period.toLocaleString()}</td>
                    <td className="text-right px-3 py-2.5">{p.temp > 0 ? '+' : ''}{p.temp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-700 mb-4">주요 위성</h3>
            <table className="w-full text-base text-gray-600 font-mono">
              <thead>
                <tr className="text-gray-500 border-b border-gray-300">
                  <th className="text-left py-2 pr-4">이름</th>
                  <th className="text-left px-3 py-2">모행성</th>
                  <th className="text-right px-3 py-2">질량 (kg)</th>
                  <th className="text-right px-3 py-2">반지름 (km)</th>
                  <th className="text-right px-3 py-2">중력 (m/s²)</th>
                  <th className="text-right px-3 py-2">공전 주기 (일)</th>
                </tr>
              </thead>
              <tbody>
                {moons.map(m => (
                  <tr key={m.name} className="border-b border-gray-200 hover:bg-white">
                    <td className="py-2.5 pr-4 font-bold text-indigo-700">{m.nameKr} ({m.name})</td>
                    <td className="px-3 py-2.5 text-gray-500">{m.planet}</td>
                    <td className="text-right px-3 py-2.5">{formatNum(m.mass)}</td>
                    <td className="text-right px-3 py-2.5">{(m.radius / 1000).toLocaleString()}</td>
                    <td className="text-right px-3 py-2.5">{m.gravity}</td>
                    <td className="text-right px-3 py-2.5">{m.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'gravity' && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">표면 중력 계산기</h3>
          <p className="text-sm text-gray-500 mb-4">g = G × M / r²</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">질량 (kg)</label>
              <input value={gMass} onChange={e => setGMass(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">반지름 (m)</label>
              <input value={gRadius} onChange={e => setGRadius(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <button onClick={calcGravity} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl text-base font-bold hover:opacity-90 h-fit mt-7">계산</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {planets.map(p => (
              <button key={p.name} onClick={() => { setGMass(String(p.mass)); setGRadius(String(p.radius)); setGResult(null) }}
                className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">{p.nameKr}</button>
            ))}
          </div>
          {gResult && (
            <div className="mt-4 bg-white border border-gray-200 p-4 rounded-xl">
              <p className="text-lg font-mono text-purple-700 whitespace-pre-line">{gResult}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'orbital' && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">궤도 주기 계산 (케플러 제3법칙)</h3>
          <p className="text-sm text-gray-500 mb-4">T = 2π × √(r³ / GM)</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">중심 천체 질량 (kg)</label>
              <input value={orbitalMass} onChange={e => setOrbitalMass(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">궤도 반지름 (m)</label>
              <input value={orbitalRadius} onChange={e => setOrbitalRadius(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <button onClick={calcOrbital} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl text-base font-bold hover:opacity-90 h-fit mt-7">계산</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setOrbitalMass(String(SOLAR_MASS)); setOrbitalRadius(String(AU)); setOrbitalResult(null) }} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">지구 → 태양</button>
            <button onClick={() => { setOrbitalMass(String(5.972e24)); setOrbitalRadius(String(3.844e8)); setOrbitalResult(null) }} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">달 → 지구</button>
            <button onClick={() => { setOrbitalMass(String(SOLAR_MASS)); setOrbitalRadius(String(57.9e9)); setOrbitalResult(null) }} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">수성 → 태양</button>
            <button onClick={() => { setOrbitalMass(String(1.898e27)); setOrbitalRadius(String(4.217e8)); setOrbitalResult(null) }} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">이오 → 목성</button>
            <button onClick={() => { setOrbitalMass(String(SOLAR_MASS)); setOrbitalRadius(String(778.5e9)); setOrbitalResult(null) }} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">목성 → 태양</button>
          </div>
          {orbitalResult && (
            <div className="mt-4 bg-white border border-gray-200 p-4 rounded-xl">
              <p className="text-lg font-mono text-purple-700 whitespace-pre-line">{orbitalResult}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'light' && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-3">광년 거리 변환기</h3>
          <p className="text-sm text-gray-500 mb-4">1 ly = 9.461×10¹⁵ m = 63,241 AU = 0.3066 pc</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1.5 block">광년 (ly)</label>
              <input value={lyValue} onChange={e => setLyValue(e.target.value)} className="w-full bg-white border border-gray-300 text-gray-800 px-4 py-3 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>
            <button onClick={calcLight} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl text-base font-bold hover:opacity-90 h-fit mt-7">변환</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setLyValue('4.246')} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">프록시마 켄타우리</button>
            <button onClick={() => setLyValue('8.6')} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">시리우스</button>
            <button onClick={() => setLyValue('640')} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">베텔게우스</button>
            <button onClick={() => setLyValue('25300')} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">은하 중심</button>
            <button onClick={() => setLyValue('2.5e6')} className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50">안드로메다 은하</button>
          </div>
          {lightResult && (
            <div className="mt-4 bg-white border border-gray-200 p-4 rounded-xl">
              <p className="text-lg font-mono text-purple-700">{lightResult}</p>
            </div>
          )}
          <div className="mt-5 bg-white border border-gray-200 p-5 rounded-xl">
            <h4 className="text-sm font-bold text-gray-700 mb-3">천문 거리 단위</h4>
            <div className="text-sm text-gray-500 space-y-1.5">
              <p>1 AU (천문단위) = {AU.toExponential(3)} m (지구-태양 거리)</p>
              <p>1 ly (광년) = {LY.toExponential(3)} m</p>
              <p>1 pc (파섹) = {PC.toExponential(3)} m = 3.2616 ly</p>
              <p>1 태양질량 = {SOLAR_MASS.toExponential(3)} kg</p>
              <p>1 태양반지름 = {(SOLAR_RADIUS / 1e6).toFixed(0)} km</p>
              <p>1 태양광도 = {SOLAR_LUMINOSITY.toExponential(3)} W</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
