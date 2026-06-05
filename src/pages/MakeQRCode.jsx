import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { supabase } from '../lib/supabase';

const MakeQRCode = () => {
  const [qrMode, setQrMode] = useState('text'); // 'text' or 'image'
  const [text, setText] = useState('https://hypersalon.com');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [logo, setLogo] = useState(null);
  const [bottomText, setBottomText] = useState('SCAN ME');
  const [fontFamily, setFontFamily] = useState('Outfit');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const canvasRef = useRef(null);

  const fontOptions = [
    { name: 'Outfit (Modern)', value: 'Outfit' },
    { name: 'Inter (Clean)', value: 'Inter' },
    { name: 'Playfair Display (Luxury Serif)', value: 'Playfair Display' },
    { name: 'Great Vibes (Luxury Cursive)', value: 'Great Vibes' },
    { name: 'Courier New (Retro)', value: 'Courier New' }
  ];

  const generateQR = async () => {
    try {
      setError('');
      const canvas = canvasRef.current;
      if (!canvas) return;

      const hasBottomText = bottomText && bottomText.trim().length > 0;
      canvas.width = 400;
      canvas.height = hasBottomText ? 465 : 400;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill background white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render QR on offscreen canvas
      const qrCanvas = document.createElement('canvas');
      await QRCode.toCanvas(qrCanvas, text || 'https://hypersalon.com', {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });

      // Draw QR onto main canvas
      ctx.drawImage(qrCanvas, 0, 0);

      const drawText = () => {
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const fontSize = fontFamily === 'Great Vibes' ? '36px' : '22px';
        ctx.font = `bold ${fontSize} "${fontFamily}", sans-serif`;
        ctx.fillText(bottomText, 200, 432);
      };

      // Overlay logo if provided
      if (logo) {
        const img = new Image();
        img.onload = () => {
          const logoSize = 80; // size of central logo
          const x = (canvas.width - logoSize) / 2;
          const y = (400 - logoSize) / 2; // Center of the 400x400 QR area

          // Round background rectangle behind logo
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          if (ctx.roundRect) {
            ctx.roundRect(x - 5, y - 5, logoSize + 10, logoSize + 10, 10);
          } else {
            ctx.rect(x - 5, y - 5, logoSize + 10, logoSize + 10);
          }
          ctx.fill();

          // Draw logo
          ctx.drawImage(img, x, y, logoSize, logoSize);
          
          // Draw bottom text if it exists (draw after logo loads to avoid race condition)
          if (hasBottomText) {
            drawText();
          }
        };
        img.src = logo;
      } else {
        // Draw bottom text if no logo
        if (hasBottomText) {
          drawText();
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate QR Code');
    }
  };

  useEffect(() => {
    // If the font is not loaded yet, wait for it to load to prevent canvas render bugs
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`1em "${fontFamily}"`).then(() => {
        generateQR();
      }).catch(() => {
        generateQR();
      });
    } else {
      generateQR();
    }
  }, [text, logo, bottomText, fontFamily]);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQRImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      setError('');
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = async () => {
          // Compress image to fit in mock local storage & prevent database bloat
          const MAX_WIDTH = 300;
          const MAX_HEIGHT = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Get compressed Base64 image data (JPEG at 50% quality)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
          setUploadedImage(compressedBase64);

          // Save image to Supabase database (or local fallback)
          const imgId = 'img_' + Math.random().toString(36).substring(2, 9);
          try {
            const { error: uploadError } = await supabase
              .from('qr_images')
              .insert([{ id: imgId, imageUrl: compressedBase64 }]);

            if (uploadError) throw uploadError;

            // Set QR content to local URL pointing to the ViewImage page
            const qrUrl = `${window.location.origin}/view-image?id=${imgId}`;
            setText(qrUrl);
          } catch (err) {
            console.error(err);
            setError("Failed to store image in database: " + (err.message || err));
          } finally {
            setUploading(false);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'qrcode.png';
      link.href = dataURL;
      link.click();
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen flex items-center justify-center bg-richBlack">
      <div className="w-full max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Settings Box */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-heading font-bold text-white mb-2">
              Make <span className="text-gold">QR Code</span>
            </h2>
            <p className="text-gray-400 mb-6 text-sm">Generate custom QR codes for your links, text, or images with custom logos.</p>
            
            {/* Mode selection tabs */}
            <div className="flex gap-4 mb-6 p-1 bg-[#050c18] border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => { setQrMode('text'); setText('https://hypersalon.com'); setUploadedImage(null); }}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${qrMode === 'text' ? 'bg-gold text-richBlack' : 'text-gray-400 hover:text-white'}`}
              >
                Link / Text
              </button>
              <button
                type="button"
                onClick={() => { setQrMode('image'); setText(''); }}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold text-sm transition-all ${qrMode === 'image' ? 'bg-gold text-richBlack' : 'text-gray-400 hover:text-white'}`}
              >
                Upload Image
              </button>
            </div>

            {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-6 text-sm">{error}</div>}

            <div className="space-y-6">
              {qrMode === 'text' ? (
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-semibold">QR Code Content (Link / Text)</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-3 text-white focus:outline-none focus:border-gold resize-none"
                    placeholder="Enter URL or text to encode..."
                  ></textarea>
                </div>
              ) : (
                <div>
                  <label className="block text-gray-400 mb-2 text-sm font-semibold">Upload Image to QR Code</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQRImageUpload}
                    disabled={uploading}
                    className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-gold file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-richBlack hover:file:bg-yellow-500 disabled:opacity-50"
                  />
                  {uploading && <p className="text-gold text-xs mt-2 animate-pulse">Compressing and uploading image...</p>}
                  {uploadedImage && !uploading && (
                    <div className="mt-4 h-32 rounded overflow-hidden border border-white/10">
                      <img src={uploadedImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-gray-400 mb-2 text-sm font-semibold">Upload Center Logo (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-gold file:mr-4 file:py-1 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-richBlack hover:file:bg-yellow-500"
                />
              </div>

              {/* Custom Bottom Text Section */}
              <div className="space-y-4 border-t border-white/5 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gold">Customize QR Text</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Bottom Text</label>
                    <input
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      placeholder="e.g. SCAN ME"
                      className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2 text-sm">Font Style</label>
                    <select
                      value={fontFamily}
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                    >
                      {fontOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div className="pt-8 flex gap-4">
            <button onClick={handleDownload} className="btn-gold flex-1" disabled={!text || uploading}>
              Download PNG
            </button>
            {logo && (
              <button onClick={() => setLogo(null)} className="btn-outline flex-1 border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white">
                Remove Logo
              </button>
            )}
          </div>
        </div>

        {/* Display Canvas Box */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 flex flex-col items-center justify-center">
          <div className="bg-white p-4 rounded-xl shadow-2xl">
            {text ? (
              <canvas ref={canvasRef} style={{ width: '280px', height: bottomText.trim().length > 0 ? '325px' : '280px' }}></canvas>
            ) : (
              <div className="w-[280px] h-[280px] flex items-center justify-center text-gray-400 text-sm italic">
                Upload image to generate QR Code
              </div>
            )}
          </div>
          <p className="text-gray-400 text-xs mt-6 text-center">
            {qrMode === 'image' && text ? 'Scan QR Code to open the uploaded image on any phone.' : 'High Quality PNG with Error Correction Level H.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MakeQRCode;
