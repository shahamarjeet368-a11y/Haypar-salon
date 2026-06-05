import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      const lowerEmail = email.trim().toLowerCase();

      // Check if admin login (matches "vinay@haypersalon", "vinay@haypersalon.com", "admin", or "admin@hypersalon.com")
      const isAdminEmail = 
        lowerEmail === 'vinay@haypersalon' || 
        lowerEmail === 'vinay@haypersalon.com' || 
        lowerEmail === 'admin@hypersalon.com' || 
        lowerEmail === 'admin';
      
      if (isAdminEmail) {
        const isValidAdminPassword = 
          ((lowerEmail === 'vinay@haypersalon' || lowerEmail === 'vinay@haypersalon.com') && password === 'vinay@12345') ||
          ((lowerEmail === 'admin@hypersalon.com' || lowerEmail === 'admin') && password === 'admin');

        if (isValidAdminPassword) {
          localStorage.setItem('admin_session', 'true');
          localStorage.setItem('admin_email', lowerEmail);
          localStorage.removeItem('user_session');
          localStorage.removeItem('user_email');
          
          // Dispatch custom events to trigger navbar re-render
          window.dispatchEvent(new Event('storage'));
          window.dispatchEvent(new Event('auth-change'));
          
          navigate('/admin/dashboard');
        } else {
          throw new Error("Invalid admin password.");
        }
      } else {
        // Regular user login
        localStorage.setItem('user_session', 'true');
        localStorage.setItem('user_email', lowerEmail);
        localStorage.removeItem('admin_session');
        localStorage.removeItem('admin_email');
        
        // Dispatch custom events to trigger navbar re-render
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('auth-change'));
        
        navigate('/book');
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-12 px-6 bg-richBlack">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-white/10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400">Sign in to book an appointment or manage settings.</p>
        </div>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-6 text-sm">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Email or Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-richBlack/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="you@example.com or admin"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2 text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-richBlack/50 border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full btn-gold ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 space-y-2 text-xs text-gray-500">
          <p className="flex justify-between">
            <span className="text-gold">Admin credentials:</span>
            <span>vinay@haypersalon / vinay@12345</span>
          </p>
          <p className="flex justify-between">
            <span className="text-silver">User credentials:</span>
            <span>Any valid email / password</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
