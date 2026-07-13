import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { SidebarNavItem } from '../components/navigation/Sidebar';
import { NavbarNotification } from '../components/navigation/Navbar';
import { useRoleContext } from '../context/RoleContext';
import {
  LayoutDashboard,
  Leaf,
  Users,
  Building,
  Trophy,
  Gift,
  FileText,
  Settings as SettingsIcon,
  HelpCircle,
} from 'lucide-react';
import { NotFoundPage, ServerErrorPage } from '../pages/ErrorPages';

// 1. Lazy load feature modules
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'));
const CarbonPage = lazy(() => import('../features/carbon/pages/CarbonPage'));
const CSRPage = lazy(() => import('../features/csr/pages/CSRPage'));
const GovernancePage = lazy(() => import('../features/governance/pages/GovernancePage'));
const ChallengePage = lazy(() => import('../features/challenge/pages/ChallengePage'));
const GamificationPage = lazy(() => import('../features/gamification/pages/GamificationPage'));
const ReportsPage = lazy(() => import('../features/reports/pages/ReportsPage'));
const SettingsPage = lazy(() => import('../features/settings/pages/SettingsPage'));

// 2. Suspense Fallback Loading Skeleton
const RouteLoadingSkeleton = () => (
  <div className="flex-1 p-8 space-y-6 md:space-y-8 animate-pulse">
    <div className="flex justify-between items-center border-b border-border pb-5">
      <div className="space-y-2 w-1/3">
        <div className="h-6 bg-zinc-800 rounded w-2/3" />
        <div className="h-4 bg-zinc-800 rounded w-full" />
      </div>
      <div className="h-9 bg-zinc-800 rounded w-24" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-zinc-900 border border-border rounded-lg" />
      ))}
    </div>
    <div className="h-64 bg-zinc-900 border border-border rounded-lg" />
  </div>
);

import { LoginPage } from '../features/auth/pages/LoginPage';

// Authentication protector guarding dashboard paths
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { profile, loading } = useRoleContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center text-teal-400 text-xs font-mono tracking-wider animate-pulse">
        CONNECTING TO SECURITY SESSION...
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole, userName, logout } = useRoleContext();

  // Sidebar list definitions
  const sidebarItems: SidebarNavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { label: 'Carbon Ledger', path: '/carbon', icon: <Leaf className="h-4.5 w-4.5" /> },
    { label: 'CSR Activities', path: '/csr', icon: <Users className="h-4.5 w-4.5" /> },
    { label: 'Governance', path: '/governance', icon: <Building className="h-4.5 w-4.5" /> },
    { label: 'Challenges', path: '/challenges', icon: <Trophy className="h-4.5 w-4.5" /> },
    { label: 'Gamification', path: '/gamification', icon: <Gift className="h-4.5 w-4.5" /> },
    { label: 'Reports', path: '/reports', icon: <FileText className="h-4.5 w-4.5" /> },
    { label: 'Settings', path: '/settings', icon: <SettingsIcon className="h-4.5 w-4.5" /> },
  ];

  // Simulated notifications feed
  const mockNotifications: NavbarNotification[] = [
    { id: 'n-1', title: 'Critical Compliance Overdue', category: 'compliance', isRead: false },
    { id: 'n-2', title: 'Zero Plastic Challenge Approved', category: 'challenge', isRead: false },
    { id: 'n-3', title: 'Carbon Factor Revised (Grid Electric)', category: 'policy', isRead: true },
  ];

  // Breadcrumbs generation based on active path
  const getBreadcrumbs = (pathname: string): string[] => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return ['Platform'];
    return ['Platform', ...segments];
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Routes>
      {/* Platform Route Wrapper */}
      <Route
        path="/"
        element={
          <ProtectedLayout>
            <AppLayout
              sidebarItems={sidebarItems}
              activePath={location.pathname}
              onNavigate={handleNavigate}
              userName={userName}
              userRole={role}
              onRoleChange={(newRole) => setRole(newRole)}
              notifications={mockNotifications}
              breadcrumbs={getBreadcrumbs(location.pathname)}
              onLogout={logout}
            >
              <Suspense fallback={<RouteLoadingSkeleton />}>
                <OutletWrapper />
              </Suspense>
            </AppLayout>
          </ProtectedLayout>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="carbon" element={<CarbonPage />} />
        <Route path="csr" element={<CSRPage />} />
        <Route path="governance" element={<GovernancePage />} />
        <Route path="challenges" element={<ChallengePage />} />
        <Route path="gamification" element={<GamificationPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="500" element={<ServerErrorPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

// React Router Outlet emulator for nesting lazy-loaded elements inside the AppLayout context
const OutletWrapper = () => {
  const location = useLocation();
  const path = location.pathname.replace(/^\//, '');

  switch (path) {
    case 'dashboard':
      return <DashboardPage />;
    case 'carbon':
      return <CarbonPage />;
    case 'csr':
      return <CSRPage />;
    case 'governance':
      return <GovernancePage />;
    case 'challenges':
      return <ChallengePage />;
    case 'gamification':
      return <GamificationPage />;
    case 'reports':
      return <ReportsPage />;
    case 'settings':
      return <SettingsPage />;
    default:
      return <DashboardPage />;
  }
};
export default AppRoutes;
