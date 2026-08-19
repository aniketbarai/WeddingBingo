import { Routes, Route, Navigate, useLocation } from "react-router-dom";import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";

import IntroLoader from "./pages/IntroLoader";

// Public pages
import Home from "./pages/Home";
import AboutPage from "./pages/About";
import ServicesPage from "./pages/Services";
import PackagesPage from "./pages/Packages";
import Gallery from "./pages/Gallery";
import TestimonialsPage from "./pages/Testimonials";
import ContactPage from "./pages/ContactPage";
import BookNowPage from "./pages/BookNow";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminPackages from "./pages/admin/AdminPackages";
import AdminInquiries from "./pages/admin/AdminInquiries";
import AdminWeddings from "./pages/admin/AdminWeddings";
import AdminSettings from "./pages/admin/AdminSettings";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#050505] min-h-screen">
      <AnimatePresence>{loading && <IntroLoader />}</AnimatePresence>

      {!loading && (
        <>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book-now" element={<BookNowPage />} />

            {/* Admin - login is public, everything else requires a token */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/gallery" element={<ProtectedRoute><AdminGallery /></ProtectedRoute>} />
            <Route path="/admin/weddings" element={<ProtectedRoute><AdminWeddings /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute><AdminReviews /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
            <Route path="/admin/packages" element={<ProtectedRoute><AdminPackages /></ProtectedRoute>} />
            <Route path="/admin/inquiries" element={<ProtectedRoute><AdminInquiries /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

            {/* Legacy service URLs redirect to the real services page instead of
                silently re-rendering Home under a different path */}
            <Route path="/services/weddingp" element={<Navigate to="/services" replace />} />
            <Route path="/services/cinematic" element={<Navigate to="/services" replace />} />
            <Route path="/services/prewedshoots" element={<Navigate to="/services" replace />} />
            <Route path="/services/droneCover" element={<Navigate to="/services" replace />} />
            <Route path="*" element={<div className="min-h-screen bg-[#050505] px-6 py-32 text-center text-white"><h1 className="font-serif text-5xl">Page not found.</h1><p className="mt-4 text-sm text-white/45">The page you requested does not exist.</p></div>} />
          </Routes>

          {!isAdminRoute && <Navbar />}
        </>
      )}
    </div>
  );
}

export default App;

