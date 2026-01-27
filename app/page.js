'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// All 15 localities data
const localitiesData = [
    { id: "jubilee-hills", name: "Jubilee Hills", area: "Film Nagar, Hyderabad", totalScore: 90, recommendation: "buy", highlights: ["Most premium area", "Celebrity enclave", "Best infrastructure"] },
    { id: "banjara-hills", name: "Banjara Hills", area: "Central Hyderabad", totalScore: 88, recommendation: "buy", highlights: ["Premium location", "Best hospitals", "VIP zone"] },
    { id: "financial-district", name: "Financial District", area: "Nanakramguda, Hyderabad", totalScore: 85, recommendation: "buy", highlights: ["Premium location", "Planned infrastructure", "Corporate hub"] },
    { id: "kokapet", name: "Kokapet", area: "Financial District, Hyderabad", totalScore: 82, recommendation: "buy", highlights: ["Metro Phase 2 planned", "Near Financial District", "Premium communities"] },
    { id: "tellapur", name: "Tellapur", area: "West Hyderabad", totalScore: 79, recommendation: "buy", highlights: ["Affordable", "High growth potential", "ORR connected"] },
    { id: "gachibowli", name: "Gachibowli", area: "IT Hub, Hyderabad", totalScore: 78, recommendation: "buy", highlights: ["IT Hub", "Best hospitals", "Top schools"] },
    { id: "madhapur", name: "Madhapur", area: "IT Corridor, Hyderabad", totalScore: 77, recommendation: "hold", highlights: ["IT hub center", "Great hospitals", "Nightlife"] },
    { id: "hitech-city", name: "Hitech City", area: "Madhapur, Hyderabad", totalScore: 76, recommendation: "hold", highlights: ["IT Capital", "Metro connected", "Vibrant nightlife"] },
    { id: "manikonda", name: "Manikonda", area: "Near Gachibowli, Hyderabad", totalScore: 76, recommendation: "buy", highlights: ["Gachibowli adjacent", "High growth", "Value for money"] },
    { id: "kondapur", name: "Kondapur", area: "Tech Corridor, Hyderabad", totalScore: 75, recommendation: "hold", highlights: ["Affordable IT area", "Good connectivity", "Established locality"] },
    { id: "nallagandla", name: "Nallagandla", area: "Serilingampally, Hyderabad", totalScore: 74, recommendation: "hold", highlights: ["Budget-friendly", "Family-oriented", "Growing infrastructure"] },
    { id: "miyapur", name: "Miyapur", area: "North West Hyderabad", totalScore: 73, recommendation: "hold", highlights: ["Metro terminal", "Affordable", "Fast growing"] },
    { id: "kukatpally", name: "Kukatpally", area: "North West Hyderabad", totalScore: 72, recommendation: "hold", highlights: ["JNTU hub", "Affordable", "Shopping malls"] },
    { id: "bachupally", name: "Bachupally", area: "North Hyderabad", totalScore: 71, recommendation: "buy", highlights: ["Most affordable", "High growth", "Low traffic"] },
    { id: "uppal", name: "Uppal", area: "East Hyderabad", totalScore: 68, recommendation: "hold", highlights: ["Metro connected", "Affordable", "Growing area"] }
]

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [filteredLocalities, setFilteredLocalities] = useState([])
    const [user, setUser] = useState(null)
    const [favorites, setFavorites] = useState([])

    useEffect(() => {
        // Check if user is logged in
        const session = localStorage.getItem('localityiq_session')
        if (session) {
            const sessionData = JSON.parse(session)
            setUser(sessionData)
            // Load favorites
            const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')
            const currentUser = users.find(u => u.email === sessionData.email)
            if (currentUser?.favorites) {
                setFavorites(currentUser.favorites)
            }
        }
    }, [])

    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = localitiesData.filter(loc =>
                loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                loc.area.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredLocalities(filtered)
            setShowDropdown(true)
        } else {
            setShowDropdown(false)
        }
    }, [searchQuery])

    const toggleFavorite = (localityId, e) => {
        e.preventDefault()
        e.stopPropagation()

        if (!user) {
            alert('Please login to save favorites')
            return
        }

        const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')
        const userIndex = users.findIndex(u => u.email === user.email)

        if (userIndex === -1) return

        if (!users[userIndex].favorites) {
            users[userIndex].favorites = []
        }

        const favIndex = users[userIndex].favorites.indexOf(localityId)
        if (favIndex > -1) {
            users[userIndex].favorites.splice(favIndex, 1)
        } else {
            users[userIndex].favorites.push(localityId)
        }

        localStorage.setItem('localityiq_users', JSON.stringify(users))
        setFavorites([...users[userIndex].favorites])
    }

    const getRecommendationBadge = (rec) => {
        const badges = {
            buy: { class: 'status-good', text: '✓ Strong Buy' },
            hold: { class: 'status-moderate', text: '⊙ Hold' },
            avoid: { class: 'status-poor', text: '✗ Avoid' }
        }
        return badges[rec] || badges.hold
    }

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <h1 className="animate-fade-in">
                    Know Your Neighbourhood<br />
                    <span className="highlight">Before You Buy</span>
                </h1>
                <p className="subtitle animate-fade-in">
                    Get comprehensive health scores for any locality. Compare air quality,
                    water, power, schools, safety, and growth potential — all in one place.
                </p>

                {/* Search Bar */}
                <div className="search-container animate-fade-in">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search locality... (e.g., Kokapet, Jubilee Hills)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />

                    {showDropdown && filteredLocalities.length > 0 && (
                        <div className="search-dropdown">
                            {filteredLocalities.map(loc => (
                                <Link
                                    href={`/locality/${loc.id}`}
                                    key={loc.id}
                                    className="search-item"
                                >
                                    <div>
                                        <div className="search-item-name">{loc.name}</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{loc.area}</div>
                                    </div>
                                    <div className="search-item-score">{loc.totalScore}/100</div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link href="/compare" className="btn btn-secondary">
                        ⚖️ Compare Localities
                    </Link>
                    {user ? (
                        <Link href="/profile" className="btn btn-secondary">
                            👤 {user.name}
                        </Link>
                    ) : (
                        <Link href="/login" className="btn btn-primary">
                            🔐 Login / Sign Up
                        </Link>
                    )}
                </div>
            </section>

            {/* Featured Localities */}
            <section className="localities-section" id="localities">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h2 className="section-title" style={{ marginBottom: 0 }}>📍 All Localities in Hyderabad ({localitiesData.length})</h2>
                </div>

                <div className="locality-grid">
                    {localitiesData.map((locality, index) => {
                        const badge = getRecommendationBadge(locality.recommendation)
                        const isFavorite = favorites.includes(locality.id)

                        return (
                            <Link
                                href={`/locality/${locality.id}`}
                                key={locality.id}
                                className="glass-card locality-card animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="locality-card-header">
                                    <div>
                                        <div className="locality-name">{locality.name}</div>
                                        <div className="locality-area">{locality.area}</div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                        <button
                                            onClick={(e) => toggleFavorite(locality.id, e)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '1.3rem',
                                                padding: '4px',
                                                opacity: isFavorite ? 1 : 0.5,
                                                transition: 'all 0.2s ease'
                                            }}
                                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                        >
                                            {isFavorite ? '❤️' : '🤍'}
                                        </button>
                                        <div className="locality-score">{locality.totalScore}</div>
                                    </div>
                                </div>

                                <span className={`status ${badge.class}`} style={{ fontSize: '0.85rem' }}>
                                    {badge.text}
                                </span>

                                <div className="locality-metrics">
                                    {locality.highlights.slice(0, 3).map((h, i) => (
                                        <span key={i} className="metric-pill">{h}</span>
                                    ))}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </section>

            {/* Features Section */}
            <section className="localities-section">
                <h2 className="section-title">🎯 What We Measure</h2>

                <div className="score-grid">
                    {[
                        { icon: '🌫️', label: 'Air Quality', desc: 'Real-time AQI data' },
                        { icon: '💧', label: 'Water Supply', desc: 'Availability & quality' },
                        { icon: '⚡', label: 'Power Reliability', desc: 'Outage frequency' },
                        { icon: '🏫', label: 'School Quality', desc: 'Ratings & distance' },
                        { icon: '🚔', label: 'Safety Score', desc: 'Crime & security' },
                        { icon: '🚧', label: 'Growth Potential', desc: 'Infrastructure plans' },
                        { icon: '🏥', label: 'Healthcare', desc: 'Hospital access' },
                        { icon: '🚦', label: 'Traffic', desc: 'Commute times' }
                    ].map((feature, index) => (
                        <div
                            key={index}
                            className="glass-card score-card animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="icon">{feature.icon}</div>
                            <div className="label" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{feature.label}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{feature.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="localities-section text-center" style={{ paddingBottom: '80px' }}>
                <h2>Ready to make a smarter decision?</h2>
                <p className="text-muted" style={{ marginTop: '8px', marginBottom: '24px' }}>
                    Compare localities side-by-side and download detailed PDF reports.
                </p>
                <Link href="/compare" className="btn btn-primary">
                    Start Comparing →
                </Link>
            </section>
        </>
    )
}
