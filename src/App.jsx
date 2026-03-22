import { Suspense, lazy } from 'react';
import './styles.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Preloader      from './components/Preloader';
import Navbar         from './components/Navbar';
import BackToTop      from './components/BackToTop';

const HomePage = lazy(() => import('./pages/HomePage'));
const WorkPage = lazy(() => import('./pages/WorkPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const AppsPage = lazy(() => import('./pages/AppsPage'));
const ResumePage = lazy(() => import('./pages/ResumePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

function RouteLoader() {
  return (
    <div className="route-loader" role="status" aria-live="polite" aria-label="Loading page">
      <div className="preloader-spinner" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <Navbar />
      <main className="app-main">
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/experience" element={<WorkPage />} />
            <Route path="/work" element={<Navigate to="/experience" replace />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/apps" element={<AppsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <BackToTop />
    </BrowserRouter>
  );
}
