import React from 'react'

const Library = () => {
    return (
        <div className="main">
            <header className="topbar">
                <div>
                    <div className="title">Library</div>
                    <div className="subtitle">Readings, verses, fathers, and iconography.</div>
                </div>
            </header>

            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
                <div className="cardTitle" style={{ fontSize: '20px' }}>Under Construction</div>
                <p className="smallMuted" style={{ marginTop: '12px', maxWidth: '400px', margin: '12px auto' }}>
                    This preview focuses on the Today experience, Journey Map, and log confirmation recorder.
                </p>
            </div>
        </div>
    )
}

export default Library
