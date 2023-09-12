import React from 'react';
import '../styles/privacy.scss';

function Privacy() {
    return (
        <div className="privacy-container">
            <h1>Privacy Statement</h1>
            <section className="privacy-content">
                <h2>Introduction</h2>
                <p>Welcome to the Weather App by Davitt Barry.</p>
                <p>
                    This Privacy Statement explains how
                    information is managed. By using
                    Weather App, users agree to the
                    collection and use of information
                    in accordance with this statement.
                </p>

                <h2>Information Collection</h2>
                <p>
                    Various types of information are
                    collected for various purposes to
                    provide and improve the service.
                </p>

                <h2>Use of Data</h2>
                <p>
                    Collected data is used for various
                    purposes, including providing and
                    maintaining the service, and
                    monitoring usage of the service.
                </p>

                <h2>Security of Data</h2>
                <p>
                    The security of the data is
                    important. However, no method of
                    transmission over the internet is
                    100% secure. While efforts are
                    made to protect the data, its
                    absolute security cannot be guaranteed.
                </p>

                <h2>Contact</h2>
                <p>
                    If there are any questions about
                    this Privacy Statement, the
                    following contact information is
                    available:
                </p>
                <ul>
                    <li>
                        Email:
                        {' '}
                        <a href="mailto:davittbarry333@gmail.com?subject=Privacy%20Inquiry">davittbarry333@gmail.com</a>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default Privacy;
