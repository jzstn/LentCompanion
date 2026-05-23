import React, { useMemo, useState } from 'react'
import { CalendarDays, MapPin, Mail, CheckCircle2, XCircle, HelpCircle, Users } from 'lucide-react'

const EVENT = {
    title: 'Liya is Turning TWO!',
    tagline: "With a super dee duper hug and a big ‘I love you’… come celebrate Liya turning TWO!",
    date: 'Sunday, June 14',
    time: '2:00 PM',
    location: 'Hyatt Place Garden City',
    address: '5 North Ave, Garden City, NY 11530',
    rsvpTo: 'Mommy',
    phone: '917-587-6735'
}

// Add your image at: public/invitation.png
const INVITATION_IMAGE_URL = '/invitation.png'

const GUEST_LIMITS = {
    LIYA001: { label: 'Varghese Family', maxGuests: 4 },
    LIYA002: { label: 'Joseph Family', maxGuests: 3 },
    LIYA003: { label: 'Asha Family', maxGuests: 5 }
}

export default function App() {
    const [inviteCode, setInviteCode] = useState('')
    const [status, setStatus] = useState('yes')
    const [adults, setAdults] = useState(1)
    const [kids, setKids] = useState(1)
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const invite = useMemo(() => GUEST_LIMITS[inviteCode.trim().toUpperCase()] ?? null, [inviteCode])
    const totalComing = Number(adults || 0) + Number(kids || 0)
    const exceedsLimit = invite && status === 'yes' && totalComing > invite.maxGuests

    function submitRsvp(eventItem) {
        eventItem.preventDefault()
        if (!invite) return
        if (status === 'yes' && exceedsLimit) return
        setSubmitted(true)
    }

    function resetForm() {
        setInviteCode('')
        setStatus('yes')
        setAdults(1)
        setKids(1)
        setMessage('')
        setSubmitted(false)
    }

    return (
        <div className="app-shell">
            <div className="container">
                <header className="header">
                    <p className="eyebrow">Private Event RSVP</p>
                    <h1>{EVENT.title}</h1>
                    <p className="tagline">{EVENT.tagline}</p>
                </header>

                <main className="layout">
                    <section>
                        <article className="card image-card">
                            <div className="image-wrap">
                                <img
                                    src={INVITATION_IMAGE_URL}
                                    alt="Liya birthday invitation"
                                    onError={(eventItem) => {
                                        eventItem.currentTarget.style.display = 'none'
                                    }}
                                />
                                <p className="image-help">Put your card image at <strong>public/invitation.png</strong></p>
                            </div>
                        </article>
                    </section>

                    <section className="stack">
                        <article className="card info-card">
                            <div className="info-grid">
                                <Info icon={<CalendarDays />} label="Date & Time" value={`${EVENT.date} · ${EVENT.time}`} />
                                <Info icon={<MapPin />} label="Location" value={`${EVENT.location}\n${EVENT.address}`} />
                            </div>
                        </article>

                        <article className="card form-card">
                            {!submitted ? (
                                <form onSubmit={submitRsvp} className="form">
                                    <div>
                                        <h3>Will you celebrate with us?</h3>
                                        <p>Please enter your invite code and RSVP.</p>
                                    </div>

                                    <label>
                                        <span>Invite code</span>
                                        <input
                                            value={inviteCode}
                                            onChange={(eventItem) => setInviteCode(eventItem.target.value)}
                                            placeholder="Example: LIYA001"
                                            required
                                        />
                                    </label>

                                    {invite && (
                                        <div className="limit-box">
                                            <Users size={16} />
                                            <span>
                                                {invite.label}: You can RSVP up to <strong>{invite.maxGuests}</strong> guests.
                                            </span>
                                        </div>
                                    )}

                                    {!invite && inviteCode.trim() && <p className="error">Invalid invite code. Please check and try again.</p>}

                                    <div className="choices">
                                        <RsvpChoice active={status === 'yes'} onClick={() => setStatus('yes')} icon={<CheckCircle2 />} label="Yes" />
                                        <RsvpChoice active={status === 'maybe'} onClick={() => setStatus('maybe')} icon={<HelpCircle />} label="Maybe" />
                                        <RsvpChoice active={status === 'no'} onClick={() => setStatus('no')} icon={<XCircle />} label="No" />
                                    </div>

                                    {status === 'yes' && (
                                        <>
                                            <div className="num-grid">
                                                <NumberField label="Adults" value={adults} setValue={setAdults} />
                                                <NumberField label="Kids" value={kids} setValue={setKids} />
                                            </div>
                                            {invite && <p className="helper">Total selected: {totalComing} / {invite.maxGuests}</p>}
                                            {exceedsLimit && <p className="error">You selected more than your allowed guest limit.</p>}
                                        </>
                                    )}

                                    <label>
                                        <span>Message / allergy note</span>
                                        <textarea
                                            value={message}
                                            onChange={(eventItem) => setMessage(eventItem.target.value)}
                                            placeholder="Optional note for the host"
                                            rows={4}
                                        />
                                    </label>

                                    <button className="primary-btn" type="submit" disabled={!invite || exceedsLimit}>Submit RSVP</button>
                                </form>
                            ) : (
                                <div className="success-state">
                                    <div className="success-icon"><CheckCircle2 /></div>
                                    <h3>RSVP received!</h3>
                                    <p>Thank you. The host will upload all responses to Google Sheets.</p>
                                    <button onClick={resetForm} className="outline-btn" type="button">Add another RSVP</button>
                                </div>
                            )}
                        </article>

                        <div className="contact">
                            <Mail size={16} /> Questions? RSVP to {EVENT.rsvpTo}: {EVENT.phone}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    )
}

function Info({ icon, label, value }) {
    return <div className="info"><div className="icon-wrap">{React.cloneElement(icon, { size: 20 })}</div><p className="label">{label}</p><p className="value">{value}</p></div>
}

function RsvpChoice({ active, onClick, icon, label }) {
    return <button type="button" onClick={onClick} className={`choice ${active ? 'active' : ''}`}><div>{React.cloneElement(icon, { size: 18 })}</div><div>{label}</div></button>
}

function NumberField({ label, value, setValue }) {
    return <label><span>{label}</span><input type="number" min="0" value={value} onChange={(eventItem) => setValue(Number(eventItem.target.value))} /></label>
}
