import React, { useState } from 'react'
import PrayerGuideModal from './PrayerGuideModal'
import {
    getTodayReading,
    getTodayFather,
    getLiturgicalSeason,
    getCurrentAffairsPrayer,
    ICON_IMAGES
} from '../lib/liturgical'

const LiturgicalCard = ({ reflection }) => {
    const [showGuide, setShowGuide] = useState(false)

    const reading = reflection ? {
        title: reflection.theme || "Daily Reflection",
        motivation: reflection.bible_story || "Reflection on today's readings.",
        theme: reflection.theme || "Default",
        verseText: reflection.primary_gospel || "Reading today",
        verseRef: reflection.all_readings || ""
    } : getTodayReading()

    const father = reflection && reflection.father_quote ? {
        name: reflection.father_name || "Desert Father",
        quote: reflection.father_quote
    } : getTodayFather(reading.theme)

    const season = reflection?.liturgical_phase || getLiturgicalSeason()
    const worldPrayers = getCurrentAffairsPrayer()

    // Use reflection image_url if provided, otherwise fallback to theme-based icon
    const iconUrl = reflection?.image_url || ICON_IMAGES[reading.theme] || ICON_IMAGES.Default

    return (
        <div className="card">
            <div className="cardHead">
                <div className="cardHeadLeft">
                    <div className="iconBox">🕊️</div>
                    <div className="cardTitle">Today in the Church</div>
                </div>
                <span className="pill">{season}</span>
            </div>

            <div className="cardBody" style={{ color: 'var(--text)' }}>
                <div className="iconFrame">
                    <div className="iconFrameInner">
                        <img src={iconUrl} className="iconImagePremium" alt="Orthodox icon" />
                        <div className="iconFrameHighlight"></div>
                    </div>
                </div>

                <div style={{ marginTop: '4px', fontWeight: 900, fontSize: '14px' }}>
                    {reading.title}
                </div>

                <div style={{ marginTop: '8px', color: 'var(--muted)', lineHeight: '1.6' }}>
                    {reading.motivation}
                </div>

                <div style={{ marginTop: '14px', border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '12px' }}>
                    <div style={{ fontWeight: 900 }}>Scripture</div>
                    <div style={{ marginTop: '6px', fontStyle: 'italic' }}>
                        “{reading.verseText}”
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '6px' }}>
                        {reading.verseRef}
                    </div>
                    {reflection?.bible_story && (
                        <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text)', borderTop: '1px solid var(--border)', paddingTop: '10px', lineHeight: '1.6' }}>
                            <div className="smallMuted" style={{ fontWeight: 800, marginBottom: '4px' }}>Story & Reflection</div>
                            {reflection.bible_story}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '14px', border: '1px solid var(--border)', borderRadius: '18px', padding: '12px' }}>
                    <div style={{ fontWeight: 900 }}>Desert & Early Church Fathers</div>
                    <div style={{ marginTop: '6px', fontStyle: 'italic', lineHeight: '1.6' }}>
                        “{father.quote}”
                    </div>
                    <div style={{ marginTop: '6px', color: 'var(--muted)', fontSize: '12px' }}>
                        — {father.name}
                    </div>
                    {reflection?.desert_father_story && (
                        <div style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text)', borderTop: '1px solid var(--border)', paddingTop: '10px', lineHeight: '1.6' }}>
                            <div className="smallMuted" style={{ fontWeight: 800, marginBottom: '4px' }}>Father's Wisdom Story</div>
                            {reflection.desert_father_story}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '14px', border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '12px' }}>
                    <div style={{ fontWeight: 900 }}>Pray for the World</div>
                    <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {worldPrayers.map((p, i) => (
                            <div key={i} style={{ fontSize: '13px' }}>• {p}</div>
                        ))}
                    </div>
                </div>

                {reflection?.prayer_insight && (
                    <div style={{ marginTop: '14px', border: '1px solid var(--border)', background: '#fafafa', borderRadius: '18px', padding: '12px' }}>
                        <div style={{ fontWeight: 900 }}>Prayer Insight</div>
                        <div style={{ marginTop: '6px', fontSize: '13px', color: 'var(--muted)', lineHeight: '1.6' }}>
                            {reflection.prayer_insight}
                        </div>
                    </div>
                )}

                <button
                    className="btn"
                    style={{ marginTop: '16px', width: '100%', justifyContent: 'center' }}
                    onClick={() => setShowGuide(true)}
                >
                    Pray with this →
                </button>
            </div>

            {showGuide && (
                <PrayerGuideModal
                    reading={{ ...reading, father, worldPrayers }}
                    onClose={() => setShowGuide(false)}
                />
            )}
        </div>
    )
}

export default LiturgicalCard
