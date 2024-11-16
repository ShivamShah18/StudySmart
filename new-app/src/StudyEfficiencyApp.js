import React, { useState } from "react";
import ReactDOM from 'react-dom';
import WebcamComponent from './WebcamComponent'; // Adjust the path as necessary

const StudyEfficiencyApp = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Webcam":
        return (
          <div>
            <h2>Webcam Feed</h2>
            <WebcamComponent />
          </div>
        );
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
            <p>This is your session timer page.</p>
          </div>
        );
      default:
        return <div>Select a tab to view its content.</div>;
    }
  };

  return (
    <div>
      <button onClick={() => setActiveTab("Dashboard")}>Dashboard</button>
      <button onClick={() => setActiveTab("Webcam")}>Webcam</button>
      <button onClick={() => setActiveTab("Session Timer")}>Session Timer</button>
      {renderContent()}
    </div>
  );
};

ReactDOM.render(<StudyEfficiencyApp />, document.getElementById('root'));

export default StudyEfficiencyApp