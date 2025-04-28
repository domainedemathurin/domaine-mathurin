import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Package, User, Heart, CreditCard, ArrowLeft } from 'lucide-react';

export function AccountDashboard() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  const navigation = [
    { name: 'Mes commandes', href: '/account', icon: Package },
    { name: 'Mes informations', href: '/account/profile', icon: User },
    { name: 'Mes favoris', href: '/account/favorites', icon: Heart },
    { name: 'Mes moyens de paiement', href: '/account/payment', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-gray-900">Mon compte</h1>
            <Link 
              to="/"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Sidebar */}
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      isActive
                        ? 'bg-gray-50 text-[#374F29] border-[#374F29]'
                        : 'text-gray-900 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                    } group border-l-4 px-3 py-2 flex items-center text-sm font-medium`}
                  >
                    <item.icon
                      className={`${
                        isActive ? 'text-[#374F29]' : 'text-gray-400 group-hover:text-gray-500'
                      } flex-shrink-0 -ml-1 mr-3 h-6 w-6`}
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}