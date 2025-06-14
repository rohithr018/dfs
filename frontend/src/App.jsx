import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/toastContext';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
