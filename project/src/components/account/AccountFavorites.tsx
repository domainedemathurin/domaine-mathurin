import React from 'react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export function AccountFavorites() {
  const addItem = useCartStore((state) => state.addItem);
  
  // Exemple de favoris (à remplacer par les données réelles)
  const favorites = [
    {
      id: 1,
      name: "Huile d'Olive AOP Vierge Extra",
      price: 15.00,
      size: "500ml",
      image: "/products/huile-aop.png"
    },
    {
      id: 2,
      name: "Huile d'Olive Fruitée Noire",
      price: 10.00,
      size: "500ml",
      image: "/products/huile-noire.png"
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Mes favoris
        </h3>

        {favorites.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Vous n'avez pas encore de produits favoris
          </p>
        ) : (
          <div className="space-y-4">
            {favorites.map((product) => (
              <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.size}</p>
                    <p className="text-sm font-medium text-[#374F29]">{product.price.toFixed(2)}€</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => addItem(product)}
                    className="p-2 text-[#374F29] hover:bg-[#374F29] hover:text-white rounded-full transition-colors"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-600 hover:text-white rounded-full transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}