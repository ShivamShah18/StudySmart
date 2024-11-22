import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <header className="navigation-header">
      <div className="header-content">
        <img src="Logo.png" alt="Logo" className="logo" />
        <h1 className="header-text">StudySmart</h1>
      </div>
      <div className="top-right-buttons">
        <button
          className={`nav-button ${activeTab === 'Dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('Dashboard')}
        >
          Home
        </button>
        <button
          className={`nav-button ${activeTab === 'About' ? 'active' : ''}`}
          onClick={() => setActiveTab('About')}
        >
          About
        </button>
      </div>
    </header>
  );
};

export default Navigation;
