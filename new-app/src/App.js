import React, { useState, useEffect } from "react";

const StudyEfficiencyApp = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Goals State
  const [goals, setGoals] = useState([]);
  const [goalInput, setGoalInput] = useState("");

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

  // Add a new goal
  const addGoal = () => {
    if (goalInput.trim() !== "") {
      setGoals([...goals, goalInput.trim()]);
      setGoalInput(""); // Clear the input field
    }
  };

  // Remove a goal
  const removeGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
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
            <div className="card-container" style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
              <div className="card" style={{ textAlign: "center", padding: "20px", borderRadius: "8px", backgroundColor: "#ECF0F1" }}>
                <span style={{ fontSize: "4rem" }}>🧠</span>
                <h3>Track Focus</h3>
                <p>Monitor your attention and minimize distractions.</p>
              </div>
              <div className="card" style={{ textAlign: "center", padding: "20px", borderRadius: "8px", backgroundColor: "#ECF0F1" }}>
                <span style={{ fontSize: "4rem" }}>💬</span>
                <h3>Get Feedback</h3>
                <p>Receive actionable advice to improve your study habits.</p>
              </div>
              <div className="card" style={{ textAlign: "center", padding: "20px", borderRadius: "8px", backgroundColor: "#ECF0F1" }}>
                <span style={{ fontSize: "4rem" }}>🎯</span>
                <h3>Set Goals</h3>
                <p>Define your study goals and achieve them effectively.</p>
              </div>
            </div>
          </div>
        );
      case "Goals":
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#3498DB" }}>Goals</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto", marginBottom: "20px" }}>
              The Goals tab helps you stay organized and motivated by allowing you to set, track, and manage your study goals.
              Add goals that you'd like to achieve during your session and remove them as you complete them!
            </p>
            <div style={{ marginBottom: "20px" }}>
              <input
                type="text"
                placeholder="Enter a new goal"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                style={{
                  padding: "10px",
                  width: "60%",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                  marginRight: "10px",
                }}
              />
              <button onClick={addGoal} style={{ backgroundColor: "#2ECC71", color: "#fff" }}>
                Add Goal
              </button>
            </div>
            <ul style={{ listStyleType: "disc", paddingLeft: "40px", maxWidth: "600px", margin: "0 auto", textAlign: "left" }}>
              {goals.map((goal, index) => (
                <li
                  key={index}
                  style={{
                    backgroundColor: "#ECF0F1",
                    padding: "10px 15px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{goal}</span>
                  <button
                    onClick={() => removeGoal(index)}
                    style={{
                      backgroundColor: "#E74C3C",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      case "Efficiency Score":
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#3498DB" }}>Efficiency Score</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto", marginBottom: "20px" }}>
              The Efficiency Score is calculated using a custom algorithm that evaluates your focus during study sessions.
              It takes into account the number of blinks, eye movements, hand gestures, and phone usage detected during the session.
              Based on this data, a focus percentage is generated to help you understand how well you're concentrating.
            </p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#2ECC71", marginTop: "20px" }}>
              Focus Percentage: Placeholder %
            </p>
          </div>
        );
      case "Distraction Alerts":
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#E74C3C" }}>Distraction Alerts</h2>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto", marginBottom: "20px" }}>
              Distraction Alerts help you stay focused by monitoring and detecting when your concentration is interrupted.
              Using advanced tracking algorithms, this feature identifies distractions such as phone usage, hand movements,
              or excessive blinking, and provides real-time alerts to keep you on track.
            </p>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#E74C3C", marginTop: "20px" }}>
              Distractions Detected: Placeholder
            </p>
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
      case "Results":
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
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
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>Settings</h2>
            <p>Customize your preferences here.</p>
          </div>
        );
      default:
        return (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <p>Invalid Tab</p>
          </div>
        );
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
        {["Dashboard", "Session Timer", "Break Timer", "Goals", "Efficiency Score", "Distraction Alerts", "Results", "Settings"].map((tab) => (
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
