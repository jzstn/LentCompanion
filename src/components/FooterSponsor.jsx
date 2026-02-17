import React from 'react'

const FooterSponsor = () => {
    return (
        <div className="footerSponsor">
            <a
                className="sponsorCard"
                href="https://www.mystyra.com"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="/sponsor_logo.png"
                    className="sponsorLogo"
                    alt="Mystyra Logo"
                    style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '14px',
                        objectFit: 'cover'
                    }}
                />

                <div className="sponsorText">
                    <div className="sponsorLabel">Official Sponsor</div>
                    <div className="sponsorName">Mystyra Prints</div>
                    <div className="sponsorSub">
                        Part of Mystyra · Custom printing for t-shirts & apparel<br />
                        www.mystyra.com
                    </div>
                </div>
            </a>
        </div>
    )
}

export default FooterSponsor
