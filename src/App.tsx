import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { EventDetails } from './pages/EventDetails';
import { SeatSelection } from './pages/SeatSelection';
import { Checkout } from './pages/Checkout';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { AdminDashboard } from './pages/AdminDashboard';
import { TicketPage } from './pages/TicketPage';
import { UserProfile } from './pages/UserProfile';
import { NotFound } from './pages/NotFound';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Pages that should NOT show the Navbar/Footer (full-screen views)
const FULL_SCREEN_PATHS = ['/admin'];

function Layout() {
  const { pathname } = useLocation();
  const isFullScreen = FULL_SCREEN_PATHS.some(p => pathname.startsWith(p));

  return (
    <>
      <ScrollToTop />
      {!isFullScreen && <Navbar />}
      <main>
        <Routes>
          <Route path="/"                   element={<Home />} />
          <Route path="/discover"           element={<Discover />} />
          <Route path="/event/:id"          element={<EventDetails />} />
          <Route path="/seat-selection/:id" element={<SeatSelection />} />
          <Route path="/checkout/:id"       element={<Checkout />} />
          <Route path="/dashboard"          element={<Dashboard />} />
          <Route path="/ticket/:id"         element={<TicketPage />} />
          <Route path="/profile"            element={<UserProfile />} />
          <Route path="/login"              element={<Login />} />
          <Route path="/register"           element={<Register />} />
          <Route path="/forgot-password"    element={<ForgotPassword />} />
          <Route path="/admin"              element={<AdminDashboard />} />
          <Route path="*"                   element={<NotFound />} />
        </Routes>
      </main>
      {!isFullScreen && <Footer />}
    </>
  );
}

import { ThemeProvider } from './context/ThemeContext';
import { BookingProvider } from './context/BookingContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BookingProvider>
            <Router>
              <Layout />
            </Router>
          </BookingProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
