-- Initial Schema for GearFlow

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS table (Customers & Admins)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
    saved_vehicles JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- MECHANICS table
CREATE TABLE IF NOT EXISTS mechanics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    current_lat DOUBLE PRECISION,
    current_lng DOUBLE PRECISION,
    status TEXT DEFAULT 'OFFLINE' CHECK (status IN ('AVAILABLE', 'WORKING', 'OFFLINE', 'SUSPENDED')),
    wallet_balance DECIMAL(12, 2) DEFAULT 0.00,
    average_rating FLOAT DEFAULT 5.0,
    kyc_documents JSONB DEFAULT '{}'::jsonb,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ORDERS table (State Machine)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_name TEXT,
    phone_number TEXT,
    user_id UUID REFERENCES users(id),
    mechanic_id UUID REFERENCES mechanics(id),
    mechanic_name TEXT,
    status TEXT DEFAULT 'PENDING_FEE',
    service_tier TEXT DEFAULT 'STANDARD' CHECK (service_tier IN ('STANDARD', 'PREMIUM')),
    is_premium BOOLEAN DEFAULT FALSE,
    location_lat DOUBLE PRECISION NOT NULL,
    location_lng DOUBLE PRECISION NOT NULL,
    vehicle_details TEXT NOT NULL,
    customer_notes TEXT,
    cancel_otp TEXT,
    feedback_received BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ORDER_QUOTES table
CREATE TABLE IF NOT EXISTS order_quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    labor_cost DECIMAL(12, 2) NOT NULL,
    parts_cost DECIMAL(12, 2) NOT NULL,
    diagnosis_notes TEXT,
    customer_approved BOOLEAN DEFAULT FALSE,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PAYMENTS table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    payment_type TEXT CHECK (payment_type IN ('UPFRONT_FEE', 'FINAL_BILL', 'REFUND')),
    amount DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    transaction_ref TEXT,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- WALLET_TRANSACTIONS table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mechanic_id UUID REFERENCES mechanics(id),
    order_id UUID REFERENCES orders(id),
    type TEXT CHECK (type IN ('EARNING', 'DEDUCTION', 'PAYOUT')),
    amount DECIMAL(12, 2) NOT NULL,
    status TEXT DEFAULT 'PENDING_ESCROW' CHECK (status IN ('PENDING_ESCROW', 'CLEARED', 'PAID_OUT')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- FRAUD_LOGS table
CREATE TABLE IF NOT EXISTS fraud_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    mechanic_id UUID REFERENCES mechanics(id),
    flag_type TEXT NOT NULL,
    evidence JSONB DEFAULT '{}'::jsonb,
    ai_resolution TEXT DEFAULT 'PENDING',
    flagged_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- KNOWLEDGE_BASE table for RAG
CREATE TABLE IF NOT EXISTS knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(1536), -- Dimension for OpenAI text-embedding-3-small
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed some technical data
INSERT INTO knowledge_base (content, metadata) VALUES 
('Royal Enfield Classic 350 chain tension should be between 25mm to 30mm. If the chain is clicking, check for loose links or lack of lubrication.', '{"model": "Classic 350", "category": "maintenance"}'),
('Engine oil for Royal Enfield should be 15W50 API SL Grade or higher. Change every 10,000 km after the first service.', '{"model": "General", "category": "oil"}'),
('Tire pressure for commuter bikes: Front 25 PSI, Rear 32 PSI (Solo). For pillion riding, increase Rear to 35 PSI.', '{"model": "General", "category": "tires"}');
