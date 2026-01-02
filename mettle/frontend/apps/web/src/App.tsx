import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { PipelinePage } from './pages/PipelinePage';
import { AIToolsPage } from './pages/AIToolsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { OfferPage } from './pages/OfferPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { JobsPage } from './pages/JobsPage';
import { PlannerPage } from './pages/PlannerPage';
import { CandidatesPage } from './pages/CandidatesPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/planner" element={<PlannerPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/ai-assistant" element={<AIToolsPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          {/* Add other routes as placeholders or components when ready */}
          <Route path="*" element={<div className="p-4">Page Not Found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
