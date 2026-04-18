import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Listing } from '../types';
import { MapPin, Tag, Shield, Calendar, CreditCard, MessageCircle, Star, ArrowLeft, Loader2, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function ItemDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [renting, setRenting] = useState(false);
  const [days, setDays] = useState(1);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      const docSnap = await getDoc(doc(db, 'listings', id));
      if (docSnap.exists()) {
        setListing({ id: docSnap.id, ...docSnap.data() } as Listing);
      }
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleRent = async () => {
    if (!user || !listing) return;
    if (listing.ownerId === user.uid) {
      alert("You can't rent your own item!");
      return;
    }

    setRenting(true);
    try {
      await addDoc(collection(db, 'rentals'), {
        listingId: listing.id,
        itemTitle: listing.title,
        itemImage: listing.images[0] || '',
        renterId: user.uid,
        ownerId: listing.ownerId,
        startDate: serverTimestamp(),
        endDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000),
        status: 'requested',
        totalPrice: listing.price * days,
        deposit: listing.deposit,
        createdAt: serverTimestamp()
      });
      navigate('/rentals');
    } catch (err) {
      console.error(err);
      alert('Failed to process rental request');
    } finally {
      setRenting(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-display text-2xl animate-pulse">Scanning item...</div>;
  if (!listing) return <div className="h-screen flex flex-col items-center justify-center gap-4">
    <h2 className="text-2xl font-bold">Item not found</h2>
    <button onClick={() => navigate('/browse')} className="text-blue-600 font-bold hover:underline">Back to Marketplace</button>
  </div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-200 border-4 border-white shadow-sm">
            <img 
              src={listing.images[0] || `https://picsum.photos/seed/${listing.id}/800/800`} 
              className="w-full h-full object-cover" 
              alt={listing.title}
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden bg-slate-100 border-2 border-transparent hover:border-blue-500 cursor-pointer transition-all">
                <img src={`https://picsum.photos/seed/${i + listing.id}/200/200`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Info & Pricing */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
               <span className="theme-tag">{listing.category}</span>
               <span className="flex items-center gap-1 text-[12px] font-medium text-slate-400">
                 <MapPin className="w-3 h-3" />
                 {listing.location}
               </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 leading-tight">{listing.title}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img src={listing.ownerPhoto || "https://picsum.photos/seed/owner/100/100"} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Owner</p>
                  <p className="text-[14px] font-semibold text-slate-800">{listing.ownerName || 'Student'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 theme-card space-y-6">
             <div className="flex justify-between items-end">
               <div>
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Price per day</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-bold text-slate-800">₹{listing.price}</span>
                   <span className="text-slate-500 text-sm">/day</span>
                 </div>
               </div>
               <div className="text-right">
                 <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Deposit</p>
                 <p className="text-xl font-bold text-slate-800">₹{listing.deposit}</p>
               </div>
             </div>

             <div className="space-y-4 pt-4 border-t border-slate-100">
               <div className="flex items-center justify-between text-sm">
                 <label className="font-semibold text-slate-600">Rent duration</label>
                 <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-full border border-slate-100">
                   <button onClick={() => setDays(Math.max(1, days-1))} className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm font-bold">-</button>
                   <span className="w-6 text-center font-bold">{days} days</span>
                   <button onClick={() => setDays(days+1)} className="w-7 h-7 flex items-center justify-center bg-white rounded-full shadow-sm font-bold">+</button>
                 </div>
               </div>
             </div>

             <div className="grid gap-3 pt-2">
                <button 
                  onClick={handleRent}
                  disabled={renting}
                  className="w-full theme-btn-primary py-4 text-[16px] shadow-lg shadow-blue-500/10"
                >
                  {renting ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : `Confirm Rental • ₹${listing.price * days}`}
                </button>
                <button className="w-full py-4 rounded-full text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm">
                  Chat with Owner
                </button>
             </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <Info className="w-6 h-6 text-slate-400" />
              Item Description
            </h3>
            <p className="text-slate-600 leading-relaxed text-lg">
              {listing.description}
            </p>
            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Condition</p>
                 <p className="font-bold text-slate-900">{listing.condition}</p>
               </div>
               <div className="p-6 bg-slate-50 rounded-3xl space-y-1">
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verification</p>
                 <p className="font-bold text-green-600 flex items-center gap-1">
                   <Shield className="w-4 h-4" />
                   Item Inspected
                 </p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
