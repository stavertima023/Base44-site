import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Pool } = pg

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:FCDEa5F2eA2*BefF36GcB-Fc3*443cA4@crossover.proxy.rlwy.net:28601/railway'

console.log('Connecting to database...')
console.log('DATABASE_URL:', databaseUrl.replace(/:[^:@]+@/, ':****@'))

const pool = new Pool({ 
  connectionString: databaseUrl, 
  ssl: databaseUrl?.includes('proxy.rlwy.net') ? false : { rejectUnauthorized: false }
})

async function checkDatabase() {
  try {
    // Test connection
    const client = await pool.connect()
    console.log('✅ Database connection successful!')
    
    // Check admin user
    const { rows } = await client.query('SELECT * FROM admin_users WHERE email = $1', ['admin@base44.com'])
    
    if (rows.length > 0) {
      console.log('✅ Admin user exists:', rows[0].email)
      
      // Test password
      const validPassword = await bcrypt.compare('admin123', rows[0].password_hash)
      if (validPassword) {
        console.log('✅ Admin password is correct')
      } else {
        console.log('❌ Admin password is incorrect')
      }
    } else {
      console.log('❌ Admin user not found')
    }
    
    // Check categories
    const { rows: categories } = await client.query('SELECT COUNT(*) as count FROM categories')
    console.log(`📊 Categories: ${categories[0].count}`)
    
    // Check products
    const { rows: products } = await client.query('SELECT COUNT(*) as count FROM products')
    console.log(`📦 Products: ${products[0].count}`)
    
    client.release()
    await pool.end()
    
  } catch (error) {
    console.error('❌ Database error:', error.message)
    process.exit(1)
  }
}

checkDatabase()
