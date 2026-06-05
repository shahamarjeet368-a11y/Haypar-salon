import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);

      // Hide if scrolling down past 100px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setMobileMenuOpen(false); // Close mobile menu if open when scrolling down
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const checkAuth = () => {
    const adminSess = !!localStorage.getItem('admin_session');
    setIsAdmin(adminSess);
    const userSess = localStorage.getItem('user_session');
    setIsUser(!!userSess);
    if (adminSess) {
      setUserEmail(localStorage.getItem('admin_email') || 'Admin');
    } else if (userSess) {
      setUserEmail(localStorage.getItem('user_email') || 'User');
    } else {
      setUserEmail('');
    }
  };

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('user_session');
    localStorage.removeItem('user_email');
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Hair Styles', path: '/hairstyles' },
    { name: 'Book Appointment', path: '/book' },
    { name: 'Make QR Code', path: '/make-qr' },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin Dashboard', path: '/admin/dashboard' });
  }

  if (location.pathname === '/admin/dashboard') {
    return null;
  }

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'bg-transparent md:bg-[#0a1424]/95 md:backdrop-blur-lg md:shadow-lg shadow-gold/10 md:border-b border-gold/20 py-4' : 'bg-transparent py-6'}`}>
      <div className="w-full max-w-[1600px] mx-auto px-2 md:px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center -ml-2 md:-ml-4">
          <img src="/logo.webp" alt="HYPER SALON Logo" className="h-16 md:h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-100 md:scale-110 origin-left" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={`font-medium transition-colors hover:text-gold ${location.pathname === link.path ? 'text-gold' : 'text-gray-300'}`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin || isUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-gold text-sm font-medium border border-gold/20 bg-gold/5 px-3 py-1.5 rounded-lg max-w-[180px] truncate" title={userEmail}>
                {userEmail}
              </span>
              <button onClick={handleLogout} className="btn-outline border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-6 py-2 rounded-md font-medium text-base transition-colors">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-outline px-6 py-2 rounded-md font-medium text-base transition-colors">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-richBlack/95 backdrop-blur-lg border-b border-white/10 flex flex-col py-6 px-6 space-y-4 md:hidden"
        >
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-gold"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin || isUser ? (
            <div className="flex flex-col space-y-2 pt-2 border-t border-white/5">
              <span className="text-gold text-sm font-medium px-2">
                Logged in as: {userEmail}
              </span>
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left text-red-400 hover:text-red-300 font-medium py-2 px-2">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-left text-gold hover:text-yellow-400 font-medium py-2 px-2">
              Sign In
            </Link>
          )}
        </motion.div>
      )}
    </nav>

  );
};

export default Navbar;
