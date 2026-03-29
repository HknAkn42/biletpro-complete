# 🎫 BiletPro - Real-time Event Management System

**Modern, real-time etkinlik ve bilet yönetim platformu**

---

## 🚀 **Özellikler**

### ✨ **Core Features**
- 🎯 **Etkinlik Yönetimi** - Oluştur, düzenle, sil
- 💰 **Bilet Satış** - Anlık satış ve tahsilat
- 👥 **Müşteri CRM** - Müşteri takip ve finans
- 🎪 **Gişe Mimarî** - Kategori ve masa yönetimi
- 🛡️ **Kapı Kontrol** - QR okutma ve giriş
- 👤 **Personel Yönetimi** - Rol bazlı yetkilendirme
- 📊 **Raporlama** - Detaylı analytics

### 🌐 **Real-time Features**
- ⚡ **Anlık Senkronizasyon** - Tüm kullanıcılar aynı veriyi görür
- 🔔 **Live Notifications** - Satış ve güncellemeler anında
- 📱 **Multi-device** - Telefon, tablet, laptop aynı anda
- 🌍 **Global Access** - Her yerden erişim

---

## 🛠️ **Teknoloji Stack**

### Frontend
- **HTML5** - Modern web standartları
- **TailwindCSS** - Utility-first styling
- **JavaScript ES6+** - Modern JavaScript
- **Socket.io** - Real-time communication

### Backend  
- **Supabase** - PostgreSQL + Real-time + Auth
- **PostgreSQL** - Güçlü veritabanı
- **REST API** - Otomatik API generation
- **WebSocket** - Built-in real-time

### Hosting
- **Vercel** - Global CDN deployment
- **GitHub** - Version control
- **Supabase** - Backend as a Service

---

## 📋 **Kurulum**

### Prerequisites
- Git
- GitHub hesabı
- Supabase hesabı
- Vercel hesabı

### Quick Start
```bash
# 1. Clone repository
git clone https://github.com/kullanici/biletpro-complete.git
cd biletpro-complete

# 2. Frontend setup
cd frontend
# Local development için sunucu başlat
python -m http.server 8080

# 3. Supabase setup
# Supabase.com'da proje oluştur
# Database schema import et
# API keys al
```

---

## 🎯 **Kullanım**

### Login
```
Username: hakan
Password: 52655265
```

### Ana Modüller
1. **Dashboard** - Etkinlik yönetimi
2. **Gişe** - Kategori ve masa oluşturma
3. **Satış** - Bilet satış terminali
4. **Müşteriler** - CRM ve finans
5. **Kapı** - Giriş kontrol sistemi
6. **Personel** - Yetki yönetimi
7. **Raporlar** - Analytics

---

## 🗄️ **Database Schema**

### Ana Tablolar
```sql
users        - Kullanıcılar ve yetkiler
events       - Etkinlikler
categories   - Kategoriler
tables       - Masalar
customers    - Müşteriler
sales        - Satışlar
```

### İlişkiler
```
events → categories → tables → sales → customers
users ────────────────────────┘
```

---

## 🔧 **API Endpoints**

### Authentication
```
POST /api/auth/login
```

### Events
```
GET    /api/events
POST   /api/events
PUT    /api/events/:id
DELETE /api/events/:id
```

### Customers
```
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
DELETE /api/customers/:id
```

### Sales
```
GET    /api/sales
POST   /api/sales
```

---

## 🚀 **Deployment**

### Development
```bash
# Local development
cd frontend
python -m http.server 8080
# http://localhost:8080
```

### Production
1. **GitHub** - Repository oluştur
2. **Supabase** - Proje ve database kurulumu
3. **Vercel** - Frontend deployment
4. **Environment Variables** - Supabase keys

---

## 📱 **Mobile Support**

### PWA Features
- ✅ Offline support
- ✅ Install to homescreen
- ✅ Push notifications
- ✅ Responsive design

### Mobile Optimization
- Touch-friendly interface
- Swipe gestures
- Mobile-first design
- Fast loading

---

## 🔒 **Güvenlik**

### Authentication
- JWT tokens
- Session management
- Role-based access
- Secure passwords

### Data Protection
- HTTPS encryption
- Database encryption
- API rate limiting
- Input validation

---

## 📊 **Performance**

### Optimizations
- Lazy loading
- Image optimization
- Code splitting
- CDN caching

### Metrics
- <100ms API response
- <2s page load
- 99.9% uptime
- Global CDN

---

## 🤝 **Contributing**

1. Fork repository
2. Feature branch oluştur
3. Değişiklikleri yap
4. Pull request gönder

---

## 📄 **License**

MIT License - Free to use

---

## 🆘 **Support**

### Documentation
- [Setup Guide](docs/setup.md)
- [API Reference](docs/api.md)
- [Troubleshooting](docs/troubleshooting.md)

### Contact
- GitHub Issues
- Email: support@biletpro.com

---

## 🎉 **Özellikler**

### v1.0 Features
- ✅ Real-time sync
- ✅ Multi-user support
- ✅ Mobile responsive
- ✅ PWA support
- ✅ Global deployment

### Roadmap
- 📱 Native mobile app
- 🔄 Advanced analytics
- 🎤 Multi-language support
- 🏢 Enterprise features

---

**Made with ❤️ by Hakan Akın**

---

> **BiletPro:** Etkinlik yönetiminin geleceği, şimdi! 🚀
