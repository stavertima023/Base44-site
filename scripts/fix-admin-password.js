import pg from 'pg'
import bcrypt from 'bcryptjs'

const { Pool } = pg

const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:FCDEa5F2eA2*BefF36GcB-Fc3*443cA4@crossover.proxy.rlwy.net:28601/railway'

const pool = new Pool({ 
  connectionString: databaseUrl, 
  ssl: databaseUrl?.includes('proxy.rlwy.net') ? false : { rejectUnauthorized: false }
})

async function fixAdminPassword() {
  try {
    const client = await pool.connect()
    
    // Generate new password hash for 'admin123'
    const passwordHash = await bcrypt.hash('admin123', 10)
    
    // Update admin password
    const { rows } = await client.query(`
      UPDATE admin_users 
      SET password_hash = $1 
      WHERE email = 'admin@base44.com'
      RETURNING email
    `, [passwordHash])
    
    if (rows.length > 0) {
      console.log('✅ Admin password updated successfully!')
      console.log('Email: admin@base44.com')
      console.log('Password: admin123')
    } else {
      console.log('❌ Admin user not found')
    }
    
    client.release()
    await pool.end()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

fixAdminPassword()
