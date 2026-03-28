import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import WorkExperience from "./pages/WorkExperience";
import PaymentSuccess from "./pages/PaymentSuccess";
import EbooksPage from "./pages/EbooksPage";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/Dashboard";
import Reviews from "./pages/admin/Reviews";
import Services from "./pages/admin/Services";
import Blog from "./pages/admin/Blog";
import EbooksAdmin from "./pages/admin/Ebooks";
import Settings from "./pages/admin/Settings";
import AuditLog from "./pages/admin/AuditLog";
import AdminUsers from "./pages/admin/AdminUsers";
import Users from "./pages/admin/Users";
import FormSubmissions from "./pages/admin/FormSubmissions";
import Reports from "./pages/admin/Reports";
import JobPostings from "./pages/admin/JobPostings";
import SuperAdmin from "./pages/admin/SuperAdmin";
import BookCall from "./pages/BookCall";
import OrderService from "./pages/OrderService";
import Partnership from "./pages/Partnership";
import Jobs from "./pages/Jobs";
import WebsiteBuildingServices from "./pages/WebsiteBuildingServices";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { usePageTracking } from "./hooks/usePageTracking";

const queryClient = new QueryClient();

const PageTracker = () => {
  usePageTracking();
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/work-experience" element={<WorkExperience />} />
          <Route path="/ebooks" element={<EbooksPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/book-call" element={<BookCall />} />
          <Route path="/order-service" element={<OrderService />} />
          <Route path="/partnership" element={<Partnership />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/website-building-services" element={<WebsiteBuildingServices />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/super" element={<SuperAdmin />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/submissions" element={<FormSubmissions />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/jobs" element={<JobPostings />} />
          <Route path="/admin/users-management" element={<AdminUsers />} />
          <Route path="/admin/reviews" element={<Reviews />} />
          <Route path="/admin/services" element={<Services />} />
          <Route path="/admin/blog" element={<Blog />} />
          <Route path="/admin/ebooks" element={<EbooksAdmin />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="/admin/audit" element={<AuditLog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
