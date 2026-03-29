-- BiletPro Premium SaaS Database Schema - PostgreSQL (Supabase / Railway)
-- Bu dosyayı SQL Editor'e yapıştırıp çalıştırın (Run)

-- 1. USERS (Personel ve Yöneticiler) Tablosu
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,          -- Soft Delete (Pasife Alma) İçin
    permissions JSONB DEFAULT '{}'::jsonb,   -- 10 Maddelik Yetki Matrisi İçin (Satış, İptal, İndirim vb.)
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. EVENTS (Etkinlikler) Tablosu
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100),
    venue VARCHAR(100),
    city VARCHAR(50),
    full_address TEXT,
    date DATE,
    door_time TIME,
    start_time TIME,
    cover TEXT,
    logo TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. CATEGORIES (Kategoriler ve Fiyatlandırma) Tablosu
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    capacity INTEGER,
    color VARCHAR(20) DEFAULT '#2563eb',     -- Arayüzdeki cam efektli renk kodları için
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. TABLES (Masalar ve Bilet Birimleri) Tablosu
CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    table_number VARCHAR(20) NOT NULL,
    capacity INTEGER NOT NULL,               -- Masanın Orijinal Kapasitesi
    remaining_capacity INTEGER NOT NULL,     -- Kapıdan Kademeli Giriş İçin Kalan Hak (Örn: 4 kişiden 2'si girdi)
    price DECIMAL(10,2) NOT NULL,
    is_sold BOOLEAN DEFAULT false,
    sold_to VARCHAR(100),                    -- Satın Alan Kişinin Adı (Hızlı arama için)
    ticket_hash VARCHAR(100),                -- Çoklu Masa Gruplama (Kader Birliği ID'si)
    status VARCHAR(20) DEFAULT 'AVAILABLE',  -- AVAILABLE, READY, IN_PROGRESS, FULL
    is_deleted BOOLEAN DEFAULT false,        -- Masayı silmek yerine gizlemek için
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. CUSTOMERS (CRM - Müşteri Havuzu) Tablosu
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,              -- Numara bazlı takip için
    email VARCHAR(100),
    total_spent DECIMAL(10,2) DEFAULT 0,     -- Müşterinin bugüne kadar harcadığı toplam para
    total_tickets INTEGER DEFAULT 0,         -- Aldığı toplam masa/bilet sayısı
    debt_amount DECIMAL(10,2) DEFAULT 0,
    last_purchase TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(phone, name)                      -- Aynı numara farklı isim çakışmasını engellemek için ZIRH
);

-- 6. SALES (Satış İşlemleri ve Finans) Tablosu
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    customer_id INTEGER REFERENCES customers(id),
    ticket_hash VARCHAR(100) NOT NULL,       -- Hangi barkoda ait olduğunu bağlar
    total_amount DECIMAL(10,2) NOT NULL,     -- Brüt Tutar
    discount_pr DECIMAL(5,2) DEFAULT 0,      -- Yüzdelik İskonto
    discount_tl DECIMAL(10,2) DEFAULT 0,     -- Net TL İndirimi
    net_amount DECIMAL(10,2) NOT NULL,       -- Tahsil Edilmesi Gereken Net Tutar
    paid_amount DECIMAL(10,2) DEFAULT 0,     -- Alınan Para
    debt_amount DECIMAL(10,2) DEFAULT 0,     -- Kalan Borç
    payment_method VARCHAR(50),              -- Nakit, K.Kartı, Havale
    gate_note TEXT,                          -- Kapı / VIP Notu
    is_cancelled BOOLEAN DEFAULT false,      -- Satış İptali İçin
    created_by VARCHAR(100),                 -- Satışı Yapan Personel Adı
    created_at TIMESTAMP DEFAULT NOW()
);

-- 7. AUDIT LOGS (Sistem Güvenlik Logları - Kara Kutu) Tablosu
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    actor_name VARCHAR(100) NOT NULL,        -- İşlemi Yapan Personel (Örn: Merkez Kasa)
    actor_role VARCHAR(20) NOT NULL,         -- Personel Rolü (admin, user)
    module VARCHAR(50) NOT NULL,             -- Hangi Sayfada Yaptı? (Satış Terminali, Personel Modülü)
    action VARCHAR(100) NOT NULL,            -- Ne Yaptı? (SATIŞ İPTALİ, KISMI GİRİŞ)
    details TEXT,                            -- Detay (Örn: VIP Masa 14'ün 15.000 TL'lik satışı iptal edildi)
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==========================================
-- BAŞLANGIÇ VERİLERİ (SEED DATA)
-- ==========================================

-- Sistem Yöneticisi (Admin) Ekleme (Şifreyi arayüzden MD5 veya benzeriyle hashlenecekse ona göre ayarlarsın)
INSERT INTO users (username, password, name, role, is_active, permissions) 
VALUES (
    'hakan', 
    '52655265', 
    'Hakan Akın', 
    'admin', 
    true, 
    '{"pSale": true, "pDiscount": true, "pCancel": true, "pDoor": true, "pDoorPay": true, "pDoorRisk": true, "pManageEvents": true, "pReports": true, "pManageStaff": true, "pViewLogs": true}'::jsonb
)
ON CONFLICT (username) DO NOTHING;

-- Örnek Etkinlik (Test için)
INSERT INTO events (title, company, venue, city, full_address, date, door_time, start_time)
VALUES ('Test Etkinliği', 'Test Organizasyon', 'Test Mekan', 'İstanbul', 'Kadıköy Moda Sahili', '2026-12-31', '20:00:00', '21:00:00')
ON CONFLICT DO NOTHING;