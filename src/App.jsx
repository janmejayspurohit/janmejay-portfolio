import './styles.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Preloader      from './components/Preloader';
import Navbar         from './components/Navbar';
import BackToTop      from './components/BackToTop';
import HomePage       from './pages/HomePage';
import WorkPage       from './pages/WorkPage';
import ProjectsPage   from './pages/ProjectsPage';
import ResumePage     from './pages/ResumePage';

export default function App() {
  return (
    <BrowserRouter>
      <Preloader />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BackToTop />
    </BrowserRouter>
  );
}
