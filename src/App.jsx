import { useState, useEffect } from 'react'
import Today from './pages/Today'
import Journey from './pages/Journey'
import Library from './pages/Library'
import Profile from './pages/Profile'
import Sidebar from './components/Sidebar'
import Auth from './components/Auth'
import FooterSponsor from './components/FooterSponsor'
import { supabase } from './lib/supabase'

function App() {
    const [activeTab, setActiveTab] = useState('today')
    const [session, setSession] = useState(null)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => subscription.unsubscribe()
    }, [])

    const renderContent = () => {
        switch (activeTab) {
            case 'today': return <Today />
            case 'journey': return <Journey />
            case 'library': return <Library />
            case 'profile': return <Profile />
            default: return <Today />
        }
    }

    if (!session) {
        return <Auth />
    }

    return (
        <div className="wrap">
            <div className="grid">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
                <main className="main-content">
                    {renderContent()}
                    <FooterSponsor />
                </main>
            </div>
        </div>
    )
}

export default App
