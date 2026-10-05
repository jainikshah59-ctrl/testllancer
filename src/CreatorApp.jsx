import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, ShoppingBag, Calendar, Star, User, 
  DollarSign, Bot, Bell, HelpCircle, FileText, 
  Shield, LogOut, CheckCircle, Activity, TrendingUp, 
  Search, Menu, X 
} from 'lucide-react';

const Card = ({ children, className = '' }) => (
  <div className={`bg-white/70 backdrop-blur-lg border border-white/40 shadow-sm rounded-2xl p-6 ${className}`}>
    {children}
  </div>
);

import BookingsPage from './components/Creator/BookingsPage';
import EarningsPage from './components/Creator/EarningsPage';

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const baseStyle = "px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-black text-white hover:bg-gray-900 shadow-md shadow-black/10 hover:shadow-black/20",
    secondary: "bg-white text-gray-800 border border-gray-200 hover:bg-gray-50",
    accent: "bg-cyan-500 text-white hover:bg-cyan-600 shadow-md shadow-cyan-500/20",
    danger: "bg-red-50 text-red-600 hover:bg-red-100"
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const DashboardPage = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-black to-gray-900 text-white border-none relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={64} /></div>
        <h3 className="text-gray-400 font-medium mb-1">Active Bookings</h3>
        <p className="text-4xl font-bold text-white mb-4">3</p>
        <div className="text-sm text-cyan-400 flex items-center gap-1"><TrendingUp size={14} /> +1 this week</div>
      </Card>
      <Card>
        <h3 className="text-gray-500 font-medium mb-1">Total Earnings</h3>
        <p className="text-4xl font-bold text-gray-900 mb-4">₹42,500</p>
        <div className="text-sm text-gray-500">₹12,000 pending clearance</div>
      </Card>
      <Card>
        <h3 className="text-gray-500 font-medium mb-1">Profile Views</h3>
        <p className="text-4xl font-bold text-gray-900 mb-4">1,248</p>
        <div className="text-sm text-gray-500">Last 30 days</div>
      </Card>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Bookings</h2>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold">
                  B{i}
                </div>
                <div>
                  <p className="font-medium text-gray-900">Brand Campaign {i}</p>
                  <p className="text-xs text-gray-500">Pending Delivery</p>
                </div>
              </div>
              <Button variant="secondary" className="py-1 px-3 text-sm">View</Button>
            </div>
          ))}
        </div>
      </Card>
      
      <Card>
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
        <Button variant="primary" className="w-full mt-6">Complete Profile</Button>
      </Card>
    </div>
  </div>
);

const MarketplacePage = () => (
  <div className="p-6 max-w-7xl mx-auto space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900">Requirements Marketplace</h2>
      <div className="flex gap-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search briefs..." className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
        </div>
      </div>
    </div>
    
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <Card key={i} className="hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Tech Product Review Video {i}</h3>
              <p className="text-sm text-gray-500">TechBrand India • Posted 2 hours ago</p>
            </div>
            <div className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-100">
              ₹15,000 - ₹25,000
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Looking for a tech creator to review our new smart home hub. Must have good lighting and audio quality.
            Video should be 60-90 seconds long for Instagram Reels and YouTube Shorts.
          </p>
          <div className="flex gap-2 mb-4">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">Tech</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">Video</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">100k+ followers</span>
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4 mt-2">
            <Button variant="secondary">Save</Button>
            <Button variant="primary">Submit Proposal</Button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);



const CreatorProPage = () => (
  <div className="p-6 max-w-4xl mx-auto space-y-8">
    <div className="text-center space-y-4">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 text-white mb-2 shadow-lg shadow-yellow-500/30">
        <Star size={32} />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">Collancer Pro for Creators</h2>
      <p className="text-gray-500 max-w-lg mx-auto">Unlock premium features, get priority support, and maximize your earnings with our Pro tools.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-2 border-transparent hover:border-cyan-500/30 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Requirements Marketplace</h3>
        <p className="text-gray-600 text-sm mb-4">Access exclusive briefs from top brands and pitch your ideas directly.</p>
      </Card>
      <Card className="border-2 border-transparent hover:border-cyan-500/30 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Ad Shoots</h3>
        <p className="text-gray-600 text-sm mb-4">Enable high-paying personal ad formats for brands to run performance marketing.</p>
      </Card>
      <Card className="border-2 border-transparent hover:border-cyan-500/30 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Pro Badge</h3>
        <p className="text-gray-600 text-sm mb-4">Stand out in search results with a verified Pro badge on your profile.</p>
      </Card>
      <Card className="border-2 border-transparent hover:border-cyan-500/30 transition-colors">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Discount Pricing</h3>
        <p className="text-gray-600 text-sm mb-4">Offer custom discounted packages to businesses to increase conversion.</p>
      </Card>
    </div>
    
    <Card className="bg-black text-white p-8 text-center border-none">
      <h3 className="text-2xl font-bold mb-2">Upgrade to Pro</h3>
      <p className="text-gray-400 mb-6">₹599 / month or ₹4,999 / year (save 30%)</p>
      <div className="flex gap-4 justify-center">
        <Button className="bg-white text-black hover:bg-gray-100">Monthly Plan</Button>
        <Button className="bg-cyan-500 text-white hover:bg-cyan-400 border-none">Annual Plan</Button>
      </div>
    </Card>
  </div>
);

