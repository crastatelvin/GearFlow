import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function init() {
  try {
    await client.connect();
    console.log('Connected to Neon Postgres');
    console.log('Cleaning up existing tables...');
    await client.query(`
      DROP TABLE IF EXISTS fraud_logs CASCADE;
      DROP TABLE IF EXISTS wallet_transactions CASCADE;
      DROP TABLE IF EXISTS payments CASCADE;
      DROP TABLE IF EXISTS order_quotes CASCADE;
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS mechanics CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    const sqlPath = path.join(process.cwd(), 'src', 'db', 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running init.sql...');
    await client.query(sql);
    console.log('✅ Database initialized successfully!');
    
    // Seed an available mechanic for n8n test
    await client.query("INSERT INTO mechanics (full_name, phone_number, status, is_approved) VALUES ('Alex Gearhead', '+91 99999 88888', 'AVAILABLE', TRUE) ON CONFLICT DO NOTHING;");
    console.log('✅ Seed mechanic added!');

  } catch (err) {
    console.error('❌ Initialization failed:', err);
  } finally {
    await client.end();
  }
}

init();
