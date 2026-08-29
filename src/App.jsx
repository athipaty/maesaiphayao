import { useState, lazy, Suspense, useEffect } from "react";
import ChunkErrorBoundary from "./components/ChunkErrorBoundary";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [pathname])
  return null
}
import Layout from "./components/Layout";
import SplashPage from "./pages/SplashPage";

// Public pages — HomePage is the most common landing route, kept eager so "/" has
// no extra chunk round-trip. Every other public page is lazy loaded, same as admin
// below, so a visitor only downloads code for the page they're actually viewing
// (this is also what keeps heavy libs like leaflet, only used by 3 form pages,
// out of the bundle everyone pays for on first load).
import HomePage from "./pages/HomePage";
const AboutPage            = lazy(() => import("./pages/AboutPage"));
const NewsListPage         = lazy(() => import("./pages/NewsListPage"));
const NewsDetailPage       = lazy(() => import("./pages/NewsDetailPage"));
const AnnouncePage         = lazy(() => import("./pages/AnnouncePage"));
const ActionPlanPage       = lazy(() => import("./pages/ActionPlanPage"));
const BudgetPage           = lazy(() => import("./pages/BudgetPage"));
const ParticipationPage    = lazy(() => import("./pages/ParticipationPage"));
const FinancePage          = lazy(() => import("./pages/FinancePage"));
const ProcurementPage      = lazy(() => import("./pages/ProcurementPage"));
const ProcurementPlanPage  = lazy(() => import("./pages/ProcurementPlanPage"));
const StaffPage            = lazy(() => import("./pages/StaffPage"));
const PublicServicePage    = lazy(() => import("./pages/PublicServicePage"));
const TravelPage           = lazy(() => import("./pages/TravelPage"));
const ProductsPage         = lazy(() => import("./pages/ProductsPage"));
const ElectricalStockPage  = lazy(() => import("./pages/ElectricalStockPage"));
const EServicePage         = lazy(() => import("./pages/EServicePage"));
const ComplaintPage        = lazy(() => import("./pages/ComplaintPage"));
const FeedbackPage         = lazy(() => import("./pages/FeedbackPage"));
const SurveyPage           = lazy(() => import("./pages/SurveyPage"));
const CorruptionPage       = lazy(() => import("./pages/CorruptionPage"));
const ItaPage               = lazy(() => import("./pages/ItaPage"));
const InfoCenterPage       = lazy(() => import("./pages/InfoCenterPage"));
const LawPage               = lazy(() => import("./pages/LawPage"));
const DocumentPage         = lazy(() => import("./pages/DocumentPage"));
const ContactPage          = lazy(() => import("./pages/ContactPage"));
const DynamicPage          = lazy(() => import("./pages/DynamicPage"));

