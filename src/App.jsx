import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SplashPage from "./pages/SplashPage";

// Public pages
import HomePage from "./pages/HomePage";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AnnouncePage from "./pages/AnnouncePage";
import ProcurementPage from "./pages/ProcurementPage";
import StaffPage from "./pages/StaffPage";
import TravelPage from "./pages/TravelPage";
import ProductsPage from "./pages/ProductsPage";
import ContactPage from "./pages/ContactPage";
import GeneralInfoPage from "./pages/GeneralInfoPage";
import MissionPage from "./pages/MissionPage";
import LocalWisdomPage from "./pages/LocalWisdomPage";
import HistoryPage from "./pages/HistoryPage";
import BudgetPage from "./pages/BudgetPage";
import DevelopmentPlanPage from "./pages/DevelopmentPlanPage";
import ParticipationPage   from './pages/ParticipationPage';
import ActionPlanPage from './pages/ActionPlanPage';
import ProcurementPlanPage from './pages/ProcurementPlanPage';

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminAnnounce from "./pages/admin/AdminAnnounce";
import AdminProcurement from "./pages/admin/AdminProcurement";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminTravel from "./pages/admin/AdminTravel";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProcurementPlan from "./pages/admin/AdminProcurementPlan";
import ItaPage from './pages/ItaPage';
import EServicePage from './pages/EServicePage';
import ComplaintPage from './pages/ComplaintPage';
import DocumentPage from './pages/DocumentPage';
import AdminIta from './pages/admin/AdminIta';
import AdminEService from './pages/admin/AdminEService';
import AdminComplaint from './pages/admin/AdminComplaint';
import AdminDocument from './pages/admin/AdminDocument';

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => !sessionStorage.getItem("splash_seen"),
  );

  function handleEnter() {
    sessionStorage.setItem("splash_seen", "1");
    setShowSplash(false);
  }

  return (
    <>
      {showSplash && <SplashPage onEnter={handleEnter} />}

      <Routes>
        {/* Public site */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:dept" element={<NewsListPage />} />
          <Route path="/news/detail/:id" element={<NewsDetailPage />} />
          <Route path="/announcements" element={<AnnouncePage />} />
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/procurement-plans" element={<ProcurementPlanPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/general-info" element={<GeneralInfoPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/local-wisdom" element={<LocalWisdomPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/development-plan" element={<DevelopmentPlanPage />} />
          <Route path="/participation" element={<ParticipationPage />} />
          <Route path="/action-plan" element={<ActionPlanPage />} />
          <Route path="/ita" element={<ItaPage />} />
          <Route path="/eservice" element={<EServicePage />} />
          <Route path="/complaint" element={<ComplaintPage />} />
          <Route path="/documents" element={<DocumentPage />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="news" element={<AdminNews />} />
          <Route path="announcements" element={<AdminAnnounce />} />
          <Route path="procurement" element={<AdminProcurement />} />
          <Route path="procurement-plans" element={<AdminProcurementPlan />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="travel" element={<AdminTravel />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="ita" element={<AdminIta />} />
          <Route path="eservice" element={<AdminEService />} />
          <Route path="complaints" element={<AdminComplaint />} />
          <Route path="documents" element={<AdminDocument />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
}
