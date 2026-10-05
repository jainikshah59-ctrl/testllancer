import React, { useState, useEffect } from 'react';
import { Activity, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    activeBookings: 0,
    totalEarnings: 0,
    pendingClearance: 0,
    profileViews: 1248 // Static for demo
  });

  useEffect(() => {
    if (!db) {
      setStats({ activeBookings: 3, totalEarnings: 42500, pendingClearance: 12000, profileViews: 1248 });
      return;
    }

    const q = query(collection(db, 'bookings'), where('creatorId', '==', 'demo_creator'));
    const unsub = onSnapshot(q, snap => {
      let active = 0, earnings = 0, pending = 0;
      snap.docs.forEach(doc => {
        const d = doc.data();
        const share = d.creatorPrice ? d.creatorPrice * 0.95 : (d.amount || 0) * 0.95;
        if (d.status === 'Active') active++;
        if (d.status === 'Completed') earnings += share;
        if (d.status === 'PendingCompletion') pending += share;
      });
      setStats(prev => ({ ...prev, activeBookings: active, totalEarnings: earnings, pendingClearance: pending }));
    });
    return unsub;
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-black to-gray-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={64} /></div>
          <h3 className="text-gray-400 font-medium mb-1">Active Bookings</h3>
          <p className="text-4xl font-bold text-white mb-4">{stats.activeBookings}</p>
          <div className="text-sm text-cyan-400 flex items-center gap-1"><TrendingUp size={14} /> Tracking in real-time</div>
        </div>
        
        <div className="glass rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 font-medium mb-1">Total Earnings</h3>
          <p className="text-4xl font-bold text-gray-900 mb-4">₹{stats.totalEarnings.toLocaleString()}</p>
          <div className="text-sm text-yellow-600 font-medium">₹{stats.pendingClearance.toLocaleString()} in QC review</div>
        </div>
        
        <div className="glass rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <h3 className="text-gray-500 font-medium mb-1">Profile Views</h3>
          <p className="text-4xl font-bold text-gray-900 mb-4">{stats.profileViews.toLocaleString()}</p>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-6 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Action Required</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">A</div>
                <div>
                  <p className="font-medium text-gray-900">Finish Profile Setup</p>
                  <p className="text-xs text-gray-500">Add a profile picture</p>
                </div>
              </div>
              <button className="text-sm font-medium text-cyan-600">Action</button>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-3xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Profile Completeness</h2>
            <span className="text-cyan-600 font-bold">85%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
            <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <ul className="space-y-3">
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle size={16} className="text-green-500" /> Basic Information
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle size={16} className="text-green-500" /> Connected Accounts
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div> Upload Promo Demo
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
