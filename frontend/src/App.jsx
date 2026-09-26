import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import NestGuideChat from './components/NestGuideChat';

import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DiscoveryPage from './pages/DiscoveryPage';
import DetailsPage from './pages/DetailsPage';
import DashboardPage from './pages/DashboardPage';
import DeadlineTrackerPage from './pages/DeadlineTrackerPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-slate-800">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/discover" element={<DiscoveryPage />} />
              <Route path="/scholarship/:id" element={<DetailsPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/deadlines" element={<DeadlineTrackerPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>

          <Footer />
          <AuthModal />
          <NestGuideChat />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
