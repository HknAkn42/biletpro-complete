/**
 * BiletPro | Crystal Silk Official Guard v18.2 (Premium UI + Müşteriler + BİLET SATIŞ)
 * MASTER ADMIN: Hakan | ŞİFRE: 52655265
 */

(function() {
    // 1. MASTER VERİ TANIMI
    const MASTER_USER = {
        name: "Hakan",
        username: "Hakan",
        password: "52655265",
        role: "admin",
        perms: { sales: true, reports: true, management: true }
    };

    // 2. OTURUM KONTROLÜ
    let session = JSON.parse(localStorage.getItem('BiletPro_Session'));
    const path = window.location.pathname;
    const currentPage = path.split("/").pop();

    if (!session && currentPage !== 'login.html' && currentPage !== '') {
        window.location.href = 'login.html';
        return;
    }

    // 3. PERSONEL VERİTABANINA HAKAN'I ÇAK
    let staffData = JSON.parse(localStorage.getItem('BiletPro_Staff')) || [];
    if (!staffData.find(s => s.username.toLowerCase() === MASTER_USER.username.toLowerCase())) {
        staffData.push(MASTER_USER);
        localStorage.setItem('BiletPro_Staff', JSON.stringify(staffData));
    }
})();

/* ==========================================
   GLOBAL UI: TOAST & CONFIRM (PREMIUM UYARILAR)
   ========================================== */
const uiStyles = document.createElement('style');
uiStyles.innerHTML = `
    /* Toast Bildirimleri (Sağ üstten kayarak gelir) */
    .toast-container { position: fixed; top: 30px; right: 30px; z-index: 9999999; display: flex; flex-direction: column; gap: 12px; pointer-events: none; }
    .toast-silk { 
        background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(226, 232, 240, 0.8); 
        padding: 16px 24px; border-radius: 20px; box-shadow: 0 15px 40px rgba(0,0,0,0.08); 
        display: flex; align-items: center; gap: 14px; transform: translateX(120%); opacity: 0; 
        transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); font-family: 'Plus Jakarta Sans', sans-serif;
    }
    .toast-silk.show { transform: translateX(0); opacity: 1; }
    .toast-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px; }
    .toast-success .toast-icon { background: #dcfce7; color: #16a34a; }
    .toast-error .toast-icon { background: #fee2e2; color: #ef4444; }
    .toast-info .toast-icon { background: #e0e7ff; color: #4f46e5; }
    .toast-text { font-size: 13px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;}

    /* Confirm Kutusu (Ekranın ortasında cam efektli) */
    .confirm-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.5); backdrop-filter: blur(10px); z-index: 9999999; display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; pointer-events: none; }
    .confirm-overlay.show { opacity: 1; pointer-events: all; }
    .confirm-box { background: #fff; border-radius: 36px; padding: 45px 35px; width: 100%; max-width: 400px; text-align: center; box-shadow: 0 30px 60px rgba(0,0,0,0.15); transform: scale(0.95); transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); font-family: 'Plus Jakarta Sans', sans-serif; }
    .confirm-overlay.show .confirm-box { transform: scale(1); }
    .confirm-icon { width: 65px; height: 65px; background: #fee2e2; color: #ef4444; border-radius: 22px; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 25px; font-weight: bold;}
    .confirm-title { font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 12px; text-transform: uppercase; tracking-tight; }
    .confirm-desc { font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 35px; line-height: 1.6; }
    .confirm-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
    .btn-c-cancel { padding: 16px; border-radius: 18px; background: #f1f5f9; color: #475569; font-weight: 800; font-size: 11px; text-transform: uppercase; border: none; cursor: pointer; transition: 0.2s; }
    .btn-c-cancel:hover { background: #e2e8f0; }
    .btn-c-confirm { padding: 16px; border-radius: 18px; background: #ef4444; color: #fff; font-weight: 800; font-size: 11px; text-transform: uppercase; border: none; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 25px rgba(239, 68, 68, 0.25); }
    .btn-c-confirm:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.4); }
`;
document.head.appendChild(uiStyles);

window.addEventListener('DOMContentLoaded', () => {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.id = 'globalToastContainer';
    document.body.appendChild(toastContainer);
});

