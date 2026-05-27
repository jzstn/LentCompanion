import React, { useEffect, useMemo, useState } from 'react'
import { CalendarDays, MapPin, Mail, CheckCircle2, XCircle, Users } from 'lucide-react'

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
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxg0_fpMxl1_uRs4UNSfVhorltRp8uw_ldn4zc2i9ZO9LhyJEpPFlE7Tc1hq7JypQcL/exec'

export default function App() {
    const [inviteCode, setInviteCode] = useState('')
    const [status, setStatus] = useState('yes')
    const [adults, setAdults] = useState(1)
    const [kids, setKids] = useState(1)
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loadingInvite, setLoadingInvite] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [inviteError, setInviteError] = useState('')
    const [saveError, setSaveError] = useState('')
    const [guest, setGuest] = useState(null)
    const [apiOffline, setApiOffline] = useState(false)

    useEffect(() => {
        const urlCode = new URLSearchParams(window.location.search).get('code') || ''
        if (urlCode) {
            const normalized = urlCode.trim().toUpperCase()
            setInviteCode(normalized)
            lookupInvite(normalized)
        }
    }, [])

    const maxGuests = useMemo(() => {
        if (!guest) return 0
        return Number(guest.adultsInvited || 0) + Number(guest.kidsInvited || 0)
    }, [guest])

    const totalComing = Number(adults || 0) + Number(kids || 0)
    const exceedsLimit = guest && status === 'yes' && totalComing > maxGuests

    async function lookupInvite(codeValue) {
        const code = codeValue.trim().toUpperCase()
        if (!code) {
            setGuest(null)
            setInviteError('')
            setApiOffline(false)
            return
        }

        setLoadingInvite(true)
        setInviteError('')
        setSaveError('')
        setApiOffline(false)

        try {
            const response = await fetch(`${APPS_SCRIPT_URL}?code=${encodeURIComponent(code)}`)
            const payload = await response.json()

            if (!payload.ok) {
                setGuest(null)
                setInviteError(payload.error || 'Invalid invite code. Please check and try again.')
                return
            }

            setGuest(payload.guest)
            setInviteError('')
            setApiOffline(false)
        } catch (_error) {
            setGuest(null)
            setApiOffline(true)
            setInviteError('Unable to connect to guest list right now. Please try again.')
        } finally {
            setLoadingInvite(false)
        }
    }

    async function submitRsvp(eventItem) {
        eventItem.preventDefault()
        setSaveError('')

        if (!guest) {
            setSaveError('Please enter a valid invite code.')
            return
        }

        if (status === 'yes' && exceedsLimit) {
            setSaveError('You selected more than your allowed guest limit.')
            return
        }

        const payloadBody = {
            code: inviteCode.trim().toUpperCase(),
            status,
            adultsComing: status === 'yes' ? Number(adults || 0) : 0,
            kidsComing: status === 'yes' ? Number(kids || 0) : 0,
            message
        }

        try {
            setSubmitting(true)
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(payloadBody)
            })
            const raw = await response.text()
            let payload = null
            try {
                payload = JSON.parse(raw)
            } catch (_parseError) {
                setSaveError(`RSVP service returned an invalid response: ${raw.slice(0, 120)}`)
                return
            }

            if (!payload.ok) {
                setSaveError(payload.error || 'Could not save RSVP. Please try again.')
                return
            }

            setSubmitted(true)
        } catch (_error) {
            setApiOffline(true)
            setSaveError('Network error while sending RSVP. Please try again.')
        } finally {
            setSubmitting(false)
        }
    }

    function resetForm() {
        setStatus('yes')
        setAdults(1)
        setKids(1)
        setMessage('')
        setSubmitted(false)
        setSaveError('')
    }

    return (
        <div className="app-shell">
            <div className="container">
                <header className="header">
                    {apiOffline && <p className="api-warning">⚠️ RSVP service is temporarily offline. You can still view the invite.</p>}
                    <p className="eyebrow">Hosted by Justin & Merlin Varghese </p>
                    <h1>{EVENT.title}</h1>
                    <p className="tagline">{EVENT.tagline}</p>
                </header>

                <main className="layout">
                    <section>
                        <article className="card image-card">
                            <div className="image-wrap">
                                <img src={INVITATION_IMAGE_URL} alt="Liya birthday invitation" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                                <p className="image-help">Put your card image at <strong>public/invitation.png</strong></p>
                            </div>
                        </article>
                    </section>

                    <section className="stack">
                        <article className="card info-card">
                            <div className="info-grid">
                                <Info icon={<CalendarDays />} label="Date & Time" value={`${EVENT.date} · ${EVENT.time}`} />
                                <Info icon={<MapPin />} label="Location" value={`${EVENT.location}
${EVENT.address}`} />
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
                                        <div className="invite-row">
                                            <input value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="Example: LIYA001" required />
                                            <button type="button" className="lookup-btn" onClick={() => lookupInvite(inviteCode)} disabled={loadingInvite}>
                                                {loadingInvite ? <><span className="spinner" aria-hidden="true" />Checking...</> : 'Check'}
                                            </button>
                                        </div>
                                    </label>

                                    {guest && (
                                        <div className="limit-box"><Users size={16} /><span><strong>{guest.familyName}</strong>: You can RSVP up to <strong>{maxGuests}</strong> guests.</span></div>
                                    )}

                                    {inviteError && <p className="error">{inviteError}</p>}

                                    <div className="choices">
                                        <RsvpChoice active={status === 'yes'} onClick={() => setStatus('yes')} icon={<CheckCircle2 />} label="Yes" />
                                        <RsvpChoice active={status === 'no'} onClick={() => setStatus('no')} icon={<XCircle />} label="No" />
                                    </div>

                                    {status === 'yes' && (
                                        <>
                                            <div className="num-grid">
                                                <NumberField label="Adults" value={adults} setValue={setAdults} />
                                                <NumberField label="Kids" value={kids} setValue={setKids} />
                                            </div>
                                            {guest && <p className="helper">Total selected: {totalComing} / {maxGuests}</p>}
                                            {exceedsLimit && <p className="error">You selected more than your allowed guest limit.</p>}
                                        </>
                                    )}

                                    <label>
                                        <span>Message / allergy note</span>
                                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Optional note for the host" rows={4} />
                                    </label>

                                    {saveError && <p className="error">{saveError}</p>}
                                    <button className="primary-btn" type="submit" disabled={!guest || exceedsLimit || submitting}>
                                        {submitting ? <><span className="spinner" aria-hidden="true" />Submitting...</> : 'Submit RSVP'}
                                    </button>
                                </form>
                            ) : (
                                <div className="success-state">
                                    <div className="success-icon"><CheckCircle2 /></div>
                                    <h3>RSVP received!</h3>
                                    <p>Thank you. Your RSVP has been saved with Mommy.</p>
                                    <button onClick={resetForm} className="outline-btn" type="button">Update RSVP</button>
                                </div>
                            )}
                        </article>

                        <div className="contact"><Mail size={16} /> Questions? RSVP to {EVENT.rsvpTo}: {EVENT.phone}</div>
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
