import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import About from './components/About';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    if (activeTab === 'Dashboard') {
      return <Dashboard />;
    } else if (activeTab === 'About') {
      return <About />;
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
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </header>
      <main className="App-main">{renderContent()}</main>
    </div>
  );
};

export default App;