// KULLANIM: showToast("İşlem Başarılı", "success") veya "error" / "info"
window.showToast = function(message, type = 'info') {
    const container = document.getElementById('globalToastContainer');
    if(!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-silk toast-${type}`;
    let iconHtml = 'i';
    if(type === 'success') iconHtml = '✓';
    if(type === 'error') iconHtml = '!';

    toast.innerHTML = `<div class="toast-icon">${iconHtml}</div><div class="toast-text">${message}</div>`;
    container.appendChild(toast);
    
    requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add('show')));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3500);
}

// KULLANIM: showConfirm("SİL?", "Emin misin?", () => { silme_kodları_buraya })
window.showConfirm = function(title, description, onConfirm) {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
        <div class="confirm-box">
            <div class="confirm-icon">!</div>
            <div class="confirm-title">${title}</div>
            <div class="confirm-desc">${description}</div>
            <div class="confirm-actions">
                <button class="btn-c-cancel" onclick="this.closest('.confirm-overlay').remove()">VAZGEÇ</button>
                <button class="btn-c-confirm" id="confirmBtnAction">ONAYLA VE SİL</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    
    requestAnimationFrame(() => overlay.classList.add('show'));

    document.getElementById('confirmBtnAction').onclick = () => {
        overlay.classList.remove('show');
        setTimeout(() => {
            overlay.remove();
            if(onConfirm) onConfirm();
        }, 300);
    };
}

// SYSTEM AUDIT LOG (GLOBAL)
window.writeAuditEvent = function(module, action, details) {
    const logs = JSON.parse(localStorage.getItem('BiletPro_AuditLogs') || '[]');
    const session = JSON.parse(localStorage.getItem('BiletPro_Session')) || { name: 'anon', role: 'guest', username: 'guest' };
    logs.unshift({
        time: new Date().toLocaleString('tr-TR'),
        actor: session.name,
        username: session.username,
        role: session.role,
        module: module,
        action: action,
        details: details
    });
    if(logs.length > 1000) logs.splice(1000);
    localStorage.setItem('BiletPro_AuditLogs', JSON.stringify(logs));
}

/* ==========================================
   SOL MENÜ ENJEKSİYONU (SQUEEZE YAPISI)
   ========================================== */
function injectMenu(active = 'dashboard', eventId = null) {
    const session = JSON.parse(localStorage.getItem('BiletPro_Session')) || { name: "Misafir", role: "user" };
    
    // Eğer kullanıcı giriş yapmamışsa, login sayfasına yönlendir
    if (!session.username || session.username === 'guest') {
        window.location.href = 'login.html';
        return;
    }
    
    const isAdmin = session.role === 'admin' || (session.username && session.username.toLowerCase() === 'hakan');

    const style = document.createElement('style');
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
        :root { --sb-c: 95px; --sb-e: 280px; --silk-accent: #2563eb; --silk-text: #0f172a; }
        html, body { height: 100%; margin: 0; padding: 0 !important; overflow: hidden; background: #f4f7fa; }

        /* ÖNEMLİ DEĞİŞİKLİK: flex-row body yapısında içerik alanı doğru genişliği alsın */
        body { display: flex !important; flex-direction: row !important; font-family: 'Plus Jakarta Sans', sans-serif !important; }

        /* Sidebar'ın yanındaki tüm doğrudan body çocukları (sidebar hariç) flex-1 olsun */
        body > *:not(.sidebar-silk) { flex: 1; min-width: 0; overflow: hidden; }

        .sidebar-silk { width: var(--sb-c); height: 100vh; background: rgba(255, 255, 255, 0.98); backdrop-filter: blur(40px); border-right: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; padding: 40px 0; z-index: 100000; transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1); flex-shrink: 0; overflow: hidden; position: relative; }
        .sidebar-silk.expanded { width: var(--sb-e); align-items: flex-start; }
        .menu-btn { position: absolute; top: 40px; width: 56px; height: 56px; border-radius: 18px; background: #fff; border: 1px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px; cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(0,0,0,0.05); z-index: 10; }
        .sidebar-silk.expanded .menu-btn { left: 20px; transform: none; }
        .sidebar-silk:not(.expanded) .menu-btn { left: 50%; transform: translateX(-50%); }
        .m-line { width: 22px; height: 2.5px; background: var(--silk-text); border-radius: 5px; transition: 0.3s; }
        .expanded .l1 { transform: translateY(7.5px) rotate(45deg); }
        .expanded .l2 { opacity: 0; }
        .expanded .l3 { transform: translateY(-7.5px) rotate(-45deg); }
        .nav-list { width: 100%; flex: 1; display: flex; flex-direction: column; padding-top: 80px; }
        .nav-link { width: 100%; display: flex; align-items: center; padding: 6px 35px; color: #64748b; text-decoration: none; transition: 0.2s; position: relative; white-space: nowrap; }
        .nav-link i { font-size: 20px; min-width: 22px; text-align: center; font-style: normal; }
        .nav-txt { font-size: 9px; font-weight: 800; text-transform: uppercase; margin-left: 18px; letter-spacing: 1.2px; color: var(--silk-text); opacity: 0; visibility: hidden; transition: 0.3s; }
        .expanded .nav-txt { opacity: 1; visibility: visible; }
        .nav-link.active { color: var(--silk-accent); background: rgba(37, 99, 235, 0.04); }
        .nav-link.active::before { content: ''; position: absolute; left: 0; top: 15%; bottom: 15%; width: 5px; background: var(--silk-accent); border-radius: 0 5px 5px 0; }
        main, .main-content { flex: 1; height: 100vh; overflow-y: auto; background: #f4f7fa; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); position: relative; }
        .u-sec { width: 100%; padding: 20px; border-top: 1px solid #e2e8f0; opacity: 0; visibility: hidden; transition: 0.3s; background: #f8fafc; }
        .expanded .u-sec { opacity: 1; visibility: visible; }
        .u-n { font-size: 12px; font-weight: 800; color: var(--silk-text); text-transform: uppercase; display: block; margin-bottom: 8px; }
        .out-btn { width: 100%; background: #fff; color: #ef4444; border: 1px solid #fee2e2; padding: 10px; border-radius: 14px; cursor: pointer; font-weight: 900; font-size: 9px; display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 8px; }
    `;
    document.head.appendChild(style);

    const eventParams = eventId ? `?id=${eventId}` : '';
    
    const menuItems = [
        { id: 'dashboard', label: 'DASHBOARD', icon: '📊', url: 'index.html', show: true },
        { id: 'gise', label: 'GİŞE & MİMARİ', icon: '🎫', url: `gise.html${eventParams}`, show: true },
        { id: 'satis', label: 'BİLET SATIŞ', icon: '💰', url: `satis.html${eventParams}`, show: true },
        { id: 'musteriler', label: 'MÜŞTERİLER', icon: '👥', url: `musteriler.html${eventParams}`, show: true },
        { id: 'checkin', label: 'KAPI KONTROL', icon: '🛡️', url: `checkin.html${eventParams}`, show: true },
        { id: 'personel', label: 'PERSONEL', icon: '🔑', url: 'personel.html', show: isAdmin },
        { id: 'report', label: 'RAPORLAR', icon: '📈', url: 'rapor.html', show: isAdmin }
    ];

    let html = `
        <nav class="sidebar-silk" id="proSidebar">
            <div class="menu-btn" onclick="toggleProSidebar()">
                <div class="m-line l1"></div><div class="m-line l2"></div><div class="m-line l3"></div>
            </div>
            <div class="nav-list">
                ${menuItems.filter(i => i.show).map(i => `
                    <a href="${i.url}" class="nav-link ${active === i.id ? 'active' : ''}">
                        <i>${i.icon}</i><span class="nav-txt">${i.label}</span>
                    </a>
                `).join('')}
            </div>
            <div class="u-sec">
                <span class="u-n">${session.name}</span>
                <button onclick="openGuide()" class="out-btn" style="background:#0f172a;color:#fff;"><i>📘</i> KILAVUZ</button>
                <button onclick="logout()" class="out-btn"><i>🚪</i> ÇIKIŞ</button>
            </div>
        </nav>
    `;
    document.body.insertAdjacentHTML('afterbegin', html);
    if(!document.getElementById('guideModal')) {
        const guideHtml = `
            <div id="guideModal" class="fixed inset-0 hidden z-[99999] bg-slate-900/70 flex items-center justify-center p-6">
                <div class="bg-white w-full max-w-2xl p-7 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh]">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-lg font-black uppercase">BiletPro Kullanım Kılavuzu</h2>
                        <button onclick="closeGuide()" class="text-xl font-black">&times;</button>
                    </div>
                    <ol class="pl-4 list-decimal text-xs text-slate-700 leading-6">
                        <li><strong>Dashboard</strong>: Etkinlik ekle, düzenle, sil, pasif/aktif geçiş yap.</li>
                        <li><strong>Gişe</strong>: Kategori ve masa üretimi, masayı sat veya iptal işlemleri.</li>
                        <li><strong>Satış</strong>: Müşteri seç, masa seç, indirim uygula (izin varsa), tahsilat kaydet.</li>
                        <li><strong>Kapı</strong>: QR okut ve "Kaç kişi giriyor?" sorusunu kullan. Borçlu geçiş için yetki gereklidir.</li>
                        <li><strong>Müşteriler</strong>: CRM verilerini izle; aynı numara + farklı isim ayrı müşteri olur.</li>
                        <li><strong>Personel</strong>: Yetki matrisi ataması (Satış, İndirim, İptal, Kapı, Tahsilat, Risk vb).</li>
                        <li><strong>Audit</strong>: Her işlem otomatik kaydedilir; açılan pencereden CSV indirilebilir.</li>
                        <li><strong>Çıkış</strong>: Güvenli oturum kapatma.</li>
                    </ol>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', guideHtml);
    }
}

window.openGuide = function() { const m = document.getElementById('guideModal'); if(m) m.classList.remove('hidden'); }
window.closeGuide = function() { const m = document.getElementById('guideModal'); if(m) m.classList.add('hidden'); }

window.toggleProSidebar = function() { document.getElementById('proSidebar').classList.toggle('expanded'); }

window.logout = function() {
    showConfirm("ÇIKIŞ YAPILIYOR", "Güvenli çıkış yapılsın mı?", () => {
        localStorage.removeItem('BiletPro_Session');
        window.location.href = 'login.html';
    });
}