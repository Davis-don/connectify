import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Services from "../pages/Services";
import Category from "../pages/Category";
import ServiceDetails from "../pages/ServiceDetails";
import HowItWorks from "../pages/Howitworks";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Join from "../pages/Join";
import MainLayout from "../components/layout/MainLayout";

function AppRoutes() {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />

      {/* Services overview */}
      <Route path="/services" element={<MainLayout><Services /></MainLayout>} />

      {/* Dynamic category page */}
      <Route path="/services/:category" element={<MainLayout><Category /></MainLayout>} />

      {/* Dynamic service page */}
      <Route path="/services/:category/:service" element={<MainLayout><ServiceDetails /></MainLayout>} />

      {/* Other static pages */}
      <Route path="/how-it-works" element={<MainLayout><HowItWorks /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/join" element={<MainLayout><Join /></MainLayout>} />
    </Routes>
  );
}

export default AppRoutes;
