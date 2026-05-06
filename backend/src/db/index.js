import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('✅ Connected to GearFlow Database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

export const query = (text, params) => pool.query(text, params);

export default pool;
