"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Map as MapIcon, 
  Settings, 
  Bell,
  Search,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 5000, orders: 29 },
  { name: 'Thu', revenue: 2780, orders: 15 },
  { name: 'Fri', revenue: 6890, orders: 40 },
  { name: 'Sat', revenue: 8390, orders: 52 },
  { name: 'Sun', revenue: 7490, orders: 48 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl hidden lg:flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-neon rounded flex items-center justify-center">
            <Zap className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter">GEAR<span className="text-brand-neon">FLOW</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <SidebarItem icon={<ShoppingCart size={20} />} label="Active Orders" />
          <SidebarItem icon={<Users size={20} />} label="Mechanics" />
          <SidebarItem icon={<MapIcon size={20} />} label="Fleet Map" />
          <SidebarItem icon={<TrendingUp size={20} />} label="Analytics" />
          <SidebarItem icon={<ShieldCheck size={20} />} label="Fraud Logs" />
        </nav>

        <div className="p-6 border-t border-white/5">
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              placeholder="Search leads, mechanics, or transactions..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:border-brand-neon outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-neon rounded-full" />
            </button>
            <div className="h-10 w-10 rounded-full bg-brand-neon text-black flex items-center justify-center font-black">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tighter">OPERATIONS <span className="text-brand-neon italic">HUB</span></h1>
              <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Real-time GearFlow Monitoring</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-brand-neon/50 transition-colors text-sm font-bold">
                EXPORT REPORT
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard label="Live Leads" value="24" trend="+12%" icon={<Zap className="text-brand-neon" />} />
            <StatCard label="Active Mechanics" value="156" trend="+3" icon={<Users className="text-brand-neon" />} />
            <StatCard label="Daily Revenue" value="₹42,850" trend="+18%" icon={<TrendingUp className="text-brand-neon" />} />
            <StatCard label="Fraud Alerts" value="0" trend="0" icon={<AlertTriangle className="text-yellow-500" />} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 glass rounded-3xl p-8 border-white/5">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold tracking-tight">REVENUE FORECAST</h3>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 bg-brand-neon/10 text-brand-neon rounded">WEEKLY</span>
                  <span className="px-2 py-1 text-gray-500">MONTHLY</span>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#39FF14" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#39FF14" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #39FF1433', borderRadius: '12px' }}
                      itemStyle={{ color: '#39FF14' }}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#39FF14" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Live Feed */}
            <div className="glass rounded-3xl p-8 border-white/5 flex flex-col">
              <h3 className="text-xl font-bold tracking-tight mb-8 uppercase text-xs text-gray-500 tracking-widest">Live Activity</h3>
              <div className="space-y-6 flex-1">
                <ActivityItem 
                  title="Lead Paid (₹200)" 
                  desc="Rahul S. • Classic 350" 
                  time="2m ago" 
                  status="dispatching"
                />
                <ActivityItem 
                  title="Work Started" 
                  desc="Alex G. • Arrived at Sector 5" 
                  time="5m ago" 
                  status="working"
                />
                <ActivityItem 
                  title="Payment Received" 
                  desc="Job #4829 • ₹1,250" 
                  time="12m ago" 
                  status="paid"
                />
                <ActivityItem 
                  title="AI Verification" 
                  desc="Part Check: PASSED" 
                  time="15m ago" 
                  status="verified"
                />
              </div>
              <button className="w-full mt-6 py-4 border border-white/5 hover:border-brand-neon/50 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-brand-neon transition-all rounded-xl">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
      active ? 'bg-brand-neon text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
    }`}>
      {icon}
      <span className="text-sm">{label}</span>
    </div>
  );
}

function StatCard({ label, value, trend, icon }: { label: string, value: string, trend: string, icon: React.ReactNode }) {
  return (
    <div className="glass p-6 rounded-3xl border-white/5">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-black rounded-lg border border-white/5">{icon}</div>
        <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-brand-neon' : 'text-gray-500'}`}>
          {trend}
        </span>
      </div>
      <p className="text-gray-500 text-xs uppercase tracking-widest font-bold mb-1">{label}</p>
      <p className="text-3xl font-black tracking-tighter">{value}</p>
    </div>
  );
}

function ActivityItem({ title, desc, time, status }: { title: string, desc: string, time: string, status: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="relative">
        <div className={`w-2 h-2 rounded-full mt-2 ${
          status === 'dispatching' ? 'bg-blue-500 animate-pulse' :
          status === 'working' ? 'bg-brand-neon animate-pulse' :
          status === 'verified' ? 'bg-brand-neon' : 'bg-gray-500'
        }`} />
        <div className="absolute top-4 left-[3px] bottom-[-24px] w-[1px] bg-white/5 group-last:hidden" />
      </div>
      <div>
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
        <p className="text-[10px] text-gray-600 mt-1 uppercase font-bold">{time}</p>
      </div>
    </div>
  );
}
