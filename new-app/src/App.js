// src/App.js
import React, { useEffect, useState } from 'react';

const StudyEfficiencyApp = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [eventCounts, setEventCounts] = useState({
    phone_pickup_count: 0,
    left_frame_count: 0,
    unfocused_count: 0
});

useEffect(() => {
    const interval = setInterval(() => {
        fetch('http://localhost:8000/event_counts')
            .then(response => response.json())
            .then(data => setEventCounts(data))
            .catch(error => console.error('Error fetching event counts:', error));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
}, []);
  const renderContent = () => {
    switch (activeTab) {
      
      case "Dashboard":
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ fontSize: "2.2rem", color: "#3498DB", marginBottom: "10px" }}>
              Welcome to Study Efficiency Tracker
            </h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", maxWidth: "800px", margin: "0 auto" }}>
              Our mission is to help you study smarter, not harder. By tracking your focus, identifying distractions, 
              and providing actionable feedback, we aim to make your study sessions more productive and efficient.
            </p>
            <div className="card-container">
              <div className="card">
                <span style={{ fontSize: "4rem" }}>🧠</span>
                <h3>Track Focus</h3>
                <p>Monitor your attention and minimize distractions.</p>
              </div>
              <div className="card">
                <span style={{ fontSize: "4rem" }}>💬</span>
                <h3>Get Feedback</h3>
                <p>Receive actionable advice to improve your study habits.</p>
              </div>
              <div className="card">
                <span style={{ fontSize: "4rem" }}>🎯</span>
                <h3>Set Goals</h3>
                <p>Define your study goals and achieve them effectively.</p>
              </div>
            </div>
          </div>
        );
        case "Camera":
          return (
            <div style={{ textAlign: 'center' }}>
                <h1>Study Tracker</h1>
                <div>
                    <img
                        src="http://localhost:8000/video_feed"
                        alt="Video feed"
                        style={{ width: '640px', height: '480px' }}
                    />
                </div>
                <div>
                    <h2>Event Counts:</h2>
                    <p>Phone Pickups: {eventCounts.phone_pickup_count}</p>
                    <p>Left Frame: {eventCounts.left_frame_count}</p>
                    <p>Unfocused: {eventCounts.unfocused_count}</p>
                </div>
            </div>
        );
      case "Session Timer":
        return <div><h2>Session Timer</h2><p>Total Study Time: Placeholder</p></div>;
      case "Efficiency Score":
        return <div><h2>Efficiency Score</h2><p>Focus Score: Placeholder</p></div>;
      case "Distraction Alerts":
        return <div><h2>Distraction Alerts</h2><p>Distractions Detected: Placeholder</p></div>;
      case "Goals":
        return <div><h2>Goals</h2><p>Set and track your goals here.</p></div>;
      case "Break Timer":
        return <div><h2>Break Timer</h2><p>Break Time: Placeholder</p></div>;
      case "Results":
        return (
          <div>
            <h2>Results</h2>
            <ul>
              <li>Focus Percentage: Placeholder</li>
              <li>Distractions Count: Placeholder</li>
              <li>What You Did Wrong: Placeholder</li>
              <li>What You Could Do Better: Placeholder</li>
            </ul>
          </div>
        );
      case "Settings":
        return <div><h2>Settings</h2><p>Customize your preferences here.</p></div>;
      default:
        return <div><p>Invalid Tab</p></div>;
    }
  };

  return (
    <div style={{ fontFamily: "inherit", margin: "0", minHeight: "100vh", backgroundColor: "#F7F9FB" }}>
      <header>
        <h1>Study Efficiency Tracker</h1>
      </header>

      {/* Navigation Tabs */}
      <nav>
        {["Dashboard", "Camera", "Session Timer", "Efficiency Score", "Distraction Alerts", "Goals", "Break Timer", "Results", "Settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active" : ""}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default StudyEfficiencyApp;
