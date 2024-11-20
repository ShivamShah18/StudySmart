import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:5000';

const TimerComponent = () => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);

  const fetchTime = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timer/time`);
      const data = await response.json();
      setElapsedTime(data.elapsed_time);
    } catch (error) {
      console.error('Error fetching time:', error);
    }
  };

  const startTimer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timer/start`, { method: 'POST' });
      if (response.ok) setRunning(true);
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  const stopTimer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/timer/stop`, { method: 'POST' });
      if (response.ok) {
        setRunning(false);
        fetchTime();
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };

  const resetTimer = async () => {
    await fetch(`${API_BASE_URL}/timer/reset`, {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ isRunning: false }),
       });
     
   };

  useEffect(() => {
    if (running) {
      const interval = setInterval(fetchTime, 1000);
      return () => clearInterval(interval);
    }
  }, [running]);

  return (
    <div className="timer">
      <h1>Timer</h1>
      <p>Elapsed Time: {elapsedTime.toFixed(2)} seconds</p>
      <button onClick={startTimer} disabled={running}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!running}>
        Stop
      </button>
      <button onClick={resetTimer}>
        Reset
      </button>
    </div>
  );
};

export default TimerComponent;
