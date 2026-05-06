"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Zap,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'YOUR_KEY_HERE';

const chartData = [
  { name: 'Mon', revenue: 4000, orders: 24 },
  { name: 'Tue', revenue: 3000, orders: 18 },
  { name: 'Wed', revenue: 5000, orders: 29 },
  { name: 'Thu', revenue: 2780, orders: 15 },
  { name: 'Fri', revenue: 6890, orders: 40 },
  { name: 'Sat', revenue: 8390, orders: 52 },
  { name: 'Sun', revenue: 7490, orders: 48 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardHome />;
      case 'Active Orders':
        return <OrdersView />;
      case 'Mechanics':
        return <MechanicsView />;
      case 'Fleet Map':
        return <MapView />;
      case 'Analytics':
        return <AnalyticsView />;
      case 'Fraud Logs':
        return <FraudLogsView />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black/50 backdrop-blur-xl hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-neon rounded flex items-center justify-center">
            <Zap className="text-black w-5 h-5" />
          </div>
          <span className="text-xl font-black tracking-tighter">GEAR<span className="text-brand-neon">FLOW</span></span>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <SidebarItem icon={<ShoppingCart size={20} />} label="Active Orders" active={activeTab === 'Active Orders'} onClick={() => setActiveTab('Active Orders')} />
          <SidebarItem icon={<Users size={20} />} label="Mechanics" active={activeTab === 'Mechanics'} onClick={() => setActiveTab('Mechanics')} />
          <SidebarItem icon={<MapIcon size={20} />} label="Fleet Map" active={activeTab === 'Fleet Map'} onClick={() => setActiveTab('Fleet Map')} />
          <SidebarItem icon={<TrendingUp size={20} />} label="Analytics" active={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
          <SidebarItem icon={<ShieldCheck size={20} />} label="Fraud Logs" active={activeTab === 'Fraud Logs'} onClick={() => setActiveTab('Fraud Logs')} />
        </nav>

        <div className="p-6 border-t border-white/5">
          <SidebarItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
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

        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// --- Dashboard Home ---
function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">OPERATIONS <span className="text-brand-neon italic">HUB</span></h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Real-time GearFlow Monitoring</p>
        </div>
        <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl hover:border-brand-neon/50 transition-colors text-sm font-bold">
          EXPORT REPORT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Live Leads" value="24" trend="+12%" icon={<Zap className="text-brand-neon" />} />
        <StatCard label="Active Mechanics" value="156" trend="+3" icon={<Users className="text-brand-neon" />} />
        <StatCard label="Daily Revenue" value="₹42,850" trend="+18%" icon={<TrendingUp className="text-brand-neon" />} />
        <StatCard label="Fraud Alerts" value="0" trend="0" icon={<AlertTriangle className="text-yellow-500" />} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass rounded-3xl p-8 border-white/5 min-h-[400px]">
          <h3 className="text-xl font-bold tracking-tight mb-8">REVENUE FORECAST</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
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

        <div className="glass rounded-3xl p-8 border-white/5 flex flex-col">
          <h3 className="text-xl font-bold tracking-tight mb-8 uppercase text-xs text-gray-500 tracking-widest">Live Activity</h3>
          <div className="space-y-6 flex-1">
            <ActivityItem title="Lead Paid (₹200)" desc="Rahul S. • Classic 350" time="2m ago" status="dispatching" />
            <ActivityItem title="Work Started" desc="Alex G. • Arrived at Sector 5" time="5m ago" status="working" />
            <ActivityItem title="Payment Received" desc="Job #4829 • ₹1,250" time="12m ago" status="paid" />
            <ActivityItem title="AI Verification" desc="Part Check: PASSED" time="15m ago" status="verified" />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Orders View ---
function OrdersView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3001/admin/orders');
        const data = await response.json();
        setOrders(data);
      } catch (e) {
        console.error("Fetch failed", e);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const mechanics = ['Alex Gearhead', 'John Piston', 'Sam Spark', 'Mike Bolt'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black tracking-tighter">ACTIVE <span className="text-brand-neon italic">ORDERS</span></h1>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-gray-500 uppercase">Live Sync: ON</span>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-white/5">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5 text-gray-500 text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="p-6">Tier</th>
              <th className="p-6">Customer</th>
              <th className="p-6">Status</th>
              <th className="p-6">Mechanic</th>
              <th className="p-6">Details</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {orders.map((order) => (
              <tr key={order.id} className={`hover:bg-white/5 transition-colors ${order.is_premium ? 'bg-brand-neon/[0.03]' : ''}`}>
                <td className="p-6">
                   <div className={`px-3 py-1 rounded-full text-[8px] font-black inline-block ${
                     order.is_premium ? 'bg-brand-neon text-black' : 'bg-gray-800 text-gray-400'
                   }`}>
                     {order.service_tier}
                   </div>
                </td>
                <td className="p-6">
                   <p className="font-bold">{order.customer_name}</p>
                   <p className="text-[10px] text-gray-500 font-bold">{order.phone_number}</p>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    order.status === 'PENDING_DISPATCH' ? 'bg-blue-500/20 text-blue-500' :
                    order.status === 'PENDING_FEE' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-6">
                   {order.mechanic_name ? (
                     <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-brand-neon/10 rounded-full flex items-center justify-center text-brand-neon text-[10px] font-black">{order.mechanic_name[0]}</div>
                        <span className="text-sm">{order.mechanic_name}</span>
                     </div>
                   ) : (
                     <button 
                       onClick={() => setSelectedOrder(order.id)}
                       className="text-[10px] font-black text-brand-neon border border-brand-neon/30 px-3 py-1 rounded-lg hover:bg-brand-neon hover:text-black transition-all"
                     >
                       {order.is_premium ? 'PRIORITY ALLOCATE' : 'ALLOCATE'}
                     </button>
                   )}
                </td>
                <td className="p-6">
                   <p className="text-xs font-bold truncate max-w-[150px]">{order.vehicle_details}</p>
                </td>
                <td className="p-6 text-right relative">
                  <button className="text-gray-500 hover:text-white"><MoreVertical size={20} /></button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-20 text-center text-gray-600 font-bold uppercase tracking-widest text-xs">
                  Waiting for new leads...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Mechanics View ---
function MechanicsView() {
  const mechanics = [
    { name: 'Alex Gearhead', jobs: 12, status: 'AVAILABLE', rating: 4.9, location: 'Sector 5' },
    { name: 'John Piston', jobs: 8, status: 'WORKING', rating: 4.7, location: 'Downtown' },
    { name: 'Sam Spark', jobs: 15, status: 'WORKING', rating: 4.8, location: 'North Block' },
    { name: 'Mike Bolt', jobs: 5, status: 'OFFLINE', rating: 4.5, location: 'N/A' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black tracking-tighter">FLEET <span className="text-brand-neon italic">MASTERS</span></h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mechanics.map((m) => (
          <div key={m.name} className="glass p-6 rounded-3xl border-white/5 text-center">
            <div className="w-16 h-16 bg-brand-neon/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-neon/30">
              <Users className="text-brand-neon" size={32} />
            </div>
            <h3 className="font-bold text-lg">{m.name}</h3>
            <p className="text-gray-500 text-xs mb-4">{m.location}</p>
            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Jobs</p>
                <p className="font-black text-brand-neon">{m.jobs}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Rating</p>
                <p className="font-black">★ {m.rating}</p>
              </div>
            </div>
            <div className={`mt-4 py-2 rounded-lg text-[10px] font-black ${
              m.status === 'AVAILABLE' ? 'bg-brand-neon text-black' : 'bg-white/5 text-gray-500'
            }`}>
              {m.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Map View ---
function MapView() {
  const [selectedMechanic, setSelectedMechanic] = useState<string | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const activeMechanics = [
    { id: 1, name: 'Alex G.', lat: 28.6139, lng: 77.2090, status: 'WORKING' },
    { id: 2, name: 'John P.', lat: 28.6239, lng: 77.2190, status: 'DISPATCHED' },
    { id: 3, name: 'Sam S.', lat: 28.6039, lng: 77.1990, status: 'AVAILABLE' },
    { id: 4, name: 'Mike B.', lat: 28.6339, lng: 77.2290, status: 'AVAILABLE' },
  ];

  const mapContainerStyle = {
    width: '100%',
    height: '650px',
    borderRadius: '1.5rem'
  };

  const center = { lat: 28.6139, lng: 77.2090 };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <h1 className="text-4xl font-black tracking-tighter">FLEET <span className="text-brand-neon italic">MAP</span></h1>
        <div className="flex gap-4 text-xs font-bold uppercase tracking-widest text-gray-500">
           <div className="flex items-center gap-2"><div className="w-2 h-2 bg-brand-neon rounded-full" /> Available</div>
           <div className="flex items-center gap-2"><div className="w-2 h-2 bg-blue-500 rounded-full" /> Working</div>
        </div>
      </div>

      <div className="glass rounded-3xl h-[650px] border-white/5 relative overflow-hidden bg-[#050505]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={13}
            options={{
              styles: [
                { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
                { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
                { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
                // ... Dark theme styles for Google Maps
              ],
              disableDefaultUI: true,
            }}
          >
            {activeMechanics.map(m => (
              <Marker 
                key={m.id} 
                position={{ lat: m.lat, lng: m.lng }}
                onClick={() => setSelectedMechanic(m.name)}
                icon={{
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: m.status === 'AVAILABLE' ? '#39FF14' : '#3B82F6',
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: '#000',
                  scale: 8
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 font-bold animate-pulse">LOADING REAL GOOGLE MAPS...</p>
          </div>
        )}

        {/* Info Overlay */}
        <AnimatePresence>
          {selectedMechanic && (
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute right-8 top-8 w-64 glass p-6 rounded-2xl border-white/10 shadow-2xl z-20"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-bold text-lg">{selectedMechanic}</h3>
                <button onClick={() => setSelectedMechanic(null)} className="text-gray-500 hover:text-white"><XCircle size={20} /></button>
              </div>
              <div className="space-y-4">
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Current Speed</p>
                   <p className="text-xl font-black text-brand-neon italic">24 KM/H</p>
                </div>
                <div>
                   <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Heading</p>
                   <p className="text-sm font-bold">North-East (Sector 5)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Analytics View ---
function AnalyticsView() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black tracking-tighter">BUSINESS <span className="text-brand-neon italic">INSIGHTS</span></h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl border-white/5 h-[400px]">
          <h3 className="text-lg font-bold mb-8">ORDER VOLUME</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" stroke="#555" fontSize={12} />
              <YAxis stroke="#555" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
              <Line type="monotone" dataKey="orders" stroke="#39FF14" strokeWidth={4} dot={{ fill: '#39FF14' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="glass p-8 rounded-3xl border-white/5 flex flex-col justify-center text-center">
            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Avg. Ticket</p>
            <p className="text-4xl font-black text-brand-neon">₹1,450</p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5 flex flex-col justify-center text-center">
            <p className="text-gray-500 text-xs font-bold uppercase mb-2">CSAT</p>
            <p className="text-4xl font-black text-brand-neon">4.8/5</p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5 flex flex-col justify-center text-center">
            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Refund Rate</p>
            <p className="text-4xl font-black text-red-500">0.2%</p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5 flex flex-col justify-center text-center">
            <p className="text-gray-500 text-xs font-bold uppercase mb-2">Retention</p>
            <p className="text-4xl font-black text-brand-neon">64%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Fraud Logs View ---
function FraudLogsView() {
  const logs = [
    { id: 'F-1', type: 'Proximity Mismatch', target: 'John P.', severity: 'HIGH', time: '10m ago' },
    { id: 'F-2', type: 'OTP Bypass Attempt', target: 'Lead #482', severity: 'CRITICAL', time: '1h ago' },
    { id: 'F-3', type: 'Location Spoofing', target: 'Mike B.', severity: 'LOW', time: '4h ago' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-black tracking-tighter">FRAUD <span className="text-red-500 italic">LOGS</span></h1>
      <div className="space-y-4">
        {logs.map(log => (
          <div key={log.id} className="glass p-6 rounded-2xl border-white/5 flex items-center justify-between hover:border-red-500/30 transition-all">
            <div className="flex items-center gap-6">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                log.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'
              }`}>
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="font-bold">{log.type}</h3>
                <p className="text-xs text-gray-500">Suspect: {log.target} • {log.time}</p>
              </div>
            </div>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black ${
              log.severity === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-black'
            }`}>
              {log.severity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Reusable Components ---
function SidebarItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-brand-neon text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
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
