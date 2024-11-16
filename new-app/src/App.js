import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import WebcamComponent from './WebcamComponent';

const StudyEfficiencyApp = () => {
    const [activeTab, setActiveTab] = useState("Dashboard");

    const handleCapture = (imageSrc) => {
        fetch('http://localhost:5000/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageSrc })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    };

    const [stats, setStats] = useState({
      timesAway: 0,
      unfocusedEye: 0,
      phoneUsage: 0,
      talk: 0,
      handMovement: 0
  });
  useEffect(() => {
    const interval = setInterval(() => {
        fetch('http://localhost:5000/stats')
        .then(response => response.json())
        .then(data => setStats(data))
        .catch(error => console.error('Error fetching stats:', error));
    }, 1000);  // Update every second

    return () => clearInterval(interval);
}, []);
    const renderContent = () => {
        switch (activeTab) {
            case "Webcam":
                return (
                  <div>
                  <h1>Study Tracker</h1>
                  <WebcamComponent />
                </div>
                );
                case "Dashboard":
                  return (
                      <div>
                          <h2>Dashboard</h2>
                          <p>Welcome to your study efficiency dashboard.</p>
                          <p>Times Away: {stats.timesAway}</p>
                          <p>Unfocused Eye: {stats.unfocusedEye}</p>
                          <p>Phone Usage: {stats.phoneUsage}</p>
                          <p>Talk: {stats.talk}</p>
                          <p>Hand Movement: {stats.handMovement}</p>
                      </div>
                  );
                case "Session Timer":
                  return (
                    <div>
                      <h2>Session Timer</h2>
                      <p>Total Study Time: Placeholder value</p>
                    </div>
                  );
                case "Efficiency Score":
                  return (
                    <div>
                      <h2>Efficiency Score</h2>
                      <p>Your focus score: Placeholder value</p>
                    </div>
                  );
                case "Distraction Alerts":
                  return (
                    <div>
                      <h2>Distraction Alerts</h2>
                      <p>Distractions detected: Placeholder value</p>
                    </div>
                  );
                case "Goals":
                  return (
                    <div>
                      <h2>Goals</h2>
                      <p>Set and track your study goals here.</p>
                    </div>
                  );
                case "Break Timer":
                  return (
                    <div>
                      <h2>Break Timer</h2>
                      <p>Break Time: Placeholder value</p>
                    </div>
                  );
                case "Results":
                  return (
                    <div>
                      <h2>Results</h2>
                      <ul>
                        <li>Focus Percentage: Placeholder value</li>
                        <li>Distractions Count: Placeholder value</li>
                        <li>What You Did Wrong: Placeholder</li>
                        <li>What You Could Do Better: Placeholder</li>
                      </ul>
                    </div>
                  );
                case "Settings":
                  return (
                    <div>
                      <h2>Settings</h2>
                      <p>Customize your study tracker preferences here.</p>
                    </div>
                  );
                default:
                  return <div><p>Invalid Tab</p></div>;
              }
            };
    return (
      <div style={{ fontFamily: "Arial, sans-serif", margin: "20px" }}>
        <header style={{ textAlign: "center", marginBottom: "20px" }}>
          <h1>Study Efficiency Tracker</h1>
        </header>
  
        {/* Navigation Tabs */}
        <nav style={{ marginBottom: "20px", textAlign: "center" }}>
          {["Webcam", "Dashboard", "Session Timer", "Efficiency Score", "Distraction Alerts", "Goals", "Break Timer", "Results", "Settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                margin: "5px",
                padding: "10px 15px",
                cursor: "pointer",
                border: activeTab === tab ? "2px solid #007BFF" : "1px solid #ddd",
                backgroundColor: activeTab === tab ? "#007BFF" : "#fff",
                color: activeTab === tab ? "#fff" : "#333",
                borderRadius: "5px",
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
  
        {/* Content Area */}
        <main style={{ padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          {renderContent()}
        </main>
      </div>
    );
};

ReactDOM.render(<StudyEfficiencyApp />, document.getElementById('root'));


export default StudyEfficiencyApp;


