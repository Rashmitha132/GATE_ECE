import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedLayout } from './components/ProtectedLayout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { LearnPage } from './pages/LearnPage';
import { PracticePage } from './pages/PracticePage';
import { TestsPage } from './pages/TestsPage';
import { PerformancePage } from './pages/PerformancePage';
import { ResourcesPage } from './pages/ResourcesPage';
import { FacultyPortal } from './pages/FacultyPortal';
import { AdminPortal } from './pages/AdminPortal';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes inside App Shell */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/tests" element={<TestsPage />} />
            <Route path="/performance" element={<PerformancePage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/faculty" element={<FacultyPortal />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Route>

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
