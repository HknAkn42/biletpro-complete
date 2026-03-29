# BiletPro Backend Setup Plan

## 1. Node.js Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── salesController.js
│   │   └── customerController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Sale.js
│   │   └── Customer.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── events.js
│   │   ├── sales.js
│   │   └── customers.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── socket/
│   │   └── socketHandlers.js
│   └── app.js
├── package.json
└── .env
```

## 2. Database Schema (PostgreSQL)
```sql
-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Events Table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(100),
    venue VARCHAR(100),
    city VARCHAR(50),
    date DATE,
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sales Table
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id),
    customer_id INTEGER REFERENCES customers(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Customers Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    total_spent DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 3. Real-time Socket Events
```javascript
// Socket Events
socket.on('event_created', (data) => {
    socket.broadcast.emit('event_update', data);
});

socket.on('sale_made', (data) => {
    socket.broadcast.emit('sales_update', data);
});

socket.on('customer_added', (data) => {
    socket.broadcast.emit('customer_update', data);
});
```

## 4. API Endpoints
```
Authentication:
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout

Events:
GET /api/events
POST /api/events
PUT /api/events/:id
DELETE /api/events/:id

Sales:
GET /api/sales
POST /api/sales
GET /api/sales/stats

Customers:
GET /api/customers
POST /api/customers
PUT /api/customers/:id
```

## 5. Environment Variables
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/biletpro
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```
