'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { generatePDFReport } from '@/components/ReportGenerator'
import { LiveAQIBadge, NearbyPlacesList } from '@/components/LiveData'

const LocalityMap = dynamic(() => import('@/components/LocalityMap'), {
    ssr: false,
    loading: () => <div className="map-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>Loading map...</div>
})

// All 15 localities with full data
const localitiesData = {
    "kokapet": {
        id: "kokapet", name: "Kokapet", area: "Financial District, Hyderabad", coordinates: [17.4037, 78.3459], totalScore: 82, recommendation: "buy",
        metrics: {
            airQuality: { score: 72, label: "Moderate", status: "moderate", details: "AQI around 80-100, improving with green zones" },
            water: { score: 65, label: "Mixed", status: "moderate", details: "Municipal + borewell, some tanker dependence in summer" },
            power: { score: 85, label: "Stable", status: "good", details: "TSSPDCL grid, avg 2-3 outages/month" },
            schools: { score: 88, label: "Excellent", status: "good", details: "DPS, Oakridge, CHIREC within 5km" },
            safety: { score: 78, label: "Good", status: "good", details: "Low crime rate, gated communities, police patrols" },
            growth: { score: 92, label: "High Growth", status: "good", details: "Metro Phase 2, ORR proximity, IT corridor expansion" },
            hospitals: { score: 80, label: "Good", status: "good", details: "Continental, KIMS within 8km" },
            traffic: { score: 70, label: "Moderate", status: "moderate", details: "ORR access good, internal roads developing" }
        },
        priceRange: "₹8,000 - ₹12,000 per sqft", highlights: ["Metro Phase 2 planned", "Near Financial District", "Premium gated communities"]
    },
    "gachibowli": {
        id: "gachibowli", name: "Gachibowli", area: "IT Hub, Hyderabad", coordinates: [17.4401, 78.3489], totalScore: 78, recommendation: "buy",
        metrics: {
            airQuality: { score: 65, label: "Moderate", status: "moderate", details: "AQI 90-120, traffic pollution" },
            water: { score: 70, label: "Good", status: "good", details: "HMWSSB supply, backup borewells" },
            power: { score: 82, label: "Stable", status: "good", details: "Industrial grade supply, rare outages" },
            schools: { score: 90, label: "Excellent", status: "good", details: "ISB, IIIT, multiple international schools" },
            safety: { score: 80, label: "Good", status: "good", details: "IT corridor security, well-lit areas" },
            growth: { score: 75, label: "Mature", status: "good", details: "Established IT hub, stable appreciation" },
            hospitals: { score: 85, label: "Excellent", status: "good", details: "KIMS, AIG, multiple specialty hospitals" },
            traffic: { score: 55, label: "Heavy", status: "poor", details: "Peak hour congestion, ORR helps" }
        },
        priceRange: "₹7,500 - ₹11,000 per sqft", highlights: ["IT Hub", "Best hospitals", "Top schools"]
    },
    "kondapur": {
        id: "kondapur", name: "Kondapur", area: "Tech Corridor, Hyderabad", coordinates: [17.4625, 78.3522], totalScore: 75, recommendation: "hold",
        metrics: {
            airQuality: { score: 62, label: "Moderate", status: "moderate", details: "AQI 95-125, urban pollution" },
            water: { score: 68, label: "Mixed", status: "moderate", details: "Municipal supply with summer shortages" },
            power: { score: 78, label: "Good", status: "good", details: "Occasional outages, improving grid" },
            schools: { score: 85, label: "Excellent", status: "good", details: "Multiple CBSE/ICSE schools nearby" },
            safety: { score: 75, label: "Good", status: "good", details: "Active police station, residential security" },
            growth: { score: 72, label: "Stable", status: "good", details: "Mature area, steady appreciation" },
            hospitals: { score: 82, label: "Good", status: "good", details: "Rainbow, KIMS nearby" },
            traffic: { score: 52, label: "Heavy", status: "poor", details: "Major bottleneck during peak hours" }
        },
        priceRange: "₹6,500 - ₹9,500 per sqft", highlights: ["Affordable IT area", "Good connectivity", "Established locality"]
    },
    "financial-district": {
        id: "financial-district", name: "Financial District", area: "Nanakramguda, Hyderabad", coordinates: [17.4234, 78.3424], totalScore: 85, recommendation: "buy",
        metrics: {
            airQuality: { score: 75, label: "Good", status: "good", details: "AQI 70-90, well-planned green spaces" },
            water: { score: 72, label: "Good", status: "good", details: "Premium water supply, STP in complexes" },
            power: { score: 88, label: "Excellent", status: "good", details: "Underground cabling, minimal outages" },
            schools: { score: 85, label: "Excellent", status: "good", details: "DPS, CHIREC, international schools" },
            safety: { score: 90, label: "Excellent", status: "good", details: "Corporate security, CCTV coverage" },
            growth: { score: 88, label: "High Growth", status: "good", details: "Planned development, premium appreciation" },
            hospitals: { score: 78, label: "Good", status: "good", details: "Continental nearby, more planned" },
            traffic: { score: 65, label: "Moderate", status: "moderate", details: "Wide roads, ORR access" }
        },
        priceRange: "₹9,000 - ₹14,000 per sqft", highlights: ["Premium location", "Planned infrastructure", "Corporate hub"]
    },
    "hitech-city": {
        id: "hitech-city", name: "Hitech City", area: "Madhapur, Hyderabad", coordinates: [17.4486, 78.3772], totalScore: 76, recommendation: "hold",
        metrics: {
            airQuality: { score: 60, label: "Moderate", status: "moderate", details: "AQI 100-130, high traffic zones" },
            water: { score: 72, label: "Good", status: "good", details: "Reliable municipal supply" },
            power: { score: 80, label: "Good", status: "good", details: "IT-grade power infrastructure" },
            schools: { score: 88, label: "Excellent", status: "good", details: "Multiple premium schools" },
            safety: { score: 78, label: "Good", status: "good", details: "IT security, active surveillance" },
            growth: { score: 70, label: "Mature", status: "good", details: "Saturated, limited new supply" },
            hospitals: { score: 85, label: "Excellent", status: "good", details: "Apollo, KIMS in vicinity" },
            traffic: { score: 48, label: "Very Heavy", status: "poor", details: "Major congestion, metro helps" }
        },
        priceRange: "₹8,000 - ₹12,000 per sqft", highlights: ["IT Capital", "Metro connected", "Vibrant nightlife"]
    },
    "tellapur": {
        id: "tellapur", name: "Tellapur", area: "West Hyderabad", coordinates: [17.4833, 78.2583], totalScore: 79, recommendation: "buy",
        metrics: {
            airQuality: { score: 78, label: "Good", status: "good", details: "AQI 60-80, less congested area" },
            water: { score: 60, label: "Mixed", status: "moderate", details: "Borewell dependent, improving infra" },
            power: { score: 75, label: "Good", status: "good", details: "Developing grid, occasional outages" },
            schools: { score: 82, label: "Good", status: "good", details: "Phoenix Greens, DRS International" },
            safety: { score: 80, label: "Good", status: "good", details: "Gated townships, low crime" },
            growth: { score: 90, label: "High Growth", status: "good", details: "ORR advantage, new developments" },
            hospitals: { score: 70, label: "Moderate", status: "moderate", details: "Limited options, improving" },
            traffic: { score: 75, label: "Low", status: "good", details: "Less congested, ORR access" }
        },
        priceRange: "₹5,500 - ₹8,000 per sqft", highlights: ["Affordable", "High growth potential", "ORR connected"]
    },
    "nallagandla": {
        id: "nallagandla", name: "Nallagandla", area: "Serilingampally, Hyderabad", coordinates: [17.4572, 78.3128], totalScore: 74, recommendation: "hold",
        metrics: {
            airQuality: { score: 70, label: "Good", status: "good", details: "AQI 75-95, suburban area" },
            water: { score: 58, label: "Mixed", status: "moderate", details: "Tanker dependence in peak summer" },
            power: { score: 72, label: "Good", status: "good", details: "Improving infrastructure" },
            schools: { score: 80, label: "Good", status: "good", details: "Glendale, Manthan schools" },
            safety: { score: 76, label: "Good", status: "good", details: "Residential area, community watch" },
            growth: { score: 78, label: "Growing", status: "good", details: "Metro connectivity expected" },
            hospitals: { score: 68, label: "Moderate", status: "moderate", details: "Depends on Gachibowli hospitals" },
            traffic: { score: 65, label: "Moderate", status: "moderate", details: "Internal roads need improvement" }
        },
        priceRange: "₹5,000 - ₹7,500 per sqft", highlights: ["Budget-friendly", "Family-oriented", "Growing infrastructure"]
    },
    "banjara-hills": {
        id: "banjara-hills", name: "Banjara Hills", area: "Central Hyderabad", coordinates: [17.4156, 78.4347], totalScore: 88, recommendation: "buy",
        metrics: {
            airQuality: { score: 68, label: "Moderate", status: "moderate", details: "AQI 85-110, urban area with parks" },
            water: { score: 85, label: "Excellent", status: "good", details: "Premium municipal supply, no shortages" },
            power: { score: 92, label: "Excellent", status: "good", details: "Priority zone, minimal outages" },
            schools: { score: 95, label: "Premium", status: "good", details: "Oakridge, Chirec, Meridian - top schools" },
            safety: { score: 92, label: "Excellent", status: "good", details: "VIP zone, heavy police presence" },
            growth: { score: 70, label: "Mature", status: "good", details: "Established posh area, stable values" },
            hospitals: { score: 95, label: "Premium", status: "good", details: "Apollo, Care, Yashoda - all major hospitals" },
            traffic: { score: 58, label: "Heavy", status: "moderate", details: "Congested during peak, good roads" }
        },
        priceRange: "₹15,000 - ₹25,000 per sqft", highlights: ["Premium location", "Best hospitals", "Elite schools", "VIP zone"]
    },
    "jubilee-hills": {
        id: "jubilee-hills", name: "Jubilee Hills", area: "Film Nagar, Hyderabad", coordinates: [17.4325, 78.4072], totalScore: 90, recommendation: "buy",
        metrics: {
            airQuality: { score: 72, label: "Good", status: "good", details: "AQI 75-95, greenery and parks" },
            water: { score: 88, label: "Excellent", status: "good", details: "Best water supply in city" },
            power: { score: 94, label: "Excellent", status: "good", details: "Underground cables, rarely any cuts" },
            schools: { score: 92, label: "Premium", status: "good", details: "Oakridge, Silver Oaks, international schools" },
            safety: { score: 95, label: "Excellent", status: "good", details: "Celebrity area, private security" },
            growth: { score: 72, label: "Stable", status: "good", details: "Iconic location, premium appreciation" },
            hospitals: { score: 90, label: "Excellent", status: "good", details: "All major hospitals within 5km" },
            traffic: { score: 62, label: "Moderate", status: "moderate", details: "Good roads, some evening congestion" }
        },
        priceRange: "₹18,000 - ₹30,000 per sqft", highlights: ["Most premium area", "Celebrity enclave", "Iconic location", "Best infrastructure"]
    },
    "madhapur": {
        id: "madhapur", name: "Madhapur", area: "IT Corridor, Hyderabad", coordinates: [17.4489, 78.3916], totalScore: 77, recommendation: "hold",
        metrics: {
            airQuality: { score: 58, label: "Moderate", status: "moderate", details: "AQI 105-135, heavy traffic area" },
            water: { score: 75, label: "Good", status: "good", details: "Municipal supply with backup" },
            power: { score: 82, label: "Good", status: "good", details: "IT-grade infrastructure" },
            schools: { score: 86, label: "Excellent", status: "good", details: "DPS, Oakridge, Manthan schools" },
            safety: { score: 78, label: "Good", status: "good", details: "Good security, IT area surveillance" },
            growth: { score: 72, label: "Stable", status: "good", details: "Established area, steady demand" },
            hospitals: { score: 88, label: "Excellent", status: "good", details: "AIG, KIMS, Continental nearby" },
            traffic: { score: 45, label: "Very Heavy", status: "poor", details: "Worst traffic in Hyderabad" }
        },
        priceRange: "₹7,000 - ₹11,000 per sqft", highlights: ["IT hub center", "Great hospitals", "Nightlife", "Food scene"]
    },
    "kukatpally": {
        id: "kukatpally", name: "Kukatpally", area: "North West Hyderabad", coordinates: [17.4947, 78.3996], totalScore: 72, recommendation: "hold",
        metrics: {
            airQuality: { score: 55, label: "Poor", status: "poor", details: "AQI 110-140, industrial pollution" },
            water: { score: 72, label: "Good", status: "good", details: "Municipal supply, some areas mixed" },
            power: { score: 75, label: "Good", status: "good", details: "Regular grid, occasional outages" },
            schools: { score: 82, label: "Good", status: "good", details: "Sri Chaitanya, Narayana, JNTU area" },
            safety: { score: 70, label: "Moderate", status: "moderate", details: "Dense area, mixed safety record" },
            growth: { score: 68, label: "Stable", status: "moderate", details: "Mature locality, limited growth" },
            hospitals: { score: 78, label: "Good", status: "good", details: "KPHB, Apollo clinic nearby" },
            traffic: { score: 50, label: "Heavy", status: "poor", details: "Major junction, often congested" }
        },
        priceRange: "₹5,500 - ₹8,500 per sqft", highlights: ["JNTU hub", "Affordable", "Shopping malls", "Good connectivity"]
    },
    "uppal": {
        id: "uppal", name: "Uppal", area: "East Hyderabad", coordinates: [17.4065, 78.5593], totalScore: 68, recommendation: "hold",
        metrics: {
            airQuality: { score: 52, label: "Poor", status: "poor", details: "AQI 115-145, industrial zone nearby" },
            water: { score: 65, label: "Mixed", status: "moderate", details: "Municipal supply with summer issues" },
            power: { score: 70, label: "Good", status: "good", details: "Average grid, some outages" },
            schools: { score: 75, label: "Good", status: "good", details: "Local schools, growing options" },
            safety: { score: 68, label: "Moderate", status: "moderate", details: "Industrial area, improving security" },
            growth: { score: 75, label: "Growing", status: "good", details: "Metro boost, new developments" },
            hospitals: { score: 65, label: "Moderate", status: "moderate", details: "Limited options, ECIL hospitals" },
            traffic: { score: 60, label: "Moderate", status: "moderate", details: "Metro helps, still congested" }
        },
        priceRange: "₹4,000 - ₹6,500 per sqft", highlights: ["Metro connected", "Affordable", "Growing area", "IT jobs nearby"]
    },
    "miyapur": {
        id: "miyapur", name: "Miyapur", area: "North West Hyderabad", coordinates: [17.4965, 78.3528], totalScore: 73, recommendation: "hold",
        metrics: {
            airQuality: { score: 65, label: "Moderate", status: "moderate", details: "AQI 90-115, suburban area" },
            water: { score: 62, label: "Mixed", status: "moderate", details: "Borewell heavy, improving supply" },
            power: { score: 72, label: "Good", status: "good", details: "Growing grid infrastructure" },
            schools: { score: 78, label: "Good", status: "good", details: "DRS, Meridian schools nearby" },
            safety: { score: 75, label: "Good", status: "good", details: "Residential area, low crime" },
            growth: { score: 82, label: "High Growth", status: "good", details: "Metro terminal, rapid development" },
            hospitals: { score: 68, label: "Moderate", status: "moderate", details: "Limited, depends on Kukatpally" },
            traffic: { score: 68, label: "Moderate", status: "moderate", details: "Metro reduces congestion" }
        },
        priceRange: "₹5,000 - ₹7,500 per sqft", highlights: ["Metro terminal", "Affordable", "Fast growing", "Family friendly"]
    },
    "manikonda": {
        id: "manikonda", name: "Manikonda", area: "Near Gachibowli, Hyderabad", coordinates: [17.4052, 78.3872], totalScore: 76, recommendation: "buy",
        metrics: {
            airQuality: { score: 68, label: "Moderate", status: "moderate", details: "AQI 85-110, near IT corridor" },
            water: { score: 70, label: "Good", status: "good", details: "Municipal supply, some areas mixed" },
            power: { score: 78, label: "Good", status: "good", details: "IT area spillover, good grid" },
            schools: { score: 82, label: "Good", status: "good", details: "Gachibowli schools accessible" },
            safety: { score: 76, label: "Good", status: "good", details: "Residential area, improving" },
            growth: { score: 85, label: "High Growth", status: "good", details: "IT spillover, rapid appreciation" },
            hospitals: { score: 75, label: "Good", status: "good", details: "Continental, Gachibowli hospitals" },
            traffic: { score: 58, label: "Heavy", status: "moderate", details: "Gachibowli traffic affects area" }
        },
        priceRange: "₹6,000 - ₹9,000 per sqft", highlights: ["Gachibowli adjacent", "High growth", "IT jobs", "Value for money"]
    },
    "bachupally": {
        id: "bachupally", name: "Bachupally", area: "North Hyderabad", coordinates: [17.5422, 78.3856], totalScore: 71, recommendation: "buy",
        metrics: {
            airQuality: { score: 72, label: "Good", status: "good", details: "AQI 70-90, less congested" },
            water: { score: 58, label: "Mixed", status: "moderate", details: "Borewell dependent, tankers in summer" },
            power: { score: 68, label: "Moderate", status: "moderate", details: "Developing grid, some outages" },
            schools: { score: 75, label: "Good", status: "good", details: "Growing school options" },
            safety: { score: 78, label: "Good", status: "good", details: "Peaceful area, gated communities" },
            growth: { score: 88, label: "High Growth", status: "good", details: "ORR nearby, new developments" },
            hospitals: { score: 62, label: "Mixed", status: "moderate", details: "Limited, improving options" },
            traffic: { score: 75, label: "Low", status: "good", details: "Less congested, ORR access" }
        },
        priceRange: "₹4,500 - ₹7,000 per sqft", highlights: ["Most affordable", "High growth potential", "ORR access", "Low traffic"]
    }
}

