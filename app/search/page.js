'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generatePDFReport } from '@/components/ReportGenerator'
import dynamic from 'next/dynamic'

const LocalityMap = dynamic(() => import('@/components/LocalityMap'), {
    ssr: false,
    loading: () => <div style={{ height: '300px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading map...</div>
})

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const metricIcons = {
    airQuality: '🌫️', water: '💧', power: '⚡', schools: '🏫',
    safety: '🚔', growth: '🚧', hospitals: '🏥', traffic: '🚦',
    restaurants: '🍽️', pharmacies: '💊'
}

const metricLabels = {
    airQuality: 'Air Quality', water: 'Water Supply', power: 'Power', schools: 'Schools',
    safety: 'Safety', growth: 'Growth', hospitals: 'Healthcare', traffic: 'Traffic',
    restaurants: 'Restaurants', pharmacies: 'Pharmacies'
}

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim() || query.length < 3) {
            setError('Please enter at least 3 characters')
            return
        }

        setLoading(true)
        setError(null)
        setResult(null)

        try {
            const response = await fetch(`${API_BASE}/api/analyze?q=${encodeURIComponent(query)}`)
            const data = await response.json()

            if (data.error) {
                setError(data.error)
            } else {
                setResult(data)
            }
        } catch (err) {
            setError('Failed to connect to API. Make sure the server is running on port 3001.')
        } finally {
            setLoading(false)
        }
    }

    const getRecommendationBadge = (rec) => {
        const badges = {
            buy: { class: 'recommendation-buy', text: '✓ Strong Buy' },
            hold: { class: 'recommendation-hold', text: '⊙ Hold' },
            avoid: { class: 'recommendation-avoid', text: '✗ Avoid' }
        }
        return badges[rec] || badges.hold
    }

    return (
        <div className="search-page">
            <div className="search-hero">
                <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', display: 'inline-block' }}>
                    ← Back to home
                </Link>
                <h1>🔍 Search Any Locality</h1>
                <p className="text-muted" style={{ marginTop: '8px', marginBottom: '24px' }}>
                    Enter any locality name worldwide and get instant analysis with live data
                </p>

                <form onSubmit={handleSearch} className="dynamic-search-form">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., Indiranagar Bangalore, Koramangala, Manhattan NY..."
                        className="search-input"
                        style={{ maxWidth: '500px', margin: '0 auto' }}
                    />
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '16px' }}>
                        {loading ? '🔄 Analyzing...' : '🚀 Analyze Locality'}
                    </button>
                </form>
            </div>

            {error && (
                <div className="glass-card" style={{ padding: '24px', textAlign: 'center', marginTop: '24px', background: 'rgba(239, 68, 68, 0.1)' }}>
                    <p style={{ color: 'var(--danger)' }}>❌ {error}</p>
                </div>
            )}

            {loading && (
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', marginTop: '24px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
                    <h3>Analyzing {query}...</h3>
                    <p className="text-muted" style={{ marginTop: '8px' }}>
                        Fetching live AQI, schools, hospitals, and more...
                    </p>
                    <div style={{ marginTop: '24px' }}>
                        <div className="loading-bar"></div>
                    </div>
                </div>
            )}

            {result && (
                <div className="result-container" style={{ marginTop: '40px' }}>
                    {/* Header */}
                    <div className="glass-card result-header" style={{ padding: '32px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '24px' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                    <span style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--accent-primary)' }}>
                                        LIVE DATA
                                    </span>
                                </div>
                                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>{result.name}</h1>
                                <p className="text-muted">{result.area}</p>
                                {result.city && (
                                    <p style={{ marginTop: '4px', color: 'var(--text-secondary)' }}>
                                        📍 {result.city}{result.state ? `, ${result.state}` : ''}{result.country ? `, ${result.country}` : ''}
                                    </p>
                                )}
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '4rem', fontWeight: 700, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {result.totalScore}
                                </div>
                                <div className="text-muted">out of 100</div>
                                <div className={`recommendation ${getRecommendationBadge(result.recommendation).class}`} style={{ marginTop: '12px' }}>
                                    {getRecommendationBadge(result.recommendation).text}
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                            <button onClick={() => generatePDFReport(result)} className="btn btn-primary">
                                📄 Download PDF Report
                            </button>
                            <button className="btn btn-secondary" onClick={() => {
                                const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')
                                const session = localStorage.getItem('localityiq_session')
                                if (session) {
                                    const sessionData = JSON.parse(session)
                                    const userIndex = users.findIndex(u => u.email === sessionData.email)
                                    if (userIndex > -1) {
                                        if (!users[userIndex].savedReports) users[userIndex].savedReports = []
                                        users[userIndex].savedReports.push({
                                            ...result,
                                            savedAt: new Date().toISOString()
                                        })
                                        localStorage.setItem('localityiq_users', JSON.stringify(users))
                                        alert('Report saved!')
                                    }
                                } else {
                                    alert('Please login to save reports')
                                }
                            }}>
                                💾 Save Report
                            </button>
                        </div>
                    </div>

                    {/* Map */}
                    {result.coordinates && (
                        <div className="glass-card" style={{ marginTop: '24px', padding: 0, overflow: 'hidden' }}>
                            <LocalityMap coordinates={result.coordinates} name={result.name} />
                        </div>
                    )}

                    {/* Metrics Grid */}
                    <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>📊 Live Analysis Results</h3>
                    <div className="score-grid">
                        {Object.entries(result.metrics || {}).map(([key, metric], index) => (
                            <div key={key} className="glass-card score-card" style={{ textAlign: 'left', padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{metricIcons[key] || '📊'}</span>
                                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{metric.score}</span>
                                </div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                    {metricLabels[key] || key}
                                </div>
                                <span className={`status status-${metric.status}`}>
                                    {metric.label}
                                </span>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                    {metric.details}
                                </p>
                                {metric.places && metric.places.length > 0 && (
                                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Nearby:</p>
                                        <ul style={{ fontSize: '0.8rem', color: 'var(--text-muted)', paddingLeft: '16px' }}>
                                            {metric.places.slice(0, 3).map((place, i) => (
                                                <li key={i}>{place.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Highlights */}
                    {result.highlights && result.highlights.length > 0 && (
                        <>
                            <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>✨ Highlights</h3>
                            <div className="glass-card" style={{ padding: '24px' }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {result.highlights.map((h, i) => (
                                        <span key={i} className="metric-pill" style={{ padding: '10px 20px' }}>{h}</span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Data Source */}
                    <div className="text-center" style={{ marginTop: '40px', paddingBottom: '40px' }}>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                            📡 Data source: {result.dataSource === 'google' ? 'Google Places API' : 'OpenStreetMap'} |
                            Analyzed: {new Date(result.analyzedAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            )}

            <style jsx>{`
        .search-page {
          padding: 100px 24px 60px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .search-hero {
          text-align: center;
          margin-bottom: 24px;
        }

        .search-hero h1 {
          font-size: 2.5rem;
        }

        .dynamic-search-form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .loading-bar {
          height: 4px;
          width: 200px;
          background: var(--bg-secondary);
          border-radius: 2px;
          overflow: hidden;
          margin: 0 auto;
        }

        .loading-bar::after {
          content: '';
          display: block;
          height: 100%;
          width: 50%;
          background: var(--accent-gradient);
          animation: loading 1s ease-in-out infinite;
        }

        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
        </div>
    )
}
