import { useMemo, useState } from 'react'

const initialForm = {
    parentName: '',
    childName: '',
    email: '',
    attending: 'yes',
    guests: 2,
    dietary: '',
    note: ''
}

function App() {
    const [event] = useState({
        title: "Ava's 2nd Birthday Party",
        date: 'Saturday, June 15, 2026',
        time: '11:00 AM - 2:00 PM',
        venue: 'Sunshine Kids Park, Austin, TX',
        theme: 'Butterflies & Bubbles'
    })

    const [form, setForm] = useState(initialForm)
    const [responses, setResponses] = useState([])
    const [submitted, setSubmitted] = useState(false)

    const stats = useMemo(() => {
        const attending = responses.filter((entry) => entry.attending === 'yes')
        const totalGuests = attending.reduce((sum, entry) => sum + Number(entry.guests || 0), 0)

        return {
            totalResponses: responses.length,
            attendingCount: attending.length,
            totalGuests
        }
    }, [responses])

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }))
    }

    const handleSubmit = (eventItem) => {
        eventItem.preventDefault()

        const newResponse = {
            ...form,
            id: crypto.randomUUID(),
            submittedAt: new Date().toLocaleString()
        }

        setResponses((current) => [newResponse, ...current])
        setSubmitted(true)
        setForm(initialForm)

        setTimeout(() => setSubmitted(false), 3000)
    }

    return (
        <div className="page">
            <header className="hero card">
                <p className="tag">You're invited 🎉</p>
                <h1>{event.title}</h1>
                <p className="theme">Theme: {event.theme}</p>
                <div className="event-grid">
                    <p><strong>Date:</strong> {event.date}</p>
                    <p><strong>Time:</strong> {event.time}</p>
                    <p><strong>Venue:</strong> {event.venue}</p>
                </div>
            </header>

            <section className="layout">
                <form className="card form" onSubmit={handleSubmit}>
                    <h2>RSVP Form</h2>
                    <label>
                        Parent / Guardian Name
                        <input
                            required
                            value={form.parentName}
                            onChange={(eventItem) => updateField('parentName', eventItem.target.value)}
                            placeholder="e.g., Sarah Johnson"
                        />
                    </label>

                    <label>
                        Child's Name
                        <input
                            required
                            value={form.childName}
                            onChange={(eventItem) => updateField('childName', eventItem.target.value)}
                            placeholder="e.g., Mia"
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(eventItem) => updateField('email', eventItem.target.value)}
                            placeholder="name@email.com"
                        />
                    </label>

                    <label>
                        Will you attend?
                        <select value={form.attending} onChange={(eventItem) => updateField('attending', eventItem.target.value)}>
                            <option value="yes">Yes, we will be there</option>
                            <option value="no">Sorry, we can't make it</option>
                        </select>
                    </label>

                    <label>
                        Number attending (including child)
                        <input
                            type="number"
                            min="1"
                            max="8"
                            value={form.guests}
                            onChange={(eventItem) => updateField('guests', eventItem.target.value)}
                        />
                    </label>

                    <label>
                        Dietary notes (optional)
                        <input
                            value={form.dietary}
                            onChange={(eventItem) => updateField('dietary', eventItem.target.value)}
                            placeholder="Allergies or food preferences"
                        />
                    </label>

                    <label>
                        Message for Ava (optional)
                        <textarea
                            rows="3"
                            value={form.note}
                            onChange={(eventItem) => updateField('note', eventItem.target.value)}
                            placeholder="Can't wait to celebrate with you!"
                        />
                    </label>

                    <button type="submit">Send RSVP</button>
                    {submitted && <p className="success">Thanks! Your RSVP has been saved.</p>}
                </form>

                <aside className="card summary">
                    <h2>RSVP Summary</h2>
                    <div className="stats">
                        <p><span>{stats.totalResponses}</span>Total Responses</p>
                        <p><span>{stats.attendingCount}</span>Families Attending</p>
                        <p><span>{stats.totalGuests}</span>Expected Guests</p>
                    </div>

                    <h3>Latest Responses</h3>
                    <ul>
                        {responses.length === 0 && <li className="empty">No RSVPs yet.</li>}
                        {responses.map((entry) => (
                            <li key={entry.id}>
                                <p><strong>{entry.parentName}</strong> ({entry.childName})</p>
                                <p>{entry.attending === 'yes' ? 'Attending' : 'Not attending'} · {entry.guests} guests</p>
                                <p className="muted">{entry.submittedAt}</p>
                            </li>
                        ))}
                    </ul>
                </aside>
            </section>
        </div>
    )
}

export default App
