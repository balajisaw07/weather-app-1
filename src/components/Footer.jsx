import React from 'react';
import '../styles/footer.scss';

function Footer() {
    return (
        <div className="footer-container" data-testid="footer-component">
            <a href="https://davittportfolio.com/" target="_blank" rel="noopener noreferrer">
                <img src="/profile.png" alt="Portfolio Logo" width="20" height="20" />
                Developer&apos;s Portfolio
            </a>
            <a href="https://github.com/DavittBarry/weather-app" target="_blank" rel="noopener noreferrer">
                <img src="/github-mark-white.svg" alt="GitHub Logo" width="20" height="20" />
                GitHub Repository
            </a>
            <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
            >
                Privacy Statement
            </a>
        </div>
    );
}

export default Footer;
