import { useState, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import SplashPage from "./pages/SplashPage";

// Public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import AnnouncePage from "./pages/AnnouncePage";
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
import DynamicPage from "./pages/DynamicPage";

// Admin pages — lazy loaded so each page is its own chunk
import AdminLayout from "./pages/admin/AdminLayout";
const AdminNews           = lazy(() => import("./pages/admin/AdminNews"));
const AdminAnnounce       = lazy(() => import("./pages/admin/AdminAnnounce"));
const AdminProcurement    = lazy(() => import("./pages/admin/AdminProcurement"));
const AdminProcurementPlan = lazy(() => import("./pages/admin/AdminProcurementPlan"));
const AdminStaff          = lazy(() => import("./pages/admin/AdminStaff"));
const AdminTravel         = lazy(() => import("./pages/admin/AdminTravel"));
const AdminProducts       = lazy(() => import("./pages/admin/AdminProducts"));
const AdminIta            = lazy(() => import("./pages/admin/AdminIta"));
const AdminEService       = lazy(() => import("./pages/admin/AdminEService"));
const AdminComplaint      = lazy(() => import("./pages/admin/AdminComplaint"));
const AdminDocument       = lazy(() => import("./pages/admin/AdminDocument"));
const AdminSettings       = lazy(() => import("./pages/admin/AdminSettings"));
const AdminPages          = lazy(() => import("./pages/admin/AdminPages"));
const AdminBanners        = lazy(() => import("./pages/admin/AdminBanners"));

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

          {/* หน้าแบบ dynamic (สร้างจาก admin) */}
          <Route path="/page/:slug" element={<DynamicPage />} />
        </Route>

        {/* Admin panel */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/pages" replace />} />
          <Route path="news"             element={<Suspense fallback={null}><AdminNews /></Suspense>} />
          <Route path="announcements"    element={<Suspense fallback={null}><AdminAnnounce /></Suspense>} />
          <Route path="procurement"      element={<Suspense fallback={null}><AdminProcurement /></Suspense>} />
          <Route path="procurement-plans" element={<Suspense fallback={null}><AdminProcurementPlan /></Suspense>} />
          <Route path="staff"            element={<Suspense fallback={null}><AdminStaff /></Suspense>} />
          <Route path="travel"           element={<Suspense fallback={null}><AdminTravel /></Suspense>} />
          <Route path="products"         element={<Suspense fallback={null}><AdminProducts /></Suspense>} />
          <Route path="ita"              element={<Suspense fallback={null}><AdminIta /></Suspense>} />
          <Route path="eservice"         element={<Suspense fallback={null}><AdminEService /></Suspense>} />
          <Route path="complaints"       element={<Suspense fallback={null}><AdminComplaint /></Suspense>} />
          <Route path="documents"        element={<Suspense fallback={null}><AdminDocument /></Suspense>} />
          <Route path="banners"          element={<Suspense fallback={null}><AdminBanners /></Suspense>} />
          <Route path="settings"         element={<Suspense fallback={null}><AdminSettings /></Suspense>} />
          <Route path="pages"            element={<Suspense fallback={<div className="p-8 text-center text-gray-400 text-sm animate-pulse">กำลังโหลด...</div>}><AdminPages /></Suspense>} />
        </Route>
      </Routes>
    </>
  );
}
