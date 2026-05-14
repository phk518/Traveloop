import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { DataProvider, useData } from './context/DataContext';
import { motion, AnimatePresence } from 'framer-motion';
import CosmicBackground from './components/CosmicBackground';

// Static Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';

// Lazy Loaded Pages (Reduces initial RAM usage)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const CreateTrip = lazy(() => import('./pages/CreateTrip'));
const ItineraryView = lazy(() => import('./pages/ItineraryView'));
const ItineraryBuilder = lazy(() => import('./pages/ItineraryBuilder'));
const BudgetAnalytics = lazy(() => import('./pages/BudgetAnalytics'));
const PackingList = lazy(() => import('./pages/PackingList'));
const TripJournal = lazy(() => import('./pages/TripJournal'));
const Profile = lazy(() => import('./pages/Profile'));
const MyAccount = lazy(() => import('./pages/MyAccount'));
const PastTrips = lazy(() => import('./pages/PastTrips'));
const TripsList = lazy(() => import('./pages/TripsList'));
const TravelPreferences = lazy(() => import('./pages/TravelPreferences'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));
const PrivacySettings = lazy(() => import('./pages/PrivacySettings'));
const Settings = lazy(() => import('./pages/Settings'));
const Explore = lazy(() => import('./pages/Explore'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Loading Placeholder
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh] text-primary animate-pulse font-headline-md">
    Traveloop is loading...
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user } = useData();
  if (!user) return <Navigate to="/login" />;
  return children;
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useData();
  const location = useLocation();
  const isDetailView = location.pathname.startsWith('/trip/');

  return (
    <div className="min-h-screen relative overflow-hidden">
      <CosmicBackground />
      {user && !isDetailView && <Header user={user} />}
      <main className={isDetailView ? '' : `px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto pb-32 ${user ? 'pt-24' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Suspense fallback={<PageLoader />}>
              {children}
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      {user && !isDetailView && <BottomNav />}
    </div>
  );
};

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/create-trip" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
          <Route path="/trip/:id" element={<ProtectedRoute><ItineraryView /></ProtectedRoute>} />
          <Route path="/trip/:id/edit" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
          <Route path="/trip/:id/budget" element={<ProtectedRoute><BudgetAnalytics /></ProtectedRoute>} />
          <Route path="/trip/:id/checklist" element={<ProtectedRoute><PackingList /></ProtectedRoute>} />
          <Route path="/trip/:id/journal" element={<ProtectedRoute><TripJournal /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-account" element={<ProtectedRoute><MyAccount /></ProtectedRoute>} />
          <Route path="/past-trips" element={<ProtectedRoute><PastTrips /></ProtectedRoute>} />
          <Route path="/preferences" element={<ProtectedRoute><TravelPreferences /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/privacy" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/trips" element={<ProtectedRoute><TripsList /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

export default App;
