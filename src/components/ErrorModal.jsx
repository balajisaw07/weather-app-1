import React from 'react';
import PropTypes from 'prop-types';
import '../styles/errormodal.scss';

function ErrorModal({ message, onClose }) {
    const handleCloseClick = () => {
        onClose();
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            onClose();
        }
    };

    return (
        <div className="error-modal">
            <div className="error-modal-content">
                <span
                    role="button"
                    tabIndex="0"
                    className="error-modal-close"
                    onClick={handleCloseClick}
                    onKeyDown={handleKeyDown}
                >
                    &times;
                </span>
                <p>{message}</p>
            </div>
        </div>
    );
}

ErrorModal.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ErrorModal;
