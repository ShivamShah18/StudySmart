import React, { useState, useEffect } from 'react';
import './App.css';
import Logo from './Logo.png';

const link2 = 'https://studynew.onrender.com:10000'
const link = 'http://localhost:5000' 
const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0); // Store elapsed time
  const [running, setRunning] = useState(false); // Track if the timer is running
  const [graphUrl, setGraphUrl] = useState(null); // State to store the graph URL

  const fetchFocusGraph = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/focus-graph');
      if (!response.ok) {
        throw new Error('Failed to fetch the graph');
      }

      const blob = await response.blob(); // Get the image as a blob
      const url = URL.createObjectURL(blob); // Convert the blob to a URL
      setGraphUrl(url); // Update the graph URL
    } catch (error) {
      console.error('Error fetching graph:', error);
    }
  };

  // Fetch elapsed time periodically when the timer is running
  useEffect(() => {
    let timerInterval;
    if (running) {
      timerInterval = setInterval(() => {
        fetchTime();
      }, 1000);
    }
    return () => clearInterval(timerInterval); // Cleanup interval on unmount
  }, [running]);

  // Fetch the elapsed time from the backend
  const fetchTime = async () => {
    try {
      const response = await fetch(link + '/get_time'); // Flask endpoint
      if (response.ok) {
        const data = await response.json();
        setElapsedTime(data.elapsed_time); // Update elapsed time
      } else {
        console.error('Failed to fetch time');
      }
    } catch (error) {
      console.error('Error fetching time:', error);
    }
  };

  // Start the timer by calling Flask
  const startTimer = async () => {
    try {
      const response = await fetch(link + '/start_timer', { method: 'POST' }); // Flask endpoint
      if (response.ok) {
        setRunning(true); // Set timer as running
      } else {
        console.error('Failed to start timer');
      }
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  // Stop the timer by calling Flask
  const stopTimer = async () => {
    try {
      const response = await fetch(link + '/stop_timer', { method: 'POST' }); // Flask endpoint
      if (response.ok) {
        setRunning(false); // Set timer as stopped
        fetchTime(); // Update elapsed time after stopping
      } else {
        console.error('Failed to stop timer');
      }
    } catch (error) {
      console.error('Error stopping timer:', error);
    }
  };  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [detectionState, setDetectionState] = useState({
    face_detected: false,
    blink_count: 0,
    hand_absent_count: 0,
    session_score: 0
  });

  
  const handleStop = async () => {
      const response = await fetch(link + '/update_variable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRunning: false }),
      });
    
  };

  useEffect(() => {

    const interval = setInterval(() => {
      fetch(link + '/detection_state')
        .then(response => response.json())
        .then(data => setDetectionState(data))
        .catch(error => console.error('Error fetching detection state:', error));
    }, 1000); // Update every second

    return () => clearInterval(interval);

  }, [activeTab]);



  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (index) => {
    setTasks(tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((task, i) => i !== index));
  };

  const renderContent = () => {
    if (activeTab === "Dashboard") {
      return (
        <div className="dashboard">
          <div className="video-feed">
            <h2>Study Session Statistics</h2>
            <div>
            <div>
            
            <div>
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Focus Graph</h1>
      <button onClick={fetchFocusGraph}>Get Focus Graph</button>
      {graphUrl && <img src={graphUrl} alt="Focus Graph" style={{ marginTop: '20px', width: '80%' }} />}
    </div>
        </div>
        </div>
        </div>
            <p>Face Detected: {detectionState.face_detected ? "Yes" : "No"}</p>
            <p>Blinks Detected: {detectionState.blink_count}</p>
            <p>Hand Left Frame Count: {detectionState.hand_absent_count}</p>
          </div>
          <div className="task-section">
            <div className="task-input">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter a task"
              />
              <button onClick={handleAddTask}>Add Task</button>
            </div>
            <ul className="task-list">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={task.completed ? 'completed' : ''}
                  onClick={() => toggleTaskCompletion(index)}
                >
                  {task.text}
                  <button onClick={() => handleDeleteTask(index)}>Delete</button>
                </li>
              ))}
            </ul>


           
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Flask Timer</h1>
      <p>Elapsed Time: {elapsedTime.toFixed(2)} seconds</p>
      <button onClick={startTimer} disabled={running}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!running}>
        Stop
      </button>
    </div>
            <div className="statistics">
              <h3>Session Statistics</h3>
              
              <p>Your focus level: {detectionState.session_score}%</p>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === "About") {
      return (
        <div className="about">
          <h2>About This Application</h2>
          <p>This app helps you stay productive by combining a task manager, a timer, and a live video feed to track your focus during study sessions.</p>
          <ul>
            <li>Add your tasks to the list.</li>
            <li>Use the timer to measure study sessions.</li>
            <li>Review statistics on your focus after each session.</li>
          </ul>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-and-title">
          <img src={Logo} alt="Logo" className="logo" />
          <h1>Study Smart</h1>
        </div>
      </header>
      <nav className="App-nav">
        <button onClick={() => setActiveTab("Dashboard")}>Dashboard</button>
        <button onClick={() => setActiveTab("About")}>About</button>
      </nav>
      <main className="App-main">
        <div className="layout">
          <div className="camera">
            <h3>Camera</h3>
            <img
              src= {link + "/video_feed"}
              width="300"
              height="200"
              alt="Live Video Feed"
            />
          </div>
          <div className="center">
            <h2>Today's Tasks</h2>
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;

