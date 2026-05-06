import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

import AuthService from './services/AuthService.js';

// Mock DB for simulation
const users = [];
const orders = [];

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'GearFlow Backend is running', timestamp: new Date() });
});

// Create Order (Lead Intake)
app.post('/orders', async (req, res) => {
  const { name, phone, vehicle, lat, lng, tier } = req.body;
  
  const newOrder = {
    id: Math.random().toString(36).substr(2, 9),
    customer_name: name,
    phone_number: phone,
    vehicle_details: vehicle,
    location_lat: lat,
    location_lng: lng,
    service_tier: tier,
    is_premium: tier === 'PREMIUM',
    status: tier === 'PREMIUM' ? 'PENDING_FEE' : 'PENDING_DISPATCH',
    created_at: new Date()
  };
  
  orders.unshift(newOrder); 

  // --- n8n Dispatch Trigger ---
  try {
    // In production: await fetch('N8N_DISPATCH_WEBHOOK_URL', { method: 'POST', body: JSON.stringify(newOrder) });
    console.log(`[n8n] Triggering smart dispatch for Order ${newOrder.id}`);
  } catch (e) {
    console.error("n8n Dispatch failed", e);
  }

  res.json({ success: true, order: newOrder });
});

// Update Dispatch (Called by n8n or Admin)
app.patch('/orders/:id/dispatch', (req, res) => {
  const { id } = req.params;
  const { mechanic_name, status } = req.body;
  
  const order = orders.find(o => o.id === id);
  if (order) {
    order.mechanic_name = mechanic_name;
    order.status = status || 'DISPATCHED';
    order.updated_at = new Date();
    return res.json({ success: true, order });
  }
  res.status(404).json({ error: 'Order not found' });
});

// Get Admin Orders (Live Sync)
app.get('/admin/orders', (req, res) => {
  res.json(orders);
});

// User Registration
app.post('/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  const hashedPassword = await AuthService.hashPassword(password);
  
  const newUser = {
    id: Math.random().toString(36).substr(2, 9),
    full_name: name,
    email,
    password_hash: hashedPassword,
    phone_number: phone,
    role: 'CUSTOMER'
  };
  
  users.push(newUser);
  const token = AuthService.generateToken(newUser);
  
  res.json({ success: true, token, user: { name, email, role: 'CUSTOMER' } });
});

// User Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (!user || !(await AuthService.comparePassword(password, user.password_hash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = AuthService.generateToken(user);
  res.json({ success: true, token, user: { name: user.full_name, email, role: user.role } });
});

// User Service History (Mocked)
app.get('/user/history', (req, res) => {
  // In production, verify token and query DB
  const mockHistory = [
    { id: '1', date: '2026-05-01', service: 'Oil Change', status: 'COMPLETED', bike: 'Royal Enfield Classic 350' },
    { id: '2', date: '2026-04-15', service: 'Chain Lubrication', status: 'COMPLETED', bike: 'Royal Enfield Classic 350' }
  ];
  res.json(mockHistory);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 GearFlow API running on http://localhost:${PORT}`);
});
