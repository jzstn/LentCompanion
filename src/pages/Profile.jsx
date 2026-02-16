import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { db } from '../lib/db'

const TOTAL_DAYS = 50

const Profile = () => {
    const [completions, setCompletions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProgress() {
            try {
                const data = await db.getProgress()
                if (data && data.completed_days) {
                    setCompletions(data.completed_days)
                }
            } catch (err) {
                console.error("Failed to fetch progress:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchProgress()
    }, [])

    const isUnlocked = (day) => {
        if (day === 1) return true
        return completions.includes(day - 1)
    }

    const handleDayClick = async (day) => {
        if (!isUnlocked(day)) {
            alert("Complete previous day to unlock!")
            return
        }

        if (!completions.includes(day)) {
            const newCompletions = [...completions, day]
            setCompletions(newCompletions)
            try {
                await db.updateProgress(newCompletions)
            } catch (err) {
                console.error("Failed to update progress:", err)
            }
        }
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) console.error("Error signing out:", error)
    }

    if (loading) return (
        <div className="main">
            <header className="topbar">
                <div>
                    <div className="title">Progression</div>
                    <div className="subtitle">Loading your journey...</div>
                </div>
            </header>
        </div>
    )

    return (
        <div className="main">
            <header className="topbar">
                <div>
                    <div className="title">Progression</div>
                    <div className="subtitle">Your journey through the 50-day companion.</div>
                </div>
            </header>

            <div className="card">
                <div className="cardHead">
                    <div className="cardHeadLeft">
                        <div className="iconBox">🗺️</div>
                        <div className="cardTitle">Journey Roadmap</div>
                    </div>
                </div>
                <div className="cardBody">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                        gap: '12px',
                        marginTop: '10px'
                    }}>
                        {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map(day => (
                            <button
                                key={day}
                                onClick={() => handleDayClick(day)}
                                style={{
                                    aspectRatio: '1',
                                    borderRadius: '16px',
                                    border: '1px solid var(--border)',
                                    background: completions.includes(day) ? 'var(--primary)' : isUnlocked(day) ? '#fff' : '#f4f4f5',
                                    color: completions.includes(day) ? '#fff' : isUnlocked(day) ? 'var(--text)' : 'var(--muted)',
                                    fontWeight: 800,
                                    fontSize: '14px',
                                    cursor: isUnlocked(day) ? 'pointer' : 'not-allowed',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {day}
                                {!isUnlocked(day) && (
                                    <span style={{ position: 'absolute', bottom: '4px', right: '4px', fontSize: '10px' }}>🔒</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="cardHead">
                    <div className="cardHeadLeft">
                        <div className="iconBox">⚙️</div>
                        <div className="cardTitle">Settings & Privacy</div>
                    </div>
                </div>
                <div className="cardBody">
                    <p style={{ marginTop: '4px' }}>All data is stored securely in Supabase with RLS protection.</p>
                    <button className="btn secondary" style={{ marginTop: '16px' }} onClick={handleSignOut}>Sign Out</button>
                </div>
            </div>
        </div>
    )
}

export default Profile
