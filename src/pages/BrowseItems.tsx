import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Listing } from '../types';
import { Search, Filter, MapPin, Tag, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const CATEGORIES = ['All', 'Textbooks', 'Calculators', 'Lab Equipment', 'Electronics', 'Sports', 'Other'];

const SEED_DATA = [
  { title: 'TI-84 Plus CE Graphing Calculator', category: 'Calculators', price: 15, deposit: 500, description: 'Perfect condition, includes charger. Used for 1 semester.', condition: 'Like New', location: 'Science Library' },
  { title: 'Organic Chemistry: Structure and Function', category: 'Textbooks', price: 10, deposit: 200, description: '8th Edition. Minimal highlighting.', condition: 'Gently Used', location: 'Hostel A' },
  { title: 'Digital Multimeter', category: 'Electronics', price: 25, deposit: 1000, description: ' fluke 101. Great for lab projects.', condition: 'Gently Used', location: 'Main Gate' },
  { title: 'Lab Coat (Medium)', category: 'Lab Equipment', price: 5, deposit: 100, description: 'White lab coat, washed and clean.', condition: 'Fair', location: 'Biotech Dept' },
  { title: 'Introduction to Algorithms (CLRS)', category: 'Textbooks', price: 12, deposit: 400, description: 'The "Bible" of algorithms. Hardcover.', condition: 'Gently Used', location: 'CS Lab' }
];

export default function BrowseItems() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [seeding, setSeeding] = useState(false);

  const seedStore = async () => {
    setSeeding(true);
    for (const item of SEED_DATA) {
      await addDoc(collection(db, 'listings'), {
        ...item,
        ownerId: 'system',
        ownerName: 'RentEase Admin',
        ownerPhoto: 'https://picsum.photos/seed/admin/100/100',
        images: [`https://picsum.photos/seed/${item.title.length}/800/800`],
        status: 'available',
        createdAt: serverTimestamp()
      });
    }
    setSeeding(false);
  };

  useEffect(() => {
    let q = query(collection(db, 'listings'), where('status', '==', 'available'), orderBy('createdAt', 'desc'));
    
    if (selectedCategory !== 'All') {
      q = query(collection(db, 'listings'), where('status', '==', 'available'), where('category', '==', selectedCategory), orderBy('createdAt', 'desc'));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Listing));
      if (docs.length === 0 && selectedCategory === 'All' && !seeding) {
        // Option to seed will be shown if empty
      }
      setListings(docs);
      setLoading(false);
    });

    return unsubscribe;
  }, [selectedCategory]);

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Trending on Campus</h1>
          <p className="text-[13px] text-slate-500 mt-1">Handpicked rentals from verified students in your area</p>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search for books, calculators..." 
              className="w-full md:w-[320px] pl-10 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-full text-sm focus:bg-white focus:border-slate-200 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="mb-10 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex gap-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`theme-pill ${selectedCategory === cat ? 'theme-pill-active' : ''}`}
            >
              {cat === 'All' ? 'All items' : cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="theme-card h-[340px] animate-pulse" />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredListings.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="theme-card overflow-hidden group"
            >
              <Link to={`/item/${item.id}`} className="block">
                <div className="relative h-[180px] bg-slate-200">
                  <img 
                    src={item.images[0] || `https://picsum.photos/seed/${item.id}/600/800`} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 theme-tag">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold shadow-sm">
                    ✓
                  </div>
                </div>
                <div className="p-4">
                  <span className="font-semibold text-[15px] text-slate-800 line-clamp-1 mb-1">{item.title}</span>
                  <div className="flex items-center gap-2 text-[12px] text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {item.location || 'Campus'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-slate-700">⭐ 4.9</span>
                  </div>
                  <div className="text-[18px] font-bold text-slate-800 mb-4">
                    ₹{item.price}<span className="text-[12px] font-normal text-slate-500">/day</span>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-500">
                    <span>Owner: {item.ownerName?.split(' ')[0] || 'Student'}</span>
                    <span>Just now</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 space-y-4">
          <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700">No items found</h2>
          <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
          <div className="flex flex-col items-center gap-4 pt-4">
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="text-blue-600 font-bold hover:underline"
            >
              Clear all filters
            </button>
            <button 
              onClick={seedStore}
              disabled={seeding}
              className="flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-100"
            >
              <Sparkles className="w-4 h-4" />
              {seeding ? 'Seeding...' : 'Load Demo Marketplace Data'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
