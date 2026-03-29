// BiletPro Ücretsiz Backend - Railway.app
// package.json oluşturduktan sonra çalıştır

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection (Railway otomatik sağlar)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/biletpro"
});

// Test endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'BiletPro API çalışıyor!' });
});

// Events API
app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  try {
    const { title, company, venue, city, date, door_time, start_time, cover, logo } = req.body;
    const result = await pool.query(
      'INSERT INTO events (title, company, venue, city, date, door_time, start_time, cover, logo, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true) RETURNING *',
      [title, company, venue, city, date, door_time, start_time, cover, logo]
    );
    
    // Real-time broadcast
    io.emit('event_created', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username=$1 AND password=$2', [username, password]);
    
    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.json({ 
        token: 'free-token-' + Date.now(),
        user: { id: user.id, name: user.name, role: user.role, username: user.username }
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customers API
app.get('/api/customers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const { name, phone, email, total_spent, debt_amount } = req.body;
        const result = await pool.query(
            'INSERT INTO customers (name, phone, email, total_spent, debt_amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, phone, email, total_spent || 0, debt_amount || 0]
        );
        io.emit('customer_created', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/customers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, phone, email, total_spent, debt_amount } = req.body;
        const result = await pool.query(
            'UPDATE customers SET name=$1, phone=$2, email=$3, total_spent=$4, debt_amount=$5 WHERE id=$6 RETURNING *',
            [name, phone, email, total_spent || 0, debt_amount || 0, id]
        );
        io.emit('customer_updated', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/customers/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query('DELETE FROM customers WHERE id=$1', [id]);
        io.emit('customer_deleted', { id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Staff API
app.get('/api/staff', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, name, role, created_at FROM users ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/staff', async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        const { rows } = await pool.query('SELECT * FROM users WHERE username=$1', [username]);
        if(rows.length>0) return res.status(409).json({ error: 'Kullanıcı adı zaten var'});

        const result = await pool.query(
            'INSERT INTO users (name, username, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, name, role, created_at',
            [name, username, password, role || 'user']
        );
        io.emit('staff_created', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/staff/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, username, password, role } = req.body;
        const existing = await pool.query('SELECT id FROM users WHERE username=$1 AND id<>$2', [username, id]);
        if(existing.rows.length > 0) return res.status(409).json({ error: 'Kullanıcı adı zaten var'});

        const fields = [name, username, role];
        let query = 'UPDATE users SET name=$1, username=$2, role=$3';
        let params = [name, username, role, id];
        if(password) { query += ', password=$4'; params = [name, username, role, password, id]; }
        query += ' WHERE id=$' + params.length + ' RETURNING id, username, name, role, created_at';
        const result = await pool.query(query, params);
        io.emit('staff_updated', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/staff/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await pool.query('DELETE FROM users WHERE id=$1', [id]);
        io.emit('staff_deleted', { id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sales API
app.get('/api/sales', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT s.*, e.title as event_title, c.name as customer_name, u.name as created_by_name 
            FROM sales s 
            LEFT JOIN events e ON s.event_id = e.id 
            LEFT JOIN customers c ON s.customer_id = c.id 
            LEFT JOIN users u ON s.created_by = u.id 
            ORDER BY s.created_at DESC
        `);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/sales', async (req, res) => {
    try {
        const { event_id, customer_id, table_id, amount, payment_method, is_debt, created_by } = req.body;
        const result = await pool.query(
            'INSERT INTO sales (event_id, customer_id, table_id, amount, payment_method, is_debt, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [event_id, customer_id, table_id, amount, payment_method, is_debt || false, created_by]
        );
        
        // Update customer total_spent
        if (customer_id) {
            await pool.query('UPDATE customers SET total_spent = total_spent + $1 WHERE id = $2', [amount, customer_id]);
        }
        
        io.emit('sale_created', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Categories API
app.get('/api/categories', async (req, res) => {
    try {
        const { event_id } = req.query;
        let query = 'SELECT * FROM categories';
        let params = [];
        
        if (event_id) {
            query += ' WHERE event_id = $1 ORDER BY name';
            params.push(event_id);
        } else {
            query += ' ORDER BY name';
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const { event_id, name, price, capacity } = req.body;
        const result = await pool.query(
            'INSERT INTO categories (event_id, name, price, capacity) VALUES ($1, $2, $3, $4) RETURNING *',
            [event_id, name, price, capacity]
        );
        io.emit('category_created', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tables API
app.get('/api/tables', async (req, res) => {
    try {
        const { category_id } = req.query;
        let query = `
            SELECT t.*, c.name as category_name, c.price as category_price 
            FROM tables t 
            LEFT JOIN categories c ON t.category_id = c.id
        `;
        let params = [];
        
        if (category_id) {
            query += ' WHERE t.category_id = $1 ORDER BY t.table_number';
            params.push(category_id);
        } else {
            query += ' ORDER BY t.table_number';
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tables', async (req, res) => {
    try {
        const { category_id, table_number, capacity, price } = req.body;
        const result = await pool.query(
            'INSERT INTO tables (category_id, table_number, capacity, price, is_sold) VALUES ($1, $2, $3, $4, false) RETURNING *',
            [category_id, table_number, capacity, price]
        );
        io.emit('table_created', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/tables/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { is_sold } = req.body;
        const result = await pool.query(
            'UPDATE tables SET is_sold = $1 WHERE id = $2 RETURNING *',
            [is_sold, id]
        );
        io.emit('table_updated', result.rows[0]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Socket.io real-time events
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join_room', (eventId) => {
    socket.join(eventId);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`BiletPro API running on port ${PORT}`);
});
