
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTopButton from './components/ScrollTopButton';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import PropertiesPage from './pages/Properties';
import RentProperties from './pages/RentProperties';
import SellProperty from './pages/SellProperty';
import PaymentPage from './pages/Payment';
import AIEditor from './pages/AIEditor';
import ServicesPage from './pages/Services';
import CRM from './pages/CRM';
import AdminCRM from './pages/AdminCRM';
import AdminDashboardV2 from './pages/AdminDashboardV2';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ServiceDetail from './pages/ServiceDetail';
import ForgotPasswordPage from './pages/ForgotPassword';
import NotFound from './pages/NotFound';

import ProtectedMasterRoute from './components/ProtectedMasterRoute';
import ProtectedRoute from './components/ProtectedRoute';
import { PropertyProvider, usePropertyDetails } from './contexts/PropertyContext';
import PropertyModal from './components/PropertyModal';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  React.useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
};

const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin/secure');
  const { selectedProperty, closePropertyDetails } = usePropertyDetails();

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <ScrollToTop />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />
          <Route path="/imoveis" element={<PropertiesPage />} />
          <Route path="/aluguel" element={<RentProperties />} />
          <Route path="/vender" element={<ProtectedRoute reason="sell"><SellProperty /></ProtectedRoute>} />
          <Route path="/servicos" element={<ProtectedRoute reason="services"><ServicesPage /></ProtectedRoute>} />
          <Route path="/pagamento/:id" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
          <Route path="/editor" element={<ProtectedRoute reason="services"><AIEditor /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
          <Route path="/admin/secure/dashboard" element={
            <ProtectedMasterRoute>
              <AdminDashboardV2 />
            </ProtectedMasterRoute>
          } />
          <Route path="/termos" element={<TermsOfUse />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/servico/:id" element={<ProtectedRoute reason="services"><ServiceDetail /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!isAdminRoute && <Footer />}
      <ScrollTopButton />

      {selectedProperty && (
        <PropertyModal
          property={selectedProperty}
          onClose={closePropertyDetails}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PropertyProvider>
      <Router>
        <AppContent />
      </Router>
    </PropertyProvider>
  );
};

export default App;
