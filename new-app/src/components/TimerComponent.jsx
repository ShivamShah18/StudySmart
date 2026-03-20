import React, { useState, useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const TimerComponent = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const fetchTime = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timer/time`);
      if (!response.ok) throw new Error('Failed to fetch time');
      
      const data = await response.json();
      setElapsedTime(data.elapsed_time || 0);
      setError('');
    } catch (err) {
      console.error('Error fetching time:', err);
      setError('Unable to connect to backend');
    }
  };

  const startTimer = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/timer/start`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to start timer');
      
      const data = await response.json();
      setRunning(true);
      setElapsedTime(data.elapsed_time || 0);
    } catch (err) {
      console.error('Error starting timer:', err);
      setError('Failed to start timer');
    } finally {
      setLoading(false);
    }
  };

  const stopTimer = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/timer/stop`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to stop timer');
      
      const data = await response.json();
      setRunning(false);
      setElapsedTime(data.elapsed_time || 0);
    } catch (err) {
      console.error('Error stopping timer:', err);
      setError('Failed to stop timer');
    } finally {
      setLoading(false);
    }
  };

  const resetTimer = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/timer/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRunning: false })
      });
      
      if (!response.ok) throw new Error('Failed to reset timer');
      
      setRunning(false);
      setElapsedTime(0);
    } catch (err) {
      console.error('Error resetting timer:', err);
      setError('Failed to reset timer');
    } finally {
      setLoading(false);
    }
  };

  // Fetch time every second when running
  useEffect(() => {
    if (running) {
      const interval = setInterval(fetchTime, 1000);
      return () => clearInterval(interval);
    }
  }, [running]);

  // Initial fetch
  useEffect(() => {
    fetchTime();
  }, []);

  return (
    <div className="timer">
      <h1>⏱️ Focus Timer</h1>
      
      {error && <div style={{ color: '#e74c3c', marginBottom: '10px', fontSize: '14px' }}>{error}</div>}
      
      <div style={{ fontSize: '2em', fontWeight: 'bold', margin: '20px 0', minHeight: '50px' }}>
        {formatTime(elapsedTime)}
      </div>
      
      <div className="timer-buttons">
        <button 
          onClick={startTimer} 
          disabled={running || loading}
          style={{ opacity: running || loading ? 0.6 : 1 }}
        >
          Start
        </button>
        <button 
          onClick={stopTimer} 
          disabled={!running || loading}
          style={{ opacity: !running || loading ? 0.6 : 1 }}
        >
          Stop
        </button>
        <button 
          onClick={resetTimer} 
          disabled={loading}
          style={{ opacity: loading ? 0.6 : 1 }}
        >
          Reset
        </button>
      </div>
      
      {loading && <p style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>Loading...</p>}
    </div>
  );
};

export default TimerComponent;
