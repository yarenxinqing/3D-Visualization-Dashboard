import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import SystemSettings from './pages/SystemSettings';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
  <div className="tab-bar">

  </div>
  <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;