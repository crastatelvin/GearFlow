import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { query } from './db/index.js';
import AuthService from './services/AuthService.js';
import PayoutEngine from './services/PayoutEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'GearFlow Backend is running', timestamp: new Date() });
});

// Create Order (Lead Intake)
app.post('/orders', async (req, res) => {
  const { name, phone, vehicle, lat, lng, tier } = req.body;
  
  try {
    const result = await query(
      'INSERT INTO orders (customer_name, phone_number, vehicle_details, location_lat, location_lng, service_tier, is_premium, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, phone, vehicle, lat || 28.6139, lng || 77.2090, tier, tier === 'PREMIUM', tier === 'PREMIUM' ? 'PENDING_FEE' : 'PENDING_DISPATCH']
    );

    const newOrder = result.rows[0];

    // --- n8n Dispatch Trigger ---
    try {
      await fetch('http://localhost:5678/webhook-test/dispatch-lead', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder) 
      });
      console.log(`[n8n] Triggering smart dispatch for Order ${newOrder.id}`);
    } catch (e) {
      console.error("n8n Dispatch failed", e);
    }

    res.json({ success: true, order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update Dispatch (Called by n8n or Admin)
app.patch('/orders/:id/dispatch', async (req, res) => {
  const { id } = req.params;
  const { mechanic_name, status } = req.body;
  
  try {
    const result = await query(
      'UPDATE orders SET mechanic_name = $1, status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 OR (id::text = $3) RETURNING *',
      [mechanic_name, status || 'DISPATCHED', id]
    );

    if (result.rows.length > 0) {
      return res.json({ success: true, order: result.rows[0] });
    }
    res.status(404).json({ error: 'Order not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Update failed' });
  }
});

// Get Admin Orders (Live Sync)
app.get('/admin/orders', async (req, res) => {
  try {
    const result = await query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Get Admin Stats (Real Database Aggregates)
app.get('/admin/stats', async (req, res) => {
  try {
    const leadsCount = await query("SELECT COUNT(*) FROM orders WHERE status NOT IN ('COMPLETED', 'CANCELLED')");
    const mechanicsCount = await query("SELECT COUNT(*) FROM mechanics WHERE status IN ('AVAILABLE', 'WORKING')");
    const revenueSum = await query("SELECT SUM(amount) FROM payments WHERE status = 'SUCCESS' AND paid_at >= CURRENT_DATE");
    const fraudCount = await query("SELECT COUNT(*) FROM fraud_logs WHERE flagged_at >= CURRENT_DATE");

    res.json({
      liveLeads: parseInt(leadsCount.rows[0].count),
      activeMechanics: parseInt(mechanicsCount.rows[0].count),
      dailyRevenue: parseFloat(revenueSum.rows[0].sum || 0),
      fraudAlerts: parseInt(fraudCount.rows[0].count)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Stats fetch failed' });
  }
});

// User Registration
app.post('/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body;
  
  try {
    const hashedPassword = await AuthService.hashPassword(password);
    const result = await query(
      'INSERT INTO users (full_name, email, password_hash, phone_number, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, hashedPassword, phone, 'CUSTOMER']
    );
    
    const newUser = result.rows[0];
    const token = AuthService.generateToken(newUser);
    
    res.json({ success: true, token, user: { name: newUser.full_name, email: newUser.email, role: 'CUSTOMER' } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user || !(await AuthService.comparePassword(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = AuthService.generateToken(user);
    res.json({ success: true, token, user: { name: user.full_name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// User Service History
app.get('/user/history', async (req, res) => {
  try {
    const result = await query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Mechanic: Arrived at Location
app.post('/mechanic/arrive', async (req, res) => {
  const { orderId } = req.body;
  try {
    await query("UPDATE orders SET status = 'ARRIVED', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [orderId]);
    
    // Trigger n8n Operations workflow
    await fetch('http://localhost:5678/webhook-test/mechanic-arrive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, event: 'ARRIVED' })
    });
    
    res.json({ success: true, status: 'ARRIVED' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update arrival' });
  }
});

// Mechanic: Submit Diagnosis Quote
app.post('/mechanic/quote', async (req, res) => {
  const { orderId, labor, parts, total } = req.body;
  try {
    // Store quote in metadata or temporary columns (using a simple update for now)
    await query("UPDATE orders SET status = 'PENDING_APPROVAL', updated_at = CURRENT_TIMESTAMP WHERE id = $1", [orderId]);
    
    // Trigger n8n Customer Approval workflow
    await fetch('http://localhost:5678/webhook-test/mechanic-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, labor, parts, total })
    });
    
    res.json({ success: true, message: 'Quote submitted for customer approval' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quote' });
  }
});

// Mechanic: Work Completed (Triggers AI Fraud Check)
app.post('/mechanic/complete', async (req, res) => {
  const { orderId, photoUrl } = req.body;
  try {
    // Trigger n8n Fraud workflow
    await fetch('http://localhost:5678/webhook-test/mechanic-complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, photoUrl })
    });
    
    res.json({ success: true, message: 'Work completion submitted for AI verification' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit completion' });
  }
});

// AI Chat Assistant (RAG Bridge)
app.post('/chat', async (req, res) => {
  const { message, userId } = req.body;
  
  try {
    // Trigger n8n RAG workflow
    const response = await fetch('http://localhost:5678/webhook-test/rag-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, userId })
    });
    
    const data = await response.json();
    res.json({ response: data.output || "I've processed your request but couldn't find a specific answer. Alex will check it out manually!" });
  } catch (error) {
    console.error("RAG fetch failed", error);
    res.json({ response: "My diagnostic systems are currently offline. Please try again in a few minutes!" });
  }
});

// Admin Payout Rollout
app.post('/admin/payouts/rollout', async (req, res) => {
  try {
    const result = await PayoutEngine.rolloutMonthlySalary();
    res.json(result);
  } catch (error) {
    console.error("Payout rollout failed", error);
    res.status(500).json({ error: 'Failed to process payouts rollout' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 GearFlow API running on http://localhost:${PORT}`);
});
