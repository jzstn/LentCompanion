import React, { useEffect, useMemo, useState } from 'react'
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
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzFdxXeMi8B9WAxC51ykGxTDbB3-7c5OCgvW-h316QJENjCxhV9yXla4StYlaLkoogN/exec'

export default function App() {
    const [inviteCode, setInviteCode] = useState('')
    const [status, setStatus] = useState('yes')
    const [adults, setAdults] = useState(1)
    const [kids, setKids] = useState(1)
    const [message, setMessage] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [loadingInvite, setLoadingInvite] = useState(false)
    const [inviteError, setInviteError] = useState('')
    const [saveError, setSaveError] = useState('')
    const [guest, setGuest] = useState(null)

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
            return
        }

        setLoadingInvite(true)
        setInviteError('')
        setSaveError('')

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
        } catch (_error) {
            setGuest(null)
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

        const body = {
            code: inviteCode.trim().toUpperCase(),
            status,
            adultsComing: status === 'yes' ? Number(adults || 0) : 0,
            kidsComing: status === 'yes' ? Number(kids || 0) : 0,
            message
        }

        try {
            const response = await fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })
            const payload = await response.json()

            if (!payload.ok) {
                setSaveError(payload.error || 'Could not save RSVP. Please try again.')
                return
            }

            setSubmitted(true)
        } catch (_error) {
            setSaveError('Network error while sending RSVP. Please try again.')
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
                    <p className="eyebrow">Private Event RSVP</p>
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
                                            <button type="button" className="lookup-btn" onClick={() => lookupInvite(inviteCode)} disabled={loadingInvite}>{loadingInvite ? 'Checking...' : 'Check'}</button>
                                        </div>
                                    </label>

                                    {guest && (
                                        <div className="limit-box"><Users size={16} /><span><strong>{guest.familyName}</strong>: You can RSVP up to <strong>{maxGuests}</strong> guests.</span></div>
                                    )}

                                    {inviteError && <p className="error">{inviteError}</p>}

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
                                            {guest && <p className="helper">Total selected: {totalComing} / {maxGuests}</p>}
                                            {exceedsLimit && <p className="error">You selected more than your allowed guest limit.</p>}
                                        </>
                                    )}

                                    <label>
                                        <span>Message / allergy note</span>
                                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Optional note for the host" rows={4} />
                                    </label>

                                    {saveError && <p className="error">{saveError}</p>}
                                    <button className="primary-btn" type="submit" disabled={!guest || exceedsLimit}>Submit RSVP</button>
                                </form>
                            ) : (
                                <div className="success-state">
                                    <div className="success-icon"><CheckCircle2 /></div>
                                    <h3>RSVP received!</h3>
                                    <p>Thank you. Your RSVP has been saved in Google Sheets.</p>
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
