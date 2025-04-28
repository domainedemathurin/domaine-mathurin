import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Products } from './components/Products';
import { Story } from './components/Story';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Dashboard } from './components/admin/Dashboard';
import { Login } from './components/admin/Login';
import { SignIn } from './components/auth/SignIn';
import { SignUp } from './components/auth/SignUp';
import { ResetPassword } from './components/auth/ResetPassword';
import { AccountDashboard } from './components/account/AccountDashboard';
import { AccountOrders } from './components/account/AccountOrders';
import { AccountProfile } from './components/account/AccountProfile';
import { AccountFavorites } from './components/account/AccountFavorites';
import { AccountPayment } from './components/account/AccountPayment';
import { useAuthStore } from './store/authStore';
import { analytics } from './utils/analytics';

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location]);

  return (
    <div className="min-h-screen bg-stone-50">
      <Navigation />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  const isAdmin = useAuthStore((state) => state.isAdmin);
  const user = useAuthStore((state) => state.user);

  return (
    <HashRouter>
      <Routes>
        <Route path="/admin/*" element={
          isAdmin ? <Dashboard /> : <Login />
        } />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/account" element={
          user ? <AccountDashboard /> : <Navigate to="/signin" replace />
        }>
          <Route index element={<AccountOrders />} />
          <Route path="profile" element={<AccountProfile />} />
          <Route path="favorites" element={<AccountFavorites />} />
          <Route path="payment" element={<AccountPayment />} />
        </Route>
        <Route path="/" element={
          <MainLayout>
            <Hero />
            <Products />
            <Story />
            <Contact />
          </MainLayout>
        } />
        <Route path="/products" element={
          <MainLayout>
            <div className="pt-16">
              <Products />
            </div>
          </MainLayout>
        } />
        <Route path="/story" element={
          <MainLayout>
            <div className="pt-16">
              <Story />
            </div>
          </MainLayout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;