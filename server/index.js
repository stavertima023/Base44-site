import express from 'express'
import cors from 'cors'
import pg from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const { Pool } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')))

// JWT secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// API routes

const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not set')
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('POSTGRES')))
}

const pool = new Pool({ 
  connectionString: databaseUrl, 
  ssl: databaseUrl?.includes('proxy.rlwy.net') ? false : { rejectUnauthorized: false }
})

// Test database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

// Test connection on startup
pool.connect()
  .then(client => {
    console.log('✅ Database connected successfully')
    client.release()
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message)
  })

app.get('/health', (_req, res) => res.json({ ok: true }))

// List orders
app.get('/orders', authenticateToken, async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT o.*, c.email AS customer_email
      FROM orders o
      LEFT JOIN customers c ON c.id = o.customer_id
      ORDER BY o.created_at DESC
      LIMIT 100
    `)
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
})

// Get order by id with items (admin only)
app.get('/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' })
    const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id])
    res.json({ ...rows[0], items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch order' })
  }
})

// Create order
app.post('/orders', async (req, res) => {
  const { customer_email, items = [], currency = 'USD' } = req.body
  try {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      let customerId
      const { rows: cust } = await client.query('SELECT id FROM customers WHERE email=$1', [customer_email])
      if (cust.length) customerId = cust[0].id
      else {
        const { rows: inserted } = await client.query('INSERT INTO customers (email) VALUES ($1) RETURNING id', [customer_email])
        customerId = inserted[0].id
      }

      let total = 0
      for (const it of items) total += (it.unit_price_cents ?? 0) * (it.quantity ?? 1)
      const { rows: orderRows } = await client.query(
        'INSERT INTO orders (customer_id, status, total_cents, currency, meta) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [customerId, 'pending', total, currency, {}]
      )
      const orderId = orderRows[0].id

      for (const it of items) {
        await client.query(
          'INSERT INTO order_items (order_id, product_id, title, sku, quantity, unit_price_cents, currency, attributes) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
          [orderId, it.product_id ?? null, it.title, it.sku ?? null, it.quantity ?? 1, it.unit_price_cents ?? 0, currency, it.attributes ?? {}]
        )
      }

      await client.query('COMMIT')
      res.status(201).json({ id: orderId })
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create order' })
  }
})

// Update order status and meta
app.patch('/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { status, meta } = req.body
  try {
    await pool.query('UPDATE orders SET status = COALESCE($2,status), meta = COALESCE($3,meta), updated_at = now() WHERE id = $1', [id, status ?? null, meta ?? null])
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update order' })
  }
})

// Delete order (admin only)
app.delete('/orders/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id])
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete order' })
  }
})

// Admin authentication
app.post('/admin/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const { rows } = await pool.query('SELECT * FROM admin_users WHERE email = $1', [email])
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const admin = rows[0]
    const validPassword = await bcrypt.compare(password, admin.password_hash)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    res.json({ token, user: { id: admin.id, email: admin.email, role: admin.role } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Categories CRUD
app.get('/admin/categories', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM categories ORDER BY name')
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

app.post('/admin/categories', authenticateToken, async (req, res) => {
  const { slug, name } = req.body
  try {
    const { rows } = await pool.query(
      'INSERT INTO categories (slug, name) VALUES ($1, $2) RETURNING *',
      [slug, name]
    )
    res.status(201).json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create category' })
  }
})

app.put('/admin/categories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { slug, name } = req.body
  try {
    const { rows } = await pool.query(
      'UPDATE categories SET slug = $1, name = $2, updated_at = now() WHERE id = $3 RETURNING *',
      [slug, name, id]
    )
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update category' })
  }
})

app.delete('/admin/categories/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [id])
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

// Products CRUD
app.get('/admin/products', authenticateToken, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON c.id = p.category_id 
      ORDER BY p.created_at DESC
    `)
    res.json(rows)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

app.get('/admin/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id])
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' })
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

app.post('/admin/products', authenticateToken, async (req, res) => {
  const { sku, title, description, price_cents, currency, stock, is_active, category_id, images, attributes } = req.body
  try {
    const { rows } = await pool.query(`
      INSERT INTO products (sku, title, description, price_cents, currency, stock, is_active, category_id, images, attributes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [sku, title, description, price_cents, currency, stock, is_active, category_id, JSON.stringify(images), JSON.stringify(attributes)])
    res.status(201).json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create product' })
  }
})

app.put('/admin/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  const { sku, title, description, price_cents, currency, stock, is_active, category_id, images, attributes } = req.body
  try {
    const { rows } = await pool.query(`
      UPDATE products 
      SET sku = $1, title = $2, description = $3, price_cents = $4, currency = $5, 
          stock = $6, is_active = $7, category_id = $8, images = $9, attributes = $10, updated_at = now()
      WHERE id = $11
      RETURNING *
    `, [sku, title, description, price_cents, currency, stock, is_active, category_id, JSON.stringify(images), JSON.stringify(attributes), id])
    res.json(rows[0])
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update product' })
  }
})

app.delete('/admin/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id])
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const port = process.env.PORT || 8787
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${port}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    pool.end(() => {
      console.log('Database pool closed')
      process.exit(0)
    })
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    pool.end(() => {
      console.log('Database pool closed')
      process.exit(0)
    })
  })
})



