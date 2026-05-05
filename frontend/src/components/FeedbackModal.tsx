"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle2, MessageSquare, ShieldCheck } from 'lucide-react';

export default function FeedbackModal({ isOpen, onClose, mechanicName }: { isOpen: boolean, onClose: () => void, mechanicName: string }) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(onClose, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass rounded-[2.5rem] border-white/10 overflow-hidden shadow-2xl"
          >
            {!submitted ? (
              <div className="p-8 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter">SERVICE <span className="text-brand-neon italic">COMPLETE</span></h2>
                    <p className="text-gray-400 text-sm mt-1">How was your experience with {mechanicName}?</p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="flex justify-center gap-3 py-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={40} 
                        className={`transition-all ${
                          star <= (hoveredRating || rating) 
                            ? 'fill-brand-neon text-brand-neon drop-shadow-[0_0_8px_#39FF14]' 
                            : 'text-white/10 fill-transparent'
                        }`} 
                      />
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-gray-500 w-5 h-5" />
                    <textarea 
                      placeholder="Share your thoughts on the quality of work..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-sm focus:border-brand-neon outline-none transition-all h-32 resize-none"
                    />
                  </div>

                  <button 
                    disabled={rating === 0}
                    onClick={handleSubmit}
                    className="w-full py-4 bg-brand-neon text-black font-black uppercase tracking-widest rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:grayscale"
                  >
                    SUBMIT FEEDBACK
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest pt-4 border-t border-white/5">
                  <ShieldCheck size={14} className="text-brand-neon" />
                  Your reviews help the GearFlow community
                </div>
              </div>
            ) : (
              <div className="p-12 text-center space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-brand-neon rounded-full flex items-center justify-center mx-auto text-black shadow-[0_0_30px_#39FF14]"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-black">THANK YOU!</h3>
                  <p className="text-gray-400 text-sm mt-2">Your feedback has been recorded and Alex has been notified.</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
