import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, ArrowUpRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export default function EarningsPage() {
  const [earnings, setEarnings] = useState({
    active: 0,
    pendingCompletion: 0,
    cleared: 0,
    withdrawable: 0
  });
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  
  useEffect(() => {
    // 7.9 Earnings calculations
    const creatorId = 'demo_creator';

    if (!db) {
      setEarnings({
        active: 15000,
        pendingCompletion: 8000,
        cleared: 42500,
        withdrawable: 12000
      });
      setPayoutRequests([
        { id: '1', amount: 5000, status: 'approved', createdAt: new Date() }
      ]);
      return;
    }
    
    // Listen to bookings
    const bq = query(collection(db, 'bookings'), where('creatorId', '==', creatorId));
    const unsubB = onSnapshot(bq, snap => {
      let active = 0, pendingCompletion = 0, cleared = 0;
      snap.docs.forEach(d => {
        const data = d.data();
        const share = data.creatorPrice ? data.creatorPrice * 0.95 : (data.amount || 0) * 0.95;
        if (data.status === 'Active') active += share;
        if (data.status === 'PendingCompletion') pendingCompletion += share;
        if (data.status === 'Completed') cleared += share;
      });
      
      setEarnings(prev => ({ ...prev, active, pendingCompletion, cleared, withdrawable: cleared - prev.withdrawnTotal }));
    });

    // Listen to payouts
    const pq = query(collection(db, 'payoutRequests'), where('creatorId', '==', creatorId));
    const unsubP = onSnapshot(pq, snap => {
      let withdrawnTotal = 0;
      const requests = [];
      snap.docs.forEach(d => {
        const data = d.data();
        requests.push({ id: d.id, ...data });
        if (data.status !== 'rejected') withdrawnTotal += data.amount;
      });
      setPayoutRequests(requests);
      setEarnings(prev => ({ ...prev, withdrawable: prev.cleared - withdrawnTotal }));
    });

    return () => { unsubB(); unsubP(); };
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Earnings & Payouts</h1>
        <p className="text-gray-500">Track your income and request withdrawals.</p>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-black text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <DollarSign className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="text-gray-400 font-medium mb-2">Available for Withdrawal</p>
            <h2 className="text-5xl font-bold mb-8">₹{earnings.withdrawable.toLocaleString()}</h2>
            <button 
              onClick={() => setShowWithdraw(true)}
              disabled={earnings.withdrawable < 100}
              className="px-6 py-3 bg-white text-black rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Request Payout <ArrowUpRight className="w-5 h-5" />
            </button>
            {earnings.withdrawable < 100 && <p className="text-xs text-gray-500 mt-3">Minimum withdrawal is ₹100</p>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Active (Work in progress)</p>
              <p className="text-2xl font-bold">₹{earnings.active.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl"><ActivityIcon /></div>
          </div>
          
          <div className="glass p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Pending Clearance (In QC)</p>
              <p className="text-2xl font-bold">₹{earnings.pendingCompletion.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-500 rounded-xl"><Clock className="w-6 h-6" /></div>
          </div>
          
          <div className="glass p-5 rounded-2xl border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Total Cleared</p>
              <p className="text-2xl font-bold">₹{earnings.cleared.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 text-green-500 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4">Payout History</h3>
        <div className="space-y-3">
          {payoutRequests.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
              <p className="text-gray-500">No payout requests yet.</p>
            </div>
          ) : (
            payoutRequests.map(pr => (
              <div key={pr.id} className="glass p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                <div>
                  <h4 className="font-semibold">Withdrawal to Bank</h4>
                  <p className="text-sm text-gray-500">{pr.createdAt?.toLocaleDateString ? pr.createdAt.toLocaleDateString() : 'Recent'}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{pr.amount.toLocaleString()}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${
                    pr.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                    pr.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                    pr.status === 'paid' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {pr.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {showWithdraw && (
          <WithdrawModal 
            withdrawable={earnings.withdrawable} 
            onClose={() => setShowWithdraw(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function WithdrawModal({ withdrawable, onClose }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('upi');
  const [upi, setUpi] = useState('');
  
  const submitRequest = async () => {
    if (!amount || parseInt(amount) > withdrawable || parseInt(amount) < 100) return;
    if (method === 'upi' && !upi) return;
    
    if (db) {
      await addDoc(collection(db, 'payoutRequests'), {
        creatorId: 'demo_creator',
        amount: parseInt(amount),
        method,
        upi,
        status: 'pending',
        createdAt: new Date()
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl z-[70]"
      >
        <h2 className="text-xl font-bold mb-4">Request Payout</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Max: ₹{withdrawable})</label>
            <input 
              type="number" 
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500 text-lg font-semibold"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Method</label>
            <div className="flex gap-2">
              <button onClick={() => setMethod('upi')} className={`flex-1 py-2 rounded-xl border-2 font-medium ${method === 'upi' ? 'border-black bg-black/5' : 'border-gray-100 text-gray-500'}`}>UPI</button>
              <button onClick={() => setMethod('bank')} className={`flex-1 py-2 rounded-xl border-2 font-medium ${method === 'bank' ? 'border-black bg-black/5' : 'border-gray-100 text-gray-500'}`}>Bank Transfer</button>
            </div>
          </div>

          {method === 'upi' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input 
                type="text" 
                value={upi}
                onChange={e => setUpi(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500"
                placeholder="name@bank"
              />
            </div>
          )}

          {method === 'bank' && (
            <div className="p-3 bg-yellow-50 text-yellow-800 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              Bank transfers take 3-5 business days. UPI is recommended for instant clearing.
            </div>
          )}

          <div className="pt-4 flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200">Cancel</button>
            <button 
              onClick={submitRequest}
              disabled={!amount || parseInt(amount) < 100 || parseInt(amount) > withdrawable || (method === 'upi' && !upi)}
              className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              Submit Request
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ActivityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
    </svg>
  );
}
