import React, { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';

export function Orders() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const orders = [
    {
      id: '2024-001',
      customer: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      date: '2024-03-15',
      status: 'completed',
      total: 89.90,
      items: [
        { name: "Huile d'Olive AOP", quantity: 2, price: 24.95 },
        { name: "Huile d'Olive Basilic", quantity: 1, price: 40.00 }
      ]
    },
    {
      id: '2024-002',
      customer: 'Marie Martin',
      email: 'marie.martin@email.com',
      date: '2024-03-14',
      status: 'processing',
      total: 145.50,
      items: [
        { name: "Huile d'Olive Noire", quantity: 3, price: 48.50 }
      ]
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Commandes</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une commande..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-olive-500 focus:border-olive-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Filter className="h-5 w-5 mr-2" />
            Filtrer
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
            <Download className="h-5 w-5 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-md ${
                selectedStatus === 'all'
                  ? 'bg-olive-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedStatus('all')}
            >
              Toutes
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                selectedStatus === 'processing'
                  ? 'bg-olive-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedStatus('processing')}
            >
              En cours
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                selectedStatus === 'completed'
                  ? 'bg-olive-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedStatus('completed')}
            >
              Terminées
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items.length} articles</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status === 'completed' ? 'Terminée' : 'En cours'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total.toFixed(2)}€
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-olive-600 hover:text-olive-900">
                        Voir détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}