import React from 'react';
import { useAdminStore } from '../../store/adminStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export function Analytics() {
  const { analytics } = useAdminStore();

  // Données simulées pour le graphique
  const data = [
    { name: 'Lun', vues: 400, visiteurs: 240 },
    { name: 'Mar', vues: 300, visiteurs: 139 },
    { name: 'Mer', vues: 200, visiteurs: 980 },
    { name: 'Jeu', vues: 278, visiteurs: 390 },
    { name: 'Ven', vues: 189, visiteurs: 480 },
    { name: 'Sam', vues: 239, visiteurs: 380 },
    { name: 'Dim', vues: 349, visiteurs: 430 },
  ];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Pages vues</p>
          <p className="text-2xl font-bold">{analytics.pageViews}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500">Temps moyen</p>
          <p className="text-2xl font-bold">{Math.round(analytics.averageTimeOnSite / 60)}min</p>
        </div>
      </div>

      <div className="w-full h-64">
        <LineChart width={500} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="vues" stroke="#8884d8" />
          <Line type="monotone" dataKey="visiteurs" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
}