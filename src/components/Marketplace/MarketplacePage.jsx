import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Send, Clock, IndianRupee } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function MarketplacePage({ isCreator }) {
  const [briefs, setBriefs] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setBriefs([
        { id: '1', campaignName: 'Tech Review Video', bizName: 'TechCorp', budget: 15000, desc: 'Review our new smartwatch.', platforms: ['YouTube'], status: 'open', createdAt: new Date() }
      ]);
      setLoading(false);
      return;
    }

    const unsub = onSnapshot(query(collection(db, 'marketplaceBriefs')), snap => {
      const b = snap.docs.map(d => ({id: d.id, ...d.data()}));
      setBriefs(b.filter(x => x.status === 'open'));
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Requirements Marketplace</h1>
          <p className="text-gray-500">{isCreator ? 'Find campaigns to pitch for.' : 'Post your requirements and get offers.'}</p>
        </div>
        {!isCreator && (
          <button onClick={() => setShowCreate(true)} className="px-5 py-2.5 bg-black text-white rounded-xl font-medium flex items-center gap-2 hover:bg-gray-800">
            <Plus className="w-5 h-5"/> Post Brief
          </button>
        )}
      </div>

      {loading ? (
         <div className="flex justify-center p-12"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map(brief => (
            <div key={brief.id} className="glass p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{brief.campaignName}</h3>
                  <p className="text-sm text-gray-500">by {brief.bizName}</p>
                </div>
                <div className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded flex items-center">
                  <IndianRupee className="w-3 h-3"/> {brief.budget}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">{brief.desc}</p>
              <div className="flex gap-2 mb-6">
                {(brief.platforms || []).map(p => <span key={p} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">{p}</span>)}
              </div>
              {isCreator && (
                <button className="w-full py-2 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors">
                  <Send className="w-4 h-4"/> Submit Pitch
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
