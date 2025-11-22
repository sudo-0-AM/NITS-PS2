import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Issuer from "./pages/Issuer";
import Student from "./pages/Student";
import Verify from "./pages/Verify";
import Footer from "./components/Footer"
import Analytics from "./components/Analytics";

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 py-6 md:px-8 md:py-10">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/issuer" element={<Issuer />} />
              <Route path="/student" element={<Student />} />
              <Route path="/verify" element={<Verify />} />
              <Route path="/analytics" element={<Analytics/>}/>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
