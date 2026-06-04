import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { MapPin } from 'lucide-react';

const SalonSettings = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('address')
        .eq('id', 'salonLocation')
        .single();

      if (error) throw error;
      if (data) setAddress(data.address);
    } catch (err) {
      console.error("Error fetching settings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ id: 'salonLocation', address });

      if (error) throw error;
      setMessage({ text: 'Location updated successfully. It will now reflect in the public footer.', type: 'success' });
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to update location.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h2 className="text-3xl font-heading font-bold text-white mb-2">Salon Settings</h2>
        <p className="text-gray-400">Update your public business information.</p>
      </div>

      <div className="glass-panel p-8 rounded-xl border border-white/5">
        <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
          <MapPin className="text-gold" size={24} />
          <h3 className="text-xl font-bold text-white">Location Details</h3>
        </div>

        {message.text && (
          <div className={`p-4 rounded mb-6 ${message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/50' : 'bg-red-500/20 text-red-300 border border-red-500/50'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Salon Address</label>
            <textarea 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={4}
              className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold resize-none"
              placeholder="Enter full address..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-2">This address will be displayed in the website footer and used for the Google Map.</p>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className={`btn-gold w-full sm:w-auto ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {saving ? 'Saving...' : 'Update Location'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalonSettings;
