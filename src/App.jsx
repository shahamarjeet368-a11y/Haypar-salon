import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load Pages
const Home = lazy(() => import('./pages/Home'));
const Hairstyles = lazy(() => import('./pages/Hairstyles'));
const BookAppointment = lazy(() => import('./pages/BookAppointment'));
const Login = lazy(() => import('./pages/Login'));
const MakeQRCode = lazy(() => import('./pages/MakeQRCode'));
const ViewImage = lazy(() => import('./pages/ViewImage'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

// Scroll to top on route change helper
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    // Scroll immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, behavior: 'instant' });
    
    // Backup scroll for any delayed client renders
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo({ top: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, behavior: 'instant' });
    }, 50);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
};

function App() {
  useEffect(() => {
    // Preload crucial pages after the initial page renders to make transition instant
    const preloadPages = () => {
      import('./pages/Home').catch(() => {});
      import('./pages/BookAppointment').catch(() => {});
      import('./pages/Hairstyles').catch(() => {});
    };
    
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preloadPages);
    } else {
      setTimeout(preloadPages, 2000);
    }
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-richBlack text-white">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-richBlack">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hairstyles" element={<Hairstyles />} />
              <Route path="/book" element={<BookAppointment />} />
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Login />} />
              <Route path="/make-qr" element={<MakeQRCode />} />
              <Route path="/view-image" element={<ViewImage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
