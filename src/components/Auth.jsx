import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) alert(error.message)
        setLoading(false)
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: window.location.origin
            }
        })
        if (error) alert(error.message)
        else alert('Check your email for the confirmation link!')
        setLoading(false)
    }

    return (
        <div style={{ padding: '40px', maxWidth: '400px', margin: '100px auto' }} className="card">
            <div className="cardHead">
                <div className="cardTitle">Sign in to your Journey</div>
            </div>
            <form className="modalBody" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                    className="chip"
                    style={{ background: '#fff', borderRadius: '12px', padding: '12px', width: '100%', cursor: 'text' }}
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className="chip"
                    style={{ background: '#fff', borderRadius: '12px', padding: '12px', width: '100%', cursor: 'text' }}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn" style={{ flex: 1, justifyContent: 'center' }} onClick={handleLogin} disabled={loading}>
                        {loading ? '...' : 'Sign In'}
                    </button>
                    <button className="btn secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={handleSignUp} disabled={loading}>
                        Sign Up
                    </button>
                </div>
            </form>
            <div className="modalFoot">
                <div className="smallMuted">Auth is powered by Supabase GoTrue.</div>
            </div>
        </div>
    )
}
