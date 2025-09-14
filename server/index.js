import express from 'express'
import cors from 'cors'
import pg from 'pg'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json())

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, '../dist')))

// API routes

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  console.error('DATABASE_URL is not set')
}

const pool = new Pool({ connectionString: databaseUrl, ssl: databaseUrl?.includes('proxy.rlwy.net') ? false : { rejectUnauthorized: false } })

app.get('/health', (_req, res) => res.json({ ok: true }))

// List orders
app.get('/orders', async (_req, res) => {
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

// Get order by id with items
app.get('/orders/:id', async (req, res) => {
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
app.patch('/orders/:id', async (req, res) => {
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

// Delete order
app.delete('/orders/:id', async (req, res) => {
  const { id } = req.params
  try {
    await pool.query('DELETE FROM orders WHERE id = $1', [id])
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to delete order' })
  }
})

// Catch all handler: send back React's index.html file for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const port = process.env.PORT || 8787
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})



