import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

const AppointmentsCMS = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      if (data) setAppointments(data);
    } catch (err) {
      console.error("Error fetching appointments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      // update local state
      setAppointments(appointments.map(app => app.id === id ? { ...app, status } : app));
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const formatPhoneForWA = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) cleaned = '91' + cleaned;
    return cleaned;
  };

  const handleNotifyWA = (app) => {
    const waPhone = formatPhoneForWA(app.phone);
    const message = `Hello ${app.name},\n\nYour appointment at *HYPER SALON* is confirmed for *${app.date}* at *${app.time}*.\n\nWe look forward to providing you a luxury grooming experience!`;
    window.open(`https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-white">Appointments Management</h2>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-gray-300">
            <thead className="bg-[#050c18] border-b border-white/10 text-gray-400">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {appointments.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8">No appointments found.</td></tr>
              ) : appointments.map((app) => (
                <tr key={app.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{app.name}</td>
                  <td className="px-6 py-4">{app.phone}</td>
                  <td className="px-6 py-4">{app.date}</td>
                  <td className="px-6 py-4">{app.time}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' :
                      app.status === 'accepted' ? 'bg-green-500/20 text-green-500 border border-green-500/30' :
                      'bg-red-500/20 text-red-500 border border-red-500/30'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 space-x-2 text-right">
                    {app.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(app.id, 'accepted')} className="text-green-400 hover:text-green-300 font-medium px-2 py-1 bg-green-400/10 rounded">Accept</button>
                        <button onClick={() => updateStatus(app.id, 'cancelled')} className="text-red-400 hover:text-red-300 font-medium px-2 py-1 bg-red-400/10 rounded">Reject</button>
                      </>
                    )}
                    {app.status === 'accepted' && (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleNotifyWA(app)} className="text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 bg-emerald-400/10 rounded flex items-center gap-1 border border-emerald-500/20 text-sm">
                          <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                          WhatsApp
                        </button>
                        <button onClick={() => updateStatus(app.id, 'cancelled')} className="text-red-400 hover:text-red-300 font-medium px-2 py-1 bg-red-400/10 rounded border border-red-500/20 text-sm">Cancel</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsCMS;
