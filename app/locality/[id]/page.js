'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'
import { generatePDFReport } from '@/components/ReportGenerator'
import { LiveAQIBadge, NearbyPlacesList } from '@/components/LiveData'
import { MapPin,Wind, Droplets, Zap, GraduationCap, Shield, TrendingUp, Stethoscope, Car, Heart, XCircle, BarChart3, Sparkles, Scale, FileText } from 'lucide-react'
import { storage } from '@/lib/storage'

const LocalityMap = dynamic(() => import('@/components/LocalityMap'), {
    ssr: false,
    loading: () => <div className="map-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)' }}>Loading map...</div>
})

import { api } from '@/lib/api'

const metricIcons = {
    airQuality: Wind, water: Droplets, power: Zap, schools: GraduationCap,
    safety: Shield, growth: TrendingUp, hospitals: Stethoscope, traffic: Car
}

const metricLabels = {
    airQuality: 'Air Quality', water: 'Water Supply', power: 'Power Reliability', schools: 'School Quality',
    safety: 'Safety Score', growth: 'Growth Potential', hospitals: 'Healthcare', traffic: 'Traffic Score'
}

export default function LocalityPage() {
    const params = useParams()
    const [locality, setLocality] = useState(null)
    const [isFavorite, setIsFavorite] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const id = params.id

        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await api.getLocality(id)
                setLocality(data)

                // Check if this locality is favorited
                const favoriteStatus = storage.isFavorite(id)
                setIsFavorite(favoriteStatus)
            } catch (err) {
                console.error('Failed to load locality:', err)
                setError('Locality not found or API error')
            } finally {
                setLoading(false)
            }
        }

        if (id) fetchData()
    }, [params.id])

    const toggleFavorite = () => {
        if (!locality) return

        const newFavoriteStatus = storage.toggleFavorite(locality.id)
        setIsFavorite(newFavoriteStatus)
    }

    if (loading) {
        return (
            <div className="detail-page text-center" style={{ paddingTop: '150px' }}>
                <div className="loading-bar" style={{ margin: '0 auto' }}></div>
                <h2 style={{ mt: '20px' }}>Loading locality details...</h2>
            </div>
        )
    }

    if (error || !locality) {
        return (
            <div className="detail-page text-center" style={{ paddingTop: '150px' }}>
                <h2><XCircle className="inline w-5 h-5 mr-2" /> {error || 'Locality not found'}</h2>
                <Link href="/" className="btn btn-secondary" style={{ marginTop: '20px' }}>
                    Go Back Home
                </Link>
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
        <div className="max-w-7xl mx-auto px-6 py-24 font-ui">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                <div>
                    <Link href="/" className="text-neutral-500 hover:text-primary-600 text-sm font-bold mb-6 inline-flex items-center transition-all hover:-translate-x-1">
                        ← Back to localities
                    </Link>
                    <h1 className="text-5xl md:text-6xl font-black text-black mb-3 tracking-tighter font-display">
                        {locality.name}
                    </h1>
                    <p className="text-xl text-neutral-500 font-medium">{locality.area}</p>
                    <p className="text-2xl font-black text-primary-600 mt-4 font-display">
                        {locality.priceRange} <span className="text-neutral-400 text-sm font-bold">per sqft</span>
                    </p>
                    <div className="mt-6">
                        <LiveAQIBadge localityId={locality.id} />
                    </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={toggleFavorite}
                        className={`inline-flex items-center px-6 py-3 rounded-2xl font-bold transition-all ${isFavorite
                            ? 'bg-danger/10 text-danger hover:bg-danger/20'
                            : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:text-danger'
                            }`}
                    >
                        <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                        {isFavorite ? 'Favorited' : 'Save to Favorites'}
                    </button>
                    <button onClick={() => generatePDFReport(locality)} className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 hover:scale-105">
                        <FileText className="w-5 h-5 mr-2" />Download Report
                    </button>
                </div>
            </div>

            {/* Score + Map Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-20">
                {/* Total Score Card */}
                <div className="bg-white rounded-3xl p-10 border border-neutral-100 shadow-xl shadow-neutral-100/50 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:bg-primary-100 transition-colors"></div>

                    <div className="relative w-56 h-56 mb-8">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                            <circle
                                className="text-neutral-50"
                                strokeWidth="16"
                                stroke="currentColor"
                                fill="transparent"
                                r="85"
                                cx="100"
                                cy="100"
                            />
                            <circle
                                className="text-primary-600 transition-all duration-1000 ease-out"
                                strokeWidth="16"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                stroke="currentColor"
                                fill="transparent"
                                r="85"
                                cx="100"
                                cy="100"
                            />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center font-display">
                            <div className="text-7xl font-black text-black">{locality.totalScore}</div>
                            <div className="text-xs text-neutral-400 font-black uppercase tracking-[0.2em] mt-2">Score</div>
                        </div>
                    </div>

                    <div className={`text-xl font-black px-6 py-2 rounded-2xl mb-4 font-display ${badge.class === 'recommendation-buy' ? 'bg-success/10 text-success' : badge.class === 'recommendation-avoid' ? 'bg-danger/10 text-danger' : 'bg-warning/10 text-warning'}`}>
                        {badge.text}
                    </div>
                    <p className="text-neutral-500 font-medium leading-relaxed">{badge.desc}</p>
                </div>

                {/* Map */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/50 overflow-hidden h-[500px]">
                    <LocalityMap coordinates={locality.coordinates} name={locality.name} />
                </div>
            </div>

            {/* Metrics Grid */}
            <h3 className="text-3xl font-black text-black mb-10 flex items-center font-display tracking-tight">
                <BarChart3 className="w-8 h-8 mr-4 text-primary-600" />
                Detailed Metrics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {Object.entries(locality.metrics).map(([key, metric], index) => {
                    const Icon = metricIcons[key]
                    return (
                        <div
                            key={key}
                            className="bg-white p-8 rounded-3xl border border-neutral-100 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-500 animate-fade-in text-left group"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="p-3 bg-primary-50 rounded-2xl text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <span className="text-3xl font-black text-black font-display">{metric.score}</span>
                            </div>
                            <div className="font-bold text-black mb-2 text-lg font-display">
                                {metricLabels[key]}
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider mb-4 ${metric.status === 'excellent' ? 'bg-success/10 text-success' :
                                metric.status === 'bad' || metric.status === 'poor' ? 'bg-danger/10 text-danger' :
                                    'bg-warning/10 text-warning'
                                }`}>
                                {metric.label}
                            </span>
                            <p className="text-sm text-neutral-500 font-medium leading-relaxed font-ui">
                                {metric.details}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Highlights */}
            <h3 className="text-3xl font-black text-black mb-10 flex items-center font-display tracking-tight">
                <Sparkles className="w-8 h-8 mr-4 text-primary-600" />
                Key Highlights
            </h3>
            <div className="bg-white p-10 rounded-3xl border border-neutral-100 shadow-xl shadow-neutral-100/50 mb-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary-600"></div>
                <div className="flex flex-wrap gap-4">
                    {locality.highlights.map((highlight, i) => (
                        <span key={i} className="px-6 py-3 bg-neutral-50 border border-neutral-100 text-charcoal rounded-2xl text-[15px] font-bold font-ui hover:bg-white hover:border-primary-300 hover:shadow-md transition-all cursor-default">
                            {highlight}
                        </span>
                    ))}
                </div>
            </div>

            {/* Nearby Places */}
            <h3 className="text-3xl font-black text-black mb-10 flex items-center font-display tracking-tight">
                <MapPin className="w-8 h-8 mr-4 text-primary-600" />
                Nearby Places
            </h3>
            <div className="mb-20">
                <NearbyPlacesList localityId={locality.id} />
            </div>

            {/* Compare CTA */}
            <div className="text-center py-20 border-t border-neutral-100 font-ui text-neutral-900 border-dashed border-2 rounded-[40px] mt-10">
                <p className="text-neutral-500 mb-8 text-xl font-medium">
                    Want to compare with other localities?
                </p>
                <Link href="/compare" className="inline-flex items-center px-8 py-4 bg-white border-2 border-primary-600 text-primary-600 rounded-2xl font-black text-lg hover:bg-primary-600 hover:text-white hover:shadow-2xl hover:shadow-primary-600/30 transition-all active:scale-95">
                    <Scale className="w-6 h-6 mr-3" />Compare Localities
                </Link>
            </div>
        </div>
    )
}
