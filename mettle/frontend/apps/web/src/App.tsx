import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TalentPoolPage } from './pages/TalentPoolPage';
import { PipelinePage } from './pages/PipelinePage';
import { AIToolsPage } from './pages/AIToolsPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { OfferPage } from './pages/OfferPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { JobsPage } from './pages/JobsPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/talent-pool" element={<TalentPoolPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/ai-assistant" element={<AIToolsPage />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="/offer" element={<OfferPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          {/* Add other routes as placeholders or components when ready */}
          <Route path="*" element={<div className="p-4">Page Not Found</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
