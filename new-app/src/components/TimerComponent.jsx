import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const TimerComponent = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* ── Helpers ──────────────────────────────────────────────── */
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    if (h > 0) return `${h}:${mm}:${ss}`;
    return `${mm}:${ss}`;
  };

  /* ── API calls ────────────────────────────────────────────── */
  const fetchTime = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/timer/time`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setElapsedTime(data.elapsed_time || 0);
      setError('');
    } catch {
      setError('Cannot reach backend');
    }
  };

  const startTimer = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/timer/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRunning(true);
      setElapsedTime(data.elapsed_time || 0);
    } catch {
      setError('Failed to start timer');
    } finally {
      setLoading(false);
    }
  };

  const stopTimer = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/timer/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRunning(false);
      setElapsedTime(data.elapsed_time || 0);
    } catch {
      setError('Failed to pause timer');
    } finally {
      setLoading(false);
    }
  };

  const resetTimer = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/timer/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRunning: false }),
      });
      if (!res.ok) throw new Error();
      setRunning(false);
      setElapsedTime(0);
    } catch {
      setError('Failed to reset timer');
    } finally {
      setLoading(false);
    }
  };

  /* ── Effects ──────────────────────────────────────────────── */
  useEffect(() => {
    fetchTime();
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(fetchTime, 1000);
    return () => clearInterval(interval);
  }, [running]);

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <div>
      <div className="card-label">Focus Timer</div>

      {error && <div className="error-banner">⚠&nbsp; {error}</div>}

      <div className="timer-display">
        <div className="timer">{formatTime(elapsedTime)}</div>
        <div className={`timer-phase ${running ? 'running' : 'ready'}`}>
          {running ? '● Session Active' : '○ Ready to Start'}
        </div>
      </div>

      <div className="timer-buttons">
        <button
          className="btn btn-primary"
          onClick={startTimer}
          disabled={running || loading}
        >
          Start
        </button>
        <button
          className="btn btn-ghost"
          onClick={stopTimer}
          disabled={!running || loading}
        >
          Pause
        </button>
        <button
          className="btn btn-danger"
          onClick={resetTimer}
          disabled={loading}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimerComponent;