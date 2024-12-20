import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthPage } from './components/Auth/AuthPage';
import { ProjectLayout } from './components/Layout/ProjectLayout';
import { ProjectList } from './components/Projects/ProjectList';
import { CRMLayout } from './components/Layout/CRMLayout';
import { Dashboard } from './components/Dashboard';
import { LeadList } from './components/LeadList';
import { SettingsPage } from './components/Settings/SettingsPage';
import { DueToday } from './pages/leads/DueToday';
import { DueTomorrow } from './pages/leads/DueTomorrow';
import { Next10Days } from './pages/leads/Next10Days';
import { Overdue } from './pages/leads/Overdue';
import { SourceReport } from './pages/leads/SourceReport';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/projects" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ProjectProvider>
          <Routes>
            {/* Auth Route */}
            <Route path="/auth" element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            } />

            {/* Project Routes */}
            <Route path="/projects" element={
              <PrivateRoute>
                <ProjectLayout>
                  <ProjectList />
                </ProjectLayout>
              </PrivateRoute>
            } />

            {/* CRM Routes - All under project context */}
            <Route path="/projects/:projectId/crm/*" element={
              <PrivateRoute>
                <CRMLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="leads" element={<LeadList />} />
                    <Route path="leads/overdue" element={<Overdue />} />
                    <Route path="leads/today" element={<DueToday />} />
                    <Route path="leads/tomorrow" element={<DueTomorrow />} />
                    <Route path="leads/next-10-days" element={<Next10Days />} />
                    <Route path="leads/source-report" element={<SourceReport />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Routes>
                </CRMLayout>
              </PrivateRoute>
            } />

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/projects" />} />
          </Routes>
        </ProjectProvider>
      </Router>
    </AuthProvider>
  );
}
