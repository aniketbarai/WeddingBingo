import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutSection from "./components/AboutSection";
import ContactPage from "./pages/ContactPage";
import Services from "./components/ServicesSection";
import Gallery from "./pages/Gallery";
import IntroLoader from "./pages/IntroLoader";
import PackagesSection from "./components/PackageSection";
import WeddingPhotographyPage from "./pages/WeddingPhotography";
import CinematicVideography from "./pages/CinematicVideography";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
  <div className="bg-[#050505] min-h-screen">

    {/* LOADER */}
    <AnimatePresence>
      {loading && <IntroLoader />}
    </AnimatePresence>

    {/* WEBSITE (NO WRAPPER ANIMATION) */}
    {!loading && (
      <>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutSection />} />
          <Route path="/packages" element={<PackagesSection />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services/weddingp" element={<WeddingPhotographyPage />} />
          <Route path="/services/cinematic" element={<CinematicVideography />} />
        </Routes>
      </>
    )}

  </div>
);
}

export default App;
