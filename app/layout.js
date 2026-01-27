import './globals.css'
import Header from '@/components/Header'

export const metadata = {
    title: 'LocalityIQ - Neighbourhood Intelligence for Smart Home Buyers',
    description: 'Get comprehensive neighbourhood health scores before buying your dream home. Compare localities, check air quality, water, power, schools, safety and growth potential.',
    keywords: 'real estate, neighbourhood score, locality rating, Hyderabad property, home buying guide',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <link
                    rel="stylesheet"
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                    crossOrigin=""
                />
            </head>
            <body>
                <Header />
                <main>{children}</main>
            </body>
        </html>
    )
}
