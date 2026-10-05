import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Shield,
  CreditCard,
  CheckSquare,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { auth, db } from './firebase'; // Assuming a firebase init file exists
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  addDoc
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const AdminApp = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Verification');

  const tabs = [
    { id: 'Verification', icon: Shield },
    { id: 'Completions', icon: CheckSquare },
    { id: 'Payouts', icon: DollarSign },
    { id: 'Deposits', icon: CreditCard },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-cyan-200">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Admin Console</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-2"
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 hover:text-black border border-gray-200'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-cyan-400' : ''} />
                {tab.id}
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/50"
        >
          {activeTab === 'Verification' && <VerificationQueue />}
          {activeTab === 'Completions' && <CompletionsQueue />}
          {activeTab === 'Payouts' && <PayoutsQueue />}
          {activeTab === 'Deposits' && <DepositsQueue />}
        </motion.div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// VERIFICATION QUEUE
// -----------------------------------------------------------------------------
const VerificationQueue = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'verificationRequests'),
      where('status', '==', 'pending')
    );
    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (req) => {
    try {
      const reqRef = doc(db, 'verificationRequests', req.id);
      const creatorRef = doc(db, 'creators', req.creatorId);
      
      await updateDoc(reqRef, {
        status: 'verified',
        reviewedAt: serverTimestamp(),
      });
      await updateDoc(creatorRef, {
        verified: true,
        verificationStatus: 'verified'
      });
      await addDoc(collection(db, 'creatorNotifs'), {
        creatorId: req.creatorId,
        type: 'verification_approved',
        createdAt: serverTimestamp(),
        message: 'Your verification request has been approved!'
      });
    } catch (e) {
      console.error(e);
      alert('Error approving request');
    }
  };

  const handleReject = async (req) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;
    try {
      const reqRef = doc(db, 'verificationRequests', req.id);
      const creatorRef = doc(db, 'creators', req.creatorId);
      await updateDoc(reqRef, {
        status: 'rejected',
        rejectReason: reason,
        reviewedAt: serverTimestamp(),
      });
      await updateDoc(creatorRef, {
        verified: false,
        verificationStatus: 'rejected'
      });
      await addDoc(collection(db, 'creatorNotifs'), {
        creatorId: req.creatorId,
        type: 'verification_rejected',
        createdAt: serverTimestamp(),
        message: `Your verification request was rejected: ${reason}`
      });
    } catch (e) {
      console.error(e);
      alert('Error rejecting request');
    }
  };

  if (loading) return <Loader />;
  if (!requests.length) return <EmptyState title="No verification requests" />;

  return (
    <div className="space-y-4">
      {requests.map(req => (
        <div key={req.id} className="p-5 border border-gray-100 rounded-2xl bg-white flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="font-bold text-lg">{req.name || req.creatorId}</h3>
            <p className="text-sm text-gray-500">{req.platform} • {req.followers} followers</p>
            <a href={req.profileUrl} target="_blank" rel="noreferrer" className="text-cyan-600 text-sm hover:underline mt-1 block">
              View Profile
            </a>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => handleApprove(req)} className="flex-1 md:flex-none px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-cyan-400" /> Approve
            </button>
            <button onClick={() => handleReject(req)} className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <XCircle size={16} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// COMPLETIONS QUEUE
// -----------------------------------------------------------------------------
const CompletionsQueue = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'bookings'), where('status', '==', 'PendingCompletion'));
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (b) => {
    try {
      await runTransaction(db, async (t) => {
        const docRef = doc(db, 'bookings', b.id);
        const docSnap = await t.get(docRef);
        if (!docSnap.exists() || docSnap.data().status !== 'PendingCompletion') {
          throw new Error('Booking not valid for completion.');
        }

        const data = docSnap.data();
        const creatorShare = data.creatorPrice || data.amount; 
        const platformRevenue = data.amount - creatorShare;

        t.update(docRef, {
          status: 'Completed',
          paymentApproved: true,
          paymentStatus: 'released',
          escrowStatus: 'released',
          completedAt: serverTimestamp()
        });

        const revRef = doc(db, 'adminRevenue', `rev_${b.id}`);
        t.set(revRef, {
          bookingId: b.id,
          creatorId: data.creatorId,
          bizId: data.bizId,
          grossAmount: data.amount,
          creatorShare: creatorShare,
          platformRevenue: platformRevenue,
          createdAt: serverTimestamp()
        });

        // Notifications
        t.set(doc(collection(db, 'creatorNotifs')), {
          creatorId: data.creatorId,
          type: 'payment_approved',
          message: `Payment released for ${data.campaignName}`,
          createdAt: serverTimestamp()
        });
        t.set(doc(collection(db, 'bizNotifs')), {
          bizId: data.bizId,
          type: 'completion_approved',
          message: `Completion approved for ${data.campaignName}`,
          createdAt: serverTimestamp()
        });
      });
      alert('Approved and released.');
    } catch (e) {
      console.error(e);
      alert('Error: ' + e.message);
    }
  };

  const handleSendBack = async (b) => {
    const reason = prompt('Reason for rejection?');
    if (!reason) return;
    try {
      await updateDoc(doc(db, 'bookings', b.id), {
        status: 'Active',
        adminRejected: true,
        adminRejectionReason: reason
      });
      await addDoc(collection(db, 'creatorNotifs'), {
        creatorId: b.creatorId,
        type: 'completion_rejected',
        message: `Delivery for ${b.campaignName} was rejected: ${reason}`,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.error(e);
      alert('Error rejecting delivery');
    }
  };

  if (loading) return <Loader />;
  if (!bookings.length) return <EmptyState title="No pending completions" />;

  return (
    <div className="space-y-4">
      {bookings.map(b => (
        <div key={b.id} className="p-5 border border-gray-100 rounded-2xl bg-white flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">{b.campaignName}</h3>
            <p className="text-sm text-gray-500 mb-2">Creator: {b.creatorName} | Biz: {b.bizName}</p>
            <div className="text-sm bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
              <span className="font-semibold block mb-1">Delivery Link:</span>
              <a href={b.driveLink || b.promotedVideoLink} target="_blank" rel="noreferrer" className="text-cyan-600 break-all hover:underline">
                {b.driveLink || b.promotedVideoLink || 'No link provided'}
              </a>
            </div>
            <p className="text-sm font-semibold">Amount: ₹{b.amount} <span className="text-gray-400 font-normal">(Creator Share: ₹{b.creatorPrice || b.amount})</span></p>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-48">
            <button onClick={() => handleApprove(b)} className="px-4 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-cyan-400" /> Approve & Release
            </button>
            <button onClick={() => handleSendBack(b)} className="px-4 py-2.5 bg-gray-100 text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <AlertCircle size={16} /> Send Back
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// PAYOUTS QUEUE
// -----------------------------------------------------------------------------
const PayoutsQueue = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'payoutRequests'), where('status', 'in', ['pending', 'approved']));
    const unsub = onSnapshot(q, (snap) => {
      setPayouts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (p) => {
    try {
      await updateDoc(doc(db, 'payoutRequests', p.id), {
        status: 'approved',
        reviewedAt: serverTimestamp(),
        reviewedBy: auth.currentUser?.uid || 'admin'
      });
      await addDoc(collection(db, 'creatorNotifs'), {
        creatorId: p.creatorId,
        type: 'payout_approved',
        message: `Your payout request for ₹${p.amount} has been approved.`,
        createdAt: serverTimestamp()
      });
    } catch(e) { console.error(e); }
  };

  const handleMarkPaid = async (p) => {
    try {
      await updateDoc(doc(db, 'payoutRequests', p.id), {
        status: 'paid',
        paidAt: serverTimestamp(),
        paidBy: auth.currentUser?.uid || 'admin'
      });
      await addDoc(collection(db, 'creatorNotifs'), {
        creatorId: p.creatorId,
        type: 'payout_paid',
        message: `Your payout of ₹${p.amount} has been transferred!`,
        createdAt: serverTimestamp()
      });
    } catch(e) { console.error(e); }
  };

  const handleReject = async (p) => {
    const reason = prompt('Reason for rejection?');
    if (!reason) return;
    try {
      await updateDoc(doc(db, 'payoutRequests', p.id), {
        status: 'rejected',
        rejectReason: reason,
        reviewedAt: serverTimestamp()
      });
      await addDoc(collection(db, 'creatorNotifs'), {
        creatorId: p.creatorId,
        type: 'payout_rejected',
        message: `Your payout request was rejected: ${reason}`,
        createdAt: serverTimestamp()
      });
    } catch(e) { console.error(e); }
  };

  if (loading) return <Loader />;
  if (!payouts.length) return <EmptyState title="No active payout requests" />;

  return (
    <div className="space-y-4">
      {payouts.map(p => (
        <div key={p.id} className="p-5 border border-gray-100 rounded-2xl bg-white flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-lg">₹{p.amount}</h3>
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
                p.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
              }`}>
                {p.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-1">Creator ID: {p.creatorId}</p>
            <div className="text-xs text-gray-400 font-mono bg-gray-50 p-2 rounded border border-gray-100 inline-block">
              {p.method === 'upi' ? `UPI: ${p.upi}` : `Bank: ${p.account} | IFSC: ${p.ifsc}`}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {p.status === 'pending' && (
              <>
                <button onClick={() => handleApprove(p)} className="px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Approve
                </button>
                <button onClick={() => handleReject(p)} className="px-4 py-2 bg-gray-100 text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors">
                  Reject
                </button>
              </>
            )}
            {p.status === 'approved' && (
              <button onClick={() => handleMarkPaid(p)} className="px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                <CheckCircle size={16} className="text-cyan-400" /> Mark as Paid
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// DEPOSITS QUEUE
// -----------------------------------------------------------------------------
const DepositsQueue = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'walletDeposits'), where('status', '==', 'pending'));
    const unsub = onSnapshot(q, (snap) => {
      setDeposits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleApprove = async (d) => {
    try {
      await runTransaction(db, async (t) => {
        const depRef = doc(db, 'walletDeposits', d.id);
        const depSnap = await t.get(depRef);
        if (!depSnap.exists() || depSnap.data().status !== 'pending') {
          throw new Error('Deposit not pending');
        }

        const bizRef = doc(db, 'businesses', d.bizId);
        const bizSnap = await t.get(bizRef);
        if (!bizSnap.exists()) throw new Error('Business not found');

        const currentBalance = bizSnap.data().walletBalance || 0;
        
        t.update(bizRef, { walletBalance: currentBalance + d.amount });
        t.update(depRef, {
          status: 'credited',
          creditedAt: serverTimestamp(),
          creditedBy: auth.currentUser?.uid || 'admin'
        });

        const ledgerRef = doc(collection(db, 'walletTransactions'));
        t.set(ledgerRef, {
          bizId: d.bizId,
          type: 'deposit',
          amount: d.amount,
          depositId: d.id,
          createdAt: serverTimestamp()
        });

        const notifRef = doc(collection(db, 'bizNotifs'));
        t.set(notifRef, {
          bizId: d.bizId,
          type: 'deposit_credited',
          message: `Your wallet deposit of ₹${d.amount} was credited.`,
          createdAt: serverTimestamp()
        });
      });
      alert('Deposit approved and credited.');
    } catch(e) {
      console.error(e);
      alert('Error: ' + e.message);
    }
  };

  const handleReject = async (d) => {
    const reason = prompt('Reason for rejection?');
    if (!reason) return;
    try {
      await updateDoc(doc(db, 'walletDeposits', d.id), {
        status: 'rejected',
        rejectReason: reason,
        reviewedAt: serverTimestamp()
      });
      await addDoc(collection(db, 'bizNotifs'), {
        bizId: d.bizId,
        type: 'deposit_rejected',
        message: `Your deposit of ₹${d.amount} was rejected: ${reason}`,
        createdAt: serverTimestamp()
      });
    } catch(e) { console.error(e); }
  };

  if (loading) return <Loader />;
  if (!deposits.length) return <EmptyState title="No pending deposits" />;

  return (
    <div className="space-y-4">
      {deposits.map(d => (
        <div key={d.id} className="p-5 border border-gray-100 rounded-2xl bg-white flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="font-bold text-lg text-green-600 mb-1">+ ₹{d.amount}</h3>
            <p className="text-sm text-gray-500 mb-1">Business: {d.bizId}</p>
            <p className="text-sm font-mono text-gray-400 bg-gray-50 p-2 rounded inline-block border border-gray-100">
              UTR: <span className="text-black font-semibold">{d.utr}</span>
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => handleApprove(d)} className="flex-1 md:flex-none px-4 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
              <CheckCircle size={16} className="text-cyan-400" /> Credit
            </button>
            <button onClick={() => handleReject(d)} className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-black rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
              <XCircle size={16} /> Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// -----------------------------------------------------------------------------
// SHARED COMPONENTS
// -----------------------------------------------------------------------------
const Loader = () => (
  <div className="py-20 flex flex-col items-center justify-center gap-3">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
    <p className="text-sm text-gray-500 font-medium">Loading data...</p>
  </div>
);

const EmptyState = ({ title }) => (
  <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
    <CheckCircle size={48} className="text-gray-200" />
    <p className="text-base font-medium">{title}</p>
  </div>
);

export default AdminApp;
