import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import SplashPage from "./pages/SplashPage";

// Public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AnnouncePage from "./pages/AnnouncePage";
import DevelopmentPlanPage from "./pages/DevelopmentPlanPage";
import ActionPlanPage from "./pages/ActionPlanPage";
import BudgetPage from "./pages/BudgetPage";
import ParticipationPage from "./pages/ParticipationPage";
import FinancePage from "./pages/FinancePage";
import ProcurementPage from "./pages/ProcurementPage";
import ProcurementPlanPage from "./pages/ProcurementPlanPage";
import StaffPage from "./pages/StaffPage";
import PublicServicePage from "./pages/PublicServicePage";
import TravelPage from "./pages/TravelPage";
import ProductsPage from "./pages/ProductsPage";
import EServicePage from "./pages/EServicePage";
import ComplaintPage from "./pages/ComplaintPage";
import CorruptionPage from "./pages/CorruptionPage";
import ItaPage from "./pages/ItaPage";
import InfoCenterPage from "./pages/InfoCenterPage";
import LawPage from "./pages/LawPage";
import DocumentPage from "./pages/DocumentPage";
import ContactPage from "./pages/ContactPage";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminNews from "./pages/admin/AdminNews";
import AdminAnnounce from "./pages/admin/AdminAnnounce";
import AdminProcurement from "./pages/admin/AdminProcurement";
import AdminProcurementPlan from "./pages/admin/AdminProcurementPlan";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminTravel from "./pages/admin/AdminTravel";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminIta from "./pages/admin/AdminIta";
import AdminEService from "./pages/admin/AdminEService";
import AdminComplaint from "./pages/admin/AdminComplaint";
import AdminDocument from "./pages/admin/AdminDocument";
import AdminSettings from "./pages/admin/AdminSettings";

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

          {/* 2. เกี่ยวกับ อบต. */}
          <Route path="/about" element={<AboutPage />} />

          {/* 3. ข่าวสาร */}
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:dept" element={<NewsListPage />} />
          <Route path="/news/detail/:id" element={<NewsDetailPage />} />
          <Route path="/announcements" element={<AnnouncePage />} />

          {/* 4. แผนงาน/งบประมาณ */}
          <Route path="/development-plan" element={<DevelopmentPlanPage />} />
          <Route path="/action-plan" element={<ActionPlanPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/participation" element={<ParticipationPage />} />

          {/* 5. การเงิน/การคลัง */}
          <Route path="/finance" element={<FinancePage />} />

          {/* 6. จัดซื้อจัดจ้าง */}
          <Route path="/procurement" element={<ProcurementPage />} />
          <Route path="/procurement-plans" element={<ProcurementPlanPage />} />

          {/* 7. บุคลากร/กิจการสภา */}
          <Route path="/staff" element={<StaffPage />} />

          {/* 8. บริการสาธารณะ */}
          <Route path="/public-service" element={<PublicServicePage />} />
          <Route path="/travel" element={<TravelPage />} />
          <Route path="/products" element={<ProductsPage />} />

          {/* 9. e-Service */}
          <Route path="/eservice" element={<EServicePage />} />

          {/* 10. ร้องเรียน/ร้องทุกข์ */}
          <Route path="/complaint" element={<ComplaintPage />} />

          {/* 11. ร้องเรียนทุจริต */}
          <Route path="/corruption" element={<CorruptionPage />} />

          {/* 12. ITA/OIT */}
          <Route path="/ita" element={<ItaPage />} />

          {/* 13. ศูนย์ข้อมูลข่าวสาร */}
          <Route path="/info-center" element={<InfoCenterPage />} />

          {/* 14. กฎหมาย/ข้อบัญญัติ */}
          <Route path="/laws" element={<LawPage />} />

          {/* คลังเอกสาร (sub-page) */}
          <Route path="/documents" element={<DocumentPage />} />

          {/* 15. ติดต่อเรา */}
          <Route path="/contact" element={<ContactPage />} />
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
