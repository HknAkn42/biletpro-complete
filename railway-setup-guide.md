# 🆓 Railway.app Ücretsiz Kurulum Rehberi

## 🚀 ADIM 1: Railway Hesabı Oluştur

1. [Railway.app](https://railway.app) adresine git
2. GitHub ile ücretsiz kayıt ol
3. **$5 kredi** otomatik yüklenir (ilk ay ücretsiz)

## 📁 ADIM 2: GitHub Repository

1. Yeni GitHub repo oluştur: `biletpro-backend`
2. Bu dosyaları repo'ya ekle:
   ```
   📄 package.json
   📄 free-backend-starter.js  
   📄 database-setup.sql
   ```

## 🚂 ADIM 3: Railway Projesi

1. Railway'de "New Project" → "Deploy from GitHub repo"
2. `biletpro-backend` repo'sunu seç
3. Otomatik deploy başlar

## 🗄️ ADIM 4: Database Kurulumu

1. Proje içinde "New" → "PostgreSQL"
2. Database oluşturulur
3. `database-setup.sql` dosyasını Railway'da çalıştır:
   - Database'e tıkla
   - "Query" tabına geç
   - SQL kodunu yapıştır
   - "Execute" de

## 🔧 ADIM 5: Environment Variables

Railway'de proje ayarlarına git:
```
NODE_ENV=production
PORT=3000
```

## ✅ ADIM 6: Test

Deploy tamamlandığında:
- URL'i kopyala: `https://biletpro-backend.railway.app`
- Test et: `https://biletpro-backend.railway.app/api/health`

## 📱 ADIM 7: Frontend Entegrasyonu

Frontend'de API URL'ini güncelle:
```javascript
// index.html içinde
const API_URL = 'https://biletpro-backend.railway.app/api';
```

## 💰 Maliyet
- **İlk ay:** ₺0 (ücretsiz kredi)
- **Sonraki aylar:** $5/ay (~₺170/ay)
- **Database:** Dahil
- **Bandwidth:** Dahil

## 🎯 Başarılı Test Sonucu
```json
{
  "status": "OK", 
  "message": "BiletPro API çalışıyor!"
}
```

Bu mesajı görüyorsanız backend hazır! 🎉
