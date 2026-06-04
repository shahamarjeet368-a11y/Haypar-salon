import { useState, useEffect } from 'react';
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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Hair Styles', path: '/hairstyles' },
    { name: 'Book Appointment', path: '/book' },
  ];

  const isDashboard = location.pathname.includes('/admin/dashboard');

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} py-2 md:py-4`}>
      <div className="w-full max-w-[1600px] mx-auto px-2 md:px-6 flex justify-between items-center">
        <div className="flex items-center -ml-2 md:-ml-4">
          {!isDashboard && (
            <Link to="/">
              <img src="/logo.png" alt="HYPER SALON Logo" className="h-16 md:h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-100 md:scale-110 origin-left" />
            </Link>
          )}
        </div>

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
          <Link to="/admin" className="btn-gold">Login</Link>
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
          <Link 
            to="/admin" 
            onClick={() => setMobileMenuOpen(false)}
            className="btn-gold text-center mt-2"
          >
            Login
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
