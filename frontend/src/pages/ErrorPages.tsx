import React from 'react';
import { ShieldAlert, WifiOff, Settings, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

// ==========================================
// 1. 404 Not Found Page
// ==========================================
export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 select-none">
      <span className="text-kpi font-extrabold text-zinc-800 dark:text-zinc-800 tracking-tighter">404</span>
      <h2 className="text-xl font-bold text-zinc-200 mt-2 display-font">Page Not Found</h2>
      <p className="text-xs text-zinc-400 max-w-sm mt-2 leading-relaxed">
        The page you are looking for does not exist or has been relocated under a compliance version audit.
      </p>
      <Button
        variant="outline"
        className="mt-6"
        leftIcon={<Home className="h-4 w-4" />}
        onClick={() => window.location.href = '/'}
      >
        Return Dashboard
      </Button>
    </div>
  );
};

// ==========================================
// 2. 500 Server Error Page
// ==========================================
export const ServerErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 select-none">
      <ShieldAlert className="h-16 w-16 text-red-500 mb-4 animate-pulse" />
      <h2 className="text-xl font-bold text-zinc-200 display-font">System Validation Crash</h2>
      <p className="text-xs text-zinc-400 max-w-sm mt-2 leading-relaxed">
        The platform encountered a database transaction error compiling ESG formulas. The developers have been alerted.
      </p>
      <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
        Reload Application
      </Button>
    </div>
  );
};

// ==========================================
// 3. Offline Connection Page
// ==========================================
export const OfflinePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 select-none">
      <WifiOff className="h-16 w-16 text-zinc-500 mb-4" />
      <h2 className="text-xl font-bold text-zinc-200 display-font">Connection Offline</h2>
      <p className="text-xs text-zinc-400 max-w-sm mt-2 leading-relaxed">
        We detected you are offline. Verify your local network configuration parameters to resume ESG tracking.
      </p>
      <Button variant="outline" className="mt-6" onClick={() => window.location.reload()}>
        Check Status
      </Button>
    </div>
  );
};

// ==========================================
// 4. Platform Maintenance Page
// ==========================================
export const MaintenancePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 select-none">
      <Settings className="h-16 w-16 text-amber-500 mb-4 animate-spin-slow" />
      <h2 className="text-xl font-bold text-zinc-200 display-font">Compliance Upgrades Active</h2>
      <p className="text-xs text-zinc-400 max-w-sm mt-2 leading-relaxed">
        EcoSphere is undergoing scheduled server updates. Real-time logging will be online shortly. Thank you for your patience.
      </p>
    </div>
  );
};
export default NotFoundPage;
