import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const HairstylesCMS = () => {
  const [hairstyles, setHairstyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', price: '', imageUrl: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchHairstyles = async () => {
    try {
      const { data, error } = await supabase.from('hairstyles').select('*');
      if (error) throw error;
      if (data) setHairstyles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHairstyles();
  }, []);

  const openAddModal = () => {
    setFormData({ id: '', name: '', price: '', imageUrl: '' });
    setIsEditing(false);
    setShowModal(true);
  };

  const openEditModal = (style) => {
    setFormData(style);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this hairstyle?")) {
      try {
        const { error } = await supabase.from('hairstyles').delete().eq('id', id);
        if (error) throw error;
        setHairstyles(hairstyles.filter(h => h.id !== id));
      } catch (err) {
        console.error("Error deleting", err);
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('hairstyles')
          .update({ name: formData.name, price: formData.price, imageUrl: formData.imageUrl })
          .eq('id', formData.id);
        if (error) throw error;
        
        setHairstyles(hairstyles.map(h => h.id === formData.id ? { ...h, ...formData } : h));
      } else {
        const { data, error } = await supabase
          .from('hairstyles')
          .insert([{ name: formData.name, price: formData.price, imageUrl: formData.imageUrl }])
          .select();
        if (error) throw error;
        
        if (data) setHairstyles([...hairstyles, data[0]]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Error saving hairstyle", err);
      alert("Error saving: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading hairstyles...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-heading font-bold text-white">Hairstyles Management</h2>
        <button onClick={openAddModal} className="btn-gold flex items-center gap-2">
          <Plus size={20} /> Add Hairstyle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hairstyles.map((style) => (
          <div key={style.id} className="glass-panel rounded-xl overflow-hidden border border-white/5 group">
            <div className="h-48 bg-[#050c18] relative">
              {style.imageUrl ? (
                <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
              )}
            </div>
            <div className="p-5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{style.name}</h3>
                <p className="text-gold font-medium">₹{style.price}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEditModal(style)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(style.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">{isEditing ? 'Edit Hairstyle' : 'Add Hairstyle'}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                  className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-gold"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Upload Image</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full bg-[#050c18] border border-white/10 rounded px-4 py-2 text-white focus:outline-none focus:border-gold file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-richBlack hover:file:bg-yellow-500"
                />
                {formData.imageUrl && (
                  <div className="mt-4 h-32 rounded overflow-hidden border border-white/10">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div className="pt-4 flex gap-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={isSaving} className="btn-gold flex-1">
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HairstylesCMS;
