// Supabase Configuration - BiletPro
const SUPABASE_URL = 'https://cjnteltosbvlhpqdwqir.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HrOC9JpFETIsXGf_yptJhg_sKdWAzHe';

// Supabase client oluştur
const { createClient } = window.supabase;
const biletproSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global değişkenler
let currentUser = null;
let events = [];
let customers = [];
let sales = [];

// Authentication
async function login(username, password) {
    try {
        const { data, error } = await biletproSupabase
            .from('users')
            .select('*')
            .eq('username', username)
            .eq('password', password)
            .single();
        
        if (data) {
            currentUser = data;
            localStorage.setItem('user', JSON.stringify(data));
            showToast('Giriş başarılı!', 'success');
            return { user: data };
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        showToast('Kullanıcı adı veya şifre hatalı!', 'error');
        throw error;
    }
}

// Events API
async function loadEvents() {
    try {
        const { data, error } = await biletproSupabase
            .from('events')
            .select('*')
            .order('date', { ascending: false });
        
        if (error) throw error;
        // Global events değişkenini güncelle
        window.events = data;
        // render() fonksiyonunu çağır
        if (typeof window.render === 'function') {
            window.render();
        }
    } catch (error) {
        console.error('Events load error:', error);
        window.events = [];
        if (typeof window.render === 'function') {
            window.render();
        }
    }
}

async function saveEvent(eventData) {
    try {
        const { data, error } = await biletproSupabase
            .from('events')
            .insert(eventData)
            .select();
        
        if (error) throw error;
        showToast('Etkinlik kaydedildi!', 'success');
        return data[0];
    } catch (error) {
        showToast('Etkinlik kaydedilemedi!', 'error');
        throw error;
    }
}

// Customers API
async function loadCustomers() {
    try {
        const { data, error } = await biletproSupabase
            .from('customers')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        customers = data;
        return data;
    } catch (error) {
        console.error('Customers load error:', error);
        return [];
    }
}

async function saveCustomer(customerData) {
    try {
        const { data, error } = await biletproSupabase
            .from('customers')
            .insert(customerData)
            .select();
        
        if (error) throw error;
        showToast('Müşteri kaydedildi!', 'success');
        return data[0];
    } catch (error) {
        showToast('Müşteri kaydedilemedi!', 'error');
        throw error;
    }
}

// Sales API
async function loadSales() {
    try {
        const { data, error } = await biletproSupabase
            .from('sales')
            .select(`
                *,
                events:event_id(title),
                customers:customer_id(name),
                users:created_by(name)
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        sales = data;
        return data;
    } catch (error) {
        console.error('Sales load error:', error);
        return [];
    }
}

async function makeSale(saleData) {
    try {
        const { data, error } = await biletproSupabase
            .from('sales')
            .insert(saleData)
            .select();
        
        if (error) throw error;
        showToast('Satış başarılı!', 'success');
        return data[0];
    } catch (error) {
        showToast('Satış yapılamadı!', 'error');
        throw error;
    }
}

// Real-time Listeners
function setupRealtimeListeners() {
    // Events listener
    biletproSupabase
        .channel('events')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'events' },
            (payload) => {
                console.log('Event changed:', payload);
                loadEvents(); // Reload events
            }
        )
        .subscribe();

    // Sales listener
    biletproSupabase
        .channel('sales')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'sales' },
            (payload) => {
                console.log('Sale changed:', payload);
                loadSales(); // Reload sales
            }
        )
        .subscribe();

    // Customers listener
    biletproSupabase
        .channel('customers')
        .on('postgres_changes',
            { event: '*', schema: 'public', table: 'customers' },
            (payload) => {
                console.log('Customer changed:', payload);
                loadCustomers(); // Reload customers
            }
        )
        .subscribe();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
    
    // Setup real-time listeners
    setupRealtimeListeners();
    
    // Load initial data
    if (window.location.pathname !== '/login.html') {
        loadEvents();
        loadCustomers();
        loadSales();
    }
});

// Export for global use
window.supabaseAPI = {
    login,
    logout: () => {
        currentUser = null;
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    },
    loadEvents,
    saveEvent,
    loadCustomers,
    saveCustomer,
    loadSales,
    makeSale,
    getCurrentUser: () => currentUser
};
