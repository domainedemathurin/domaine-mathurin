import React, { ReactNode, useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  BarChart, 
  Settings,
  Menu,
  X,
  Store,
  LogOut,
  ShoppingBag
} from 'lucide-react';
import { useAdminStore } from '../../store/adminStore';
import { useAuthStore } from '../../store/authStore';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { currentView, setCurrentView } = useAdminStore();
  const signOut = useAuthStore((state) => state.signOut);

  const navigation = [
    { name: 'Tableau de bord', icon: LayoutDashboard, view: 'dashboard' as const },
    { name: 'Commandes', icon: ShoppingBag, view: 'orders' as const },
    { name: 'Produits', icon: Package, view: 'products' as const },
    { name: 'Clients', icon: Users, view: 'customers' as const },
    { name: 'Statistiques', icon: BarChart, view: 'analytics' as const },
    { name: 'Paramètres', icon: Settings, view: 'settings' as const },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar pour mobile */}
      <div className="lg:hidden">
        <div className="fixed inset-0 flex z-40">
          <div
            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsSidebarOpen(false)}
          />

          <div
            className={`relative flex-1 flex flex-col max-w-xs w-full bg-olive-800 transform transition ease-in-out duration-300 ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <span className="text-white text-xl font-serif">Administration</span>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => setCurrentView(item.view)}
                    className={`w-full group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      currentView === item.view
                        ? 'bg-olive-900 text-white'
                        : 'text-white hover:bg-olive-700'
                    }`}
                  >
                    <item.icon
                      className="mr-4 h-6 w-6"
                      aria-hidden="true"
                    />
                    {item.name}
                  </button>
                ))}
                <a
                  href="/"
                  className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-olive-700"
                >
                  <Store className="mr-4 h-6 w-6" />
                  Voir le site
                </a>
                <button
                  onClick={signOut}
                  className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-white hover:bg-olive-700"
                >
                  <LogOut className="mr-4 h-6 w-6" />
                  Déconnexion
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar pour desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-olive-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-white text-xl font-serif">Administration</span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    currentView === item.view
                      ? 'bg-olive-900 text-white'
                      : 'text-white hover:bg-olive-700'
                  }`}
                >
                  <item.icon
                    className="mr-3 h-6 w-6"
                    aria-hidden="true"
                  />
                  {item.name}
                </button>
              ))}
              <a
                href="/"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-olive-700"
              >
                <Store className="mr-3 h-6 w-6" />
                Voir le site
              </a>
              <button
                onClick={signOut}
                className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-olive-700"
              >
                <LogOut className="mr-3 h-6 w-6" />
                Déconnexion
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-olive-500"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}