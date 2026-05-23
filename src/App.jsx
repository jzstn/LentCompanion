import { useMemo, useState } from 'react'

const initialForm = {
    guestCount: 1
}

function App() {
    const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false)
    const [form, setForm] = useState(initialForm)
    const [responses, setResponses] = useState([])
    const [submitted, setSubmitted] = useState(false)

    const event = {
        title: "Ava's 2nd Birthday",
        message: 'Please join us for cake, games, and bubbles!',
        date: 'Saturday, June 15, 2026',
        time: '11:00 AM - 2:00 PM',
        venue: 'Sunshine Kids Park, Austin, TX'
    }

    const stats = useMemo(() => {
        const totalGuests = responses.reduce((sum, entry) => sum + Number(entry.guestCount || 0), 0)

        return {
            totalResponses: responses.length,
            totalGuests
        }
    }, [responses])

    const handleSubmit = (eventItem) => {
        eventItem.preventDefault()

        const newResponse = {
            id: crypto.randomUUID(),
            guestCount: Number(form.guestCount),
            submittedAt: new Date().toLocaleString()
        }

        setResponses((current) => [newResponse, ...current])
        setSubmitted(true)
        setForm(initialForm)
        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <div className="page">
            {!isEnvelopeOpen && (
                <section className="envelope card">
                    <p className="for">To: Dear Family 💌</p>
                    <div className="envelope-art" aria-hidden="true">
                        <div className="flap" />
                        <div className="paper" />
                    </div>
                    <h1>You're Invited</h1>
                    <p>Tap below to open this birthday invitation.</p>
                    <button type="button" onClick={() => setIsEnvelopeOpen(true)}>Open Envelope</button>
                </section>
            )}

            {isEnvelopeOpen && (
                <section className="invite-layout">
                    <article className="card invite">
                        <p className="tag">2nd Birthday Party 🎉</p>
                        <h2>{event.title}</h2>
                        <p>{event.message}</p>
                        <p><strong>Date:</strong> {event.date}</p>
                        <p><strong>Time:</strong> {event.time}</p>
                        <p><strong>Venue:</strong> {event.venue}</p>
                    </article>

                    <form className="card form" onSubmit={handleSubmit}>
                        <h2>Quick RSVP</h2>
                        <p className="helper">Enter only how many guests are coming.</p>
                        <label>
                            Number of guests coming
                            <input
                                type="number"
                                min="1"
                                max="10"
                                required
                                value={form.guestCount}
                                onChange={(eventItem) => setForm({ guestCount: eventItem.target.value })}
                            />
                        </label>

                        <button type="submit">Send RSVP</button>
                        {submitted && <p className="success">Thank you! RSVP sent.</p>}
                    </form>

                    <aside className="card summary">
                        <h3>RSVP Status</h3>
                        <p><strong>{stats.totalResponses}</strong> responses</p>
                        <p><strong>{stats.totalGuests}</strong> guests expected</p>
                    </aside>
                </section>
            )}
        </div>
    )
}

export default App
