import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, CheckCircle2, XCircle, Clock, Send, PlayCircle, ExternalLink } from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 7.6 Creator bookings logic
    // Using a demo creator ID for scaffolding
    const creatorId = 'demo_creator';
    
    if (!db) {
      setBookings([
        { id: '1', bizName: 'Nike', campaignName: 'Summer Run', status: 'Pending', amount: 15000, deadline: '2026-11-01', fromMarketplace: false },
        { id: '2', bizName: 'TechCorp', campaignName: 'Gadget Review', status: 'Active', amount: 8000, deadline: '2026-10-15', fromMarketplace: true }
      ]);
      setLoading(false);
      return;
    }

    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, where('creatorId', '==', creatorId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveBookings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort newest first
      liveBookings.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
      setBookings(liveBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredBookings = filter === 'All' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Bookings</h1>
        <p className="text-gray-500">Manage your campaign requests and active collaborations.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        {['All', 'Pending', 'Active', 'PendingCompletion', 'Completed', 'Cancelled'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.replace('PendingCompletion', 'In Review')}
          </button>
        ))}
      </div>

      {loading ? (
         <div className="flex justify-center p-12">
           <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
         </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-100">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900">No {filter !== 'All' ? filter.toLowerCase() : ''} bookings</h3>
              <p className="text-gray-500">When you receive requests, they'll appear here.</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <motion.div 
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedBooking(booking)}
                className="glass rounded-2xl p-5 border border-gray-100 hover:border-cyan-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                      booking.status === 'PendingCompletion' ? 'bg-purple-100 text-purple-700' :
                      booking.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                    {booking.fromMarketplace && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 text-gray-600">Marketplace</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{booking.campaignName}</h3>
                  <p className="text-sm text-gray-500">by {booking.bizName}</p>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-500 mb-1">Total Payout</p>
                  <p className="text-2xl font-bold text-gray-900">₹{booking.amount?.toLocaleString()}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedBooking && (
          <BookingDetailModal 
            booking={selectedBooking} 
            onClose={() => setSelectedBooking(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// 7.7 Booking Detail
function BookingDetailModal({ booking, onClose }) {
  const [deliveryLink, setDeliveryLink] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAccept = async () => {
    setActionLoading(true);
    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', booking.id), {
          status: 'Active',
          acceptedAt: new Date(),
          acceptedByCreator: true
        });
      } catch(e) { console.error(e); }
    }
    setActionLoading(false);
    onClose();
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    setActionLoading(true);
    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', booking.id), {
          status: 'Cancelled',
          rejectionReason: rejectReason,
          rejectedAt: new Date(),
          rejectedByCreator: true
        });
        // Wallet refunds are handled via Cloud Functions or transactional logic
      } catch(e) { console.error(e); }
    }
    setActionLoading(false);
    onClose();
  };

  const handleDeliver = async () => {
    if (!deliveryLink) return;
    setActionLoading(true);
    if (db) {
      try {
        await updateDoc(doc(db, 'bookings', booking.id), {
          status: 'PendingCompletion',
          driveLink: deliveryLink,
          deliverySubmittedAt: new Date()
        });
      } catch(e) { console.error(e); }
    }
    setActionLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl z-[70] flex flex-col"
      >
        <div className="sticky top-0 bg-white/90 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <h2 className="font-bold text-xl">Booking Details</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <XCircle className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8 flex-1">
          {/* Header section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm font-semibold">{booking.status}</span>
              <span className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-4 h-4"/> Deadline: {booking.deadline}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{booking.campaignName}</h1>
            <p className="text-gray-600 font-medium">Business: {booking.bizName}</p>
          </div>

          {/* Payment breakdown */}
          <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
            <h3 className="font-semibold mb-3">Financials</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Total Payout</span>
              <span className="text-xl font-bold">₹{booking.amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Escrow Status</span>
              <span className="font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">Securely Held</span>
            </div>
          </div>

          {/* Brief */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Campaign Brief</h3>
            <div className="p-4 bg-gray-50 rounded-xl text-gray-700 whitespace-pre-wrap">
              {booking.brief || "No detailed brief provided. Discuss with the brand directly."}
            </div>
          </div>

          {/* Action Area */}
          {booking.status === 'Pending' && !isRejecting && (
            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button 
                onClick={handleAccept}
                disabled={actionLoading}
                className="flex-1 py-3 bg-black text-white rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors"
              >
                <CheckCircle2 className="w-5 h-5"/> Accept Booking
              </button>
              <button 
                onClick={() => setIsRejecting(true)}
                disabled={actionLoading}
                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-semibold flex justify-center items-center gap-2 hover:bg-red-100 transition-colors"
              >
                <XCircle className="w-5 h-5"/> Decline
              </button>
            </div>
          )}

          {booking.status === 'Pending' && isRejecting && (
            <div className="animate-in fade-in slide-in-from-bottom-4 p-4 bg-red-50 rounded-2xl border border-red-100">
              <h3 className="font-semibold text-red-900 mb-2">Decline Booking</h3>
              <textarea 
                className="w-full p-3 rounded-xl border border-red-200 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                placeholder="Reason for declining..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
              <div className="flex gap-2">
                <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Confirm Decline</button>
                <button onClick={() => setIsRejecting(false)} className="px-4 py-2 bg-white text-gray-700 rounded-xl font-medium border border-gray-200">Cancel</button>
              </div>
            </div>
          )}

          {booking.status === 'Active' && (
            <div className="p-5 bg-cyan-50 rounded-2xl border border-cyan-100">
              <h3 className="font-semibold text-cyan-900 mb-3 flex items-center gap-2"><PlayCircle className="w-5 h-5"/> Submit Delivery</h3>
              <p className="text-sm text-cyan-800 mb-4">Upload your content to Google Drive or provide the published link.</p>
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder="https://..."
                  className="flex-1 p-3 rounded-xl border border-cyan-200 focus:outline-none"
                  value={deliveryLink}
                  onChange={e => setDeliveryLink(e.target.value)}
                />
                <button 
                  onClick={handleDeliver}
                  disabled={!deliveryLink || actionLoading}
                  className="px-6 py-3 bg-black text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                >
                  <Send className="w-4 h-4"/> Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
