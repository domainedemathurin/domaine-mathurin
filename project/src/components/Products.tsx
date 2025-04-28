import React, { useEffect, useState } from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  image: string;
  stock: number;
  discount?: number;
  isDiscounted?: boolean;
}

export function Products() {
  const addItem = useCartStore((state) => state.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('products_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Change received!', payload);
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;

      // Add domain to image URLs
      const productsWithFullImageUrls = data?.map(product => ({
        ...product,
        image: `${window.location.origin}${product.image}`
      })) || [];

      setProducts(productsWithFullImageUrls);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600"></div>
      </div>
    );
  }

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Nos Huiles d'Exception</h2>
          <p className="text-xl text-gray-600">Découvrez notre sélection d'huiles d'olive AOP d'Aix-en-Provence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <div className="h-96 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-serif font-semibold text-gray-900">{product.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    {product.isDiscounted ? (
                      <div>
                        <span className="text-2xl font-bold text-red-600">
                          {(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}€
                        </span>
                        <span className="ml-2 text-sm text-gray-500 line-through">
                          {product.price.toFixed(2)}€
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-[#374F29]">{product.price.toFixed(2)}€</span>
                    )}
                    <span className="text-sm text-gray-500">{product.size}</span>
                  </div>
                  {product.stock > 0 ? (
                    <button 
                      className="w-full bg-[#374F29] text-white py-2 px-4 rounded-md hover:bg-[#2a3b20] transition-colors flex items-center justify-center space-x-2"
                      onClick={() => addItem(product)}
                    >
                      <ShoppingCart size={20} />
                      <span>Ajouter au panier</span>
                    </button>
                  ) : (
                    <button 
                      className="w-full bg-gray-300 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed"
                      disabled
                    >
                      Rupture de stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}