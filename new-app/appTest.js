import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
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

  // Timer functionality
  React.useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

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

  const handleReset = () => {
    setTimer(0);
    setIsRunning(false);
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((task, i) => i !== index));
  };

  const renderContent = () => {
    if (activeTab === "Dashboard") {
      return (
        <div className="dashboard">
          <div className="video-feed">
            <h2>Live Video Feed</h2>
            <img
              src="http://localhost:5000/video_feed"
              width="640"
              height="480"
              alt="Live Video Feed"
            />
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

            <div className="timer">
              <h3>Focus Timer</h3>
              <p>{`${Math.floor(timer / 60)}:${timer % 60 < 10 ? '0' : ''}${timer % 60}`}</p>
              <button onClick={() => setIsRunning(true)}>Start</button>
              <button onClick={() => setIsRunning(false)}>Stop</button>
              <button onClick={handleReset}>Reset</button>
            </div>
            <div className="statistics">
              <h3>Session Statistics</h3>
              {isRunning
                ? <p>Tracking focus...</p>
                : <p>Your focus level: {Math.max(0, 100 - timer)}%</p>}
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
          <img src="logo.png" alt="Logo" className="logo" />
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
              src="http://localhost:8000/video_feed"
              alt="Live Camera"
              className="video"
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