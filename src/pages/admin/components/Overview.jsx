import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

const Overview = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <div>Loading overview...</div>;

  const pending = appointments.filter(a => a.status === 'pending').length;
  const accepted = appointments.filter(a => a.status === 'accepted').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div>
      <h2 className="text-3xl font-heading font-bold text-white mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="glass-panel p-6 rounded-xl border-t-4 border-t-blue-500">
          <h3 className="text-gray-400 mb-2 font-medium">Total Appointments</h3>
          <p className="text-4xl font-bold text-white">{appointments.length}</p>
        </div>
        <div className="glass-panel p-6 rounded-xl border-t-4 border-t-yellow-500">
          <h3 className="text-gray-400 mb-2 font-medium">Pending</h3>
          <p className="text-4xl font-bold text-yellow-400">{pending}</p>
        </div>
        <div className="glass-panel p-6 rounded-xl border-t-4 border-t-green-500">
          <h3 className="text-gray-400 mb-2 font-medium">Accepted</h3>
          <p className="text-4xl font-bold text-green-400">{accepted}</p>
        </div>
        <div className="glass-panel p-6 rounded-xl border-t-4 border-t-red-500">
          <h3 className="text-gray-400 mb-2 font-medium">Cancelled</h3>
          <p className="text-4xl font-bold text-red-400">{cancelled}</p>
        </div>
      </div>

      <div className="glass-panel rounded-xl p-8 text-center border border-white/5">
        <h3 className="text-xl font-bold text-gold mb-4">Welcome back to Hyper Salon Admin</h3>
        <p className="text-gray-400">Use the sidebar to manage hairstyles, appointments, and salon settings.</p>
      </div>
    </div>
  );
};

export default Overview;
