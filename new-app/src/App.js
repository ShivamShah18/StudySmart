import React, { useState } from "react";

const StudyEfficiencyApp = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div>
            <h2>Dashboard</h2>
            <p>Welcome to your study efficiency dashboard.</p>
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
        {["Dashboard", "Session Timer", "Efficiency Score", "Distraction Alerts", "Goals", "Break Timer", "Results", "Settings"].map((tab) => (
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

export default StudyEfficiencyApp;
