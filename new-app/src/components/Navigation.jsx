import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = ['Dashboard', 'About'];

  return (
    <header className="navigation-header">
      {/* Wordmark */}
      <div className="header-wordmark">
        <div className="wordmark-icon">S</div>
        <span className="header-wordmark-text wordmark-text">
          Study<span>Smart</span>
        </span>
      </div>

      {/* Live session indicator */}
      <div className="session-status">
        <span className="status-dot" />
        System Ready
      </div>

      {/* Nav tabs */}
      <nav className="nav-buttons-group">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`nav-button${activeTab === tab ? ' active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Navigation;