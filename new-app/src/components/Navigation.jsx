import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
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
  );
};


export default Navigation;
