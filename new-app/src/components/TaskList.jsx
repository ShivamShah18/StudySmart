import React, { useState, useEffect } from 'react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState('');

  // Load tasks from localStorage on component mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('studysmart_tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (err) {
      console.error('Error loading tasks from localStorage:', err);
      setError('Failed to load tasks');
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('studysmart_tasks', JSON.stringify(tasks));
      setError('');
    } catch (err) {
      console.error('Error saving tasks to localStorage:', err);
      setError('Failed to save tasks');
    }
  }, [tasks]);

  const handleAddTask = () => {
    // Validate input
    if (!newTask.trim()) {
      setError('Task cannot be empty');
      return;
    }

    if (newTask.trim().length < 1) {
      setError('Task must be at least 1 character long');
      return;
    }

    if (newTask.trim().length > 500) {
      setError('Task cannot be longer than 500 characters');
      return;
    }

    // Add task
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask('');
    setError('');
  };

  const toggleTaskCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="task-list-container">
      <h2>Today's Tasks {tasks.length > 0 && `(${completedCount}/${tasks.length})`}</h2>
      
      {error && <div className="error-message" style={{ color: '#e74c3c', marginBottom: '10px' }}>{error}</div>}
      
      <div className="task-input">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter a new task..."
          maxLength={500}
          aria-label="New task input"
        />
        <button className="add-task-btn" onClick={handleAddTask} aria-label="Add task">
          Add Task
        </button>
      </div>

      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>No tasks yet. Add one to get started!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              className={task.completed ? 'completed' : ''}
              onClick={() => toggleTaskCompletion(task.id)}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') toggleTaskCompletion(task.id);
              }}
            >
              <span>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTaskCompletion(task.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Mark "${task.text}" as ${task.completed ? 'incomplete' : 'complete'}`}
                />
                {task.text}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask(task.id);
                }}
                aria-label={`Delete task "${task.text}"`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
