import React from 'react'

const PrayerGuideModal = ({ reading, onClose }) => {
    return (
        <div className="overlay">
            <div className="modal">
                <div className="modalHead">
                    <div>
                        <div className="modalTitle">Guided Prayer</div>
                        <div className="modalSub">Take a few quiet minutes.</div>
                    </div>
                    <button className="btn secondary" onClick={onClose}>Close</button>
                </div>

                <div className="modalBody" style={{ lineHeight: '1.8', fontSize: '15px' }}>
                    <p style={{ fontWeight: 600, color: 'var(--muted)', marginBottom: '16px' }}>Lord Jesus Christ, Son of God, have mercy on me.</p>

                    <div style={{ background: '#fafafa', padding: '20px', borderRadius: '18px', border: '1px solid var(--border)', marginBottom: '24px' }}>
                        <p style={{ fontStyle: 'italic', marginBottom: '8px' }}>“{reading.verseText}”</p>
                        <p style={{ fontSize: '13px', color: 'var(--muted)' }}>— {reading.verseRef}</p>
                    </div>

                    <p style={{ marginBottom: '24px' }}>
                        Teach me to live this today. As your servant <strong>{reading.father.name}</strong> reminds us:
                        <br />
                        <span style={{ fontStyle: 'italic', color: 'var(--muted)' }}>“{reading.father.quote}”</span>
                    </p>

                    <div style={{ marginBottom: '24px' }}>
                        <p style={{ fontWeight: 800, marginBottom: '12px' }}>I pray especially:</p>
                        <ul style={{ paddingLeft: '20px' }}>
                            {reading.worldPrayers.map((p, i) => (
                                <li key={i} style={{ marginBottom: '8px', color: 'var(--muted)' }}>{p}</li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                        <p style={{ fontWeight: 600 }}>Grant me repentance, humility, and courage.</p>
                        <p style={{ fontWeight: 800, marginTop: '8px' }}>Amen.</p>
                    </div>
                </div>

                <div className="modalFoot">
                    <div className="smallMuted">Focus on the words.</div>
                    <button className="btn" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    )
}

export default PrayerGuideModal
