import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

export function Contact() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    async function fetchContactInfo() {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching contact info:', error);
        return;
      }

      if (data) {
        setContactInfo(data);
      }
    }

    fetchContactInfo();
  }, []);

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Contactez-nous</h2>
          <p className="text-xl text-gray-600">Nous sommes à votre disposition pour toute question</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#374F29] bg-opacity-10 rounded-full flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-[#374F29]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notre Domaine</h3>
                <p className="text-gray-600">{contactInfo.address}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#374F29] bg-opacity-10 rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-[#374F29]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléphone</h3>
                <p className="text-gray-600">{contactInfo.phone}</p>
                <p className="text-sm text-gray-500 mt-1">Du lundi au vendredi, 9h-18h</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-[#374F29] bg-opacity-10 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-[#374F29]" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">{contactInfo.email}</p>
                <p className="text-sm text-gray-500 mt-1">Nous répondons sous 24h</p>
              </div>
            </div>
          </div>

          <form className="space-y-6 bg-gray-50 p-8 rounded-lg">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#374F29] focus:border-[#374F29]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#374F29] focus:border-[#374F29]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#374F29] focus:border-[#374F29]"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#374F29] text-white py-2 px-4 rounded-md hover:bg-[#2a3b20] transition-colors"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}