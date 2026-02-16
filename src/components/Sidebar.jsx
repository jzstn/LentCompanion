import React from 'react'

const NAV_TABS = [
    { key: 'today', label: 'Today', icon: '🌿' },
    { key: 'journey', label: 'Journey Map', icon: '🗺️' },
    { key: 'library', label: 'Library', icon: '📖' },
    { key: 'profile', label: 'Profile', icon: '✨' }
]

const Sidebar = ({ activeTab, setActiveTab }) => {
    return (
        <aside className="shell">
            <div className="brand">
                <div className="logo"></div>
                <div>
                    <div className="name">Fasting</div>
                    <div className="sub">Single-file prototype</div>
                </div>
            </div>
            <div className="divider"></div>
            <nav className="nav">
                {NAV_TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={activeTab === tab.key ? 'active' : ''}
                    >
                        <span>{tab.icon} {tab.label}</span>
                        <span className="chev">›</span>
                    </button>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar
