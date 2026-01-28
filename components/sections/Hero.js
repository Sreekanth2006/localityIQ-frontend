'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function Hero({ searchQuery, setSearchQuery, showDropdown, setShowDropdown, filteredLocalities }) {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-primary-900/40 z-10" /> {/* Overlay */}
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/1080.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto px-4 text-center w-full">
        <div className="space-y-8 animate-fade-in font-display">
          <h1 className="text-4xl md:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight drop-shadow-2xl">
            Know Your <span className="text-white underline decoration-primary-400/50 underline-offset-8">Neighbourhood</span>
            <br />
            <span className="text-primary-300">Before You Buy</span>
          </h1>

          <p className="text-base md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed font-ui font-medium drop-shadow-md">
            Comprehensive health scores for every locality.
            <span className="hidden md:inline"> Air quality, water, safety, and growth potential analyzed.</span>
          </p>

          <div className="max-w-2xl mx-auto relative mt-10 font-ui text-left">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <Input
                type="text"
                placeholder="Search for a locality (e.g., Kokapet, Jubilee Hills)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                icon={<Search className="w-6 h-6 text-primary-500" />}
                className="relative text-xl py-6 pl-14 shadow-2xl border-0 rounded-2xl w-full bg-white/95 backdrop-blur-md focus:bg-white text-charcoal placeholder-neutral-400 transition-all duration-300"
              />
            </div>

            {showDropdown && filteredLocalities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-dropdown z-50 max-h-80 overflow-y-auto border border-neutral-100 animate-slide-up overflow-hidden">
                {filteredLocalities.map(loc => (
                  <Link
                    href={`/locality/${loc.id}`}
                    key={loc.id}
                    className="flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors border-b border-neutral-50 last:border-b-0 group"
                  >
                    <div>
                      <div className="font-bold text-charcoal group-hover:text-primary-600 transition-colors text-lg">{loc.name}</div>
                      <div className="text-sm text-neutral-500 font-medium">{loc.area}</div>
                    </div>
                    <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-xl text-sm font-bold group-hover:bg-primary-100 transition-colors">
                      {loc.totalScore}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-8 font-ui">
            <Link href="/compare">
              <Button
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md px-10 py-5 text-xl font-bold rounded-2xl transition-all hover:scale-105 active:scale-95"
              >
                <MapPin className="w-6 h-6 mr-3" />
                Compare Localities
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
