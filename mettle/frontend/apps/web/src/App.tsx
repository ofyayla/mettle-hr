import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from './components/layout/Layout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Toaster } from './components/common/Toaster';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Lazy load pages for better initial bundle size
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const JobsPage = lazy(() => import('./pages/JobsPage').then(m => ({ default: m.JobsPage })));
const PlannerPage = lazy(() => import('./pages/PlannerPage').then(m => ({ default: m.PlannerPage })));
const PipelinePage = lazy(() => import('./pages/PipelinePage').then(m => ({ default: m.PipelinePage })));
const AIToolsPage = lazy(() => import('./pages/AIToolsPage').then(m => ({ default: m.AIToolsPage })));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage').then(m => ({ default: m.AssessmentPage })));
const OfferPage = lazy(() => import('./pages/OfferPage').then(m => ({ default: m.OfferPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const CandidatesPage = lazy(() => import('./pages/CandidatesPage').then(m => ({ default: m.CandidatesPage })));

import { GeneralSettingsPage } from './pages/settings/GeneralSettingsPage';
import { UserManagementPage } from './pages/settings/UserManagementPage';
import { IntegrationsPage } from './pages/settings/IntegrationsPage';
import { PipelineSettingsPage } from './pages/settings/PipelineSettingsPage';
import { TemplatesPage } from './pages/settings/TemplatesPage';
import { SecurityPage } from './pages/settings/SecurityPage';
import { SsoPage } from './pages/settings/SsoPage';
import { SettingsLayout } from './components/settings/SettingsLayout';

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                  <Route path="/planner" element={<PlannerPage />} />
                  <Route path="/pipeline" element={<PipelinePage />} />
                  <Route path="/ai-assistant" element={<AIToolsPage />} />
                  <Route path="/assessment" element={<AssessmentPage />} />
                  <Route path="/offer" element={<OfferPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/candidates" element={<CandidatesPage />} />
                  {/* Settings Nested Routes */}
                  <Route path="/settings" element={<SettingsLayout />}>
                    <Route index element={<GeneralSettingsPage />} />
                    <Route path="users" element={<UserManagementPage />} />
                    <Route path="integrations" element={<IntegrationsPage />} />
                    <Route path="pipeline" element={<PipelineSettingsPage />} />
                    <Route path="templates" element={<TemplatesPage />} />
                    <Route path="security" element={<SecurityPage />} />
                    <Route path="sso" element={<SsoPage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<div className="p-4">Page Not Found</div>} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
