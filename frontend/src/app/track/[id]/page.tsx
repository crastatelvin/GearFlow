"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  CheckCircle2,
  Navigation,
  Star
} from 'lucide-react';

const statuses = [
  { id: 'PENDING', label: 'Order Received', icon: <Clock size={20} /> },
  { id: 'DISPATCHED', label: 'Mechanic On The Way', icon: <Navigation size={20} /> },
  { id: 'ARRIVED', label: 'Arrived at Location', icon: <MapPin size={20} /> },
  { id: 'WORKING', label: 'Service In Progress', icon: <Zap size={20} /> },
  { id: 'COMPLETED', label: 'Work Finished', icon: <CheckCircle2 size={20} /> },
];

export default function TrackingPortal({ params }: { params: { id: string } }) {
  const [currentStatus, setCurrentStatus] = useState('DISPATCHED');
  const [timeLeft, setTimeLeft] = useState(12); // Minutes

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-brand-neon selection:text-black">
      {/* Navbar */}
      <nav className="h-20 border-b border-white/5 flex items-center justify-between px-6 bg-black/50 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-neon rounded flex items-center justify-center">
            <Zap className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter uppercase">GEAR<span className="text-brand-neon">FLOW</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
          <div className="w-2 h-2 bg-brand-neon rounded-full animate-pulse" />
          LIVE TRACKING
        </div>
      </nav>

      {/* Hero Tracking Section */}
      <main className="pt-28 pb-12 px-6 max-w-lg mx-auto space-y-8">
        {/* Map Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-video glass rounded-3xl overflow-hidden border-white/10 group shadow-2xl shadow-brand-neon/5"
        >
          <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/0,0,1/800x600?access_token=placeholder')] bg-cover opacity-30 grayscale contrast-125" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          {/* Animated Map Pins */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="relative">
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-4 bg-brand-neon rounded-full"
                />
                <div className="w-4 h-4 bg-brand-neon rounded-full shadow-[0_0_15px_#39FF14]" />
             </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black text-brand-neon tracking-widest uppercase mb-1">Estimated Arrival</p>
              <h2 className="text-4xl font-black italic">{timeLeft} MINS</h2>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 text-white">
              <Navigation size={20} className="animate-pulse" />
            </div>
          </div>
        </motion.div>

        {/* Mechanic Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-3xl border-white/10 space-y-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-neon to-green-800 rounded-2xl flex items-center justify-center text-black font-black text-xl border-2 border-brand-neon/20">
                AG
              </div>
              <div>
                <h3 className="font-bold text-lg">Alex Gearhead</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Star size={12} className="text-brand-neon fill-brand-neon" />
                  <span className="font-bold text-white">4.9</span>
                  <span className="opacity-50">• Classic 350 Specialist</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-brand-neon hover:bg-brand-neon hover:text-black transition-all border-white/5">
                <Phone size={20} />
              </button>
              <button className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-white hover:border-brand-neon/50 transition-all border-white/5">
                <MessageSquare size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Order ID</p>
              <p className="font-mono font-bold text-sm">#{params.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Verification Code</p>
              <p className="font-mono font-bold text-sm text-brand-neon">4829 (OTP)</p>
            </div>
          </div>
        </motion.div>

        {/* Live Status Timeline */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest px-2">Service Progress</h4>
          <div className="space-y-2">
            {statuses.map((s, idx) => {
              const isPast = statuses.findIndex(x => x.id === currentStatus) >= idx;
              const isCurrent = s.id === currentStatus;

              return (
                <div key={s.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  isCurrent ? 'bg-brand-neon/10 border border-brand-neon/20 shadow-lg shadow-brand-neon/5' : 
                  isPast ? 'opacity-50' : 'opacity-20 grayscale'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCurrent ? 'bg-brand-neon text-black' : 'bg-white/10'
                  }`}>
                    {s.icon}
                  </div>
                  <span className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                  {isCurrent && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="ml-auto w-1.5 h-1.5 bg-brand-neon rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Support Section */}
        <button className="w-full py-5 glass border-white/10 rounded-3xl text-sm font-bold text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-3">
          <ShieldCheck size={18} className="text-brand-neon" />
          Need help? Contact GearFlow Support
        </button>
      </main>
    </div>
  );
}
