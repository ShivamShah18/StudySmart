import React, { useEffect, useState } from 'react';

const StudyEfficiencyApp = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [detectionState, setDetectionState] = useState({
    face_detected: false,
    blink_count: 0,
  });

  useEffect(() => {
    if (activeTab === "Camera") {
      const interval = setInterval(() => {
        fetch('http://localhost:5000/detection_state')
          .then(response => response.json())
          .then(data => setDetectionState(data))
          .catch(error => console.error('Error fetching detection state:', error));
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case "Camera":
        return (
          <div style={{ textAlign: 'center' }}>
            <h1>Live Video Feed</h1>
            <img
              src="http://localhost:5000/video_feed"
              width="640"
              height="480"
              alt="Live Video Feed"
            />
            <p>Face Detected: {detectionState.face_detected ? "Yes" : "No"}</p>
            <p>Blinks Detected: {detectionState.blink_count}</p>
          </div>
        );
      default:
        return <div><p>Invalid Tab</p></div>;
    }
  };

  return (
    <div>
      <header>
        <h1>Study Efficiency Tracker</h1>
      </header>

      <nav>
        {["Dashboard", "Camera"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "active" : ""}
          >
            {tab}
          </button>
        ))}
      </nav>

      <main>
        {renderContent()}
      </main>
    </div>
  );
};

export default StudyEfficiencyApp;
