import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Scissors, Calendar, Settings, LogOut, Menu, X } from 'lucide-react';

// Subcomponents
import Overview from './components/Overview';
import HairstylesCMS from './components/HairstylesCMS';
import AppointmentsCMS from './components/AppointmentsCMS';
import SalonSettings from './components/SalonSettings';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      // Bypass Supabase Auth check, just use simple local storage token
      const isAuth = localStorage.getItem('admin_session');
      
      if (!isAuth) {
        navigate('/admin');
      } else {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogout = async () => {
    localStorage.removeItem('admin_session');
    // Optional: await supabase.auth.signOut();
    navigate('/admin');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hairstyles', label: 'Hairstyles', icon: Scissors },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'settings', label: 'Salon Settings', icon: Settings },
  ];

  if (loading) return <div className="text-white text-center pt-32 flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div></div>;

  return (
    <div className="min-h-screen bg-richBlack flex pt-20">
      {/* Mobile Sidebar Toggle */}
      <button 
        className="md:hidden fixed top-24 left-4 z-50 p-2 bg-navy rounded-md text-white border border-white/10"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-[#0a1424] border-r border-white/5 transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex flex-col h-full">
          <div className="space-y-2 flex-1 mt-8 md:mt-0">
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
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors mt-auto"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 ml-0">
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
