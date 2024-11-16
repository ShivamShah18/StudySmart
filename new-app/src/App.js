import React, { useState, useEffect } from "react";

const StudyEfficiencyApp = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Study Timer States
  const [studyActive, setStudyActive] = useState(false);
  const [studyTime, setStudyTime] = useState(0);

  // Break Timer States
  const [breakActive, setBreakActive] = useState(false);
  const [breakTime, setBreakTime] = useState(0);

  // Study Timer Logic
  useEffect(() => {
    let studyInterval;
    if (studyActive) {
      studyInterval = setInterval(() => {
        setStudyTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(studyInterval);
    }
    return () => clearInterval(studyInterval);
  }, [studyActive]);

  const resetStudyTimer = () => {
    setStudyTime(0);
    setStudyActive(false);
  };

  // Break Timer Logic
  useEffect(() => {
    let breakInterval;
    if (breakActive) {
      breakInterval = setInterval(() => {
        setBreakTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(breakInterval);
    }
    return () => clearInterval(breakInterval);
  }, [breakActive]);

  const resetBreakTimer = () => {
    setBreakTime(0);
    setBreakActive(false);
  };

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
      case "Session Timer":
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#3498DB" }}>Study Timer</h2>
            <p style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
              Time Elapsed: {Math.floor(studyTime / 60)} min {studyTime % 60} sec
            </p>
            <div>
              <button
                onClick={() => setStudyActive((prev) => !prev)}
                style={{
                  marginRight: "10px",
                  backgroundColor: studyActive ? "#E74C3C" : "#2ECC71",
                }}
              >
                {studyActive ? "Pause" : "Start"}
              </button>
              <button onClick={resetStudyTimer} style={{ backgroundColor: "#3498DB" }}>
                Reset
              </button>
            </div>
          </div>
        );
      case "Break Timer":
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#E67E22" }}>Break Timer</h2>
            <p style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
              Time Elapsed: {Math.floor(breakTime / 60)} min {breakTime % 60} sec
            </p>
            <div>
              <button
                onClick={() => setBreakActive((prev) => !prev)}
                style={{
                  marginRight: "10px",
                  backgroundColor: breakActive ? "#E74C3C" : "#2ECC71",
                }}
              >
                {breakActive ? "Pause" : "Start"}
              </button>
              <button onClick={resetBreakTimer} style={{ backgroundColor: "#E67E22" }}>
                Reset
              </button>
            </div>
          </div>
        );
      case "Efficiency Score":
        return <div><h2>Efficiency Score</h2><p>Focus Score: Placeholder</p></div>;
      case "Distraction Alerts":
        return <div><h2>Distraction Alerts</h2><p>Distractions Detected: Placeholder</p></div>;
      case "Goals":
        return <div><h2>Goals</h2><p>Set and track your goals here.</p></div>;
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
    <div style={{ fontFamily: "inherit", minHeight: "100vh", backgroundColor: "#F7F9FB" }}>
      <header
        style={{
          textAlign: "center",
          backgroundColor: "#3498DB",
          color: "#fff",
          padding: "15px 0",
        }}
      >
        <h1>Study Efficiency Tracker</h1>
      </header>

      {/* Navigation Tabs */}
      <nav style={{ textAlign: "center", marginBottom: "20px" }}>
        {["Dashboard", "Session Timer", "Break Timer", "Efficiency Score", "Distraction Alerts", "Goals", "Results", "Settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              margin: "5px",
              padding: "10px 20px",
              borderRadius: "5px",
              backgroundColor: activeTab === tab ? "#3498DB" : "#fff",
              color: activeTab === tab ? "#fff" : "#2C3E50",
              border: activeTab === tab ? "2px solid #3498DB" : "1px solid #ddd",
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <main
        style={{
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {renderContent()}
      </main>
    </div>
  );
};

export default StudyEfficiencyApp;
