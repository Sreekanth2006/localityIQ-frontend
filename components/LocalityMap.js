'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'

export default function LocalityMap({ coordinates, name }) {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return

        // Initialize map
        const map = L.map(mapRef.current, {
            center: coordinates,
            zoom: 14,
            zoomControl: true,
            attributionControl: true
        })

        // Add light theme tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map)

        // Custom marker icon
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #0e82adb0 0%, #0e82ad 100%);
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(14, 130, 173, 0.4);
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
        </div>
      `,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        })

        // Add marker
        L.marker(coordinates, { icon: customIcon })
            .addTo(map)
            .bindPopup(`
        <div style="
          padding: 8px;
          font-family: Inter, sans-serif;
          text-align: center;
        ">
          <strong style="font-size: 14px;">${name}</strong><br/>
          <span style="font-size: 12px; color: #666;">Hyderabad</span>
        </div>
      `)
            .openPopup()

        mapInstanceRef.current = map

        // Cleanup
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [coordinates, name])

    return (
        <div
            ref={mapRef}
            className="map-container"
            style={{ height: '400px', width: '100%' }}
        />
    )
}
