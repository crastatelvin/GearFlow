"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle: '',
    notes: '',
    location: null as { lat: number, lng: number } | null
  });

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });
        setLoading(false);
      }, (error) => {
        console.error(error);
        setLoading(false);
        alert("Could not get location. Please allow location access.");
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to backend
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg glass border border-brand-neon/30 p-8 rounded-3xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-neon/20">
              <motion.div 
                className="h-full bg-brand-neon"
                initial={{ width: "0%" }}
                animate={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>

            <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>

            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-3xl font-black tracking-tighter mb-2">BOOK YOUR <span className="text-brand-neon">PRO</span></h2>
                  <p className="text-gray-400 text-sm">Fill in your details to request a smart dispatch.</p>
                </div>

                <div className="space-y-4">
                  <input 
                    required
                    placeholder="Full Name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-neon outline-none transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <input 
                    required
                    type="tel"
                    placeholder="WhatsApp Number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-neon outline-none transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                  <input 
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-neon outline-none transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <input 
                    required
                    placeholder="Vehicle Model (e.g. Royal Enfield Classic 350)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-brand-neon outline-none transition-colors"
                    value={formData.vehicle}
                    onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                  />
                  
                  <button 
                    type="button"
                    onClick={handleGetLocation}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                      formData.location ? 'bg-brand-neon/20 border-brand-neon text-brand-neon' : 'bg-white/5 border-white/10 hover:border-brand-neon/50'
                    }`}
                  >
                    <MapPin className="w-5 h-5" />
                    {formData.location ? 'Location Captured' : 'Tag Live Location'}
                  </button>
                </div>

                <button 
                  disabled={loading || !formData.location}
                  className="w-full py-4 bg-brand-neon text-black font-black rounded-xl hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'CONTINUE TO PAYMENT (₹200)'}
                </button>
              </form>
            ) : (
              <div className="text-center py-10 space-y-6">
                <div className="w-20 h-20 bg-brand-neon/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-brand-neon w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">LEAD <span className="text-brand-neon">GENERATED</span></h2>
                <p className="text-gray-400">We've sent a secure payment link to your WhatsApp and Email. Once paid, your mechanic will be dispatched immediately.</p>
                <button 
                  onClick={onClose}
                  className="w-full py-4 border border-brand-neon text-brand-neon font-bold rounded-xl hover:bg-brand-neon hover:text-black transition-all"
                >
                  GOT IT
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
