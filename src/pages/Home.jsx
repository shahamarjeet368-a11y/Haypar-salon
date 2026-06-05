import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Home = () => {
  const [featuredStyles, setFeaturedStyles] = useState([]);

  const fetchStyles = async () => {
    const { data } = await supabase.from('hairstyles').select('*').limit(15);
    if (data) setFeaturedStyles(data);
  };

  useEffect(() => {
    fetchStyles();
    window.addEventListener('storage', fetchStyles);
    return () => {
      window.removeEventListener('storage', fetchStyles);
    };
  }, []);
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-richBlack pt-24 pb-12">
        
        {/* Huge Background Chair */}
        <div className="absolute inset-0 flex items-center justify-center z-0 opacity-80 pointer-events-none mt-32">
          <motion.img 
            animate={{ 
              y: [-20, 20, -20],
              rotateY: [0, 360]
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              rotateY: { repeat: Infinity, duration: 15, ease: "linear" }
            }}
            src="/barber-chair.webp" 
            alt="Luxury Barber Chair Background" 
            className="w-full min-w-[500px] md:min-w-[800px] lg:min-w-[1200px] h-auto object-contain filter drop-shadow-[0_0_60px_rgba(212,175,55,0.15)] scale-100 md:scale-125 lg:scale-150 opacity-60 md:opacity-80" 
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center mt-[-10vh]">
          
          {/* Top Text */}
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-gold to-yellow-600 mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] leading-tight"
            >
              HYPER SALON
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="text-xl md:text-3xl text-gray-200 font-light tracking-wider drop-shadow-md px-4"
            >
              Luxury Grooming Experience Since 2015
            </motion.p>
          </div>

          {/* Centered Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full"
          >
            <Link to="/book" className="btn-gold text-xl px-12 py-4 shadow-[0_0_20px_rgba(212,175,55,0.5)] whitespace-nowrap w-full sm:w-auto text-center">
              Book Appointment
            </Link>
            <Link to="/hairstyles" className="btn-outline text-xl px-12 py-4 whitespace-nowrap bg-richBlack/60 backdrop-blur-md w-full sm:w-auto text-center border-2">
              Explore Hairstyles
            </Link>
          </motion.div>
          
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
        {/* Overlay gradient to blend with next section */}
        <div className="absolute bottom-0 w-full h-48 bg-gradient-to-t from-[#111111] to-transparent z-10 pointer-events-none"></div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-richBlack relative z-20">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl">
          <h2 className="text-4xl font-heading font-bold text-white mb-8">
            About <span className="text-gold">Hyper Salon</span>
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Hyper Salon is a premium luxury grooming destination serving customers since 2015. We provide modern haircuts, beard styling, hair treatments, and professional grooming services tailored for the modern gentleman.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {['Master Stylists', 'Premium Products', 'Luxury Ambience'].map((feature, i) => (
              <div key={i} className="glass-panel p-8 rounded-xl text-center hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-xl font-bold text-gold mb-4">{feature}</h3>
                <p className="text-gray-400">Experience the finest quality service designed to perfection.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hairstyles Section */}
      <section className="py-24 bg-[#0a1424] relative z-20 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              Featured <span className="text-gold">Hairstyles</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Explore our premium cuts. (Note: these are placeholders until you add real ones from the Admin dashboard!)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStyles.length > 0 ? featuredStyles.map((style) => (
              <div key={style.id} className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  <img src={style.imageUrl || "/haircut1.webp"} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-richBlack/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{style.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gold">₹{style.price}</span>
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-gray-400 col-span-full text-center">No featured styles yet. Add them in the Admin dashboard.</p>
            )}
          </div>
          <div className="text-center mt-12">
             <Link to="/hairstyles" className="btn-outline">View All Styles</Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-[#050c18] relative z-20 border-t border-white/5">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-4xl font-heading font-bold text-white text-center mb-16">
            Customer <span className="text-gold">Reviews</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Rahul Verma", text: "Best luxury salon experience in Delhi. The 3D Barber chair on their site is as cool as the actual haircuts!" },
              { name: "Siddharth Singh", text: "Vinay and his team are true professionals. Premium products, great ambience, and totally worth the price." },
              { name: "Aman Gupta", text: "I've been a regular since 2018. The booking system is so easy to use, and I never have to wait in line anymore." }
            ].map((review, i) => (
              <div key={i} className="glass-panel p-8 rounded-xl relative">
                <div className="text-gold text-4xl font-serif absolute top-4 left-6 opacity-50">"</div>
                <p className="text-gray-300 italic mb-6 relative z-10 pt-4">"{review.text}"</p>
                <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                  <div className="w-10 h-10 rounded-full bg-navy border border-gold flex items-center justify-center font-bold text-gold">
                    {review.name.charAt(0)}
                  </div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-richBlack relative z-20 border-t border-white/5 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Ready for a <span className="text-gold">Hyper</span> Transformation?</h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">Book your appointment today and experience grooming like never before.</p>
          <Link to="/book" className="btn-gold text-xl px-12 py-4">Book Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
