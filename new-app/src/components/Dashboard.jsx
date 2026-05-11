import React, { useState, useEffect } from 'react';
import TimerComponent from './TimerComponent';
import TaskList from './TaskList';
import VideoCapture from './VideoCapture';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

/* ── Inline SVG Focus Ring ──────────────────────────────────── */
const FocusRing = ({ score }) => {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="focus-ring">
      <svg viewBox="0 0 80 80" width="80" height="80">
        <circle
          className="ring-bg"
          cx="40" cy="40" r={radius}
        />
        <circle
          className="ring-progress"
          cx="40" cy="40" r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-label">
        <span className="ring-value">{score}</span>
        <span className="ring-unit">score</span>
      </div>
    </div>
  );
};

/* ── Dashboard ──────────────────────────────────────────────── */
const Dashboard = () => {
  const [detectionState, setDetectionState] = useState({
    face_detected: false,
    blink_count: 0,
    hand_absent_count: 0,
    session_score: 0,
  });
  const [graphUrl, setGraphUrl] = useState(null);
  const [error, setError] = useState('');
  const [graphLoading, setGraphLoading] = useState(false);

  const sendFrameToBackend = async (frameBlob) => {
    try {
      const formData = new FormData();
      formData.append('frame', frameBlob);
      await fetch(`${API_BASE_URL}/video/process`, { method: 'POST', body: formData });
    } catch (e) {
      // silently fail — frame drops are acceptable
    }
  };

  const fetchDetectionState = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/detection/state`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setDetectionState(data);
      setError('');
    } catch {
      setError('Cannot reach backend — analytics unavailable');
    }
  };

  const fetchFocusGraph = async () => {
    try {
      setGraphLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/graph/focus`);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      setGraphUrl(URL.createObjectURL(blob));
    } catch {
      setError('Failed to generate focus graph');
    } finally {
      setGraphLoading(false);
    }
  };

  useEffect(() => {
    fetchDetectionState();
    const interval = setInterval(fetchDetectionState, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">

      {/* ── Column 1: Camera Feed ─────────────────────────── */}
      <div className="camera-section card">
        <div className="card-label">Live Feed</div>
        <VideoCapture onFrameSend={sendFrameToBackend} />
      </div>

      {/* ── Column 2 Top: Focus Graph ─────────────────────── */}
      <div className="graph-section card">
        <div className="card-label">Focus Analytics</div>

        {error && <div className="error-banner">⚠&nbsp; {error}</div>}

        {graphUrl ? (
          <img src={graphUrl} alt="Focus Graph" className="graph-image" />
        ) : (
          <div className="empty-state">
            No graph yet.<br />
            Start a session, then generate.
          </div>
        )}

        <button
          className="graph-button"
          onClick={fetchFocusGraph}
          disabled={graphLoading}
          style={{ marginTop: 'var(--space-3)', width: '100%' }}
        >
          {graphLoading ? 'Generating...' : 'Generate Focus Graph'}
        </button>
      </div>

      {/* ── Column 2 Bottom: Session Stats ───────────────── */}
      <div className="analytics-row card">
        <div className="card-label">Session Statistics</div>

        <div className="focus-score-container">
          <FocusRing score={detectionState.session_score} />
          <div className="focus-score-meta">
            <div className="score-title">
              {detectionState.session_score >= 75
                ? 'Deep Focus'
                : detectionState.session_score >= 40
                ? 'Moderate Focus'
                : 'Low Focus'}
            </div>
            <div className="score-subtitle">Current session rating</div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-chip">
            <div className="stat-value">
              <span className={detectionState.face_detected ? 'detected-yes' : 'detected-no'}>
                {detectionState.face_detected ? '✓' : '✗'}
              </span>
            </div>
            <div className="stat-label">Face Detected</div>
          </div>
          <div className="stat-chip">
            <div className="stat-value">{detectionState.blink_count}</div>
            <div className="stat-label">Blink Count</div>
          </div>
          <div className="stat-chip">
            <div className="stat-value">{detectionState.hand_absent_count}</div>
            <div className="stat-label">Hands Off Desk</div>
          </div>
          <div className="stat-chip">
            <div className="stat-value">{detectionState.session_score}%</div>
            <div className="stat-label">Focus Score</div>
          </div>
        </div>
      </div>

      {/* ── Column 3: Tasks + Timer ──────────────────────── */}
      <div className="task-timer-section card">
        <TaskList />
        <div className="section-divider" />
        <TimerComponent />
      </div>

    </div>
  );
};

export default Dashboard;