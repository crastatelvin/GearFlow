"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Shield, MapPin, Settings, User, LogOut, Star } from 'lucide-react';

export default function CustomerDashboard() {
  const history = [
    { id: '1', date: 'May 01, 2026', service: 'Full Engine Tune-up', bike: 'Royal Enfield Classic 350', status: 'COMPLETED', price: '₹3,450' },
    { id: '2', date: 'April 12, 2026', service: 'Chain & Brake Clean', bike: 'Royal Enfield Classic 350', status: 'COMPLETED', price: '₹850' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Sidebar Overlay (Simplified for User) */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-neon rounded flex items-center justify-center">
              <Zap className="text-black w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">GEAR<span className="text-brand-neon">FLOW</span></span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black uppercase tracking-widest">Rahul Sharma</p>
                <p className="text-[10px] text-brand-neon font-bold">PREMIUM MEMBER</p>
              </div>
              <div className="w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center">
                <User className="text-brand-neon w-5 h-5" />
              </div>
            </div>
            <button className="text-gray-500 hover:text-red-500 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Profile & Stats */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass p-8 rounded-[2rem] border-white/10"
            >
              <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Your Garage</h2>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Zap size={60} />
                 </div>
                 <p className="text-[10px] font-bold text-brand-neon uppercase mb-1">Primary Bike</p>
                 <h3 className="text-xl font-black italic mb-4">RE Classic 350</h3>
                 <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Shield size={12} className="text-brand-neon" /> Verified</span>
                    <span className="flex items-center gap-1"><Clock size={12} className="text-brand-neon" /> Next Service: 45 Days</span>
                 </div>
              </div>
            </motion.div>

            <div className="glass p-8 rounded-[2rem] border-white/10">
               <h2 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-6">Loyalty Points</h2>
               <div className="flex items-end gap-2">
                  <span className="text-5xl font-black italic">1,250</span>
                  <span className="text-brand-neon font-bold mb-1">GEARBITS</span>
               </div>
               <p className="text-gray-500 text-xs mt-2">You can redeem these for a free oil change!</p>
            </div>
          </div>

          {/* Right Column: Service History */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-[2rem] border-white/10 min-h-[500px]"
            >
              <div className="flex justify-between items-end mb-8">
                <h1 className="text-3xl font-black tracking-tighter">SERVICE <span className="text-brand-neon italic">HISTORY</span></h1>
                <button className="text-[10px] font-black text-brand-neon border border-brand-neon/30 px-4 py-2 rounded-xl hover:bg-brand-neon hover:text-black transition-all">
                   DOWNLOAD ALL INVOICES
                </button>
              </div>

              <div className="space-y-4">
                {history.map((item) => (
                  <div key={item.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-brand-neon/30 transition-colors">
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">{item.date}</p>
                      <h4 className="font-bold text-lg">{item.service}</h4>
                      <p className="text-xs text-gray-400">{item.bike}</p>
                    </div>
                    <div className="flex items-center justify-between sm:text-right gap-8">
                       <div>
                          <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Amount</p>
                          <p className="font-black text-brand-neon">{item.price}</p>
                       </div>
                       <div className="px-4 py-2 bg-brand-neon/10 border border-brand-neon/20 rounded-xl">
                          <span className="text-[10px] font-black text-brand-neon uppercase tracking-widest">COMPLETED</span>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </main>
    </div>
  );
}
