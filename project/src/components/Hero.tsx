import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

export function Hero() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = '/products/hero.jpg';
    img.onload = () => setIsImageLoaded(true);
  }, []);

  return (
    <div className="relative h-screen">
      <div 
        className={`absolute inset-0 bg-center bg-no-repeat transition-opacity duration-1000 ${
          isImageLoaded ? 'opacity-80' : 'opacity-0'
        }`}
        style={{
          backgroundImage: 'url("/products/hero.jpg")',
          backgroundSize: 'cover',
          backgroundColor: '#000',
        }}
      />
      
      {/* Overlay gradient pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      
      {!isImageLoaded && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#374F29] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 drop-shadow-lg">
            L'excellence de l'huile d'olive<br />depuis 2020
          </h1>
          <p className="text-xl mb-8 max-w-2xl drop-shadow-md">
            Découvrez notre gamme d'huiles d'olive AOP, produites dans le respect des traditions 
            et de l'environnement au cœur de la Provence.
          </p>
          <a 
            href="#products"
            className="inline-flex items-center space-x-2 bg-[#374F29] text-white px-6 py-3 rounded-md text-lg hover:bg-[#2a3b20] transition-colors shadow-lg"
          >
            <span>Découvrir nos produits</span>
            <ArrowRight size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}