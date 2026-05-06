"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, ArrowRight, User, Lock, Phone } from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth and redirect
    console.log("Form Submitted", formData);
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-neon/5 blur-[120px] rounded-full -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass border border-white/10 rounded-[2.5rem] p-10 relative"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-brand-neon rounded-2xl flex items-center justify-center mb-6">
            <Zap className="text-black w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">
            {isLogin ? 'Welcome ' : 'Create '}
            <span className="text-brand-neon italic">Account</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            {isLogin ? 'Access your autonomous fleet' : 'Join the GearFlow network'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Full Name"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-brand-neon outline-none transition-all"
                required
              />
            </div>
          )}
          
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Email Address"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-brand-neon outline-none transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-brand-neon outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-brand-neon text-black font-black uppercase tracking-widest rounded-2xl hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all flex items-center justify-center gap-2 group"
          >
            {isLogin ? 'LOGIN' : 'SIGN UP'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-black text-gray-500 hover:text-brand-neon transition-colors tracking-widest uppercase"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
