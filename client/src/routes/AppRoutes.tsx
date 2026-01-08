import { Routes, Route } from "react-router-dom";
import ScrollToTop from "../components/scrolltop/Scrolltop";

import Home from "../pages/common/Home";
import Services from "../pages/common/Services";
// import Category from "../pages/Category";
// import ServiceDetails from "../pages/ServiceDetails";
import HowItWorks from "../pages/common/Howitworks";
import About from "../pages/common/About";
import Contact from "../pages/common/Contact";
import Join from "../pages/common/Join";
import MainLayout from "../components/layout/MainLayout";
import Dashboardlayout from "../components/layout/dashblayout/Dashboardlayout";
import Loginpage from "../pages/common/Loginpage";
import Signup from "../pages/common/Signup";
import Serviceproviderdashboard from "../pages/service-provider/Serviceproviderdashboard";
import RoleProtectedRoute from "../components/protected/Protectedroutes";
import AdminDashboard from "../pages/Adminuser/Adminuserdashboard";
import Unauthorized from "../pages/common/Unauthorized";
function AppRoutes() {
  return (
    <>
      <ScrollToTop /> {/* Add this component */}
      <Routes>
        {/* Home page */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />

        <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
        {/* <Route path="/services/:category" element={<MainLayout><Category /></MainLayout>} /> */}

        {/* Dynamic service page */}
        {/* <Route path="/services/:category/:service" element={<MainLayout><ServiceDetails /></MainLayout>} /> */}

        {/* Other static pages */}
        <Route path="/how-it-works" element={<MainLayout><HowItWorks /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/join" element={<MainLayout><Join/></MainLayout>} />
        <Route path="/login" element={<Dashboardlayout><Loginpage/></Dashboardlayout>} />
        <Route path="/service-provider/create-account" element={<Dashboardlayout><Signup/></Dashboardlayout>} />
        <Route path="/unauthorized" element={<Unauthorized/>} />
        
        
           {/* Service Provider */}
        <Route
          path="/service-provider/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["service_provider"]}>
              <Dashboardlayout>
              <Serviceproviderdashboard />
              </Dashboardlayout>
            </RoleProtectedRoute>
            
          }
        />



        
        {/* <Route
          path="/client/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["client"]}>
              <ClientDashboard />
            </RoleProtectedRoute>
          }
        /> */}

        
        <Route
          path="/admin/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <Dashboardlayout>
              <AdminDashboard />
              </Dashboardlayout>
            </RoleProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default AppRoutes;