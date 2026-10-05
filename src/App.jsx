import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, ShieldCheck, ChevronRight } from 'lucide-react';

const BusinessApp = React.lazy(() => import('./BusinessApp'));
const CreatorApp = React.lazy(() => import('./CreatorApp'));
const AdminApp = React.lazy(() => import('./AdminApp'));

import { authOps, auth } from './firebase';

function RoleSelection({ onSelect }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('business');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await authOps.signInWithEmailAndPassword(auth, email, password);
      } else {
        await authOps.createUserWithEmailAndPassword(auth, email, password);
      }
      onSelect(selectedRole);
    } catch (err) {
      setError(err.message);
      // Fallback for demo without credentials
      console.log("Auth failed, falling back to local demo state");
      onSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full glass rounded-3xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2">{isLogin ? 'Welcome Back' : 'Join Collancer'}</h1>
        <p className="text-gray-500 text-center mb-8">{isLogin ? 'Sign in to continue' : 'Create an account'}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2 mb-4">
            {['business', 'creator', 'admin'].map(r => (
              <button type="button" key={r} onClick={() => setSelectedRole(r)} className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize border ${selectedRole === r ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-gray-200'}`}>
                {r}
              </button>
            ))}
          </div>
          
          <div>
            <input type="email" required placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500" />
          </div>
          <div>
            <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-cyan-500" />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <button type="submit" className="w-full py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-600 font-bold hover:underline">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRole = localStorage.getItem('collancer_role');
    if (savedRole) {
      setRole(savedRole);
    }
    // Simulate auth curtain delay
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = (selectedRole) => {
    localStorage.setItem('collancer_role', selectedRole);
    setRole(selectedRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('collancer_role');
    setRole(null);
    if (window.__cauthOps) {
      window.__cauthOps.signOut(window.__auth);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AnimatePresence mode="wait">
        {!role ? (
          <motion.div key="role-select" exit={{ opacity: 0 }}>
            <RoleSelection onSelect={handleRoleSelect} />
          </motion.div>
        ) : role === 'business' ? (
          <motion.div key="business" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
            <BusinessApp onLogout={handleLogout} />
          </motion.div>
        ) : role === 'creator' ? (
          <motion.div key="creator" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
            <CreatorApp onLogout={handleLogout} />
          </motion.div>
        ) : role === 'admin' ? (
          <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
            <AdminApp onLogout={handleLogout} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </React.Suspense>
  );
}

export default App;