const metricIcons = {
    airQuality: '🌫️', water: '💧', power: '⚡', schools: '🏫',
    safety: '🚔', growth: '🚧', hospitals: '🏥', traffic: '🚦'
}

const metricLabels = {
    airQuality: 'Air Quality', water: 'Water Supply', power: 'Power Reliability', schools: 'School Quality',
    safety: 'Safety Score', growth: 'Growth Potential', hospitals: 'Healthcare', traffic: 'Traffic Score'
}

export default function LocalityPage() {
    const params = useParams()
    const [locality, setLocality] = useState(null)
    const [user, setUser] = useState(null)
    const [isFavorite, setIsFavorite] = useState(false)

    useEffect(() => {
        const id = params.id
        if (localitiesData[id]) {
            setLocality(localitiesData[id])
        }

        // Check user session and favorites
        const session = localStorage.getItem('localityiq_session')
        if (session) {
            const sessionData = JSON.parse(session)
            setUser(sessionData)

            const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')
            const currentUser = users.find(u => u.email === sessionData.email)
            if (currentUser?.favorites?.includes(id)) {
                setIsFavorite(true)
            }
        }
    }, [params.id])

    const toggleFavorite = () => {
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

        const favIndex = users[userIndex].favorites.indexOf(locality.id)
        if (favIndex > -1) {
            users[userIndex].favorites.splice(favIndex, 1)
            setIsFavorite(false)
        } else {
            users[userIndex].favorites.push(locality.id)
            setIsFavorite(true)
        }

        localStorage.setItem('localityiq_users', JSON.stringify(users))
    }

    const saveReport = () => {
        if (!user) {
            alert('Please login to save reports')
            return
        }

        const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')
        const userIndex = users.findIndex(u => u.email === user.email)

        if (userIndex === -1) return

        if (!users[userIndex].savedReports) {
            users[userIndex].savedReports = []
        }

        // Check if already saved
        if (users[userIndex].savedReports.find(r => r.localityId === locality.id)) {
            alert('Report already saved!')
            return
        }

        users[userIndex].savedReports.push({
            localityId: locality.id,
            localityName: locality.name,
            area: locality.area,
            score: locality.totalScore,
            savedAt: new Date().toISOString()
        })

        localStorage.setItem('localityiq_users', JSON.stringify(users))
        alert('Report saved to your profile!')
    }

    if (!locality) {
        return (
            <div className="detail-page text-center">
                <h2>Loading...</h2>
            </div>
        )
    }

    const getRecommendationBadge = (rec) => {
        const badges = {
            buy: { class: 'recommendation-buy', text: '✓ Strong Buy', desc: 'High growth, low risk' },
            hold: { class: 'recommendation-hold', text: '⊙ Hold', desc: 'Stable, moderate growth' },
            avoid: { class: 'recommendation-avoid', text: '✗ Avoid', desc: 'High risk or declining' }
        }
        return badges[rec] || badges.hold
    }

    const badge = getRecommendationBadge(locality.recommendation)
    const circumference = 2 * Math.PI * 85
    const offset = circumference - (locality.totalScore / 100) * circumference

    return (
        <div className="detail-page">
            {/* Header */}
            <div className="detail-header">
                <div>
                    <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'inline-block', marginBottom: '8px' }}>
                        ← Back to localities
                    </Link>
                    <h1 className="detail-title">{locality.name}</h1>
                    <p className="detail-subtitle">{locality.area}</p>
                    <p style={{ color: 'var(--accent-primary)', marginTop: '8px', fontWeight: 500 }}>
                        {locality.priceRange}
                    </p>
                    <div style={{ marginTop: '12px' }}>
                        <LiveAQIBadge localityId={locality.id} />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                        onClick={toggleFavorite}
                        className="btn btn-secondary"
                        style={{ background: isFavorite ? 'rgba(239, 68, 68, 0.2)' : undefined }}
                    >
                        {isFavorite ? '❤️ Liked' : '🤍 Like'}
                    </button>
                    <button onClick={saveReport} className="btn btn-secondary">
                        💾 Save Report
                    </button>
                    <button onClick={() => generatePDFReport(locality)} className="btn btn-primary">
                        📄 Download PDF
                    </button>
                </div>
            </div>

            {/* Score + Map Grid */}
            <div className="detail-grid">
                {/* Total Score Card */}
                <div className="glass-card total-score-container">
                    <div className="score-gauge">
                        <svg width="200" height="200" viewBox="0 0 200 200">
                            <defs>
                                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="50%" stopColor="#8b5cf6" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                            <circle className="score-gauge-bg" cx="100" cy="100" r="85" />
                            <circle
                                className="score-gauge-fill"
                                cx="100" cy="100" r="85"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                            />
                        </svg>
                        <div className="score-gauge-text">
                            <div className="score-gauge-value">{locality.totalScore}</div>
                            <div className="score-gauge-label">out of 100</div>
                        </div>
                    </div>

                    <div className={`recommendation ${badge.class}`}>
                        {badge.text}
                    </div>
                    <p className="text-muted" style={{ marginTop: '8px' }}>{badge.desc}</p>
                </div>

                {/* Map */}
                <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                    <LocalityMap coordinates={locality.coordinates} name={locality.name} />
                </div>
            </div>

            {/* Metrics Grid */}
            <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>📊 Detailed Metrics</h3>
            <div className="score-grid">
                {Object.entries(locality.metrics).map(([key, metric], index) => (
                    <div key={key} className="glass-card score-card animate-fade-in" style={{ animationDelay: `${index * 0.05}s`, textAlign: 'left', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '1.5rem' }}>{metricIcons[key]}</span>
                            <span className="value" style={{ fontSize: '1.5rem' }}>{metric.score}</span>
                        </div>
                        <div className="label" style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {metricLabels[key]}
                        </div>
                        <span className={`status status-${metric.status}`} style={{ marginBottom: '8px', display: 'inline-block' }}>
                            {metric.label}
                        </span>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                            {metric.details}
                        </p>
                    </div>
                ))}
            </div>

            {/* Highlights */}
            <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>✨ Key Highlights</h3>
            <div className="glass-card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    {locality.highlights.map((highlight, i) => (
                        <span key={i} className="metric-pill" style={{ padding: '10px 20px', fontSize: '1rem' }}>
                            {highlight}
                        </span>
                    ))}
                </div>
            </div>

            {/* Compare CTA */}
            <div className="text-center" style={{ marginTop: '60px', paddingBottom: '40px' }}>
                <p className="text-muted" style={{ marginBottom: '16px' }}>
                    Want to compare with other localities?
                </p>
                <Link href="/compare" className="btn btn-secondary">
                    ⚖️ Compare Localities
                </Link>
            </div>
        </div>
    )
}
