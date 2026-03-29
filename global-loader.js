// Global Supabase Loader - Tüm sayfalar için
window.BiletPro = {
    events: [],
    currentEvent: null,
    
    async init() {
        // Events yükle
        if (window.supabaseAPI) {
            try {
                await window.supabaseAPI.loadEvents();
            } catch (error) {
                console.error('Events load error:', error);
            }
        }
        
        // Current event'i ayarla
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        if (eventId && window.events) {
            this.currentEvent = window.events.find(e => String(e.id) === String(eventId));
        }
    },
    
    getEvent(id) {
        return window.events.find(e => String(e.id) === String(id));
    }
};

// Sayfa yüklendiğinde otomatik başlat
window.addEventListener('DOMContentLoaded', () => {
    window.BiletPro.init();
});
