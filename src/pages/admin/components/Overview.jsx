import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const Overview = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();

    // 1. Listen for storage changes (for local/mock database)
    window.addEventListener('storage', fetchAppointments);

    // 2. Listen for Supabase Realtime changes (for live cloud database)
    let channel;
    const isRealSupabase = typeof supabase.channel === 'function';
    if (isRealSupabase) {
      channel = supabase
        .channel('overview-db-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'appointments' },
          () => {
            fetchAppointments();
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('storage', fetchAppointments);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*');
      if (error) throw error;
      if (data) setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading overview...</div>;

  const pending = appointments.filter(a => a.status === 'pending').length;
  const accepted = appointments.filter(a => a.status === 'accepted').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div>
      <h2 className="text-3xl font-heading font-bold text-white mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Appointments */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-blue-500/30 hover:shadow-[0_0_30px_rgba(59,130,246,0.12)] hover:scale-[1.02] transition-all duration-300 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
          <div>
            <h3 className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">Total Bookings</h3>
            <p className="text-4xl font-extrabold text-white">{appointments.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
            <Calendar size={24} />
          </div>
        </div>

        {/* Pending Appointments */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(212,175,55,0.12)] hover:scale-[1.02] transition-all duration-300 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors"></div>
          <div>
            <h3 className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">Pending</h3>
            <p className="text-4xl font-extrabold text-gold">{pending}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform duration-300">
            <Clock size={24} />
          </div>
        </div>

        {/* Confirmed Appointments */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-green-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.12)] hover:scale-[1.02] transition-all duration-300 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-colors"></div>
          <div>
            <h3 className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">Confirmed</h3>
            <p className="text-4xl font-extrabold text-green-400">{accepted}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-300">
            <CheckCircle size={24} />
          </div>
        </div>

        {/* Cancelled Appointments */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-red-500/30 hover:shadow-[0_0_30px_rgba(239,68,68,0.12)] hover:scale-[1.02] transition-all duration-300 flex justify-between items-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/10 transition-colors"></div>
          <div>
            <h3 className="text-gray-400 text-xs font-semibold tracking-wider uppercase mb-1">Cancelled</h3>
            <p className="text-4xl font-extrabold text-red-400">{cancelled}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform duration-300">
            <XCircle size={24} />
          </div>
        </div>
      </div>

      {/* Welcome banner */}
      <div className="glass-panel rounded-2xl p-8 border border-white/10 relative overflow-hidden bg-gradient-to-r from-gold/10 via-transparent to-transparent">
        <div className="relative z-10 max-w-xl">
          <span className="bg-gold/10 text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/20 uppercase tracking-widest">
            Control Panel
          </span>
          <h3 className="text-3xl font-heading font-bold text-white mt-4 mb-3">
            Welcome back, <span className="text-gold">Hyper Salon Admin</span>
          </h3>
          <p className="text-gray-400 leading-relaxed text-base">
            Use the sidebar options on the left to easily manage your available hairstyles, process booking appointments, or edit public salon information like address and maps.
          </p>
        </div>
        <div className="absolute right-8 bottom-0 top-0 hidden md:flex items-center justify-center opacity-5">
          <Calendar size={160} className="text-gold" />
        </div>
      </div>
    </div>
  );
};

export default Overview;
