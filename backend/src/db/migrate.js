import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const initDb = async () => {
  try {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('🔄 Initializing database schema...');
    await pool.query(sql);
    console.log('✅ Database schema initialized successfully');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await pool.end();
  }
};

initDb();
