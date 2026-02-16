import React, { useState, useEffect } from 'react'

const JOURNAL_CHIPS = [
    "I noticed a pattern", "I understood a trigger", "I saw my weakness clearly", "I asked forgiveness",
    "I fell, but returned", "I want to restart", "I resisted a temptation", "I chose patience",
    "I guarded my tongue", "I chose peace", "I was grateful", "I served someone quietly", "I showed mercy",
    "I need help with this", "I feel discouraged", "I feel hopeful"
]

const FAST_ADHERENCE = ["Kept the fast", "Mostly kept it", "Struggled today", "Not today — restarting"]
const FAST_REASON = ["Hunger / low energy", "Social situation", "Stress / emotions", "Forgot / unprepared", "Health reason", "Other responsibilities"]
const FAST_NEXT = ["Simplify the next meal", "Plan ahead", "Ask mercy & restart", "Add a small act of charity", "Reach out for guidance"]

const PRAYER_TYPE = ["Morning prayer", "Evening prayer", "Jesus Prayer", "Psalm", "Akathist / Canon", "Spontaneous prayer"]
const PRAYER_ATTENTION = ["Focused", "Wandering", "Dry but faithful", "Rushed", "Deeply present"]
const PRAYER_FRUIT = ["Peace", "Compunction (softened heart)", "Gratitude", "Hope", "Patience", "Love for others", "Still struggling"]

const LogModal = ({ type, onClose, onSave }) => {
    const [selections, setSelections] = useState({
        tags: [],
        journalText: '',
        ratingType: 'PEACE',
        ratingValue: 0,
        adherence: '',
        reason: '',
        nextStep: '',
        prayerType: '',
        attention: '',
        fruit: []
    })

    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        if (type === 'FAST') {
            setIsValid(!!selections.adherence) // Reason is now optional
        } else if (type === 'PRAYER') {
            setIsValid(!!selections.prayerType) // Attention is now optional
        } else {
            setIsValid(true) // Journal is optional
        }
    }, [selections, type])

    const toggleTag = (listName, item, max = 99) => {
        setSelections(prev => {
            const list = prev[listName]
            if (list.includes(item)) {
                return { ...prev, [listName]: list.filter(t => t !== item) }
            }
            if (list.length >= max) return prev
            return { ...prev, [listName]: [...list, item] }
        })
    }

    const renderJournalFields = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '8px' }}>Journal review</h4>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>How did the day go?</p>
                <textarea
                    style={{
                        width: '100%',
                        minHeight: '100px',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid var(--border)',
                        background: '#fcfcfc',
                        fontFamily: 'inherit',
                        fontSize: '14px',
                        marginBottom: '15px'
                    }}
                    placeholder="Reflect on your day here..."
                    value={selections.journalText}
                    onChange={(e) => setSelections({ ...selections, journalText: e.target.value })}
                />
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>If confused, you can choose to click on Chips:</p>
                <div className="chipRow">
                    {JOURNAL_CHIPS.map(chip => (
                        <button
                            key={chip}
                            onClick={() => toggleTag('tags', chip)}
                            className={`chip ${selections.tags.includes(chip) ? 'selected' : ''}`}
                        >
                            {chip}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ background: '#fafafa', padding: '16px', borderRadius: '18px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 800 }}>Optional rating</h4>
                        <p style={{ fontSize: '12px', color: 'var(--muted)' }}>Peace or clarity — one tap.</p>
                    </div>
                    <div className="seg">
                        {['PEACE', 'CLARITY'].map(t => (
                            <button
                                key={t}
                                onClick={() => setSelections({ ...selections, ratingType: t })}
                                className={selections.ratingType === t ? 'active' : ''}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="ratingRow">
                    {[1, 2, 3, 4, 5].map(v => (
                        <button
                            key={v}
                            onClick={() => setSelections({ ...selections, ratingValue: v })}
                            className={`ratingBtn ${selections.ratingValue === v ? 'selected' : ''}`}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    const renderFastFields = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>Fasting check-in</h4>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>Adherence (required)</p>
                <div className="chipRow">
                    {FAST_ADHERENCE.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelections({ ...selections, adherence: c })}
                            className={`chip ${selections.adherence === c ? 'selected' : ''}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>Main reason (if couldn't make it today as planned) - (optional)</p>
                <div className="chipRow">
                    {FAST_REASON.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelections({ ...selections, reason: c })}
                            className={`chip ${selections.reason === c ? 'selected' : ''}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>Next step (optional)</p>
                <div className="chipRow">
                    {FAST_NEXT.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelections({ ...selections, nextStep: c })}
                            className={`chip ${selections.nextStep === c ? 'selected' : ''}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            {!isValid && (
                <div className="warn">
                    Please select adherence, or close to skip.
                </div>
            )}
        </div>
    )

    const renderPrayerFields = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>Prayer check-in</h4>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>Prayer type (required)</p>
                <div className="chipRow">
                    {PRAYER_TYPE.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelections({ ...selections, prayerType: c })}
                            className={`chip ${selections.prayerType === c ? 'selected' : ''}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>Attention (optional)</p>
                <div className="chipRow">
                    {PRAYER_ATTENTION.map(c => (
                        <button
                            key={c}
                            onClick={() => setSelections({ ...selections, attention: c })}
                            className={`chip ${selections.attention === c ? 'selected' : ''}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <p style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px' }}>Fruit (optional)</p>
                <div className="chipRow">
                    {PRAYER_FRUIT.map(c => (
                        <button
                            key={c}
                            onClick={() => toggleTag('fruit', c)}
                            className={`chip ${selections.fruit.includes(c) ? 'selected' : ''}`}
                        >
                            {c}
                        </button>
                    ))}
                </div>
            </div>
            {!isValid && (
                <div className="warn">
                    Please select prayer type, or close to skip.
                </div>
            )}
        </div>
    )

    return (
        <div className="overlay">
            <div className="modal">
                <div className="modalHead">
                    <div>
                        <div className="modalTitle">
                            {type === 'PRAYER' ? 'Prayer Log' : type === 'FAST' ? 'Fasting Log' : 'Journal Log'}
                        </div>
                        <div className="modalSub">Optional — takes ~10 seconds.</div>
                    </div>
                    <button className="btn secondary" onClick={onClose}>Close</button>
                </div>

                <div className="modalBody">
                    {type === 'JOURNAL' && renderJournalFields()}
                    {type === 'FAST' && renderFastFields()}
                    {type === 'PRAYER' && renderPrayerFields()}
                </div>

                <div className="modalFoot">
                    <div className="smallMuted">Your selections feed your Journey Map and gentle insights.</div>
                    <button
                        className="btn"
                        disabled={!isValid}
                        onClick={() => onSave(selections)}
                    >
                        Save check-in →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LogModal
