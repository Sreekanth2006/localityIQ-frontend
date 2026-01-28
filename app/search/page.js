'use client'

import { useState } from 'react'
import Link from 'next/link'
import { generatePDFReport } from '@/components/ReportGenerator'
import dynamic from 'next/dynamic'
import { Search, Wind, Droplet, Zap, GraduationCap, Shield, TrendingUp, Stethoscope, Car, Utensils, Pill, BarChart3, Sparkles, MapPin, XCircle, RefreshCw, Rocket, FileText, Wifi, ArrowLeft } from 'lucide-react'

const LocalityMap = dynamic(() => import('@/components/LocalityMap'), {
    ssr: false,
    loading: () => <div className="h-[300px] bg-neutral-50 flex items-center justify-center rounded-[32px] border border-neutral-100 italic text-neutral-400">Loading map intelligence...</div>
})

import { api } from '@/lib/api'

const metricIcons = {
    airQuality: Wind, water: Droplet, power: Zap, schools: GraduationCap,
    safety: Shield, growth: TrendingUp, hospitals: Stethoscope, traffic: Car,
    restaurants: Utensils, pharmacies: Pill
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
            const data = await api.analyzeLocality(query)
            setResult(data)
        } catch (err) {
            setError(err.message || 'Search failed. Make sure the backend is running.')
        } finally {
            setLoading(false)
        }
    }

    const getRecommendationBadge = (rec) => {
        const badges = {
            buy: { class: 'bg-success text-white', text: '✓ Strong Buy' },
            hold: { class: 'bg-warning text-white', text: '⊙ Hold' },
            avoid: { class: 'bg-danger text-white', text: '✗ Avoid' }
        }
        return badges[rec] || badges.hold
    }

    return (
        <div className="min-h-screen bg-[#fafafa] selection:bg-primary-100 selection:text-primary-900">
            {/* Sticky Header */}
            <div className="bg-white border-b border-neutral-100 sticky top-0 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="group flex items-center text-sm font-bold text-neutral-500 hover:text-black transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Intelligence Hub
                    </Link>
                    {result && (
                        <div className="flex items-center gap-4 animate-fade-in">
                            <button
                                onClick={() => generatePDFReport(result)}
                                className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-xl shadow-black/10"
                            >
                                <FileText className="w-4 h-4" />
                                <span className="hidden sm:inline">Download Report</span>
                                <span className="sm:hidden">Report</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
                {/* Hero Section */}
                <div className="text-center mb-16 animate-fade-in">
                    <div className="inline-block px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-[10px] font-black tracking-[0.2em] uppercase mb-6 border border-primary-100">
                        Live Locality Analysis
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-black mb-6 font-display tracking-tightest">
                        Analyze <span className="text-primary-600">Anywhere</span>
                    </h1>
                    <p className="text-xl text-neutral-500 max-w-2xl mx-auto font-medium">
                        Instant proprietary analysis for any locality worldwide using live data streams.
                    </p>

                    <form onSubmit={handleSearch} className="mt-12 flex flex-col items-center max-w-3xl mx-auto">
                        <div className="w-full relative group">
                            <div className="absolute -inset-1 bg-primary-600 rounded-[32px] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search neighborhood, city, or zip..."
                                className="relative w-full px-8 py-6 bg-white border border-neutral-100 rounded-[32px] text-xl font-bold text-black outline-none focus:border-primary-600 shadow-premium transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-4 bg-primary-600 text-white rounded-[24px] font-black hover:bg-primary-700 transition-all shadow-xl shadow-primary-500/20 disabled:bg-neutral-200 disabled:shadow-none"
                                disabled={loading}
                            >
                                {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6" />}
                            </button>
                        </div>
                    </form>
                </div>

                {error && (
                    <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 p-6 rounded-[32px] text-center text-red-600 mb-12 animate-fade-in">
                        <p className="flex items-center justify-center font-black uppercase text-xs tracking-widest">
                            <XCircle className="w-5 h-5 mr-3" /> {error}
                        </p>
                    </div>
                )}

                {loading && (
                    <div className="max-w-2xl mx-auto bg-white p-12 md:p-20 rounded-[48px] border border-neutral-100 shadow-premium text-center animate-fade-in">
                        <div className="flex justify-center mb-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-primary-600/10 rounded-full blur-2xl animate-pulse"></div>
                                <Search className="w-20 h-20 text-primary-600 relative" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-black text-black font-display mb-3 tracking-tightest">Analyzing {query}</h3>
                        <p className="text-neutral-500 font-medium mb-10">Aggregating live AQI, infrastructure, and socio-economic signals...</p>
                        <div className="w-full h-2 bg-neutral-50 rounded-full overflow-hidden">
                            <div className="h-full bg-primary-600 animate-progressBar"></div>
                        </div>
                    </div>
                )}

                {result && (
                    <div className="animate-fade-in space-y-16">
                        {/* Summary Card - Inspired by Compare Page */}
                        <div className="relative group">
                            <div className="relative bg-white border-2 border-primary-600 rounded-[48px] p-8 md:p-12 transition-all duration-500 overflow-hidden shadow-2xl shadow-primary-100/50">
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                                        <div className="flex-1">
                                            <div className="inline-flex items-center px-4 py-1.5 bg-success/10 text-success rounded-full text-[10px] font-black mb-6 tracking-[0.2em] uppercase border border-success/20">
                                                Analysis Hub
                                            </div>
                                            <h2 className="text-4xl md:text-6xl font-black text-black font-display tracking-tightest mb-4">{result.name}</h2>
                                            <p className="text-xl text-neutral-500 font-medium flex items-center gap-2">
                                                <MapPin className="w-5 h-5 text-primary-600" />
                                                {result.area}{result.city ? `, ${result.city}` : ''}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center md:items-end">
                                            <div className="text-7xl md:text-8xl font-black text-black font-display leading-none tracking-tightest mb-2 selection:bg-primary-100">
                                                {result.totalScore}
                                            </div>
                                            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Intelligence IQ</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 mb-12 border-t border-neutral-50 pt-10">
                                        <div className="bg-neutral-900 px-6 py-3 rounded-2xl text-white text-sm font-bold flex items-center gap-3 border border-neutral-800 shadow-xl shadow-black/10">
                                            <span className="text-neutral-500 text-[10px] uppercase tracking-widest">Pricing</span>
                                            {result.priceRange || 'N/A'}/sqft
                                        </div>
                                        <div className={`px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-3 shadow-xl ${getRecommendationBadge(result.recommendation).class === 'bg-success text-white' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                            <span className="w-2.5 h-2.5 rounded-full bg-current"></span>
                                            {getRecommendationBadge(result.recommendation).text.replace(/[✓⊙✗]\s/, '')}
                                        </div>
                                        {result.analyzedAt && (
                                            <div className="px-6 py-3 rounded-2xl bg-neutral-50 text-neutral-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-neutral-100">
                                                <RefreshCw className="w-3 h-3" />
                                                Live as of {new Date(result.analyzedAt).toLocaleDateString()}
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => generatePDFReport(result)}
                                            className="flex items-center justify-center p-5 bg-primary-600 text-white hover:bg-primary-700 rounded-[24px] font-bold text-lg transition-all shadow-xl shadow-primary-500/20 group/btn"
                                        >
                                            <FileText className="w-6 h-6 mr-3 group-hover/btn:scale-110 transition-transform" />
                                            Download Live Intelligence Report
                                        </button>
                                        {result.coordinates && (
                                            <button
                                                onClick={() => {
                                                    document.getElementById('map-view').scrollIntoView({ behavior: 'smooth' })
                                                }}
                                                className="flex items-center justify-center p-5 bg-neutral-50 hover:bg-black hover:text-white rounded-[24px] font-bold text-lg transition-all border border-neutral-100"
                                            >
                                                Explore Geographic Context
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <div className="absolute -bottom-12 -right-12 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-50"></div>
                            </div>
                        </div>

                        {/* Map Section */}
                        {result.coordinates && (
                            <div id="map-view" className="space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-3xl font-black text-black font-display tracking-tightest">Geographic <span className="text-primary-600">Context</span></h3>
                                    <div className="px-4 py-1.5 bg-neutral-100 rounded-full text-[10px] text-neutral-400 font-black uppercase tracking-widest">Digital Twin View</div>
                                </div>
                                <div className="bg-white rounded-[48px] border border-neutral-100 shadow-premium overflow-hidden h-[500px] relative group">
                                    <LocalityMap coordinates={result.coordinates} name={result.name} />
                                </div>
                            </div>
                        )}

                        {/* Detailed Breakdown - Matched to Compare Page Style */}
                        <div className="bg-white border border-neutral-100 rounded-[48px] shadow-premium overflow-hidden">
                            <div className="p-10 border-b border-neutral-50 bg-neutral-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h3 className="text-3xl font-black text-black font-display tracking-tightest flex items-center gap-4">
                                        <BarChart3 className="w-8 h-8 text-primary-600" />
                                        Intelligence Parameter
                                    </h3>
                                    <p className="text-neutral-500 font-medium">Deep analysis of infrastructure and quality of life</p>
                                </div>
                                <span className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-[10px] text-neutral-400 font-black uppercase tracking-widest self-start md:self-center">Live Score Breakdown</span>
                            </div>

                            <div className="p-6 md:p-12">
                                <div className="space-y-16">
                                    {Object.entries(result.metrics || {}).map(([key, metric]) => {
                                        const Icon = metricIcons[key] || Search
                                        return (
                                            <div key={key} className="group relative">
                                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                                                    {/* Metric Info */}
                                                    <div className="flex items-center gap-6 min-w-[300px]">
                                                        <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-100 shadow-sm flex items-center justify-center text-primary-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                                            <Icon className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">{metricLabels[key] || key}</div>
                                                            <div className="text-2xl font-black text-black font-display tracking-tight">{metric.label}</div>
                                                        </div>
                                                    </div>

                                                    {/* Score Circle - Inspired by Compare's VS Circles */}
                                                    <div className="flex flex-col items-center">
                                                        <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-black transition-all duration-500 ${metric.score > 7 ? 'border-primary-600 text-primary-600 bg-primary-50 shadow-lg shadow-primary-100' : 'border-neutral-100 text-neutral-400 bg-white'}`}>
                                                            {metric.score}
                                                        </div>
                                                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-4">IQ Point</span>
                                                    </div>

                                                    {/* Detailed Insights */}
                                                    <div className="flex-1 max-w-2xl bg-neutral-50/50 p-6 rounded-3xl border border-neutral-100">
                                                        <p className="text-[15px] text-neutral-600 font-medium leading-relaxed mb-4 italic">
                                                            &quot;{metric.details}&quot;
                                                        </p>
                                                        {metric.places && metric.places.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 pt-4 border-t border-neutral-100/50">
                                                                {metric.places.slice(0, 3).map((place, i) => (
                                                                    <span key={i} className="text-[10px] font-black text-neutral-400 bg-white px-3 py-1.5 rounded-xl uppercase tracking-wider border border-neutral-100">
                                                                        {place.name}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Strategic Insights - Verdict Style */}
                        {result.highlights && result.highlights.length > 0 && (
                            <div className="bg-neutral-900 rounded-[48px] p-10 md:p-16 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-3xl text-white font-display tracking-tight">AI Strategic Verdict</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {result.highlights.map((h, i) => (
                                            <div key={i} className="p-8 bg-white/5 border border-white/10 rounded-[32px] hover:bg-white/10 transition-all group/chip">
                                                <p className="text-lg text-neutral-300 font-medium leading-relaxed italic">
                                                    &quot;{h}&quot;
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-16 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
                                        <p className="text-sm font-black text-neutral-400 uppercase tracking-[0.3em] flex items-center">
                                            <Wifi className="w-4 h-4 mr-3 text-primary-500 animate-pulse" />
                                            Live Cloud Intelligence v4.0
                                        </p>
                                        <button
                                            onClick={() => generatePDFReport(result)}
                                            className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-[24px] font-black transition-all shadow-xl shadow-primary-900/50"
                                        >
                                            Export Verdict Analysis →
                                        </button>
                                    </div>
                                </div>

                                {/* Abstract Background Shapes */}
                                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 skew-x-12 translate-x-1/2"></div>
                                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-600/20 rounded-full blur-[120px]"></div>
                                <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary-600/10 rounded-full blur-[80px]"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* Fine Print / Footer */}
            <div className="text-center pb-20 pt-10">
                <p className="text-[10px] font-black text-neutral-300 uppercase tracking-[0.8em]">
                    Proprietary Algorithm | Locality Intelligence Index
                </p>
            </div>
        </div>
    )
}
