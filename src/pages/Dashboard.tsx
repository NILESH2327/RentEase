import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Listing, Rental } from '../types';
import { Package, CreditCard, Star, Clock, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myRentals, setMyRentals] = useState<Rental[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'rentals'>('listings');

  useEffect(() => {
    if (!user) return;

    const qListings = query(collection(db, 'listings'), where('ownerId', '==', user.uid));
    const unsubscribeListings = onSnapshot(qListings, (snapshot) => {
      setMyListings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing)));
    });

    const qRentals = query(collection(db, 'rentals'), where('renterId', '==', user.uid));
    const unsubscribeRentals = onSnapshot(qRentals, (snapshot) => {
      setMyRentals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rental)));
    });

    return () => {
      unsubscribeListings();
      unsubscribeRentals();
    };
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Header */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm mb-12 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <img 
            src={profile?.photoURL || "https://picsum.photos/seed/user/200/200"} 
            className="w-32 h-32 rounded-[2.5rem] object-cover border-4 border-white shadow-xl"
            alt="Profile"
          />
          {profile?.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-2xl shadow-lg">
              <Star className="w-5 h-5 fill-current" />
            </div>
          )}
        </div>
        <div className="flex-grow text-center md:text-left space-y-2">
          <h1 className="text-3xl font-display font-black text-slate-900">{profile?.displayName}</h1>
          <p className="text-slate-500 font-medium">Student at {profile?.college || 'University'}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-700">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              {profile?.rating.toFixed(1)} Rating
            </div>
            <div className="bg-slate-50 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-bold text-slate-700">
              <Package className="w-4 h-4 text-blue-500" />
              {myListings.length} Listings
            </div>
          </div>
        </div>
        <Link 
          to="/add-listing" 
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-500/20"
        >
          <PlusCircle className="w-6 h-6" />
          Add Listing
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${
            activeTab === 'listings' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Package className="w-5 h-5" />
          My Items
        </button>
        <button 
          onClick={() => setActiveTab('rentals')}
          className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold transition-all ${
            activeTab === 'rentals' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-5 h-5" />
          Rented by Me
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeTab === 'listings' ? (
          myListings.length > 0 ? myListings.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-4 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                <img src={item.images[0] || `https://picsum.photos/seed/${item.id}/600/400`} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900">
                  {item.status}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  <p className="text-slate-500 text-sm font-medium">₹{item.price} / day</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/item/${item.id}`} className="flex-grow text-center py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors">Manage</Link>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="md:col-span-3 py-20 text-center space-y-4 opacity-50">
              <Package className="w-16 h-16 mx-auto text-slate-300" />
              <p className="text-xl font-bold">You haven't listed anything yet.</p>
              <Link to="/add-listing" className="text-blue-600 font-bold hover:underline">List your first item</Link>
            </div>
          )
        ) : (
          myRentals.length > 0 ? myRentals.map((rental, i) => (
            <motion.div 
              key={rental.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 flex items-center gap-6"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={rental.itemImage || "https://picsum.photos/seed/item/200/200"} className="w-full h-full object-cover" alt="Item" />
              </div>
              <div className="flex-grow min-w-0 space-y-1">
                <h3 className="font-bold text-slate-900 truncate">{rental.itemTitle || 'Rented Item'}</h3>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  <span className={rental.status === 'active' ? 'text-green-600' : 'text-orange-500'}>{rental.status}</span>
                </div>
                <p className="text-slate-400 text-xs">Total paid: ₹{rental.totalPrice}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-300 flex-shrink-0" />
            </motion.div>
          )) : (
            <div className="md:col-span-3 py-20 text-center space-y-4 opacity-50">
              <CreditCard className="w-16 h-16 mx-auto text-slate-300" />
              <p className="text-xl font-bold">No active rentals found.</p>
              <Link to="/browse" className="text-blue-600 font-bold hover:underline">Browse items to rent</Link>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
