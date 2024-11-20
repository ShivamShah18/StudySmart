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
  };  
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [detectionState, setDetectionState] = useState({
    face_detected: false,
    blink_count: 0,
    hand_absent_count: 0,
    session_score: 0
  });

  
  const handleStop = async () => {
   await fetch(link + '/update_variable', {
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
          <img
              src= {link + "/video_feed"}
              width="300"
              height="200"
              alt="Live Video Feed"
            />
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
          <p>Face Detected: {detectionState.face_detected ? "Yes" : "No"}</p>
          <p>Blinks Detected: {detectionState.blink_count}</p>
          <p>Hand Left Frame Count: {detectionState.hand_absent_count}</p>
        </div>
      );
    }
  };

  return (
    <div className="App">
      <header className="bg-dark-blue">
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Study Smart</h1>
              <p className="mt-1.5 text-sm text-white">
                Stay productive with task management, focus tracking, and live video feed.
              </p>
            </div>
            <div className="top-right-buttons">
              <button
                className="nav-button"
                onClick={() => setActiveTab("Dashboard")}
              >
                <span className="text-sm font-medium">Dashboard</span>
              </button>

              <button
                className="nav-button about-btn"
                onClick={() => setActiveTab("About")}
              >
                About
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="App-main">
        <div className="layout">
          {/* Left Section: Camera */}
          <div className="camera">
            <h3>Camera</h3>
            <img
              src= {link + "/video_feed"}
              width="500"
              height="350"
              alt="Live Video Feed"
            />
          </div>

          {/* Middle Section: Statistics */}
          <div className="statistics">
            <h3>Session Statistics</h3>
            <p>Your focus level: {detectionState.session_score}%</p>
            <div className="graph">
            {graphUrl && <img src={graphUrl} alt="Focus Graph" style={{ marginTop: '20px', width: '80%' }} />}
              <button onClick={fetchFocusGraph}>Get Focus Graph</button>
            </div>
            <p>Face Detected: {detectionState.face_detected ? "Yes" : "No"}</p>
            <p>Blinks Detected: {detectionState.blink_count}</p>
            <p>Hand Left Frame Count: {detectionState.hand_absent_count}</p>
          </div>

          {/* Right Section: Task Input and Timer */}
          <div className="task-timer">
            {activeTab === "Dashboard" && (
              <>
                <h2>Today's Tasks</h2>
                <div className="task-input">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter a task"
                  />
                  <button className="add-task-btn" onClick={handleAddTask}>Add Task</button>
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
              </>
            )}

            {activeTab === "About" && renderContent()}

            <div className="timer">
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Timer</h1>
      <p>Elapsed Time: {elapsedTime.toFixed(2)} seconds</p>
      <button onClick={startTimer} disabled={running}>
        Start
      </button>
      <button onClick={stopTimer} disabled={!running}>
        Stop
      </button>
      <button onClick = {handleStop}>Reset</button>
    </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default App