// Admin pages — lazy loaded so each page is its own chunk
import AdminLayout from "./pages/admin/AdminLayout";
const AdminNews           = lazy(() => import("./pages/admin/AdminNews"));
const AdminAnnounce       = lazy(() => import("./pages/admin/AdminAnnounce"));
const AdminProcurement    = lazy(() => import("./pages/admin/AdminProcurement"));
const AdminProcurementPlan = lazy(() => import("./pages/admin/AdminProcurementPlan"));
const AdminStaff          = lazy(() => import("./pages/admin/AdminStaff"));
const AdminTravel         = lazy(() => import("./pages/admin/AdminTravel"));
const AdminVideos         = lazy(() => import("./pages/admin/AdminVideos"));
const AdminProducts       = lazy(() => import("./pages/admin/AdminProducts"));
const AdminIta            = lazy(() => import("./pages/admin/AdminIta"));
const AdminEService       = lazy(() => import("./pages/admin/AdminEService"));
const AdminComplaint      = lazy(() => import("./pages/admin/AdminComplaint"));
const AdminDocument       = lazy(() => import("./pages/admin/AdminDocument"));
const AdminSettings       = lazy(() => import("./pages/admin/AdminSettings"));
const AdminPages          = lazy(() => import("./pages/admin/AdminPages"));
const AdminBanners           = lazy(() => import("./pages/admin/AdminBanners"));
const AdminNotice            = lazy(() => import("./pages/admin/AdminNotice"));
const AdminContactMessages   = lazy(() => import("./pages/admin/AdminContactMessages"));
const AdminFeedback          = lazy(() => import("./pages/admin/AdminFeedback"));
const AdminSurvey            = lazy(() => import("./pages/admin/AdminSurvey"));

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

      <ScrollToTop />
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
          <Route path="/stock/electrical" element={<ElectricalStockPage />} />

          {/* 9. e-Service */}
          <Route path="/eservice" element={<EServicePage />} />

          {/* 10. ร้องเรียน/ร้องทุกข์ */}
          <Route path="/complaint" element={<ComplaintPage />} />

          {/* ช่องทางรับฟังความคิดเห็น / แบบสำรวจความพึงพอใจ */}
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/survey" element={<SurveyPage />} />

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
          <Route path="news"             element={<ChunkErrorBoundary><Suspense fallback={null}><AdminNews /></Suspense></ChunkErrorBoundary>} />
          <Route path="announcements"    element={<ChunkErrorBoundary><Suspense fallback={null}><AdminAnnounce /></Suspense></ChunkErrorBoundary>} />
          <Route path="procurement"      element={<ChunkErrorBoundary><Suspense fallback={null}><AdminProcurement /></Suspense></ChunkErrorBoundary>} />
          <Route path="procurement-plans" element={<ChunkErrorBoundary><Suspense fallback={null}><AdminProcurementPlan /></Suspense></ChunkErrorBoundary>} />
          <Route path="staff"            element={<ChunkErrorBoundary><Suspense fallback={null}><AdminStaff /></Suspense></ChunkErrorBoundary>} />
          <Route path="travel"           element={<ChunkErrorBoundary><Suspense fallback={null}><AdminTravel /></Suspense></ChunkErrorBoundary>} />
          <Route path="videos"           element={<ChunkErrorBoundary><Suspense fallback={null}><AdminVideos /></Suspense></ChunkErrorBoundary>} />
          <Route path="products"         element={<ChunkErrorBoundary><Suspense fallback={null}><AdminProducts /></Suspense></ChunkErrorBoundary>} />
          <Route path="ita"              element={<ChunkErrorBoundary><Suspense fallback={null}><AdminIta /></Suspense></ChunkErrorBoundary>} />
          <Route path="eservice"         element={<ChunkErrorBoundary><Suspense fallback={null}><AdminEService /></Suspense></ChunkErrorBoundary>} />
          <Route path="complaints"       element={<ChunkErrorBoundary><Suspense fallback={null}><AdminComplaint /></Suspense></ChunkErrorBoundary>} />
          <Route path="feedback"         element={<ChunkErrorBoundary><Suspense fallback={null}><AdminFeedback /></Suspense></ChunkErrorBoundary>} />
          <Route path="survey"           element={<ChunkErrorBoundary><Suspense fallback={null}><AdminSurvey /></Suspense></ChunkErrorBoundary>} />
          <Route path="documents"        element={<ChunkErrorBoundary><Suspense fallback={null}><AdminDocument /></Suspense></ChunkErrorBoundary>} />
          <Route path="banners"          element={<ChunkErrorBoundary><Suspense fallback={null}><AdminBanners /></Suspense></ChunkErrorBoundary>} />
          <Route path="settings"         element={<ChunkErrorBoundary><Suspense fallback={null}><AdminSettings /></Suspense></ChunkErrorBoundary>} />
          <Route path="pages"            element={<ChunkErrorBoundary><Suspense fallback={<div className="p-8 text-center text-gray-400 text-sm animate-pulse">กำลังโหลด...</div>}><AdminPages /></Suspense></ChunkErrorBoundary>} />
          <Route path="contact"          element={<ChunkErrorBoundary><Suspense fallback={null}><AdminContactMessages /></Suspense></ChunkErrorBoundary>} />
          <Route path="notices"          element={<ChunkErrorBoundary><Suspense fallback={null}><AdminNotice /></Suspense></ChunkErrorBoundary>} />
        </Route>
      </Routes>
    </>
  );
}
