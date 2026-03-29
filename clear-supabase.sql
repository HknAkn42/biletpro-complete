-- Supabase'i Temizle - Tüm Events Sil
-- DİKKAT: Bu sorgu tüm etkinlikleri kalıcı olarak siler!

-- Events tablosunu temizle
DELETE FROM events;

-- Sales tablosunu temizle (events ile ilişkili)
DELETE FROM sales;

-- Categories tablosunu temizle (events ile ilişkili)
DELETE FROM categories;

-- Tables tablosunu temizle (events ile ilişkili)
DELETE FROM tables;

-- Customers tablosunu temizle (events ile ilişkili)
DELETE FROM customers;

-- Başarılı mesajı
SELECT 'Supabase temizlendi! Tüm events silindi.' as message;
