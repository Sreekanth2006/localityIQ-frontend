'use client'

import Link from 'next/link'
import { Search, Home, BarChart3, MapPin } from 'lucide-react'

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-neutral-100 shadow-clean transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-black text-black tracking-tighter group-hover:text-primary-600 transition-colors font-display">
                            LocalityIQ
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-10 font-ui">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-[15px] font-bold text-charcoal hover:text-primary-600 transition-all hover:-translate-y-0.5"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <Link
                            href="/search"
                            className="flex items-center gap-2 text-[15px] font-bold text-charcoal hover:text-primary-600 transition-all hover:-translate-y-0.5"
                        >
                            <Search className="w-4 h-4" />
                            Search
                        </Link>
                        <Link
                            href="/compare"
                            className="flex items-center gap-2 text-[15px] font-bold text-charcoal hover:text-primary-600 transition-all hover:-translate-y-0.5"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Compare
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
