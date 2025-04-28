import React, { useState } from 'react';
import { Menu, X, ShoppingCart, User, LogOut } from 'lucide-react';
import { Cart } from './Cart';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false); // Fermer le menu mobile si ouvert
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-serif font-semibold text-[#374F29]">
              Domaine de Mathurin
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-[#374F29]">Nos Produits</Link>
            <Link to="/story" className="text-gray-700 hover:text-[#374F29]">Notre Histoire</Link>
            <a href="#contact" className="text-gray-700 hover:text-[#374F29]">Contact</a>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/account" 
                  className="flex items-center space-x-1 text-gray-700 hover:text-[#374F29]"
                >
                  <User size={20} />
                  <span>Mon Compte</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 text-gray-700 hover:text-[#374F29]"
                >
                  <LogOut size={20} />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/signin" 
                className="flex items-center space-x-1 text-gray-700 hover:text-[#374F29]"
              >
                <User size={20} />
                <span>Connexion</span>
              </Link>
            )}
            <button 
              className="flex items-center space-x-1 bg-[#374F29] text-white px-4 py-2 rounded-md hover:bg-[#2a3b20]"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={20} />
              <span>Panier</span>
              {itemCount > 0 && (
                <span className="ml-1 bg-white text-[#374F29] px-2 py-0.5 rounded-full text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/products" className="block px-3 py-2 text-gray-700">Nos Produits</Link>
            <Link to="/story" className="block px-3 py-2 text-gray-700">Notre Histoire</Link>
            <a href="#contact" className="block px-3 py-2 text-gray-700">Contact</a>
            {user ? (
              <>
                <Link to="/account" className="block px-3 py-2 text-gray-700">Mon Compte</Link>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-gray-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/signin" className="block px-3 py-2 text-gray-700">Connexion</Link>
            )}
            <button 
              className="flex items-center space-x-1 w-full bg-[#374F29] text-white px-3 py-2 rounded-md"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={20} />
              <span>Panier</span>
              {itemCount > 0 && (
                <span className="ml-1 bg-white text-[#374F29] px-2 py-0.5 rounded-full text-xs font-bold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
}