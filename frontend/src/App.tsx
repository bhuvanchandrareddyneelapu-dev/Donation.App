import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
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
import { DonorHistoryPage } from './pages/DonorHistoryPage';

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
        <Router>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/ganesh" element={<GaneshPage />} />
                <Route path="/dasara" element={<DasaraPage />} />
                <Route path="/transparency" element={<TransparencyPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/verify" element={<VerifyReceiptPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/admin" element={<AdminLoginPage />} />
                <Route path="/login" element={<AdminLoginPage />} />
                <Route path="/donor/history" element={<DonorHistoryPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
