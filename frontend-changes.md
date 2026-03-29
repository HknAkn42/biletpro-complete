# Frontend Changes for Real-time Sync

## 1. Replace localStorage with API calls

### Current (localStorage):
```javascript
// OLD WAY
let events = JSON.parse(localStorage.getItem('EventPro_DB_Ultimate_Final')) || [];

function saveEvent() {
    events.push(data);
    localStorage.setItem('EventPro_DB_Ultimate_Final', JSON.stringify(events));
    render();
}
```

### New (API + Real-time):
```javascript
// NEW WAY
let events = [];

async function loadEvents() {
    const response = await fetch('/api/events');
    events = await response.json();
    render();
}

async function saveEvent() {
    const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const newEvent = await response.json();
    events.push(newEvent);
    render();
}
```

## 2. Socket.io Integration

### Add to index.html:
```html
<script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
```

### Socket connection:
```javascript
const socket = io('http://localhost:3000');

// Listen for real-time updates
socket.on('event_update', (data) => {
    loadEvents(); // Refresh events list
});

socket.on('sales_update', (data) => {
    updateSalesStats(); // Update sales dashboard
});

socket.on('customer_update', (data) => {
    loadCustomers(); // Refresh customer list
});
```

## 3. Authentication Integration

### Login changes:
```javascript
async function handleInitialLogin() {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    });
    
    if (response.ok) {
        const { token, user } = await response.json();
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        shakeTerminal();
    }
}
```

## 4. Real-time UI Updates

### Event creation with broadcast:
```javascript
async function saveEvent() {
    const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
    });
    
    // Server will broadcast to all connected clients
    closeModal();
}
```

### Sales with instant sync:
```javascript
async function makeSale(customerId, eventId, amount) {
    const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ customer_id: customerId, event_id: eventId, amount })
    });
    
    // All users see this sale instantly
    showToast('Satış kaydedildi!', 'success');
}
```

## 5. File Upload Changes

### Current (base64 localStorage):
```javascript
function processFile(input) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => { 
        tempLogo = e.target.result; // Base64
    };
    reader.readAsDataURL(file);
}
```

### New (cloud upload):
```javascript
async function processFile(input) {
    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: formData
    });
    
    const { url } = await response.json();
    tempLogo = url; // Cloud URL
}
```
