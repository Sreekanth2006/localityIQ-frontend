'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

export default function LocalityGrid({ allLocalities, favorites, loading, toggleFavorite }) {
  const getRecommendationBadge = (rec) => {
    const badges = {
      buy: { variant: 'success', text: 'Strong Buy' },
      hold: { variant: 'warning', text: 'Hold' },
      avoid: { variant: 'danger', text: 'Avoid' }
    }
    return badges[rec] || badges.hold
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-1 bg-gradient-primary rounded-full animate-pulse"></div>
        <p className="mt-4 text-primary-500">Loading localities...</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {allLocalities.map((locality, index) => {
        const badge = getRecommendationBadge(locality.recommendation)
        const isFavorite = favorites.includes(locality.id)

        return (
          <Link
            href={`/locality/${locality.id}`}
            key={locality.id}
            className="group"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Card variant="glass" hover className="h-full animate-fade-in border border-neutral-200/60 hover:border-primary-300 shadow-sm hover:shadow-xl transition-all duration-500 rounded-2xl overflow-hidden p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-bold font-display text-black group-hover:text-primary-600 transition-colors tracking-tight">
                    {locality.name}
                  </h3>
                  <p className="text-sm font-medium font-ui text-neutral-500 mt-0.5">{locality.area}</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleFavorite(locality.id)
                    }}
                    className="p-2.5 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-100"
                    title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${isFavorite
                        ? 'fill-danger text-danger'
                        : 'text-neutral-300 hover:text-danger'
                        }`}
                    />
                  </button>
                  <div className="bg-primary-600 text-white w-11 h-11 flex items-center justify-center rounded-xl text-sm font-black shadow-lg shadow-primary-500/20 font-ui">
                    {locality.totalScore}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <Badge variant={badge.variant} size="sm">
                  {badge.text}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {locality.highlights.slice(0, 3).map((highlight, i) => (
                  <Badge key={i} variant="outline" size="sm">
                    {highlight}
                  </Badge>
                ))}
              </div>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
