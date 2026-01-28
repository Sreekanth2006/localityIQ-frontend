'use client'

import { useState, useEffect } from 'react'

import { API_BASE } from '@/lib/config'

/**
 * Hook to fetch live AQI data for a locality
 */
export function useLiveAQI(localityId) {
    const [aqi, setAqi] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!localityId) return

        const fetchAQI = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`${API_BASE}/api/localities/${localityId}/aqi`)
                if (response.ok) {
                    const data = await response.json()
                    setAqi(data)
                } else {
                    setError('Failed to fetch AQI')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAQI()
    }, [localityId])

    return { aqi, loading, error }
}

/**
 * Hook to fetch nearby places for a locality
 */
export function useNearbyPlaces(localityId, type = 'school') {
    const [places, setPlaces] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!localityId) return

        const fetchPlaces = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`${API_BASE}/api/localities/${localityId}/places?type=${type}`)
                if (response.ok) {
                    const data = await response.json()
                    setPlaces(data.places || [])
                } else {
                    setError('Failed to fetch places')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPlaces()
    }, [localityId, type])

    return { places, loading, error }
}

/**
 * Live AQI Badge Component
 */
export function LiveAQIBadge({ localityId }) {
    const { aqi, loading, error } = useLiveAQI(localityId)

    if (loading) {
        return (
            <span className="live-badge loading">
                🔄 Loading AQI...
            </span>
        )
    }

    if (error || !aqi?.aqi) {
        return null // Don't show if no data
    }

    const getAQIColor = (value) => {
        if (value <= 50) return 'good'
        if (value <= 100) return 'moderate'
        if (value <= 150) return 'unhealthy'
        return 'hazardous'
    }

    const status = getAQIColor(aqi.aqi)

    return (
        <div className={`live-aqi-badge ${status}`}>
            <span className="live-indicator">● LIVE</span>
            <span className="aqi-value">AQI: {Math.round(aqi.aqi)}</span>
            <style jsx>{`
        .live-aqi-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .live-aqi-badge.good {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }
        
        .live-aqi-badge.moderate {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }
        
        .live-aqi-badge.unhealthy {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }
        
        .live-aqi-badge.hazardous {
          background: rgba(139, 69, 139, 0.2);
          color: #8b458b;
        }
        
        .live-indicator {
          font-size: 0.7rem;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    )
}

/**
 * Nearby Places List Component
 */
export function NearbyPlacesList({ localityId, type = 'school' }) {
    const { places, loading, error } = useNearbyPlaces(localityId, type)

    const icons = {
        school: '🏫',
        hospital: '🏥',
        police: '🚔'
    }

    if (loading) {
        return <div className="text-muted">Loading {type}s...</div>
    }

    if (error) {
        return <div className="text-muted">Could not load {type}s</div>
    }

    if (places.length === 0) {
        return <div className="text-muted">No {type}s found nearby</div>
    }

    return (
        <div className="places-list">
            <div className="places-header">
                <span>{icons[type]} {places.length} {type}s found nearby</span>
                <span className="live-tag">LIVE DATA</span>
            </div>
            <ul className="places-items">
                {places.slice(0, 5).map((place, index) => (
                    <li key={index} className="place-item">
                        {place.name}
                    </li>
                ))}
                {places.length > 5 && (
                    <li className="place-item more">
                        +{places.length - 5} more
                    </li>
                )}
            </ul>

            <style jsx>{`
        .places-list {
          margin-top: 12px;
        }
        
        .places-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-weight: 500;
        }
        
        .live-tag {
          font-size: 0.7rem;
          background: rgba(99, 102, 241, 0.2);
          color: var(--accent-primary);
          padding: 2px 8px;
          border-radius: 10px;
        }
        
        .places-items {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .place-item {
          padding: 8px 12px;
          background: var(--bg-card);
          border-radius: 8px;
          margin-bottom: 4px;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }
        
        .place-item.more {
          color: var(--text-muted);
          font-style: italic;
        }
      `}</style>
        </div>
    )
}

export default { useLiveAQI, useNearbyPlaces, LiveAQIBadge, NearbyPlacesList }