// Placeholder implementations for the rest
const ProfilePage = () => <div className="p-6"><Card><h2 className="text-2xl font-bold mb-4">Profile Settings</h2></Card></div>;

const CollancerAIPage = () => <div className="p-6"><Card><h2 className="text-2xl font-bold mb-4">Cleo AI Assistant</h2></Card></div>;
const NotificationsPage = () => <div className="p-6"><Card><h2 className="text-2xl font-bold mb-4">Notifications</h2></Card></div>;
const SupportPage = () => <div className="p-6"><Card><h2 className="text-2xl font-bold mb-4">Support & Help Center</h2></Card></div>;
const PrivacyPage = () => <div className="p-6"><Card><h2 className="text-2xl font-bold mb-4">Privacy Policy</h2></Card></div>;
const TermsPage = () => <div className="p-6"><Card><h2 className="text-2xl font-bold mb-4">Terms of Service</h2></Card></div>;

export default function CreatorApp({ user, onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Auto-close sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'creatorpro', label: 'Creator Pro', icon: Star },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'collancer-ai', label: 'AI Assistant', icon: Bot },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const legalItems = [
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'terms', label: 'Terms', icon: FileText },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'marketplace': return <MarketplacePage />;
      case 'bookings': return <BookingsPage />;
      case 'creatorpro': return <CreatorProPage />;
      case 'profile': return <ProfilePage />;
      case 'earnings': return <EarningsPage />;
      case 'collancer-ai': return <CollancerAIPage />;
      case 'notifications': return <NotificationsPage />;
      case 'support': return <SupportPage />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden selection:bg-cyan-200">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-64 bg-white/80 backdrop-blur-xl border-r border-gray-200 flex flex-col shadow-lg z-20 absolute lg:relative h-full"
          >
            <div className="p-5 flex items-center justify-between border-b border-gray-100">
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Collancer<span className="text-cyan-500 text-lg ml-1">Creator</span>
              </span>
              <button className="lg:hidden p-1 rounded-md hover:bg-gray-100 text-gray-500" onClick={() => setIsSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 scrollbar-hide">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentPage === item.id 
                      ? 'bg-black text-white shadow-md shadow-black/10' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <item.icon size={20} className={currentPage === item.id ? 'text-cyan-400' : 'text-gray-400'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
              
              <div className="mt-8 mb-2 px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Support & Legal
              </div>
              
              {legalItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setCurrentPage(item.id); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    currentPage === item.id 
                      ? 'bg-black text-white shadow-md' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <item.icon size={20} className={currentPage === item.id ? 'text-cyan-400' : 'text-gray-400'} />
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-100">
              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-red-50 text-red-600 rounded-xl transition-colors font-medium text-sm border border-transparent hover:border-red-100"
              >
                <LogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-gray-50 relative overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center px-6 lg:px-10 bg-white/70 backdrop-blur-md border-b border-gray-200/50 z-10 sticky top-0">
          <button 
            className="p-2 mr-4 rounded-xl hover:bg-gray-100 lg:hidden text-gray-700 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1">
            <h1 className="text-2xl font-bold capitalize text-gray-900 tracking-tight">
              {currentPage.replace('-', ' ')}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-cyan-50/50 text-cyan-700 rounded-full text-sm font-semibold border border-cyan-100/50 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
              Creator Mode
            </div>
            <button 
              className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200" 
              onClick={() => setCurrentPage('notifications')}
            >
              <Bell size={22} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-cyan-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-md cursor-pointer border-2 border-white">
              C
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto relative scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="min-h-full pb-10"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
