import { motion } from 'motion/react';
import { Search, Shield, Zap, Heart, TrendingUp, DollarSign, ShoppingBag } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function LandingPage({ showAuth }: { showAuth?: boolean }) {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-black tracking-tight text-slate-900"
          >
            Rent what you need, <br />
            <span className="text-blue-600">earn from what you own.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto text-xl text-slate-600"
          >
            The trusted peer-to-peer marketplace for students to rent textbooks, 
            calculators, lab gear, and tech securely.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4 pt-4"
          >
            <button 
              onClick={() => navigate('/browse')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse Listings
            </button>
            <button 
              onClick={handleLogin}
              className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
            >
              <DollarSign className="w-5 h-5" />
              Start Earning
            </button>
          </motion.div>
        </div>

        {/* Floating Images / Feature Tags */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { tag: "Calculators", img: "https://picsum.photos/seed/calc/400/500" },
            { tag: "Textbooks", img: "https://picsum.photos/seed/book/400/500" },
            { tag: "Lab Coats", img: "https://picsum.photos/seed/lab/400/500" },
            { tag: "Drones", img: "https://picsum.photos/seed/drone/400/500" },
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 + 0.3 }}
              className="relative group cursor-pointer"
            >
              <img src={item.img} alt={item.tag} className="w-full h-64 object-cover rounded-3xl shadow-md group-hover:shadow-xl transition-shadow border-4 border-white" referrerPolicy="no-referrer" />
              <div className="absolute top-4 left-4">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">{item.tag}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 mb-12">
        <div className="bg-emerald-50 border border-emerald-500/20 p-6 rounded-2xl flex items-center gap-4 text-emerald-900 text-[14px]">
          <span className="text-2xl">🛡️</span>
          <div>
            <strong className="text-emerald-600 block sm:inline">Student Verified Protection:</strong> Every user on RentEase is verified using their university email. Deposits are held securely until the item is returned in stated condition.
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <h2 className="text-3xl font-display font-bold mb-12">Why students choose RentEase</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Verified Profiles</h3>
              <p className="text-slate-600">Every user is verified with their college email domain to ensure a safe student community.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Low Service Fees</h3>
              <p className="text-slate-600">We keep it affordable. Pay only for the days you use, with no hidden predatory costs.</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Instant Handover</h3>
              <p className="text-slate-600">Pick up items directly on campus. No waiting for shipping or expensive courier fees.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal / Overlay */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
            <button onClick={() => navigate('/')} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-blue-50 p-4 rounded-3xl">
                  <ShoppingBag className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome to RentEase</h2>
                <p className="text-slate-500">Connect with your student account to continue.</p>
              </div>
              <button 
                onClick={handleLogin}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-colors"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5 mx-0" alt="Google" />
                Continue with Student Identity
              </button>
              <p className="text-xs text-slate-400">By continuing, you agree to our Student Community Guidelines.</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function X(props: any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
