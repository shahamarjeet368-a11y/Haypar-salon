import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const ViewImage = () => {
  const [searchParams] = useSearchParams();
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const fetchImage = async () => {
        try {
          const { data, error: fetchError } = await supabase
            .from('qr_images')
            .select('imageUrl')
            .eq('id', id)
            .single();

          if (fetchError) throw fetchError;
          
          if (data && data.imageUrl) {
            setImageUrl(data.imageUrl);
          } else {
            setError(true);
          }
        } catch (e) {
          console.error("Error fetching QR image:", e);
          setError(true);
        }
      };
      fetchImage();
    } else {
      setError(true);
    }
  }, [searchParams]);

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-richBlack px-6">
      <div className="w-full max-w-xl glass-panel p-8 rounded-2xl border border-white/10 text-center flex flex-col items-center">
        {error ? (
          <div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Image Not Found</h2>
            <p className="text-gray-400 mb-8">The image associated with this QR Code could not be found or has expired.</p>
            <Link to="/" className="btn-gold inline-block">Go to Home</Link>
          </div>
        ) : imageUrl ? (
          <div>
            <span className="bg-gold/10 text-gold text-xs font-semibold px-3 py-1 rounded-full border border-gold/20 uppercase tracking-widest inline-block mb-6">
              Scanned Image View
            </span>
            <div className="bg-[#050c18] p-4 rounded-xl border border-white/10 shadow-2xl max-h-[60vh] overflow-hidden flex items-center justify-center mb-8">
              <img src={imageUrl} alt="Scanned from QR Code" className="w-full h-auto object-contain rounded-lg max-h-[50vh]" />
            </div>
            <div className="flex gap-4 justify-center">
              <a href={imageUrl} download="scanned_image.jpg" className="btn-gold">
                Save Image
              </a>
              <Link to="/book" className="btn-outline">
                Book Appointment
              </Link>
            </div>
          </div>
        ) : (
          <div className="animate-pulse space-y-4">
            <div className="w-16 h-16 bg-navy rounded-full mx-auto"></div>
            <div className="h-4 bg-navy rounded w-2/3 mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewImage;
