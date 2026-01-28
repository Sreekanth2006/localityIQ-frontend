'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { generatePDFReport } from '@/components/ReportGenerator'
import { FileText } from 'lucide-react'

import { api } from '@/lib/api'

const metricLabels = {
    airQuality: { icon: '🌫️', label: 'Air Quality', color: 'bg-blue-500' },
    water: { icon: '💧', label: 'Water Supply', color: 'bg-cyan-500' },
    power: { icon: '⚡', label: 'Power', color: 'bg-yellow-500' },
    schools: { icon: '🏫', label: 'Schools', color: 'bg-purple-500' },
    safety: { icon: '🚔', label: 'Safety', color: 'bg-red-500' },
    growth: { icon: '🚧', label: 'Growth', color: 'bg-orange-500' },
    hospitals: { icon: '🏥', label: 'Healthcare', color: 'bg-emerald-500' },
    traffic: { icon: '🚦', label: 'Traffic', color: 'bg-slate-500' }
}

export default function ComparePage() {
    const [allLocalities, setAllLocalities] = useState([])
    const [localityA, setLocalityA] = useState(null)
    const [localityB, setLocalityB] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await api.getLocalities()
                setAllLocalities(data)
                if (data.length >= 2) {
                    setLocalityA(data[0])
                    setLocalityB(data[1])
                }
            } catch (err) {
                console.error('Failed to load localities:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSelectA = (e) => {
        const selected = allLocalities.find(l => l.id === e.target.value)
        if (selected) setLocalityA(selected)
    }

    const handleSelectB = (e) => {
        const selected = allLocalities.find(l => l.id === e.target.value)
        if (selected) setLocalityB(selected)
    }

    const getRecommendationBadge = (rec) => {
        const badges = {
            buy: { class: 'recommendation-buy', text: '✓ Strong Buy' },
            hold: { class: 'recommendation-hold', text: '⊙ Hold' },
            avoid: { class: 'recommendation-avoid', text: '✗ Avoid' }
        }
        return badges[rec] || badges.hold
    }

    if (loading) {
        return (
            <div className="compare-page text-center" style={{ paddingTop: '150px' }}>
                <div className="loading-bar" style={{ margin: '0 auto' }}></div>
                <h2>Loading localities for comparison...</h2>
            </div>
        )
    }

    if (!localityA || !localityB) {
        return (
            <div className="compare-page text-center" style={{ paddingTop: '150px' }}>
                <h2>Not enough data to compare</h2>
            </div>
        )
    }

    const badgeA = getRecommendationBadge(localityA.recommendation)
    const badgeB = getRecommendationBadge(localityB.recommendation)

    const winnerA = localityA.totalScore > localityB.totalScore
    const winnerB = localityB.totalScore > localityA.totalScore

    return (
        <div className="min-h-screen bg-[#fafafa] selection:bg-primary-100 selection:text-primary-900">
            {/* Header / Navigation */}
            <div className="bg-white border-b border-neutral-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black transition-all">
                        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
                        Intelligence Hub
                    </Link>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                generatePDFReport(localityA)
                                generatePDFReport(localityB)
                            }}
                            className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xl shadow-black/10"
                        >
                            <FileText className="w-4 h-4" />
                            Export Comparison
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                {/* Hero Section */}
                <div className="text-center mb-20 animate-fade-in">
                    <div className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6 border border-primary-100">
                        Side-by-Side Analysis
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-black mb-6 font-display tracking-tightest">
                        Intelligence <span className="text-primary-600">Face-off</span>
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto font-medium">
                        Compare key metrics, growth potential, and quality of life indicators between two prime locations.
                    </p>
                </div>

                {/* Selection Bar */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-6 mb-16 bg-white p-8 rounded-[32px] border border-neutral-100 shadow-premium">
                    <div className="relative group">
                        <label className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black text-neutral-400 uppercase tracking-widest z-10">Primary Location</label>
                        <select
                            className="w-full p-5 bg-neutral-50 border-2 border-transparent rounded-2xl text-lg font-bold text-black outline-none appearance-none cursor-pointer focus:border-primary-600 focus:bg-white transition-all hover:bg-neutral-100"
                            value={localityA.id}
                            onChange={handleSelectA}
                        >
                            {allLocalities.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-black italic shadow-lg shadow-primary-200">
                            VS
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="absolute -top-3 left-4 px-2 bg-white text-[10px] font-black text-neutral-400 uppercase tracking-widest z-10">Comparison Location</label>
                        <select
                            className="w-full p-5 bg-neutral-50 border-2 border-transparent rounded-2xl text-lg font-bold text-black outline-none appearance-none cursor-pointer focus:border-primary-600 focus:bg-white transition-all hover:bg-neutral-100"
                            value={localityB.id}
                            onChange={handleSelectB}
                        >
                            {allLocalities.map(loc => (
                                <option key={loc.id} value={loc.id}>{loc.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>

                {/* Main Comparison Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-16 mb-8 mt-8">
                    {/* Summary Cards */}
                    {[localityA, localityB].map((loc, idx) => {
                        const isWinner = (idx === 0 && winnerA) || (idx === 1 && winnerB)
                        const rec = getRecommendationBadge(loc.recommendation)

                        return (
                            <div key={loc.id} className="relative group">
                                {isWinner && (
                                    <div className="absolute -top-6 left-1/3 -translate-x-1/2 bg-primary-600 text-white px-6 py-2.5 rounded-full text-[11px] font-black tracking-[0.2em] z-20 shadow-2xl shadow-primary-500/20 animate-bounce whitespace-nowrap border-4 border-[#fafafa]">
                                        TOP CHOICE
                                    </div>
                                )}

                                <div className={`relative bg-white border-2 rounded-[40px] p-10 transition-all duration-500 overflow-hidden h-full ${isWinner ? 'border-primary-600 shadow-2xl shadow-primary-100' : 'border-neutral-100 shadow-premium'}`}>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h2 className="text-4xl font-black text-black font-display tracking-tight mb-2 group-hover:text-primary-600 transition-colors">{loc.name}</h2>
                                                <p className="text-neutral-500 font-medium flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary-600"></span>
                                                    {loc.area}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-5xl font-black text-black font-display leading-none tracking-tightest mb-1">{loc.totalScore}</div>
                                                <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">IQ Score</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 mb-10">
                                            <div className="bg-neutral-900 px-4 py-2 rounded-xl text-white text-sm font-bold flex items-center gap-2 border border-neutral-800">
                                                <span className="text-neutral-500 text-[10px] uppercase">Avg</span>
                                                {loc.priceRange}
                                            </div>
                                            <div className={`px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 ${rec.class === 'recommendation-buy' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                                <span className="w-2 h-2 rounded-full bg-current"></span>
                                                {rec.text.replace(/^[✓⊙✗]\s/, '')}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-auto">
                                            <Link href={`/locality/${loc.id}`} className="flex items-center justify-center p-4 bg-neutral-50 hover:bg-black hover:text-white rounded-2xl font-bold transition-all border border-neutral-100">
                                                Deep Dive
                                            </Link>
                                            <button onClick={() => generatePDFReport(loc)} className="flex items-center justify-center p-4 bg-neutral-50 hover:bg-primary-600 hover:text-white rounded-2xl font-bold transition-all border border-neutral-100">
                                                Full Report
                                            </button>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary-50 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white border border-neutral-100 rounded-[40px] shadow-premium overflow-hidden mt-12">
                    <div className="p-10 border-b border-neutral-50 bg-neutral-50/50">
                        <h3 className="text-2xl font-black text-black font-display tracking-tight flex items-center gap-4">
                            Detailed Parameters
                            <span className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-[10px] text-neutral-400 font-black uppercase tracking-widest">Score Breakdown</span>
                        </h3>
                    </div>

                    <div className="p-6 md:p-10">
                        <div className="space-y-12">
                            {Object.entries(metricLabels).map(([key, { icon, label }]) => {
                                const valA = localityA.metrics[key]?.score || 0
                                const valB = localityB.metrics[key]?.score || 0
                                const diff = valA - valB
                                const leadA = valA > valB
                                const leadB = valB > valA

                                return (
                                    <div key={key} className="group relative">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                                            <div className="flex items-center gap-4 min-w-[200px]">
                                                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                                                    {icon}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-neutral-400 uppercase tracking-widest mb-0.5">{label}</div>
                                                    <div className="text-xs font-bold text-neutral-500">
                                                        {diff > 0 ? `${localityA.name} leads` : diff < 0 ? `${localityB.name} leads` : 'Equal rating'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex-1 flex items-center justify-between md:justify-center gap-4 md:gap-20">
                                                {/* Score A */}
                                                <div className="flex flex-col items-center group/score">
                                                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black transition-all duration-500 ${leadA ? 'border-primary-600 text-primary-600 bg-primary-50 shadow-lg shadow-primary-100' : 'border-neutral-100 text-neutral-400 bg-white'}`}>
                                                        {valA}
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest mt-3 transition-colors ${leadA ? 'text-primary-600' : 'text-neutral-400'}`}>
                                                        {localityA.name.split(' ')[0]}
                                                    </span>
                                                </div>

                                                <div className="text-neutral-200 font-display italic font-black text-xs hidden md:block">VS</div>

                                                {/* Score B */}
                                                <div className="flex flex-col items-center group/score">
                                                    <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-xl font-black transition-all duration-500 ${leadB ? 'border-primary-600 text-primary-600 bg-primary-50 shadow-lg shadow-primary-100' : 'border-neutral-100 text-neutral-400 bg-white'}`}>
                                                        {valB}
                                                    </div>
                                                    <span className={`text-[9px] font-black uppercase tracking-widest mt-3 transition-colors ${leadB ? 'text-primary-600' : 'text-neutral-400'}`}>
                                                        {localityB.name.split(' ')[0]}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="hidden md:flex items-center justify-center min-w-[80px]">
                                                <div className={`px-4 py-2 rounded-xl text-sm font-black ${diff > 0 ? 'bg-success/10 text-success' : diff < 0 ? 'bg-danger/10 text-danger' : 'bg-neutral-100 text-neutral-400'}`}>
                                                    {diff > 0 ? `+${diff}` : diff}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Final Verdict Section */}
                    <div className="p-10 bg-neutral-900 text-white relative overflow-hidden">
                        <div className="relative z-10 max-w-4xl">
                            <h3 className="text-3xl text-white font-display tracking-tight mb-6">The Verdict</h3>
                            <p className="text-xl text-neutral-400 leading-relaxed">
                                {winnerA ? (
                                    <>
                                        With an overall lead of <span className="text-primary-400 font-bold">{localityA.totalScore - localityB.totalScore} points</span>,
                                        <span className="text-white font-bold"> {localityA.name}</span> demonstrates superior infrastructure and living standards.
                                        {localityA.recommendation === 'buy' ? ' It emerges as the high-conviction choice for your next move.' : ' It offers a more balanced ecosystem for long-term residency.'}
                                    </>
                                ) : winnerB ? (
                                    <>
                                        With an overall lead of <span className="text-primary-400 font-bold">{localityB.totalScore - localityA.totalScore} points</span>,
                                        <span className="text-white font-bold"> {localityB.name}</span> demonstrates superior infrastructure and living standards.
                                        {localityB.recommendation === 'buy' ? ' It emerges as the high-conviction choice for your next move.' : ' It offers a more balanced ecosystem for long-term residency.'}
                                    </>
                                ) : (
                                    <>Both <span className="text-white font-bold">{localityA.name}</span> and <span className="text-white font-bold">{localityB.name}</span> are exceptionally balanced, showing identical intelligence indices across most parameters.</>
                                )}
                            </p>

                            <div className="flex gap-6 mt-10">
                                <Link
                                    href={`/locality/${winnerA ? localityA.id : winnerB ? localityB.id : localityA.id}`}
                                    className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-primary-900/20"
                                >
                                    Proceed with Top Choice →
                                </Link>
                            </div>
                        </div>

                        {/* Abstract Background Shapes */}
                        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 skew-x-12 translate-x-1/2"></div>
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px]"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
