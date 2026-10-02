import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicOnlyRoute from './components/auth/PublicOnlyRoute';
import AppLayout from './components/layout/AppLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';

// Intro Loading Page
import LoadingPage from './pages/LoadingPage';

// Application Pages
import Dashboard from './pages/Dashboard';
import AskHistorian from './pages/AskHistorian';
import EmployeeSearch from './pages/EmployeeSearch';
import Timeline from './pages/Timeline';
import KnowledgeGraph from './pages/KnowledgeGraph';
import Insights from './pages/Insights';
import Forecasts from './pages/Forecasts';
import Evidence from './pages/Evidence';
import Reports from './pages/Reports';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root Experience: Loading Screen */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <LoadingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/loading" 
            element={
              <ProtectedRoute>
                <LoadingPage />
              </ProtectedRoute>
            } 
          />

          {/* Public Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/sign-in" 
            element={<Navigate to="/login" replace />} 
          />
          <Route 
            path="/signup" 
            element={
              <PublicOnlyRoute>
                <Signup />
              </PublicOnlyRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicOnlyRoute>
                <ForgotPassword />
              </PublicOnlyRoute>
            } 
          />

          {/* Protected Application Routes */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="ask" element={<AskHistorian />} />
            <Route path="employee-search" element={<EmployeeSearch />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="graph" element={<KnowledgeGraph />} />
            <Route path="insights" element={<Insights />} />
            <Route path="forecasts" element={<Forecasts />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
