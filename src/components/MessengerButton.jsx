import React, { useState } from 'react';
import './MessengerButton.css';

const MessengerButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="messenger-container">
      <div className={`messenger-tooltip ${showTooltip ? 'visible' : ''}`}>
        Chat with us on Messenger
      </div>
      <a
        href="https://m.me/maesaiphayao"
        target="_blank"
        rel="noopener noreferrer"
        className="messenger-button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        title="Chat with us on Messenger"
      >
        <span className="messenger-icon">💬</span>
        <span className="pulse-ring"></span>
      </a>
    </div>
  );
};

export default MessengerButton;