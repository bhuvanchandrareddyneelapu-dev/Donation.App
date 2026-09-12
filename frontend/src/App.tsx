import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationProvider';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

import { HomePage } from './pages/HomePage';
import { GaneshPage } from './pages/GaneshPage';
import { DasaraPage } from './pages/DasaraPage';
import { TransparencyPage } from './pages/TransparencyPage';
import { CommunityPage } from './pages/CommunityPage';
import { VerifyReceiptPage } from './pages/VerifyReceiptPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminFestivalManagementPage } from './pages/AdminFestivalManagementPage';
import { AdminNotificationManagementPage } from './pages/AdminNotificationManagementPage';
import { DonorHistoryPage } from './pages/DonorHistoryPage';
import { PhotosPage } from './pages/PhotosPage';
import { PublicDonorsPage } from './pages/PublicDonorsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminReportsPage } from './pages/AdminReportsPage';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ganesh" element={<GaneshPage />} />
                  <Route path="/dasara" element={<DasaraPage />} />
                  <Route path="/donate" element={<GaneshPage />} />
                  <Route path="/photos" element={<PhotosPage />} />
                  <Route path="/gallery" element={<PhotosPage />} />
                  <Route path="/festival-photos" element={<PhotosPage />} />
                  <Route path="/transparency" element={<TransparencyPage />} />
                  <Route path="/donors" element={<PublicDonorsPage />} />
                  <Route path="/donor-wall" element={<PublicDonorsPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/verify" element={<VerifyReceiptPage />} />
                  <Route path="/verify-receipt" element={<VerifyReceiptPage />} />
                  <Route path="/verify-receipt/:hash" element={<VerifyReceiptPage />} />
                  <Route path="/verify/:hash" element={<VerifyReceiptPage />} />
                  <Route path="/history" element={<DonorHistoryPage />} />
                  <Route path="/donor/history" element={<DonorHistoryPage />} />
                  <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN', 'VOLUNTEER', 'TREASURER', 'HEAD', 'SUPERVISOR']}><AdminDashboardPage /></ProtectedRoute>} />
                  <Route path="/admin" element={<AdminLoginPage />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN', 'VOLUNTEER', 'TREASURER', 'HEAD', 'SUPERVISOR']}><AdminDashboardPage /></ProtectedRoute>} />
                  <Route path="/admin/donations" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN', 'VOLUNTEER', 'TREASURER', 'HEAD', 'SUPERVISOR']}><AdminDashboardPage /></ProtectedRoute>} />
                  <Route path="/admin/cash-donation" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN', 'VOLUNTEER', 'TREASURER', 'HEAD', 'SUPERVISOR']}><AdminDashboardPage /></ProtectedRoute>} />
                  <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN', 'VOLUNTEER', 'TREASURER', 'HEAD', 'SUPERVISOR']}><AdminReportsPage /></ProtectedRoute>} />
                  <Route path="/admin/festival" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN']}><AdminFestivalManagementPage /></ProtectedRoute>} />
                  <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN']}><AdminNotificationManagementPage /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'FESTIVAL_ADMIN']}><AdminFestivalManagementPage /></ProtectedRoute>} />
                  <Route path="/login" element={<AdminLoginPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
