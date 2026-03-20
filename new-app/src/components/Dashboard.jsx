import React, { useState, useEffect } from 'react';
import TimerComponent from './TimerComponent';
import TaskList from './TaskList';
import VideoCapture from "./VideoCapture";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const Dashboard = () => {
  const [detectionState, setDetectionState] = useState({
    face_detected: false,
    blink_count: 0,
    hand_absent_count: 0,
    session_score: 0,
  });
  const [graphUrl, setGraphUrl] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const sendFrameToBackend = async (frameBlob) => {
    try {
      const formData = new FormData();
      formData.append("frame", frameBlob);

      const response = await fetch(`${API_BASE_URL}/video/process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Frame processing failed:", response.status);
      }
    } catch (error) {
      console.error("Error sending frame to backend:", error);
    }
  };

  const fetchDetectionState = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/detection/state`);
      if (!response.ok) throw new Error('Failed to fetch detection state');
      
      const data = await response.json();
      setDetectionState(data);
      setError('');
    } catch (error) {
      console.error('Error fetching detection state:', error);
      setError('Unable to fetch detection data');
    }
  };

  const fetchFocusGraph = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/graph/focus`);
      
      if (!response.ok) throw new Error('Failed to fetch the graph');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setGraphUrl(url);
    } catch (error) {
      console.error('Error fetching graph:', error);
      setError('Failed to generate focus graph');
    } finally {
      setLoading(false);
    }
  };

  // Poll detection state every 2 seconds
  useEffect(() => {
    const interval = setInterval(fetchDetectionState, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Left Section: Camera Feed */}
      <div className="camera-section">
        <h3>📹 Camera Feed</h3>
        <VideoCapture onFrameSend={sendFrameToBackend} />
      </div>

      {/* Middle Section: Graph */}
      <div className="graph-section">
        <h3>📊 Focus Analytics</h3>
        
        {error && (
          <div style={{
            padding: '10px',
            backgroundColor: '#fee',
            color: '#c33',
            borderRadius: '4px',
            marginBottom: '10px',
            fontSize: '12px'
          }}>
            ⚠️ {error}
          </div>
        )}
        
        {graphUrl ? (
          <img 
            src={graphUrl} 
            alt="Focus Graph" 
            style={{ width: '100%', height: 'auto', borderRadius: '4px' }} 
          />
        ) : (
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '40px',
            textAlign: 'center',
            borderRadius: '4px',
            color: '#999'
          }}>
            <p>No graph available. Start a session to generate data.</p>
          </div>
        )}
        
        <button 
          style={{ width: "100%", marginTop: '10px' }} 
          onClick={fetchFocusGraph} 
          className="graph-button"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Focus Graph'}
        </button>

        <div className="statistics">
          <h4>📈 Session Statistics</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="stat-item">
              <span className="stat-label">Focus Level:</span>
              <span className="stat-value">{detectionState.session_score}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Face Detected:</span>
              <span className="stat-value">{detectionState.face_detected ? '✓ Yes' : '✗ No'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Blinks:</span>
              <span className="stat-value">{detectionState.blink_count}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Hand Left Frame:</span>
              <span className="stat-value">{detectionState.hand_absent_count}</span>
            </div>
          </div>
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
