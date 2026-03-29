-- BiletPro Complete Database Schema - Railway PostgreSQL
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

-- Categories Table (Kategoriler)
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

-- Customers Table (Müşteriler)
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    total_spent DECIMAL(10,2) DEFAULT 0,
    debt_amount DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sales Table (Satışlar)
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

-- Sample customer (test için)
INSERT INTO customers (name, phone, email)
VALUES ('Test Müşteri', '05554443322', 'test@customer.com')
ON CONFLICT DO NOTHING;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date DESC);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tables_category_id ON tables(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_event_id ON categories(event_id);

-- Functions for automatic updates
CREATE OR REPLACE FUNCTION update_customer_total_spent()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE customers SET total_spent = total_spent + NEW.amount WHERE id = NEW.customer_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update customer total spent
CREATE TRIGGER trigger_update_customer_total_spent
    AFTER INSERT ON sales
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_total_spent();
