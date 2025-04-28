import React from 'react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold">Domaine de Mathurin</h3>
            <p className="text-gray-400 text-sm">
              Production artisanale d'huile d'olive AOP de Provence depuis 2020.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/profile.php?id=61551123399328" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#374F29] transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/domainedemathurin/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#374F29] transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://www.linkedin.com/company/101558067" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#374F29] transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#products" className="text-gray-400 hover:text-[#374F29]">Nos Produits</a></li>
              <li><a href="#story" className="text-gray-400 hover:text-[#374F29]">Notre Histoire</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-[#374F29]">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#374F29]">Boutique</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Informations</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-[#374F29]">Conditions générales</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#374F29]">Politique de confidentialité</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#374F29]">Mentions légales</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#374F29]">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">
              Inscrivez-vous pour recevoir nos actualités et offres exclusives.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-[#374F29] focus:border-[#374F29]"
              />
              <button
                type="submit"
                className="w-full bg-[#374F29] text-white py-2 px-4 rounded-md hover:bg-[#2a3b20] transition-colors"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Domaine de Mathurin. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}