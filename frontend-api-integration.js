// Frontend API Entegrasyonu - localStorage → API
// Bu kodu index.html'e ekleyin

// API Configuration
const API_URL = 'https://biletpro-backend.railway.app/api';

// Global variables
let events = [];
let currentUser = null;

// API Functions
async function apiCall(endpoint, method = 'GET', data = null) {
    const token = localStorage.getItem('token');
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication
async function login(username, password) {
    try {
        const result = await apiCall('/auth/login', 'POST', { username, password });
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        currentUser = result.user;
        return result;
    } catch (error) {
        throw error;
    }
}

// Events API
async function loadEvents() {
    try {
        events = await apiCall('/events');
        render();
    } catch (error) {
        console.error('Events load error:', error);
        events = [];
        render();
    }
}

async function saveEvent(eventData) {
    try {
        const newEvent = await apiCall('/events', 'POST', eventData);
        events.unshift(newEvent);
        render();
        showToast('Etkinlik başarıyla kaydedildi!', 'success');
        return newEvent;
    } catch (error) {
        showToast('Etkinlik kaydedilemedi!', 'error');
        throw error;
    }
}

// Update existing functions in index.html

// Replace localStorage initialization
// OLD: let events = JSON.parse(localStorage.getItem('EventPro_DB_Ultimate_Final')) || [];
// NEW: loadEvents() function will handle this

// Update saveEvent function
async function saveEvent() {
    const title = document.getElementById('evTitle').value; 
    if(!title) {
        showToast("Etkinlik Başlığı zorunludur!", "error");
        return;
    }
    
    const eventData = {
        title,
        company: document.getElementById('evCompany').value,
        venue: document.getElementById('evVenue').value,
        city: document.getElementById('evCity').value,
        date: document.getElementById('evDate').value,
        door_time: document.getElementById('evDoorTime').value,
        start_time: document.getElementById('evStartTime').value,
        cover: document.getElementById('evImg').value,
        logo: tempLogo
    };
    
    await saveEvent(eventData);
    closeModal();
}

// Update render function to work with API data
function render() {
    const container = document.getElementById('eventGrid'); 
    container.innerHTML = '';
    
    // Sort by date (newest first)
    const sortedEvents = [...events].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });

    sortedEvents.forEach(ev => {
        const cover = ev.cover || `https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop`;
        
        const isActive = ev.is_active !== false;
        const passiveClass = isActive ? "" : "is-passive";
        const badgeHtml = isActive 
            ? `<div class="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg z-20 tracking-widest">AKTİF</div>`
            : `<div class="absolute top-6 left-6 bg-slate-500 text-white px-4 py-2 rounded-xl font-black text-[10px] uppercase shadow-lg z-20 tracking-widest">PASİF</div>`;
        
        const btnStateClass = isActive ? "" : "btn-disabled";

        const card = document.createElement('div');
        card.className = `event-card animate-pop ${passiveClass}`;
        card.innerHTML = `
            <div class="h-[260px] relative overflow-hidden bg-slate-50">
                ${badgeHtml}
                <img src="${cover}" class="cover-img w-full h-full object-cover transition-all duration-500">
                <div class="logo-mühür">
                    <img src="${ev.logo || 'https://via.placeholder.com/150/f8fafc/94a3b8?text=LOGO'}" class="w-full h-full object-cover">
                </div>
                
                <div class="absolute top-6 right-6 flex gap-2 z-20">
                    <button onclick="toggleStatus('${ev.id}')" class="bg-white/90 px-4 py-2 rounded-xl ${isActive ? 'text-amber-500 hover:bg-amber-500' : 'text-green-600 hover:bg-green-500'} hover:text-white font-black text-[10px] uppercase shadow-lg transition-all">${isActive ? 'DURDUR' : 'BAŞLAT'}</button>
                    <button onclick="editEvent('${ev.id}')" class="bg-white/90 px-4 py-2 rounded-xl text-blue-600 font-black text-[10px] uppercase shadow-lg hover:bg-blue-600 hover:text-white transition-all">DÜZENLE</button>
                    <button onclick="deleteEvent('${ev.id}')" class="bg-white/90 px-4 py-2 rounded-xl text-red-500 font-black text-[10px] uppercase shadow-lg hover:bg-red-500 hover:text-white transition-all">SİL</button>
                </div>
            </div>
            
            <div class="p-[55px] px-[35px] pb-[35px] flex-1 flex flex-col relative z-20">
                <span class="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1 block">${ev.company || 'GENEL OPERASYON'}</span>
                <h2 class="text-3xl font-black text-slate-800 uppercase leading-[1.1] mb-5 tracking-tighter">${ev.title}</h2>
                
                <div class="grid grid-cols-2 gap-5 pt-6 border-t border-slate-100 mt-auto">
                    <div><span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">LOKASYON</span><p class="text-[12px] font-bold text-slate-700 truncate mt-1">📍 ${ev.venue || 'Belirsiz'}</p></div>
                    <div class="text-right"><span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">TARİH</span><p class="text-[13px] font-black text-slate-800 mt-1">${ev.date || '-'}</p></div>
                </div>
                
                <div class="flex gap-4 mt-5 p-5 bg-slate-50 rounded-[24px] border border-slate-100">
                    <div class="flex-1"><span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">KAPI AÇILIŞ</span><p class="text-[15px] font-black text-slate-800 italic mt-1">${ev.door_time || '--:--'}</p></div>
                    <div class="flex-1 border-l border-slate-200 pl-4"><span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">BAŞLAMA</span><p class="text-[15px] font-black text-slate-800 italic mt-1">${ev.start_time || '--:--'}</p></div>
                </div>
                
                <div class="grid grid-cols-3 gap-3 mt-8">
                    <button onclick="location.href='gise.html?id=${ev.id}'" class="py-4 bg-slate-100 text-slate-700 rounded-2xl font-black text-[9px] uppercase transition-all hover:bg-slate-200">MİMARİ</button>
                    <button onclick="location.href='satis.html?id=${ev.id}'" class="${btnStateClass} py-4 bg-slate-900 text-white rounded-2xl font-black text-[9px] uppercase shadow-xl hover:bg-blue-600 transition-all">SATIŞ</button>
                    <button onclick="location.href='checkin.html?id=${ev.id}'" class="${btnStateClass} py-4 bg-blue-500 text-white rounded-2xl font-black text-[9px] uppercase shadow-xl hover:bg-blue-600 transition-all">KAPI</button>
                </div>
            </div>`;
        container.appendChild(card);
    });
}

// Update login.html authentication
async function handleInitialLogin() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    
    try {
        await login(u, p);
        localStorage.setItem('BiletPro_LastUser', u);
        loginComplete({ name: 'Hakan', role: 'admin', username: u });
    } catch (error) {
        shakeTerminal();
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token && window.location.pathname !== '/login.html') {
        loadEvents();
    }
    
    // Replace original render call
    if (typeof render === 'function') {
        // render() is already defined above
    }
});
