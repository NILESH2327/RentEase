import { useAuth } from '../hooks/useAuth';
import { Shield, Mail, School, Calendar, LogOut, Award, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const { user, profile, signOut } = useAuth();

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        </div>

        {/* User Info */}
        <div className="px-8 pb-12 -mt-16 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-end gap-6 mb-8">
            <img 
              src={profile.photoURL || "https://picsum.photos/seed/user/200/200"} 
              className="w-40 h-40 rounded-[2.5rem] border-8 border-white shadow-xl bg-white object-cover" 
              alt={profile.displayName} 
            />
            <div className="flex-grow pb-4 space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h1 className="text-4xl font-display font-black text-slate-900">{profile.displayName}</h1>
                {profile.isVerified && (
                   <span className="bg-green-100 text-green-600 p-1.5 rounded-xl shadow-sm">
                     <UserCheck className="w-5 h-5" />
                   </span>
                )}
              </div>
              <p className="text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2">
                <School className="w-4 h-4" />
                Student ID Verified
              </p>
            </div>
            <button 
              onClick={() => signOut()}
              className="mb-4 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student Email</p>
                    <p className="font-bold text-slate-700">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <Shield className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                    <p className="font-bold text-green-600">Active Marketplace Member</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined On</p>
                    <p className="font-bold text-slate-700">April 2026</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Marketplace Karma</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-6 rounded-3xl text-center space-y-2">
                  <Award className="w-8 h-8 text-blue-600 mx-auto" />
                  <p className="text-2xl font-black text-blue-900">{profile.rating.toFixed(1)}</p>
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-widest">Platform Rating</p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-3xl text-center space-y-2">
                  <Shield className="w-8 h-8 text-indigo-600 mx-auto" />
                  <p className="text-2xl font-black text-indigo-900">100%</p>
                  <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Trust Score</p>
                </div>
              </div>
              <div className="p-6 bg-slate-900 text-white rounded-3xl">
                <p className="text-sm font-medium mb-4">Complete your college portal verification to unlock "Pro Renter" status and lower deposits.</p>
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-colors">Verify Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
