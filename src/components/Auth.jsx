import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [mode, setMode] = useState('login') // 'login' or 'signup'
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')
        setError('')

        if (mode === 'login') {
            const { error } = await supabase.auth.signInWithPassword({ email, password })
            if (error) {
                if (error.message === 'Invalid login credentials') {
                    setError('Incorrect email or password. If you don\'t have an account, tap "Sign Up" below.')
                } else {
                    setError(error.message)
                }
            }
        } else {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: window.location.origin
                }
            })
            if (error) {
                setError(error.message)
            } else {
                setMessage('Success! Check your email for a confirmation link.')
            }
        }
        setLoading(false)
    }

    return (
        <div style={{ padding: '40px', maxWidth: '440px', margin: '80px auto' }} className="card">
            <div className="cardHead">
                <div>
                    <div className="cardTitle" style={{ fontSize: '20px' }}>
                        {mode === 'login' ? 'Welcome Back' : 'Begin Your Journey'}
                    </div>
                    <div className="smallMuted" style={{ marginTop: '4px' }}>
                        {mode === 'login' ? 'Enter your details to continue.' : 'Create an account to track your Lent journey.'}
                    </div>
                </div>
            </div>

            <form onSubmit={handleAuth} className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, marginLeft: '4px' }}>Email Address</label>
                    <input
                        className="chip"
                        style={{ background: '#fff', borderRadius: '16px', padding: '14px', width: '100%', cursor: 'text' }}
                        type="email"
                        placeholder="e.g. name@example.com"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, marginLeft: '4px' }}>Password</label>
                    <input
                        className="chip"
                        style={{ background: '#fff', borderRadius: '16px', padding: '14px', width: '100%', cursor: 'text' }}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', borderRadius: '14px', fontSize: '13px' }}>
                        ⚠️ {error}
                    </div>
                )}

                {message && (
                    <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #dcfce7', color: '#15803d', borderRadius: '14px', fontSize: '13px' }}>
                        ✅ {message}
                    </div>
                )}

                <button className="btn" style={{ height: '50px', justifyContent: 'center', fontSize: '15px' }} disabled={loading}>
                    {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In →' : 'Create Account →')}
                </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                <p className="smallMuted" style={{ fontSize: '14px' }}>
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                    <button
                        style={{ background: 'none', border: 'none', color: 'var(--text)', fontWeight: 800, cursor: 'pointer', marginLeft: '6px', textDecoration: 'underline' }}
                        onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login')
                            setError('')
                            setMessage('')
                        }}
                    >
                        {mode === 'login' ? 'Sign Up' : 'Log In'}
                    </button>
                </p>
            </div>
        </div>
    )
}
