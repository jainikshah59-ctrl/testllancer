import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, User, ShieldCheck, ChevronRight } from 'lucide-react';

const BusinessApp = React.lazy(() => import('./BusinessApp'));
const CreatorApp = React.lazy(() => import('./CreatorApp'));
const AdminApp = React.lazy(() => import('./AdminApp'));

function RoleSelection({ onSelect }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass rounded-3xl p-8 space-y-8"
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Welcome to Collancer</h1>
          <p className="text-gray-500">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          {[
            { id: 'business', icon: Briefcase, title: 'Business', desc: 'Find creators and manage campaigns' },
            { id: 'creator', icon: User, title: 'Creator', desc: 'Get booked and grow your reach' },
            { id: 'admin', icon: ShieldCheck, title: 'Admin', desc: 'Manage platform operations' }
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => onSelect(role.id)}
              className="w-full flex items-center p-4 rounded-2xl border border-gray-100 hover:border-accent hover:shadow-sm transition-all group bg-white"
            >
              <div className="bg-gray-50 p-3 rounded-xl group-hover:bg-accent/10 transition-colors">
                <role.icon className="w-6 h-6 text-foreground group-hover:text-accent" />
              </div>
              <div className="ml-4 text-left flex-1">
                <h3 className="font-semibold text-foreground">{role.title}</h3>
                <p className="text-sm text-gray-500">{role.desc}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-accent transition-colors" />
            </button>
          ))}
        </div>
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
