-- BiletPro Database Schema - Railway PostgreSQL
-- Bu dosyayı Railway'da çalıştırın

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Events Table
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100),
    venue VARCHAR(100),
    city VARCHAR(50),
    date DATE,
    door_time TIME,
    start_time TIME,
    cover TEXT,
    logo TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    capacity INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tables (Masalar)
CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_sold BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    total_spent DECIMAL(10,2) DEFAULT 0,
    debt_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    customer_id INTEGER REFERENCES customers(id),
    table_id INTEGER REFERENCES tables(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    is_debt BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Default admin user
INSERT INTO users (username, password, name, role) 
VALUES ('hakan', '52655265', 'Hakan Akın', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Sample event (test için)
INSERT INTO events (title, company, venue, city, date, door_time, start_time)
VALUES ('Test Etkinliği', 'Test Organizasyon', 'Test Mekan', 'İstanbul', '2024-12-31', '20:00:00', '21:00:00')
ON CONFLICT DO NOTHING;
