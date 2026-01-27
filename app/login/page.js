'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const router = useRouter()
    const [isLogin, setIsLogin] = useState(true)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Simple validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields')
            setLoading(false)
            return
        }

        if (!isLogin && !formData.name) {
            setError('Please enter your name')
            setLoading(false)
            return
        }

        // Simulate API call
        setTimeout(() => {
            if (isLogin) {
                // Check if user exists in localStorage
                const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')
                const user = users.find(u => u.email === formData.email && u.password === formData.password)

                if (user) {
                    // Save session
                    localStorage.setItem('localityiq_session', JSON.stringify({
                        email: user.email,
                        name: user.name,
                        loggedInAt: new Date().toISOString()
                    }))
                    router.push('/profile')
                } else {
                    setError('Invalid email or password')
                }
            } else {
                // Sign up - create new user
                const users = JSON.parse(localStorage.getItem('localityiq_users') || '[]')

                if (users.find(u => u.email === formData.email)) {
                    setError('Email already registered')
                } else {
                    users.push({
                        email: formData.email,
                        password: formData.password,
                        name: formData.name,
                        createdAt: new Date().toISOString(),
                        savedReports: []
                    })
                    localStorage.setItem('localityiq_users', JSON.stringify(users))

                    // Auto login
                    localStorage.setItem('localityiq_session', JSON.stringify({
                        email: formData.email,
                        name: formData.name,
                        loggedInAt: new Date().toISOString()
                    }))
                    router.push('/profile')
                }
            }
            setLoading(false)
        }, 1000)
    }

    return (
        <div className="auth-page">
            <div className="auth-container glass-card">
                <div className="auth-header">
                    <div className="logo-icon" style={{ margin: '0 auto 16px', width: '60px', height: '60px', fontSize: '1.8rem' }}>🏠</div>
                    <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
                    <p className="text-muted">
                        {isLogin
                            ? 'Sign in to access your saved reports'
                            : 'Join LocalityIQ for personalized insights'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="form-input"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="form-input"
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            ⚠️ {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
                        {loading ? '⏳ Please wait...' : (isLogin ? '🔓 Sign In' : '🚀 Create Account')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => {
                                setIsLogin(!isLogin)
                                setError('')
                            }}
                            className="auth-toggle"
                        >
                            {isLogin ? 'Sign Up' : 'Sign In'}
                        </button>
                    </p>
                </div>
            </div>

            <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .auth-container {
          width: 100%;
          max-width: 420px;
          padding: 40px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .auth-header h1 {
          font-size: 1.75rem;
          margin-bottom: 8px;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .form-input {
          width: 100%;
          padding: 14px 16px;
          font-size: 1rem;
          color: var(--text-primary);
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          outline: none;
          transition: all 0.2s ease;
        }

        .form-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .form-input::placeholder {
          color: var(--text-muted);
        }

        .error-message {
          padding: 12px 16px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          color: var(--danger);
          font-size: 0.9rem;
        }

        .auth-btn {
          width: 100%;
          padding: 16px;
          font-size: 1rem;
          margin-top: 8px;
        }

        .auth-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-footer {
          text-align: center;
          margin-top: 24px;
          color: var(--text-muted);
        }

        .auth-toggle {
          background: none;
          border: none;
          color: var(--accent-primary);
          font-weight: 600;
          cursor: pointer;
          font-size: inherit;
        }

        .auth-toggle:hover {
          text-decoration: underline;
        }
      `}</style>
        </div>
    )
}
