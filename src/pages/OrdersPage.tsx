import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Rental } from '../types';
import { Calendar, Package, Clock, CheckCircle, XCircle, ChevronRight, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'rentals'), where('renterId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRentals(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rental)));
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-black text-slate-900">Your Rentals</h1>
        <p className="text-slate-500 mt-2">Track your active bookings and history.</p>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : rentals.length > 0 ? (
        <div className="space-y-8">
          {rentals.map((rental, i) => (
            <motion.div 
              key={rental.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow"
            >
              <div className="w-full md:w-48 aspect-square flex-shrink-0">
                <img src={rental.itemImage || "https://picsum.photos/seed/item/400/400"} className="w-full h-full object-cover" alt="Item" />
              </div>
              <div className="p-8 flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{rental.itemTitle}</h2>
                    <p className="text-slate-400 text-sm font-medium">Rental ID: {rental.id.slice(0,8)}</p>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    rental.status === 'active' ? 'bg-green-100 text-green-600' : 
                    rental.status === 'requested' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {rental.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-50">
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Starts</p>
                     <p className="text-sm font-bold flex items-center gap-1">
                       <Calendar className="w-3 h-3" />
                       {rental.startDate?.toDate ? rental.startDate.toDate().toLocaleDateString() : 'Today'}
                     </p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price Paid</p>
                     <p className="text-sm font-bold">₹{rental.totalPrice}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deposit</p>
                     <p className="text-sm font-bold text-blue-600">₹{rental.deposit}</p>
                   </div>
                   <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Handover</p>
                     <p className="text-sm font-bold">In-Person</p>
                   </div>
                </div>

                <div className="pt-6 flex flex-wrap gap-3">
                   <button className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                     <MessageSquare className="w-4 h-4" />
                     Message Owner
                   </button>
                   <button className="bg-white border border-slate-200 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                     View Details
                   </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <Package className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">No rentals yet</h2>
            <p className="text-slate-500">Items you rent will appear here for tracking.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/browse'}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Go to Marketplace
          </button>
        </div>
      )}
    </div>
  );
}
