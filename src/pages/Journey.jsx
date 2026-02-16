import React, { useState, useEffect } from 'react'
import { db } from '../lib/db'

const Journey = () => {
    const [activeSection, setActiveSection] = useState('timeline')
    const [selectedLog, setSelectedLog] = useState(null)
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchLogs() {
            try {
                const data = await db.getAllLogs()
                setLogs(data)
            } catch (err) {
                console.error("Failed to fetch logs:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchLogs()
    }, [])

    // Group events by dayKey
    const groupedEvents = logs.reduce((acc, event) => {
        if (!acc[event.day_key]) acc[event.day_key] = []
        acc[event.day_key].push(event)
        return acc
    }, {})

    const sortedDays = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a))

    if (loading) {
        return (
            <div className="main">
                <header className="topbar">
                    <div>
                        <div className="title">Journey Map</div>
                        <div className="subtitle">Loading your spiritual logs...</div>
                    </div>
                </header>
            </div>
        )
    }

    const renderTimeline = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Summary Cards */}
            <div className="cards3">
                <div className="card">
                    <div className="cardHead">
                        <div className="cardHeadLeft">
                            <div className="iconBox">✅</div>
                            <div className="cardTitle">Quick View</div>
                        </div>
                    </div>
                    <div className="cardBody">
                        <p style={{ color: 'var(--muted)', lineHeight: '1.4' }}>Tap any item below to view your full reflection and check-in details.</p>
                    </div>
                </div>

                <div className="card">
                    <div className="cardHead">
                        <div className="cardHeadLeft">
                            <div className="iconBox">🏖️</div>
                            <div className="cardTitle">History</div>
                        </div>
                    </div>
                    <div className="cardBody">
                        <p style={{ color: 'var(--muted)', lineHeight: '1.4' }}>Your spiritual journey, preserved. Tapping a day shows activity summaries.</p>
                    </div>
                </div>

                <div className="card">
                    <div className="cardHead">
                        <div className="cardHeadLeft">
                            <div className="iconBox">✨</div>
                            <div className="cardTitle">Patterns</div>
                        </div>
                    </div>
                    <div className="cardBody">
                        <p style={{ color: 'var(--muted)', lineHeight: '1.4' }}>Insights stay gentle, helping you see the fruit of your labor.</p>
                    </div>
                </div>
            </div>

            {/* Daily Logs */}
            {sortedDays.length === 0 ? (
                <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                    <div className="cardTitle">No logs yet</div>
                    <p className="smallMuted">Start logging on the Today page to build your map.</p>
                </div>
            ) : sortedDays.map(dayKey => {
                const events = groupedEvents[dayKey]
                const counts = events.reduce((c, e) => {
                    c[e.type] = (c[e.type] || 0) + 1
                    return c
                }, {})

                return (
                    <div key={dayKey} className="listCard">
                        <div className="dayHead">
                            <div>
                                <div className="dayTitle">{new Date(dayKey).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                                    <span className="pill">🕯️ {counts.PRAYER || 0}</span>
                                    <span className="pill">🍞 {counts.FAST || 0}</span>
                                    <span className="pill">✍️ {counts.JOURNAL || 0}</span>
                                </div>
                            </div>
                            <div className="smallMuted">Tap an item below</div>
                        </div>
                        <div className="items">
                            {events.map(e => (
                                <button key={e.id} className="itemBtn" onClick={() => setSelectedLog(e)}>
                                    <div className="itemRow">
                                        <div className="itemLeft">
                                            <div className="iconBox">
                                                {e.type === 'PRAYER' ? '🕯️' : e.type === 'FAST' ? '🔥' : '✍️'}
                                            </div>
                                            <div className="itemMain">
                                                <div className="itemTop">
                                                    {e.type === 'PRAYER' ? 'Prayer' : e.type === 'FAST' ? 'Fasting' : 'Journal'}
                                                    <span>{new Date(e.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                                                </div>
                                                <div className="chipRow" style={{ marginTop: 0 }}>
                                                    {e.payload?.adherence && <span className="pill">{e.payload.adherence}</span>}
                                                    {e.payload?.prayer_type && <span className="pill">{e.payload.prayer_type}</span>}
                                                    {e.payload?.tags?.[0] && <span className="pill">{e.payload.tags[0]}</span>}
                                                    {e.payload?.journal_text && <span className="pill">Reflection...</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chev">›</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )
            })}

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="overlay">
                    <div className="modal" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="modalHead">
                            <div>
                                <div className="modalTitle">
                                    {selectedLog.type === 'PRAYER' ? 'Prayer Record' : selectedLog.type === 'FAST' ? 'Fasting Record' : 'Journal Record'}
                                </div>
                                <div className="modalSub">
                                    {new Date(selectedLog.ts).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </div>
                            </div>
                            <button className="btn secondary" onClick={() => setSelectedLog(null)}>Close</button>
                        </div>
                        <div className="modalBody" style={{ overflowY: 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* Fasting Details */}
                                {selectedLog.type === 'FAST' && (
                                    <>
                                        <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '16px' }}>
                                            <h4 style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Adherence</h4>
                                            <p style={{ fontWeight: 800 }}>{selectedLog.payload?.adherence || 'No selection'}</p>
                                        </div>
                                        {selectedLog.payload?.reason && (
                                            <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '16px' }}>
                                                <h4 style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Main Reason</h4>
                                                <p>{selectedLog.payload.reason}</p>
                                            </div>
                                        )}
                                        {selectedLog.payload?.next_step && (
                                            <div style={{ background: '#fff9f2', borderRadius: '18px', padding: '16px', border: '1px solid #e5c9a4' }}>
                                                <h4 style={{ fontSize: '13px', color: '#c4a484', marginBottom: '8px' }}>Next Step</h4>
                                                <p style={{ fontWeight: 600 }}>{selectedLog.payload.next_step}</p>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Prayer Details */}
                                {selectedLog.type === 'PRAYER' && (
                                    <>
                                        <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '16px' }}>
                                            <h4 style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Prayer Type</h4>
                                            <p style={{ fontWeight: 800 }}>{selectedLog.payload?.prayer_type || 'No selection'}</p>
                                        </div>
                                        {selectedLog.payload?.attention && (
                                            <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '16px' }}>
                                                <h4 style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Attention</h4>
                                                <p>{selectedLog.payload.attention}</p>
                                            </div>
                                        )}
                                        {selectedLog.payload?.fruit?.length > 0 && (
                                            <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '16px' }}>
                                                <h4 style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Fruit noticed</h4>
                                                <div className="chipRow">
                                                    {selectedLog.payload.fruit.map(f => <span key={f} className="pill selected">{f}</span>)}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Journal Details */}
                                {selectedLog.type === 'JOURNAL' && (
                                    <>
                                        {selectedLog.payload?.journal_text && (
                                            <div style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '18px', padding: '16px' }}>
                                                <h4 style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Reflection</h4>
                                                <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{selectedLog.payload.journal_text}</p>
                                            </div>
                                        )}
                                        {selectedLog.payload?.tags?.length > 0 && (
                                            <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '16px' }}>
                                                <h4 style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>Self-awareness</h4>
                                                <div className="chipRow">
                                                    {selectedLog.payload.tags.map(t => <span key={t} className="pill selected">{t}</span>)}
                                                </div>
                                            </div>
                                        )}
                                        {!!selectedLog.payload?.rating_value && (
                                            <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '16px' }}>
                                                <h4 style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '8px' }}>{selectedLog.payload.rating_type} Rating</h4>
                                                <p style={{ fontWeight: 800, fontSize: '20px' }}>{selectedLog.payload.rating_value} / 5</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    const renderInsights = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="cards3">
                <div className="card">
                    <div className="cardHead">
                        <div className="cardHeadLeft">
                            <div className="iconBox">🤝</div>
                            <div className="cardTitle">What I'm noticing</div>
                        </div>
                    </div>
                    <div className="cardBody">
                        <div className="chipRow">
                            <span className="pill">Peace</span>
                            <span className="pill">Gratitude</span>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="cardHead">
                        <div className="cardHeadLeft">
                            <div className="iconBox">🔥</div>
                            <div className="cardTitle">Common obstacles</div>
                        </div>
                    </div>
                    <div className="cardBody">
                        <div className="chipRow">
                            <span className="pill">Hunger</span>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="cardHead">
                        <div className="cardHeadLeft">
                            <div className="iconBox">🕯️</div>
                            <div className="cardTitle">Prayer fruit</div>
                        </div>
                    </div>
                    <div className="cardBody">
                        <div className="chipRow">
                            <span className="pill">Hope</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="listCard">
                <div className="dayHead">
                    <div>
                        <div className="dayTitle">Compassionate Mirror</div>
                        <div className="smallMuted">Supportive reflections based on your selections.</div>
                    </div>
                    <span className="pill">SLM</span>
                </div>
                <div className="divider"></div>
                <div className="modalBody" style={{ padding: '14px' }}>
                    <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '12px', marginBottom: '10px', fontSize: '13px' }}>
                        You keep returning quickly after difficult moments.
                    </div>
                    <div style={{ border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '12px', marginBottom: '10px', fontSize: '13px' }}>
                        Stress days often align with fasting challenges — simplifying helps.
                    </div>
                    <div style={{ border: '1px solid var(--border)', background: '#fff', borderRadius: '18px', padding: '12px' }}>
                        <div className="smallMuted" style={{ fontWeight: 800 }}>Next step</div>
                        <div style={{ marginTop: '6px', fontWeight: 900 }}>Tomorrow: plan one simple meal + 2 minutes of Jesus Prayer.</div>
                    </div>
                </div>
            </div>
        </div>
    )

    return (
        <div className="main">
            <header className="topbar">
                <div>
                    <div className="title">Journey Map</div>
                    <div className="subtitle">Your timeline, your reflections, and gentle insights.</div>
                </div>
                <div className="seg">
                    {['timeline', 'insights'].map(s => (
                        <button
                            key={s}
                            onClick={() => setActiveSection(s)}
                            className={activeSection === s ? 'active' : ''}
                        >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>
            </header>

            {activeSection === 'timeline' ? renderTimeline() : renderInsights()}
        </div>
    )
}

export default Journey
