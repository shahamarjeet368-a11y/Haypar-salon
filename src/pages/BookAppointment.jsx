import { useState } from 'react';
import { supabase } from '../lib/supabase';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const businessHours = [
    "07:00", "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Rule 1: Check if Tuesday (Day 2)
      const selectedDate = new Date(formData.date);
      if (selectedDate.getDay() === 2) {
        throw new Error("Salon is closed on Tuesdays. Please select another day.");
      }

      // Rule 2: Check if slot already booked
      const { data: existingAppts, error: fetchError } = await supabase
        .from('appointments')
        .select('id')
        .eq('date', formData.date)
        .eq('time', formData.time)
        .in('status', ['pending', 'accepted']);

      if (fetchError) throw fetchError;

      if (existingAppts && existingAppts.length > 0) {
        throw new Error("Selected time slot is already booked");
      }

      // Create appointment
      const { error: insertError } = await supabase
        .from('appointments')
        .insert([
          {
            ...formData,
            status: "pending",
          }
        ]);

      if (insertError) throw insertError;

      setMessage("Appointment booked successfully. Waiting for confirmation.");
      setFormData({ name: '', phone: '', date: '', time: '' });
      
    } catch (err) {
      setError(err.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl px-6">
        <div className="glass-panel p-8 md:p-12 rounded-2xl">
          <h2 className="text-3xl font-heading font-bold text-center text-white mb-8">
            Book an <span className="text-gold">Appointment</span>
          </h2>
          
          {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded mb-6 text-sm">{error}</div>}
          {message && <div className="bg-green-500/20 border border-green-500 text-green-200 p-4 rounded mb-6 text-sm">{message}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-richBlack/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2 text-sm">Phone Number</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-richBlack/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                placeholder="+91 9876543210"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Date</label>
                <input 
                  type="date" 
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full bg-richBlack/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Time</label>
                <select 
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full bg-richBlack/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
                >
                  <option value="">Select Time</option>
                  {businessHours.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full btn-gold mt-4 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Booking...' : 'Book Now'}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Business Hours: 7:00 AM - 7:00 PM</p>
            <p className="text-red-400/80 mt-1">Closed on Tuesdays</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
