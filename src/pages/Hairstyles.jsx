import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Hairstyles = () => {
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHairstyles = async () => {
      try {
        const { data, error } = await supabase
          .from('hairstyles')
          .select('*');
          
        if (data && !error) {
          setHairstyles(data);
        } else if (error) {
          console.error("Supabase error:", error);
        }
      } catch (err) {
        console.error("Error fetching hairstyles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHairstyles();
  }, []);

  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-heading font-bold text-white mb-4">
            Our <span className="text-gold">Hairstyles</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium haircuts and styling options.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold"></div>
          </div>
        ) : hairstyles.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Fallback Static Data */}
            {[
              { id: 1, name: "Luxury Pompadour", price: "500", imageUrl: "/haircut1.png" },
              { id: 2, name: "Modern Textured Crop", price: "400", imageUrl: "/haircut2.png" },
              { id: 3, name: "Premium Beard Sculpt", price: "300", imageUrl: "/haircut1.png" }
            ].map((style) => (
              <div key={style.id} className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-richBlack/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{style.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gold">₹{style.price}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-span-full text-center mt-8 text-gray-500 border border-white/10 p-4 rounded-xl">
              <p>These are placeholder images because the database table is empty or missing.</p>
              <p>Add real hairstyles from the Admin Dashboard!</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hairstyles.map((style) => (
              <div key={style.id} className="glass-panel rounded-xl overflow-hidden group cursor-pointer hover:-translate-y-2 transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  {style.imageUrl ? (
                    <img 
                      src={style.imageUrl} 
                      alt={style.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-navy flex items-center justify-center text-gray-500">No Image</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-richBlack/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{style.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xl font-bold text-gold">₹{style.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hairstyles;
