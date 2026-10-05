import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Search, 
  Wallet, 
  MessageSquare, 
  ShoppingBag,
  Gift,
  Star,
  LifeBuoy,
  LogOut,
  Menu,
  X
} from 'lucide-react';

import DiscoverPage from './components/Business/DiscoverPage';
import WalletPage from './components/Business/WalletPage';


import DashboardPage from './components/Business/DashboardPage';


import CleoAIPage from './components/Shared/CleoAIPage';


import MarketplacePage from './components/Marketplace/MarketplacePage';

const ReferralPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Referral</h1></div>;
const ProPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Collancer Pro</h1></div>;
const SupportPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Support</h1></div>;
const PrivacyPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Privacy Policy</h1></div>;
const TermsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Terms of Service</h1></div>;

export default function BusinessApp() {
  const [currentPage, setCurrentPage] = useState('discover');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'discover': return <DiscoverPage />;
      case 'dashboard': return <DashboardPage />;
      case 'ai': return <CleoAIPage />;
      case 'wallet': return <WalletPage />;
      case 'marketplace': return <MarketplacePage />;
      case 'referral': return <ReferralPage />;
      case 'pro': return <ProPage />;
      case 'support': return <SupportPage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      default: return <DiscoverPage />;
    }
  };

  const navItems = [
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'ai', label: 'Cleo', icon: MessageSquare },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
  ];

  const menuItems = [
    { id: 'pro', label: 'Collancer Pro', icon: Star },
    { id: 'referral', label: 'Refer & Earn', icon: Gift },
    { id: 'support', label: 'Support', icon: LifeBuoy },
  ];

  const handleLogout = () => {
    localStorage.removeItem('collancer_role');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-cyan-200">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center">
            <span className="text-cyan-400 font-bold text-xl">C</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">Collancer</span>
        </div>
        
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Main Content */}
      <main className="pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-gray-100 pb-safe">
        <div className="flex items-center justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-cyan-500 scale-110' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <span className="font-semibold text-lg">Menu</span>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4">
                <div className="px-4 mb-6">
                  <div className="bg-black/5 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div>
                      <h3 className="font-medium">Business User</h3>
                      <p className="text-sm text-gray-500">business@example.com</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 px-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setCurrentPage(item.id);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <Icon className="w-5 h-5 text-gray-500" />
                        <span className="font-medium text-gray-700">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 px-6 space-y-4">
                  <button onClick={() => { setCurrentPage('privacy'); setIsMenuOpen(false); }} className="block text-sm text-gray-400 hover:text-gray-600">Privacy Policy</button>
                  <button onClick={() => { setCurrentPage('terms'); setIsMenuOpen(false); }} className="block text-sm text-gray-400 hover:text-gray-600">Terms of Service</button>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition-colors shadow-[0_4px_14px_0_rgba(0,0,0,0.2)]"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
