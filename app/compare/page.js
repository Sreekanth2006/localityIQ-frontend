'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generatePDFReport } from '@/components/ReportGenerator'

// All 15 localities data for comparison
const localitiesData = [
    {
        id: "jubilee-hills", name: "Jubilee Hills", area: "Film Nagar", totalScore: 90, recommendation: "buy", priceRange: "₹18,000 - ₹30,000",
        metrics: { airQuality: 72, water: 88, power: 94, schools: 92, safety: 95, growth: 72, hospitals: 90, traffic: 62 }
    },
    {
        id: "banjara-hills", name: "Banjara Hills", area: "Central Hyderabad", totalScore: 88, recommendation: "buy", priceRange: "₹15,000 - ₹25,000",
        metrics: { airQuality: 68, water: 85, power: 92, schools: 95, safety: 92, growth: 70, hospitals: 95, traffic: 58 }
    },
    {
        id: "financial-district", name: "Financial District", area: "Nanakramguda", totalScore: 85, recommendation: "buy", priceRange: "₹9,000 - ₹14,000",
        metrics: { airQuality: 75, water: 72, power: 88, schools: 85, safety: 90, growth: 88, hospitals: 78, traffic: 65 }
    },
    {
        id: "kokapet", name: "Kokapet", area: "Financial District", totalScore: 82, recommendation: "buy", priceRange: "₹8,000 - ₹12,000",
        metrics: { airQuality: 72, water: 65, power: 85, schools: 88, safety: 78, growth: 92, hospitals: 80, traffic: 70 }
    },
    {
        id: "tellapur", name: "Tellapur", area: "West Hyderabad", totalScore: 79, recommendation: "buy", priceRange: "₹5,500 - ₹8,000",
        metrics: { airQuality: 78, water: 60, power: 75, schools: 82, safety: 80, growth: 90, hospitals: 70, traffic: 75 }
    },
    {
        id: "gachibowli", name: "Gachibowli", area: "IT Hub", totalScore: 78, recommendation: "buy", priceRange: "₹7,500 - ₹11,000",
        metrics: { airQuality: 65, water: 70, power: 82, schools: 90, safety: 80, growth: 75, hospitals: 85, traffic: 55 }
    },
    {
        id: "madhapur", name: "Madhapur", area: "IT Corridor", totalScore: 77, recommendation: "hold", priceRange: "₹7,000 - ₹11,000",
        metrics: { airQuality: 58, water: 75, power: 82, schools: 86, safety: 78, growth: 72, hospitals: 88, traffic: 45 }
    },
    {
        id: "hitech-city", name: "Hitech City", area: "Madhapur", totalScore: 76, recommendation: "hold", priceRange: "₹8,000 - ₹12,000",
        metrics: { airQuality: 60, water: 72, power: 80, schools: 88, safety: 78, growth: 70, hospitals: 85, traffic: 48 }
    },
    {
        id: "manikonda", name: "Manikonda", area: "Near Gachibowli", totalScore: 76, recommendation: "buy", priceRange: "₹6,000 - ₹9,000",
        metrics: { airQuality: 68, water: 70, power: 78, schools: 82, safety: 76, growth: 85, hospitals: 75, traffic: 58 }
    },
    {
        id: "kondapur", name: "Kondapur", area: "Tech Corridor", totalScore: 75, recommendation: "hold", priceRange: "₹6,500 - ₹9,500",
        metrics: { airQuality: 62, water: 68, power: 78, schools: 85, safety: 75, growth: 72, hospitals: 82, traffic: 52 }
    },
    {
        id: "nallagandla", name: "Nallagandla", area: "Serilingampally", totalScore: 74, recommendation: "hold", priceRange: "₹5,000 - ₹7,500",
        metrics: { airQuality: 70, water: 58, power: 72, schools: 80, safety: 76, growth: 78, hospitals: 68, traffic: 65 }
    },
    {
        id: "miyapur", name: "Miyapur", area: "North West", totalScore: 73, recommendation: "hold", priceRange: "₹5,000 - ₹7,500",
        metrics: { airQuality: 65, water: 62, power: 72, schools: 78, safety: 75, growth: 82, hospitals: 68, traffic: 68 }
    },
    {
        id: "kukatpally", name: "Kukatpally", area: "North West", totalScore: 72, recommendation: "hold", priceRange: "₹5,500 - ₹8,500",
        metrics: { airQuality: 55, water: 72, power: 75, schools: 82, safety: 70, growth: 68, hospitals: 78, traffic: 50 }
    },
    {
        id: "bachupally", name: "Bachupally", area: "North Hyderabad", totalScore: 71, recommendation: "buy", priceRange: "₹4,500 - ₹7,000",
        metrics: { airQuality: 72, water: 58, power: 68, schools: 75, safety: 78, growth: 88, hospitals: 62, traffic: 75 }
    },
    {
        id: "uppal", name: "Uppal", area: "East Hyderabad", totalScore: 68, recommendation: "hold", priceRange: "₹4,000 - ₹6,500",
        metrics: { airQuality: 52, water: 65, power: 70, schools: 75, safety: 68, growth: 75, hospitals: 65, traffic: 60 }
    }
]

