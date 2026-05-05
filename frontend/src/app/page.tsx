"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Zap, MapPin, ArrowRight, Menu, X, Star } from 'lucide-react';
import Image from 'next/image';
import BookingModal from '@/components/BookingModal';
import ChatBot from '@/components/ChatBot';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isBookingOpen, setIsBookingOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-brand-neon selection:text-black">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-neon rounded-lg flex items-center justify-center">
                <Settings className="text-black w-6 h-6 animate-spin-slow" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">GEAR<span className="text-brand-neon">FLOW</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-gray-400">
              <a href="#services" className="hover:text-brand-neon transition-colors">Services</a>
              <a href="#about" className="hover:text-brand-neon transition-colors">How it Works</a>
              <a href="#fleet" className="hover:text-brand-neon transition-colors">Mechanics</a>
              <button 
                onClick={() => setIsBookingOpen(true)}
                className="px-6 py-2 bg-brand-neon text-black font-bold rounded-full hover:scale-105 transition-transform"
              >
                BOOK NOW
              </button>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-brand-neon/5 blur-[120px] rounded-full -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-neon/30 bg-brand-neon/5 text-brand-neon text-xs font-bold uppercase tracking-widest mb-6">
                <Zap className="w-4 h-4" /> Fully Autonomous Service
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
                SERVICE <br />
                <span className="text-brand-neon italic">REINVENTED.</span>
              </h1>
              <p className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed">
                Experience the world's first fully autonomous bike service platform. Smart dispatch, AI-verified repairs, and zero-trust security.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setIsBookingOpen(true)}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-brand-neon text-black font-black rounded-xl hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all group"
                >
                  REQUEST SERVICE <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border border-white/10 hover:border-brand-neon transition-colors rounded-xl font-bold">
                  VIEW PRICING
                </button>
              </div>

              <div className="mt-12 flex items-center gap-8">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800" />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex text-brand-neon gap-1 mb-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-gray-500 font-medium">Trusted by 5,000+ riders</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-brand-neon/20 blur-[100px] -z-10" />
              <Image 
                src="/hero-bike.png" 
                alt="Futuristic Bike" 
                width={800} 
                height={600}
                priority
                loading="eager"
                className="drop-shadow-[0_0_50px_rgba(57,255,20,0.3)] pointer-events-none"
              />
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -right-4 glass p-4 rounded-2xl border-brand-neon/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-neon/20 rounded-full flex items-center justify-center">
                    <Shield className="text-brand-neon w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold">SECURITY</p>
                    <p className="text-xs font-black">AI VERIFIED</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-brand-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<MapPin className="w-8 h-8 text-brand-neon" />}
              title="Live Tracking"
              desc="Watch your mechanic arrive in real-time with satellite precision."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-brand-neon" />}
              title="60 Min Arrival"
              desc="Our smart dispatch system ensures the nearest pro is at your door."
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8 text-brand-neon" />}
              title="Zero Trust"
              desc="OTP-secured arrivals and AI-verified part replacement."
            />
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm tracking-widest uppercase">
        © 2026 GEARFLOW TECHNOLOGIES. ALL RIGHTS RESERVED.
      </footer>

      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <ChatBot />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-3xl bg-black border border-white/5 hover:border-brand-neon/50 transition-colors"
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4 tracking-tight">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </motion.div>
  );
}
