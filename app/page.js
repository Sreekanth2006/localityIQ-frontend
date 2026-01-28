'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { api } from '@/lib/api'
import { storage } from '@/lib/storage'
import Hero from '@/components/sections/Hero'
import LocalityGrid from '@/components/sections/LocalityGrid'
import Features from '@/components/sections/Features'
import CTA from '@/components/sections/CTA'

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showDropdown, setShowDropdown] = useState(false)
    const [filteredLocalities, setFilteredLocalities] = useState([])
    const [allLocalities, setAllLocalities] = useState([])
    const [favorites, setFavorites] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const initData = async () => {
            try {
                const data = await api.getLocalities()
                setAllLocalities(data)

                // Load favorites from localStorage
                const savedFavorites = storage.getFavorites()
                setFavorites(savedFavorites)
            } catch (err) {
                console.error('Failed to load localities:', err)
            } finally {
                setLoading(false)
            }
        }

        initData()
    }, [])

    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = allLocalities.filter(loc =>
                loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                loc.area.toLowerCase().includes(searchQuery.toLowerCase())
            )
            setFilteredLocalities(filtered)
            setShowDropdown(true)
        } else {
            setShowDropdown(false)
        }
    }, [searchQuery, allLocalities])

    const toggleFavorite = (localityId) => {
        const isNowFavorite = storage.toggleFavorite(localityId)
        if (isNowFavorite) {
            setFavorites(prev => [...prev, localityId])
        } else {
            setFavorites(prev => prev.filter(id => id !== localityId))
        }
    }

    return (
        <>
            <Hero
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                filteredLocalities={filteredLocalities}
            />

            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                        <div className="font-display">
                            <h2 className="text-4xl md:text-5xl font-black text-black mb-4 tracking-tight">
                                Explore <span className="text-primary-600">Localities</span>
                            </h2>
                            <p className="text-lg text-neutral-500 font-ui font-medium">Discover detailed insights about every neighbourhood</p>
                        </div>
                        <div className="text-sm font-bold text-primary-700 bg-primary-50 px-5 py-2.5 rounded-2xl font-ui flex items-center shadow-sm border border-primary-100">
                            <Heart className="w-4 h-4 mr-2 fill-current" />
                            {favorites.length} Saved {favorites.length !== 1 ? 'localities' : 'locality'}
                        </div>
                    </div>

                    <LocalityGrid
                        allLocalities={allLocalities}
                        favorites={favorites}
                        loading={loading}
                        toggleFavorite={toggleFavorite}
                    />
                </div>
            </section>

            <Features />
            <CTA />
        </>
    )
}
