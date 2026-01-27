'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [savedReports, setSavedReports] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Check session
        const session = localStorage.getItem('localityiq_session')
        if (!session) {
            router.push('/login')
            return
        }

        const sessionData = JSON.parse(session)
        setUser(sessionData)

        // Get user's saved reports
        const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')
        const currentUser = users.find(u => u.email === sessionData.email)
        if (currentUser && currentUser.savedReports) {
            setSavedReports(currentUser.savedReports)
        }

        setLoading(false)
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('localityiq_session')
        router.push('/')
    }

    const deleteReport = (index) => {
        const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')
        const userIndex = users.findIndex(u => u.email === user.email)
        if (userIndex !== -1) {
            users[userIndex].savedReports.splice(index, 1)
            localStorage.setItem('localityiq_users', JSON.stringify(users))
            setSavedReports([...users[userIndex].savedReports])
        }
    }

    if (loading) {
        return (
            <div className="profile-page">
                <div className="text-center">Loading...</div>
            </div>
        )
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <div className="glass-card profile-header">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="profile-info">
                        <h1>{user?.name || 'User'}</h1>
                        <p className="text-muted">{user?.email}</p>
                        <p className="profile-since">
                            Member since {new Date(user?.loggedInAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        🚪 Logout
                    </button>
                </div>

                {/* Stats */}
                <div className="profile-stats">
                    <div className="glass-card stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-value">{savedReports.length}</div>
                        <div className="stat-label">Saved Reports</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-icon">📍</div>
                        <div className="stat-value">15</div>
                        <div className="stat-label">Localities Available</div>
                    </div>
                    <div className="glass-card stat-card">
                        <div className="stat-icon">⚖️</div>
                        <div className="stat-value">∞</div>
                        <div className="stat-label">Comparisons</div>
                    </div>
                </div>

                {/* Saved Reports */}
                <div className="saved-reports-section">
                    <h2>📁 Saved Reports</h2>

                    {savedReports.length === 0 ? (
                        <div className="glass-card empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No saved reports yet</h3>
                            <p className="text-muted">
                                Browse localities and save reports to view them here.
                            </p>
                            <Link href="/" className="btn btn-primary" style={{ marginTop: '16px' }}>
                                Explore Localities →
                            </Link>
                        </div>
                    ) : (
                        <div className="reports-grid">
                            {savedReports.map((report, index) => (
                                <div key={index} className="glass-card report-card">
                                    <div className="report-header">
                                        <h3>{report.localityName}</h3>
                                        <span className="report-score">{report.score}/100</span>
                                    </div>
                                    <p className="text-muted">{report.area}</p>
                                    <p className="report-date">
                                        Saved on {new Date(report.savedAt).toLocaleDateString()}
                                    </p>
                                    <div className="report-actions">
                                        <Link href={`/locality/${report.localityId}`} className="btn btn-secondary" style={{ flex: 1 }}>
                                            View
                                        </Link>
                                        <button
                                            onClick={() => deleteReport(index)}
                                            className="btn btn-danger"
                                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: 'var(--danger)' }}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2>⚡ Quick Actions</h2>
                    <div className="actions-grid">
                        <Link href="/" className="glass-card action-card">
                            <span className="action-icon">🔍</span>
                            <span>Search Localities</span>
                        </Link>
                        <Link href="/compare" className="glass-card action-card">
                            <span className="action-icon">⚖️</span>
                            <span>Compare</span>
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .profile-page {
          padding: 100px 24px 60px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 32px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          background: var(--accent-gradient);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h1 {
          font-size: 1.75rem;
          margin-bottom: 4px;
        }

        .profile-since {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .profile-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .stat-card {
          padding: 24px;
          text-align: center;
        }

        .stat-icon {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .saved-reports-section h2,
        .quick-actions h2 {
          margin-bottom: 20px;
        }

        .empty-state {
          padding: 48px;
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 16px;
        }

        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .report-card {
          padding: 20px;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .report-header h3 {
          font-size: 1.1rem;
        }

        .report-score {
          font-weight: 700;
          color: var(--accent-primary);
        }

        .report-date {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin: 8px 0 16px;
        }

        .report-actions {
          display: flex;
          gap: 8px;
        }

        .quick-actions {
          margin-top: 40px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }

        .action-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          cursor: pointer;
          font-weight: 500;
        }

        .action-icon {
          font-size: 1.5rem;
        }

        @media (max-width: 768px) {
          .profile-stats {
            grid-template-columns: 1fr;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    )
}
