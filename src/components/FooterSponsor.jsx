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
                <div className="iconBox sponsorLogo" style={{
                    background: '#1e1e1e',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    width: '60px',
                    height: '60px'
                }}>
                    M
                </div>

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