const metricLabels = {
    airQuality: { icon: '🌫️', label: 'Air Quality' },
    water: { icon: '💧', label: 'Water Supply' },
    power: { icon: '⚡', label: 'Power' },
    schools: { icon: '🏫', label: 'Schools' },
    safety: { icon: '🚔', label: 'Safety' },
    growth: { icon: '🚧', label: 'Growth' },
    hospitals: { icon: '🏥', label: 'Healthcare' },
    traffic: { icon: '🚦', label: 'Traffic' }
}

export default function ComparePage() {
    const [localityA, setLocalityA] = useState(localitiesData[0])
    const [localityB, setLocalityB] = useState(localitiesData[3])

    const handleSelectA = (e) => {
        const selected = localitiesData.find(l => l.id === e.target.value)
        if (selected) setLocalityA(selected)
    }

    const handleSelectB = (e) => {
        const selected = localitiesData.find(l => l.id === e.target.value)
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

    const badgeA = getRecommendationBadge(localityA.recommendation)
    const badgeB = getRecommendationBadge(localityB.recommendation)

    const winnerA = localityA.totalScore > localityB.totalScore
    const winnerB = localityB.totalScore > localityA.totalScore

    return (
        <div className="compare-page">
            {/* Header */}
            <div className="compare-header">
                <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-block', marginBottom: '16px' }}>
                    ← Back to home
                </Link>
                <h1>⚖️ Compare Localities</h1>
                <p className="text-muted" style={{ marginTop: '8px' }}>
                    Select two localities to compare side by side (15 available)
                </p>
            </div>

            {/* Selectors */}
            <div className="compare-selectors">
                <select className="compare-select" value={localityA.id} onChange={handleSelectA}>
                    {localitiesData.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name} ({loc.totalScore})</option>
                    ))}
                </select>

                <span className="compare-vs">VS</span>

                <select className="compare-select" value={localityB.id} onChange={handleSelectB}>
                    {localitiesData.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name} ({loc.totalScore})</option>
                    ))}
                </select>
            </div>

            {/* Comparison Cards */}
            <div className="compare-grid">
                {/* Locality A */}
                <div className={`glass-card compare-card ${winnerA ? 'compare-card-winner' : ''}`}>
                    {winnerA && (
                        <div style={{
                            background: 'var(--success)', color: 'white', padding: '4px 12px', borderRadius: '20px',
                            fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '16px'
                        }}>
                            🏆 WINNER
                        </div>
                    )}
                    <h2>{localityA.name}</h2>
                    <p className="text-muted">{localityA.area}</p>

                    <div style={{ margin: '24px 0', textAlign: 'center' }}>
                        <div style={{
                            fontSize: '4rem', fontWeight: 700, background: 'var(--accent-gradient)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            {localityA.totalScore}
                        </div>
                        <div className="text-muted">out of 100</div>
                        <div className={`recommendation ${badgeA.class}`} style={{ marginTop: '16px' }}>
                            {badgeA.text}
                        </div>
                    </div>

                    <div style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', marginBottom: '16px' }}>
                        {localityA.priceRange} per sqft
                    </div>

                    <Link href={`/locality/${localityA.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                        View Details →
                    </Link>
                </div>

                {/* Locality B */}
                <div className={`glass-card compare-card ${winnerB ? 'compare-card-winner' : ''}`}>
                    {winnerB && (
                        <div style={{
                            background: 'var(--success)', color: 'white', padding: '4px 12px', borderRadius: '20px',
                            fontSize: '0.8rem', fontWeight: 600, display: 'inline-block', marginBottom: '16px'
                        }}>
                            🏆 WINNER
                        </div>
                    )}
                    <h2>{localityB.name}</h2>
                    <p className="text-muted">{localityB.area}</p>

                    <div style={{ margin: '24px 0', textAlign: 'center' }}>
                        <div style={{
                            fontSize: '4rem', fontWeight: 700, background: 'var(--accent-gradient)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>
                            {localityB.totalScore}
                        </div>
                        <div className="text-muted">out of 100</div>
                        <div className={`recommendation ${badgeB.class}`} style={{ marginTop: '16px' }}>
                            {badgeB.text}
                        </div>
                    </div>

                    <div style={{ fontSize: '0.95rem', color: 'var(--accent-primary)', marginBottom: '16px' }}>
                        {localityB.priceRange} per sqft
                    </div>

                    <Link href={`/locality/${localityB.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
                        View Details →
                    </Link>
                </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className="glass-card" style={{ marginTop: '40px', padding: '32px', overflowX: 'auto' }}>
                <h3 style={{ marginBottom: '24px' }}>📊 Metric-by-Metric Comparison</h3>

                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th>{localityA.name}</th>
                            <th>{localityB.name}</th>
                            <th>Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(metricLabels).map(([key, { icon, label }]) => {
                            const valA = localityA.metrics[key]
                            const valB = localityB.metrics[key]
                            const diff = valA - valB
                            const winnerClass = diff > 0 ? 'winner' : ''
                            const loserClass = diff < 0 ? 'winner' : ''

                            return (
                                <tr key={key}>
                                    <td style={{ textAlign: 'left' }}>
                                        <span style={{ marginRight: '8px' }}>{icon}</span>{label}
                                    </td>
                                    <td className={winnerClass}>{valA}</td>
                                    <td className={loserClass}>{valB}</td>
                                    <td style={{ color: diff > 0 ? 'var(--success)' : diff < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                                        {diff > 0 ? `+${diff}` : diff}
                                    </td>
                                </tr>
                            )
                        })}
                        <tr style={{ fontWeight: 600, borderTop: '2px solid var(--border-color)' }}>
                            <td style={{ textAlign: 'left' }}>🎯 Total Score</td>
                            <td className={winnerA ? 'winner' : ''}>{localityA.totalScore}</td>
                            <td className={winnerB ? 'winner' : ''}>{localityB.totalScore}</td>
                            <td style={{
                                color: localityA.totalScore > localityB.totalScore ? 'var(--success)' :
                                    localityA.totalScore < localityB.totalScore ? 'var(--danger)' : 'var(--text-muted)'
                            }}>
                                {localityA.totalScore - localityB.totalScore > 0 ? '+' : ''}{localityA.totalScore - localityB.totalScore}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Summary */}
            <div className="glass-card" style={{ marginTop: '24px', padding: '24px', textAlign: 'center' }}>
                <h3>📝 Summary</h3>
                <p style={{ marginTop: '12px', fontSize: '1.1rem', lineHeight: 1.8 }}>
                    {winnerA ? (
                        <>
                            <strong style={{ color: 'var(--success)' }}>{localityA.name}</strong> scores
                            <strong> {localityA.totalScore - localityB.totalScore} points higher</strong> than {localityB.name}.
                            {localityA.recommendation === 'buy' ? ` It's a strong buy with excellent potential.` : ` Consider it as a stable option.`}
                        </>
                    ) : winnerB ? (
                        <>
                            <strong style={{ color: 'var(--success)' }}>{localityB.name}</strong> scores
                            <strong> {localityB.totalScore - localityA.totalScore} points higher</strong> than {localityA.name}.
                            {localityB.recommendation === 'buy' ? ` It's a strong buy with excellent potential.` : ` Consider it as a stable option.`}
                        </>
                    ) : (
                        <>Both <strong>{localityA.name}</strong> and <strong>{localityB.name}</strong> have equal scores.</>
                    )}
                </p>
            </div>
        </div>
    )
}
