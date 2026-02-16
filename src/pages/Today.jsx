import React, { useState, useEffect } from 'react'
import LiturgicalCard from '../components/LiturgicalCard'
import ActionCard from '../components/ActionCard'
import LogModal from '../components/LogModal'
import { db } from '../lib/db'

const getTodayStr = () => {
    // Returns YYYY-MM-DD
    return new Date().toLocaleDateString('en-CA')
}

const Today = () => {
    const [activeModal, setActiveModal] = useState(null)
    const [reflection, setReflection] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showEveningPrayer, setShowEveningPrayer] = useState(false)

    useEffect(() => {
        async function fetchDailyContent() {
            try {
                const todayStr = getTodayStr()
                const data = await db.getReflection(todayStr)
                if (data) setReflection(data)
            } catch (err) {
                console.error("Failed to fetch reflection:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchDailyContent()
    }, [])

    const handleSeed = async () => {
        try {
            const todayStr = getTodayStr()
            const sampleData = {
                date: todayStr,
                liturgical_phase: "Pre-Lent Preparation",
                primary_gospel: "St. Luke 18:9-14",
                all_readings: "St. Luke 18:9-14",
                theme: "Humility and mercy",
                bible_story: "**Theme:** Humility and mercy. The lectionary places St. Luke 18:9-14 before us so Lent becomes more than self-improvement—it becomes communion and healing.",
                daily_prayer: "O Lord and Master of my life, grant me a spirit of repentance, humility, and love. Help me to see my own sins and not judge my brother.",
                father_name: "St. Ephrem the Syrian",
                father_quote: "Prayer is the lifting of the mind and heart to God; it is the breath of the soul.",
                desert_father_story: "A brother asked an elder, “What is repentance?” The elder replied, “It is to stop accusing others and begin accusing yourself—with hope in God’s mercy.”",
                prayer_insight: "Prayer works like dawn: you rarely notice the exact moment it arrives, but you know when the light has changed everything.",
                evening_common_prayer: "Monday Evening Prayer\nDaily Evening Prayers for the Great Fast\nMalankara Orthodox Syrian Church\n\n† In the name of the Father, / and of the Son, / and of the Holy Spirit, / one true God. Amin.",
                image_url: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1024&auto=format&fit=crop"
            }
            await db.saveReflection(sampleData)
            setReflection(sampleData)
            alert("Database seeded for today! Check out the new fields.")
        } catch (err) {
            console.error("Seed failed:", err)
            alert(`Seed failed: ${err.message || 'Unknown error'}. \n\nCheck if you ran the schema update in Supabase to add the new columns!`)
        }
    }

    const handleLog = (type) => {
        setActiveModal(type)
    }

    const handleSave = async (selections) => {
        try {
            const todayStr = getTodayStr()

            // Format payload based on type
            let payload = {}
            if (activeModal === 'FAST') {
                payload = {
                    adherence: selections.adherence,
                    reason: selections.reason,
                    next_step: selections.nextStep
                }
            } else if (activeModal === 'PRAYER') {
                payload = {
                    prayer_type: selections.prayerType,
                    attention: selections.attention,
                    fruit: selections.fruit
                }
            } else if (activeModal === 'JOURNAL') {
                payload = {
                    tags: selections.tags,
                    journal_text: selections.journalText,
                    rating_type: selections.ratingType,
                    rating_value: selections.ratingValue
                }
            }

            await db.saveLog({
                type: activeModal,
                day_key: todayStr,
                payload: payload
            })

            setActiveModal(null)
        } catch (err) {
            console.error("Failed to save log:", err)
            alert("Error saving log. Please check your connection.")
        }
    }

    return (
        <div className="main">
            <div className="topbar">
                <div>
                    <div className="title">Today</div>
                    <div className="subtitle">Daily verse, fathers, and prayer — plus your logs.</div>
                </div>
            </div>

            <LiturgicalCard reflection={reflection} />

            <div className="cards3">
                <ActionCard
                    title="Prayer Log"
                    icon="🕯️"
                    description="Tap Log to see the confirmation recorder."
                    onSave={() => handleLog('PRAYER')}
                />
                <ActionCard
                    title="Fasting Log"
                    icon="🔥"
                    description="Quick adherence + reason (optional next step)."
                    onSave={() => handleLog('FAST')}
                />
                <ActionCard
                    title="Journal Log"
                    icon="✍️"
                    description="Pick chips + optional peace/clarity rating."
                    onSave={() => handleLog('JOURNAL')}
                />
            </div>

            {/* Daily Prayer Section - Prominent */}
            {reflection?.daily_prayer && (
                <div className="card" style={{ background: 'linear-gradient(135deg, #fff9f2 0%, #fff 100%)', border: '1px solid #e5c9a4' }}>
                    <div className="cardHead">
                        <div className="cardHeadLeft">
                            <div className="iconBox">🙏</div>
                            <div className="cardTitle">Daily Prayer</div>
                        </div>
                        <span className="pill">Today's Focus</span>
                    </div>
                    <div className="cardBody">
                        <p style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text)', lineHeight: '1.6', fontStyle: 'italic', padding: '10px 0' }}>
                            "{reflection.daily_prayer}"
                        </p>
                    </div>
                </div>
            )}


            {/* Evening Common Prayer Section */}
            {reflection?.evening_common_prayer && (
                <div className="card" style={{ marginTop: '20px' }}>
                    <div className="cardHead" style={{ cursor: 'pointer' }} onClick={() => setShowEveningPrayer(!showEveningPrayer)}>
                        <div className="cardHeadLeft">
                            <div className="iconBox">🌙</div>
                            <div className="cardTitle">Evening Common Prayer</div>
                        </div>
                        <span className="pill">{showEveningPrayer ? 'Hide' : 'Show'}</span>
                    </div>
                    {showEveningPrayer && (
                        <div className="cardBody">
                            <div style={{
                                padding: '16px',
                                background: '#1a1a1a',
                                color: '#eee',
                                borderRadius: '18px',
                                fontSize: '13px',
                                lineHeight: '1.8',
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'serif'
                            }}>
                                {reflection.evening_common_prayer}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {activeModal && (
                <LogModal
                    type={activeModal}
                    onClose={() => setActiveModal(null)}
                    onSave={handleSave}
                />
            )}
            {!reflection && !loading && (
                <div style={{ textAlign: 'center', marginTop: '40px', padding: '20px', border: '1px dashed var(--border)', borderRadius: '24px' }}>
                    <p className="smallMuted">No data found for today.</p>
                    <button className="btn" style={{ marginTop: '12px' }} onClick={handleSeed}>
                        Seed Sample Lent Data
                    </button>
                </div>
            )}
        </div>
    )
}

export default Today
