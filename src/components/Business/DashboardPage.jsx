import React, { useState, useEffect } from 'react';
import { Activity, Clock, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    pendingDeliveries: 0,
    completedCampaigns: 0,
    totalSpent: 0
  });

  useEffect(() => {
    if (!db) {
      setStats({ activeCampaigns: 3, pendingDeliveries: 2, completedCampaigns: 15, totalSpent: 125000 });
      return;
    }

    const q = query(collection(db, 'bookings'), where('bizId', '==', 'demo_biz'));
    const unsub = onSnapshot(q, snap => {
      let active = 0, pending = 0, completed = 0, spent = 0;
      snap.docs.forEach(doc => {
        const d = doc.data();
        if (d.status === 'Active') active++;
        if (d.status === 'PendingCompletion') pending++;
        if (d.status === 'Completed') {
          completed++;
          spent += d.amount || 0;
        }
      });
      setStats({ activeCampaigns: active, pendingDeliveries: pending, completedCampaigns: completed, totalSpent: spent });
    });
    return unsub;
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Business Dashboard</h1>
        <p className="text-gray-500">Overview of your active campaigns and escrow metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass p-6 rounded-3xl border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Activity className="w-6 h-6"/></div>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1">{stats.activeCampaigns}</p>
            <p className="text-gray-500 text-sm font-medium">Active Campaigns</p>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-50 text-yellow-600 rounded-2xl"><Clock className="w-6 h-6"/></div>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1">{stats.pendingDeliveries}</p>
            <p className="text-gray-500 text-sm font-medium">In QC Review</p>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl border border-gray-100 flex flex-col justify-between hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><CheckCircle2 className="w-6 h-6"/></div>
          </div>
          <div>
            <p className="text-4xl font-bold mb-1">{stats.completedCampaigns}</p>
            <p className="text-gray-500 text-sm font-medium">Completed</p>
          </div>
        </div>

        <div className="bg-black text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-transform relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ArrowUpRight className="w-24 h-24"/>
          </div>
          <div className="relative z-10 mb-4">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl inline-block">
              <span className="text-xl font-bold">₹</span>
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-3xl font-bold mb-1">₹{(stats.totalSpent / 1000).toFixed(1)}k</p>
            <p className="text-gray-400 text-sm font-medium">Total Spent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
