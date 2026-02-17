// Helper logic for Orthodox liturgical seasons, readings, and reflections

export const TODAY_READINGS = [
    {
        key: "repentance",
        title: "Return to Me",
        theme: "Repentance",
        motivation: "Repentance is not shame. It is returning home — with hope.",
        verseText: "Return to Me with all your heart.",
        verseRef: "Joel 2:12"
    },
    {
        key: "hidden-fast",
        title: "The Hidden Fast",
        theme: "Fasting",
        motivation: "Fasting is not about food. It is about freedom — and love made practical.",
        verseText: "When you fast, anoint your head and wash your face.",
        verseRef: "Matthew 6:17"
    },
    {
        key: "mercy",
        title: "Mercy Over Judgment",
        theme: "Mercy",
        motivation: "The heart becomes light when it forgives quickly and prays quietly.",
        verseText: "Be merciful, just as your Father also is merciful.",
        verseRef: "Luke 6:36"
    },
    {
        key: "peace",
        title: "Peace in the Heart",
        theme: "Peace",
        motivation: "Peace is not a mood — it is a gift guarded by prayer, humility, and restraint.",
        verseText: "Peace I leave with you, My peace I give to you.",
        verseRef: "John 14:27"
    }
]

export const FATHERS_BY_THEME = {
    Repentance: [
        { name: "St. Isaac the Syrian", quote: "This life has been given to you for repentance." },
        { name: "St. John Climacus", quote: "Do not be surprised that you fall every day; do not give up, but stand your ground courageously." }
    ],
    Fasting: [
        { name: "St. Basil the Great", quote: "Fasting was ordained in Paradise." },
        { name: "St. John Chrysostom", quote: "Let the fast be observed not by the mouth alone, but by the eye, the ear, the feet, the hands, and all the members of our bodies." }
    ],
    Mercy: [
        { name: "St. Silouan the Athonite", quote: "Where there is humility, there is love; where there is love, there is peace." },
        { name: "St. Ephrem the Syrian", quote: "If you have peace in your heart, you will be able to give peace to others." }
    ],
    Peace: [
        { name: "St. Seraphim of Sarov", quote: "Acquire the Spirit of peace, and thousands around you will be saved." },
        { name: "St. Theophan the Recluse", quote: "The principal thing is to stand with the mind in the heart before God." }
    ],
    Default: [
        { name: "St. Anthony the Great", quote: "Our life and our death are with our neighbor." }
    ]
}

// Orthodox icon images by theme (High-resolution placeholders)
// When local icons are ready in src/assets/icons/, import them here:
// import repentanceImg from '../assets/icons/repentance.png'
export const ICON_IMAGES = {
    Repentance: "/today_banner.png",
    Fasting: "/today_banner.png",
    Mercy: "/today_banner.png",
    Peace: "/today_banner.png",
    Default: "/today_banner.png"
}

export function getTodayReading() {
    const i = (new Date().getDate()) % TODAY_READINGS.length
    return TODAY_READINGS[i]
}

export function getTodayFather(theme) {
    const list = FATHERS_BY_THEME[theme] || FATHERS_BY_THEME.Default
    const i = (new Date().getDate()) % list.length
    return list[i]
}

export function getLiturgicalSeason() {
    const d = new Date()
    const m = d.getMonth() + 1
    if (m === 12) return "Nativity Fast (seasonal)"
    if (m === 1) return "Theophany season (seasonal)"
    if (m === 3 || m === 4) return "Great Lent (seasonal)"
    if (m === 8) return "Dormition Fast (seasonal)"
    return "Ordinary time (seasonal)"
}

export function getCurrentAffairsPrayer() {
    return [
        "For the suffering in war and violence — that the Lord grant protection and mercy.",
        "For refugees and displaced families — that the Lord provide shelter and comfort.",
        "For the sick, the elderly, and the weary — that the Lord grant healing and strength.",
        "For the lonely, the anxious, and the forgotten — that the Lord send consolation.",
        "For peace in our homes and communities — that hearts be softened by repentance."
    ]
}
