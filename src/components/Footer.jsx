import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const Footer = () => {
  const [location, setLocation] = useState({
    address: "Nangloi Prem Nagar 3,\nDurga Chowk,\nDelhi"
  });

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('address')
          .eq('id', 'salonLocation')
          .single();
          
        if (data && !error) {
          setLocation(data);
        }
      } catch (err) {
        console.error("Error fetching location", err);
      }
    };
    fetchLocation();
  }, []);

  return (
    <footer className="bg-[#050c18] border-t border-white/5 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        {/* Salon Owner */}
        <div>
          <h3 className="text-xl font-heading font-bold text-gold mb-6">HYPER SALON</h3>
          <p className="text-gray-400 mb-2">Premium Luxury Salon since 2015</p>
          <div className="mt-4 space-y-2">
            <p className="text-gray-300"><span className="text-gold font-medium">Owner:</span> Vinay Kumar</p>
            <p className="text-gray-300"><span className="text-gold font-medium">Phone:</span> +91 8285850845</p>
          </div>
        </div>

        {/* Location */}
        <div>
          <h3 className="text-xl font-heading font-bold text-gold mb-6">Location</h3>
          <p className="text-gray-300 whitespace-pre-line mb-4 leading-relaxed">
            {location.address}
          </p>
          {/* Simple placeholder for Maps Embed */}
          <div className="w-full h-48 bg-navy rounded-lg overflow-hidden border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
            <iframe 
              title="Google Maps"
              width="100%" 
              height="100%" 
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${encodeURIComponent(location.address.replace(/\n/g, ' '))}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        </div>

        {/* Developer */}
        <div>
          <h3 className="text-xl font-heading font-bold text-silver mb-6">Developer</h3>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-navy border border-gold flex items-center justify-center text-xl font-bold">
              AS
            </div>
            <div>
              <p className="text-gray-200 font-medium text-lg">Amarjeet Shah</p>
              <p className="text-gold text-sm">Full Stack Developer</p>
            </div>
          </div>
          <div className="space-y-2 mt-4 text-sm">
            <p className="text-gray-400"><span className="text-silver">Email:</span> shahamarjeet368@gmail.com</p>
            <p className="text-gray-400"><span className="text-silver">Phone:</span> +91 6203351271</p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-600 text-sm border-t border-white/5 pt-8">
        &copy; {new Date().getFullYear()} HYPER SALON. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
