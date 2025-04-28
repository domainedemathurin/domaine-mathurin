import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { ProductList } from './ProductList';
import { Newsletter } from './Newsletter';
import { Analytics } from './Analytics';
import { Layout } from './Layout';
import { Settings } from './Settings';
import { Customers } from './Customers';
import { Orders } from './Orders';

export function Dashboard() {
  const { currentView } = useAdminStore();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Overview />;
      case 'products':
        return <ProductList />;
      case 'customers':
        return <Customers />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'orders':
        return <Orders />;
      default:
        return <Overview />;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        {renderContent()}
      </div>
    </Layout>
  );
}

function Overview() {
  const { products, subscribers, analytics } = useAdminStore();

  return (
    <>
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Chiffre d'affaires</h3>
          <p className="text-3xl font-bold">2 450€</p>
          <p className="text-sm text-green-600 mt-2">+12.5% vs mois dernier</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Commandes</h3>
          <p className="text-3xl font-bold">45</p>
          <p className="text-sm text-green-600 mt-2">+8.3% vs mois dernier</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Clients</h3>
          <p className="text-3xl font-bold">128</p>
          <p className="text-sm text-green-600 mt-2">+15.2% vs mois dernier</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Taux de conversion</h3>
          <p className="text-3xl font-bold">3.2%</p>
          <p className="text-sm text-red-600 mt-2">-0.8% vs mois dernier</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Dernières commandes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">N° Commande</th>
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-right py-3 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">#2024-001</td>
                  <td className="py-3 px-4">Jean Dupont</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Livré
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">89.90€</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">#2024-002</td>
                  <td className="py-3 px-4">Marie Martin</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      En cours
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">145.50€</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Meilleures ventes</h2>
          <div className="space-y-4">
            {products.slice(0, 3).map((product) => (
              <div key={product.id} className="flex items-center space-x-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.stock} en stock</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{product.price.toFixed(2)}€</p>
                  <p className="text-sm text-gray-500">42 vendus</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}