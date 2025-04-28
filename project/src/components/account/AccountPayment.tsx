import React from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

export function AccountPayment() {
  // Exemple de cartes enregistrées (à remplacer par les données réelles)
  const savedCards = [
    {
      id: 1,
      last4: '4242',
      brand: 'Visa',
      expMonth: 12,
      expYear: 2024
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Mes moyens de paiement
        </h3>

        <div className="space-y-4">
          {savedCards.map((card) => (
            <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {card.brand} •••• {card.last4}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expire {card.expMonth}/{card.expYear}
                  </p>
                </div>
              </div>
              <button className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-colors">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <Plus className="h-5 w-5 mr-2" />
            Ajouter une carte
          </button>
        </div>
      </div>
    </div>
  );
}