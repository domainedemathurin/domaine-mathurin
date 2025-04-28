import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Package, Tag, AlertCircle, RefreshCw } from 'lucide-react';
import { Dialog } from '@headlessui/react';
import { createClient } from '@supabase/supabase-js';
import { syncProductsWithStripe } from '../../utils/stripe';

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
  is_discounted?: boolean;
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    size: '',
    image: '',
    stock: 0
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id');

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncProducts = async () => {
    try {
      setIsSyncing(true);
      await syncProductsWithStripe();
      alert('Produits synchronisés avec succès avec Stripe !');
      fetchProducts(); // Rafraîchir la liste des produits
    } catch (error) {
      console.error('Error syncing products:', error);
      alert('Erreur lors de la synchronisation avec Stripe');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .insert([newProduct]);

      if (error) throw error;

      setIsAddModalOpen(false);
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        size: '',
        image: '',
        stock: 0
      });
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: selectedProduct.name,
          description: selectedProduct.description,
          price: selectedProduct.price,
          size: selectedProduct.size,
          image: selectedProduct.image,
          stock: selectedProduct.stock,
          discount: selectedProduct.discount,
          is_discounted: selectedProduct.is_discounted
        })
        .eq('id', selectedProduct.id);

      if (error) throw error;

      setIsEditModalOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive-600"></div>
      </div>
    );
  }

  const ProductModal = ({ isOpen, onClose, product, isEdit = false }) => (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
          <Dialog.Title className="text-lg font-medium mb-4">
            {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom</label>
              <input
                type="text"
                value={isEdit ? product?.name : newProduct.name}
                onChange={(e) => isEdit 
                  ? setSelectedProduct({...product, name: e.target.value})
                  : setNewProduct({...newProduct, name: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={isEdit ? product?.description : newProduct.description}
                onChange={(e) => isEdit
                  ? setSelectedProduct({...product, description: e.target.value})
                  : setNewProduct({...newProduct, description: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prix (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={isEdit ? product?.price : newProduct.price}
                  onChange={(e) => isEdit
                    ? setSelectedProduct({...product, price: parseFloat(e.target.value)})
                    : setNewProduct({...newProduct, price: parseFloat(e.target.value)})
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Taille</label>
                <input
                  type="text"
                  value={isEdit ? product?.size : newProduct.size}
                  onChange={(e) => isEdit
                    ? setSelectedProduct({...product, size: e.target.value})
                    : setNewProduct({...newProduct, size: e.target.value})
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Image URL</label>
              <input
                type="text"
                value={isEdit ? product?.image : newProduct.image}
                onChange={(e) => isEdit
                  ? setSelectedProduct({...product, image: e.target.value})
                  : setNewProduct({...newProduct, image: e.target.value})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Stock</label>
              <input
                type="number"
                value={isEdit ? product?.stock : newProduct.stock}
                onChange={(e) => isEdit
                  ? setSelectedProduct({...product, stock: parseInt(e.target.value)})
                  : setNewProduct({...newProduct, stock: parseInt(e.target.value)})
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
              />
            </div>

            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Promotion (%)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={product?.discount || 0}
                    onChange={(e) => setSelectedProduct({
                      ...product,
                      discount: parseInt(e.target.value),
                      is_discounted: parseInt(e.target.value) > 0
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-olive-500 focus:ring-olive-500"
                  />
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={product?.is_discounted}
                      onChange={(e) => setSelectedProduct({
                        ...product,
                        is_discounted: e.target.checked,
                        discount: e.target.checked ? (product?.discount || 0) : 0
                      })}
                      className="rounded border-gray-300 text-olive-600 focus:ring-olive-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Activer</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={isEdit ? handleEditProduct : handleAddProduct}
              className="px-4 py-2 bg-olive-600 text-white rounded-md hover:bg-olive-700"
            >
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Gestion des Produits</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleSyncProducts}
            disabled={isSyncing}
            className={`${
              isSyncing ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-4 py-2 rounded-md flex items-center`}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronisation...' : 'Synchroniser avec Stripe'}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-olive-600 text-white px-4 py-2 rounded-md hover:bg-olive-700 flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouveau Produit
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Promotion
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={product.image}
                        alt={product.name}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">{product.size}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {product.is_discounted ? (
                      <>
                        <span className="line-through text-gray-500">
                          {product.price.toFixed(2)}€
                        </span>
                        <span className="ml-2 text-red-600">
                          {(product.price * (1 - (product.discount || 0) / 100)).toFixed(2)}€
                        </span>
                      </>
                    ) : (
                      `${product.price.toFixed(2)}€`
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock === 0 ? (
                        <>
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Rupture
                        </>
                      ) : (
                        <>
                          <Package className="w-4 h-4 mr-1" />
                          {product.stock} unités
                        </>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.is_discounted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Tag className="w-4 h-4 mr-1" />
                      -{product.discount}%
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">Aucune</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setError('');
        }}
        product={newProduct}
        isEdit={false}
      />

      <ProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setError('');
        }}
        product={selectedProduct}
        isEdit={true}
      />
    </div>
  );
}