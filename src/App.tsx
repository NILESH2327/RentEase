/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import BrowseItems from './pages/BrowseItems';
import AddListing from './pages/AddListing';
import ItemDetail from './pages/ItemDetail';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import { LogIn, User as UserIcon, PlusCircle, Search, ShoppingBag, Menu, X, LogOut } from 'lucide-react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="h-[72px] sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-10 h-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
            Rent<span className="text-emerald-500">Ease</span>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[14px] font-semibold">
          <Link to="/browse" className="text-slate-600 hover:text-blue-600 transition-colors">Browse Marketplace</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-slate-600 hover:text-blue-600 transition-colors">Dashboard</Link>
              <Link to="/rentals" className="text-slate-600 hover:text-blue-600 transition-colors">Rentals</Link>
              <Link to="/add-listing" className="theme-btn-primary">
                + List an Item
              </Link>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                 <Link to="/profile">
                   <img src={profile?.photoURL || "https://picsum.photos/seed/user/100/100"} alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-[0_0_0_2px_#2563eb] object-cover" />
                 </Link>
                 <button onClick={() => signOut()} className="text-slate-400 hover:text-red-500">
                   <LogOut className="w-5 h-5" />
                 </button>
              </div>
            </>
          ) : (
            <Link to="/auth" className="theme-btn-primary">
              Student Login
            </Link>
          )}
        </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col items-center">
              <Link to="/browse" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Browse Items</Link>
              {user ? (
                <>
                  <Link to="/dashboard" className="text-lg font-medium" onClick={() => setIsOpen(false)}>Dashboard</Link>
                  <Link to="/rentals" className="text-lg font-medium" onClick={() => setIsOpen(false)}>My Rentals</Link>
                  <Link to="/add-listing" className="bg-blue-600 text-white w-full text-center py-3 rounded-xl" onClick={() => setIsOpen(false)}>List Item</Link>
                  <button onClick={() => { signOut(); setIsOpen(false); }} className="text-red-500 font-medium pt-4">Logout</button>
                </>
              ) : (
                <Link to="/auth" className="bg-blue-600 text-white w-full text-center py-3 rounded-xl font-bold" onClick={() => setIsOpen(false)}>Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/browse" element={<BrowseItems />} />
              <Route path="/item/:id" element={<ItemDetail />} />
              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/rentals" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
              <Route path="/add-listing" element={<PrivateRoute><AddListing /></PrivateRoute>} />
              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/auth" element={<LandingPage showAuth />} />
            </Routes>
          </main>
          <footer className="bg-white border-t border-slate-200 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-2 text-2xl font-display font-bold text-blue-600">
                <ShoppingBag className="w-8 h-8" />
                <span>RentEase</span>
              </div>
              <p className="text-slate-500 text-sm">© 2026 RentEase Student Marketplace. Built for students, by students.</p>
              <div className="flex gap-6 text-sm font-medium text-slate-600">
                <a href="#" className="hover:text-blue-600">Terms</a>
                <a href="#" className="hover:text-blue-600">Privacy</a>
                <a href="#" className="hover:text-blue-600">Safety</a>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

