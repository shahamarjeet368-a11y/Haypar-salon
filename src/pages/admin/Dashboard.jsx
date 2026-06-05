import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Scissors, Calendar, Settings, LogOut, Menu, X } from 'lucide-react';

// Subcomponents
import Overview from './components/Overview';
import HairstylesCMS from './components/HairstylesCMS';
import AppointmentsCMS from './components/AppointmentsCMS';
import SalonSettings from './components/SalonSettings';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const isCloudDB = typeof supabase.channel === 'function';

  useEffect(() => {
    const checkSession = async () => {
      // Bypass Supabase Auth check, just use simple local storage token
      const isAuth = localStorage.getItem('admin_session');
      
      if (!isAuth) {
        navigate('/login');
      } else {
        setUser({ email: 'admin@hypersalon.com' });
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('admin_session');
    // Optional: await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hairstyles', label: 'Hairstyles', icon: Scissors },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'settings', label: 'Salon Settings', icon: Settings },
  ];

  if (loading) return <div className="text-white text-center pt-32 flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div></div>;

  return (
    <div className="min-h-screen bg-richBlack">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-navy rounded-md text-white border border-white/10"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed top-0 bottom-0 left-0 h-screen w-64 bg-[#0a1424] border-r border-white/5 transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="space-y-2 flex-1 mt-16 md:mt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id ? 'bg-gold/10 text-gold border border-gold/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Database Connection Indicator */}
          <div className="px-4 py-2.5 mb-4 rounded-lg border flex items-center gap-2 text-xs font-semibold bg-[#050c18] border-white/5 mt-auto">
            <span className={`w-2 h-2 rounded-full ${isCloudDB ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
            <span className="text-gray-400">Database:</span>
            <span className={isCloudDB ? 'text-green-400' : 'text-yellow-500'}>
              {isCloudDB ? 'Cloud (Supabase)' : 'Local (Mock)'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors mb-4"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 md:ml-64 pt-20 md:pt-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'dashboard' && <Overview />}
          {activeTab === 'hairstyles' && <HairstylesCMS />}
          {activeTab === 'appointments' && <AppointmentsCMS />}
          {activeTab === 'settings' && <SalonSettings />}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
