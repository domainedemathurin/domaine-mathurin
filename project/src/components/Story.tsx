import React from 'react';
import { Leaf, Sun, Droplets } from 'lucide-react';

export function Story() {
  return (
    <section id="story" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Notre Histoire</h2>
          <p className="text-xl text-gray-600">Une passion pour l'excellence depuis 2020</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Oliviers centenaires"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-semibold text-gray-900">
              Une Histoire de Passion
            </h3>
            <p className="text-gray-600">
              En 2020, lors d'une balade dominicale sur la commune d'Éguilles, Mathieu est tombé sous le charme d'oliveraies abandonnées. 
              Amoureux de la Provence et passionné d'agriculture, il décide de reprendre cette terre pour lui donner un second souffle 
              en relançant l'activité oléicole. Avec Amandine, ils donnent vie au Domaine de Mathurin. Comme le dit Mathieu : 
              "Je m'applique à m'occuper de mes arbres comme je le ferai pour mes enfants. Et ils me le rendront bien !"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-[#374F29]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Savoir-faire Artisanal</h4>
                <p className="text-sm text-gray-600">Méthodes traditionnelles et originelles</p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center mb-4">
                  <Sun className="h-6 w-6 text-[#374F29]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AOP Provence</h4>
                <p className="text-sm text-gray-600">Appellation d'origine protégée</p>
              </div>

              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-olive-100 rounded-full flex items-center justify-center mb-4">
                  <Droplets className="h-6 w-6 text-[#374F29]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Respect Nature</h4>
                <p className="text-sm text-gray-600">Développement durable</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}