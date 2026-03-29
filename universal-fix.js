// Universal Fix - Tüm sayfalar için
// localStorage'dan Supabase'e geçiş

// Global events loader
window.loadEventsFromSupabase = async function() {
    if (window.supabaseAPI) {
        try {
            await window.supabaseAPI.loadEvents();
        } catch (error) {
            console.error('Events load error:', error);
        }
    }
};

// Universal event getter
window.getCurrentEvent = function(eventId) {
    if (window.events) {
        return window.events.find(e => String(e.id) === String(eventId));
    }
    return null;
};

// Universal save function
window.saveToSupabase = async function(tableName, data) {
    if (window.supabaseAPI && window.supabaseAPI[tableName]) {
        return await window.supabaseAPI[tableName](data);
    }
    return null;
};

// Auto-fix for all pages
window.addEventListener('DOMContentLoaded', async () => {
    // Events yükle
    await window.loadEventsFromSupabase();
    
    // Toast ve confirm fonksiyonlarını tanımla (eğer yoksa)
    if (!window.showToast) {
        window.showToast = function(message, type = 'info') {
            console.log(`[${type.toUpperCase()}] ${message}`);
        };
    }
    
    if (!window.showConfirm) {
        window.showConfirm = function(title, message, onConfirm) {
            if (confirm(`${title}\n\n${message}`)) {
                onConfirm();
            }
        };
    }
});
