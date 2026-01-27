'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        // Check for user session
        const session = localStorage.getItem('localityiq_session')
        if (session) {
            try {
                const sessionData = JSON.parse(session)
                setUser(sessionData)
            } catch (e) {
                console.error('Invalid session data')
            }
        }

        // Listen for storage changes (for login/logout across tabs)
        const handleStorageChange = () => {
            const session = localStorage.getItem('localityiq_session')
            if (session) {
                setUser(JSON.parse(session))
            } else {
                setUser(null)
            }
        }

        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    return (
        <header className="header">
            <div className="header-content">
                <Link href="/" className="logo">
                    <div className="logo-icon">🏠</div>
                    <span>LocalityIQ</span>
                </Link>
                <nav>
                    <ul className="nav-links">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/search">🔍 Search</Link></li>
                        <li><Link href="/compare">Compare</Link></li>
                        {user ? (
                            <li>
                                <Link href="/profile" className="user-link">
                                    <span className="user-avatar">{user.name?.charAt(0).toUpperCase()}</span>
                                    <span>{user.name}</span>
                                </Link>
                            </li>
                        ) : (
                            <li><Link href="/login">Login</Link></li>
                        )}
                    </ul>
                </nav>
            </div>

            <style jsx>{`
        .user-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          background: rgba(99, 102, 241, 0.1);
          border-radius: 24px;
          transition: all 0.2s ease;
        }

        .user-link:hover {
          background: rgba(99, 102, 241, 0.2);
        }

        .user-avatar {
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
        }
      `}</style>
        </header>
    )
}
