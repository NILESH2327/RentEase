import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Tag, Package, DollarSign, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = ['Textbooks', 'Calculators', 'Lab Equipment', 'Electronics', 'Sports', 'Other'];
const CONDITIONS = ['Like New', 'Gently Used', 'Fair', 'Worn'];

export default function AddListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Textbooks',
    price: '',
    deposit: '',
    condition: 'Gently Used',
    location: '',
    imageUrl: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'listings'), {
        ...formData,
        price: parseFloat(formData.price),
        deposit: parseFloat(formData.deposit),
        ownerId: user.uid,
        ownerName: user.displayName,
        ownerPhoto: user.photoURL,
        status: 'available',
        images: formData.imageUrl ? [formData.imageUrl] : [],
        createdAt: serverTimestamp()
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      alert('Failed to created listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-display font-black text-slate-900">List an Item</h1>
          <p className="text-slate-500 mt-2">Help a fellow student and earn some extra cash.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Image Placeholder */}
            <div className="relative group">
              <div className="w-full h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-4 text-slate-400 group-hover:border-blue-400 group-hover:bg-blue-50 transition-all cursor-pointer">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover rounded-3xl" />
                ) : (
                  <>
                    <Camera className="w-8 h-8" />
                    <span className="font-medium">Add a photo of your item</span>
                  </>
                )}
              </div>
              <input 
                type="text" 
                placeholder="Paste image URL (for demo)" 
                className="mt-3 w-full p-3 text-sm bg-slate-50 border-none rounded-xl outline-none"
                value={formData.imageUrl}
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              />
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Item Title</label>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. TI-84 Plus CE Calculator" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Category</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Condition</label>
                  <select 
                    className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  >
                    {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Daily Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input 
                      required
                      type="number" 
                      placeholder="Price per day" 
                      className="w-full pl-8 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Security Deposit</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input 
                      required
                      type="number" 
                      placeholder="Fully refundable" 
                      className="w-full pl-8 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={formData.deposit}
                      onChange={(e) => setFormData({...formData, deposit: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Science Library, Hostel C" 
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Description</label>
                <textarea 
                  required
                  placeholder="Tell students more about the item, availability, etc." 
                  rows={4}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Confirm Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}
