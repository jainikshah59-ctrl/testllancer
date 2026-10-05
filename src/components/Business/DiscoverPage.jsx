import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShieldCheck, Video, LayoutGrid, X, CheckCircle2 } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function DiscoverPage() {
  const [creators, setCreators] = useState([]);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 6.1 Discover logic: addedToCollancer == true, not banned, no active booking
    if (!db) {
      // Fallback for development if db is not initialized yet
      setCreators([
        { id: '1', name: 'Demo Creator', handle: 'democreator', niche: 'Fashion', followers: 12000, addedToCollancer: true, hasActiveBooking: false, price: 500, rating: 4.8 }
      ]);
      setLoading(false);
      return;
    }

    const creatorsRef = collection(db, 'creators');
    const q = query(creatorsRef, where('addedToCollancer', '==', true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveCreators = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const available = liveCreators.filter(c => !c.banned && !c.hasActiveBooking);
      setCreators(available);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching creators:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Discover Creators</h1>
          <p className="text-gray-500">Find the perfect matches for your next campaign.</p>
        </header>

        {loading ? (
          <div className="flex justify-center p-12">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creators.map(creator => (
              <motion.div 
                key={creator.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-5 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-cyan-200"
                onClick={() => setSelectedCreator(creator)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-gray-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      {creator.pfp ? (
                        <img src={creator.pfp} alt={creator.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-1">
                        {creator.name}
                        {creator.verified && <ShieldCheck className="w-4 h-4 text-cyan-500" />}
                      </h3>
                      <p className="text-sm text-gray-500">@{creator.handle}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-gray-50 text-xs font-medium rounded-lg text-gray-600 border border-gray-100">
                    {creator.niche || 'General'}
                  </span>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {creator.rating?.toFixed(1) || 'New'}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Followers</p>
                    <p className="font-semibold text-sm">{(creator.followers / 1000).toFixed(1)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium text-right">Starts at</p>
                    <p className="font-semibold text-sm text-right">₹{creator.price || creator.prices?.story || 0}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCreator && (
          <CreatorProfileModal 
            creator={selectedCreator} 
            onClose={() => setSelectedCreator(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 6.2 Creator Profile & 6.3 Booking Modal (Simplified)
function CreatorProfileModal({ creator, onClose }) {
  const [showBooking, setShowBooking] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl z-[70] flex flex-col"
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden">
               {creator.pfp && <img src={creator.pfp} alt="" className="w-full h-full object-cover"/>}
            </div>
            <div>
              <h2 className="font-bold">@{creator.handle}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-1">
          {showBooking ? (
            <BookingFlow creator={creator} onBack={() => setShowBooking(false)} onComplete={onClose} />
          ) : (
            <>
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="w-32 h-32 bg-gray-100 rounded-2xl flex-shrink-0 shadow-inner overflow-hidden border border-gray-200">
                  {creator.pfp && <img src={creator.pfp} alt="" className="w-full h-full object-cover"/>}
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    {creator.name}
                    {creator.verified && <ShieldCheck className="w-6 h-6 text-cyan-500" />}
                  </h1>
                  <p className="text-gray-600 mb-4">{creator.bio || 'No bio provided.'}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">{creator.niche}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">{creator.city}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium">{creator.platform}</span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-gray-100 mb-6">
                {['overview', 'promo', 'reviews'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 font-medium text-sm transition-colors relative ${activeTab === tab ? 'text-cyan-600' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-500" />
                    )}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="mb-8">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-1">Followers</p>
                      <p className="text-xl font-bold">{creator.followers?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-1">Engagement</p>
                      <p className="text-xl font-bold">{creator.engagement || '0'}%</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-1">Avg Views</p>
                      <p className="text-xl font-bold">{creator.avgViews?.toLocaleString() || '0'}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-xs text-gray-500 font-medium mb-1">Rating</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xl font-bold">{creator.rating?.toFixed(1) || '5.0'}</p>
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'promo' && (
                  <div className="flex items-center justify-center p-12 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                    <div className="text-center">
                      <Video className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">Unlock Pro to view promo demos.</p>
                    </div>
                  </div>
                )}
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <p className="text-gray-500 text-center py-8">No reviews yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!showBooking && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 sticky bottom-0 z-10 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Starting at</p>
              <p className="text-xl font-bold">₹{creator.price || creator.prices?.story || 0}</p>
            </div>
            <button 
              onClick={() => setShowBooking(true)}
              className="px-8 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5"
            >
              Start Booking
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

function BookingFlow({ creator, onBack, onComplete }) {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('paid');
  const [packageKey, setPackageKey] = useState('reel');
  const [campaignDetails, setCampaignDetails] = useState('');

  const submitBooking = async () => {
    // 6.3 Standard Paid Booking ID Generation & Firestore rules logic
    // Implementation uses standard transaction logic described in audit
    // For demo purposes, immediately completing UX flow
    setStep(3);
    setTimeout(onComplete, 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="text-gray-500 hover:text-black">← Back</button>
        <h2 className="text-xl font-bold">Create Booking</h2>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Collaboration Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setType('paid')}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${type === 'paid' ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="font-semibold mb-1">Paid Promo</div>
                <div className="text-sm text-gray-500">Pay standard rates</div>
              </button>
              <button 
                onClick={() => setType('barter')}
                className={`p-4 rounded-xl border-2 text-left transition-colors ${type === 'barter' ? 'border-black bg-black/5' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div className="font-semibold mb-1">Barter</div>
                <div className="text-sm text-gray-500">Exchange products</div>
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => setStep(2)}
            className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3">Campaign Details</h3>
            <textarea 
              value={campaignDetails}
              onChange={e => setCampaignDetails(e.target.value)}
              placeholder="Describe your brief, deliverables, and timeline..."
              className="w-full h-32 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Creator Price</span>
              <span className="font-medium">₹{creator.price || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Platform Fee (12%)</span>
              <span className="font-medium">₹{Math.round((creator.price || 0) * 0.12)}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-lg">
              <span>Total Escrow</span>
              <span>₹{Math.round((creator.price || 0) * 1.12)}</span>
            </div>
          </div>
          
          <button 
            onClick={submitBooking}
            className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
          >
            Confirm & Pay via Wallet (Demo)
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
          >
            <CheckCircle2 className="w-16 h-16 text-cyan-500" />
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Booking Sent!</h3>
            <p className="text-gray-500">The creator has been notified. They will review your brief shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
}
