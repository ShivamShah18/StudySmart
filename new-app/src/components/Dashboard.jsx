import React, { useState, useEffect } from 'react';
import TimerComponent from './TimerComponent';
import TaskList from './TaskList';

const API_BASE_URL = 'https://studynew-production.up.railway.app/';

const Dashboard = () => {
  const [detectionState, setDetectionState] = useState({
    face_detected: false,
    blink_count: 0,
    hand_absent_count: 0,
    session_score: 0,
  });
  const [graphUrl, setGraphUrl] = useState(null);

  const fetchDetectionState = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/detection/state`);
      const data = await response.json();
      setDetectionState(data);
    } catch (error) {
      console.error('Error fetching detection state:', error);
    }
  };

  const fetchFocusGraph = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/graph/focus`);
      if (!response.ok) throw new Error('Failed to fetch the graph');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGraphUrl(url);
    } catch (error) {
      console.error('Error fetching graph:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchDetectionState, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Left Section: Camera Feed */}
      <div className="camera-section">
        <h3>Camera Feed</h3>
        <img
          src={`${API_BASE_URL}/video/feed`}
          width="100%"
          height="auto"
          alt="Live Video Feed"
        />
      </div>

      {/* Middle Section: Graph */}
      <div className="graph-section">
        <h3>Focus Graph</h3>
        {graphUrl ? (
          <img src={graphUrl} alt="Focus Graph" style={{ width: '100%', height: 'auto' }} />
        ) : (
          <p>No graph available. Click below to generate.</p>
        )}
        <button style={{ width: "100%" }} onClick={fetchFocusGraph} className="graph-button">
 Generate Focus Graph
        </button>

        <div className="statistics">
          <h4>Session Statistics</h4>
          <p>Focus Level: {detectionState.session_score}%</p>
          <p>Face Detected: {detectionState.face_detected ? 'Yes' : 'No'}</p>
          <p>Blinks Detected: {detectionState.blink_count}</p>
          <p>Hand Left Frame Count: {detectionState.hand_absent_count}</p>
        </div>
      </div>

      {/* Right Section: Tasks and Timer */}
      <div className="task-timer-section">
        <TaskList />
        <TimerComponent />
      </div>
    </div>
  );
};

export default Dashboard;
