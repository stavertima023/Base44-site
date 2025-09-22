import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  let databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    try {
      const envPath = path.resolve(__dirname, '../railway.env')
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8')
        const line = content.split(/\r?\n/).find(l => l.trim().startsWith('DATABASE_URL='))
        if (line) databaseUrl = line.replace('DATABASE_URL=', '').trim()
      }
    } catch {}
  }
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const pool = new pg.Pool({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes('proxy.rlwy.net') ? false : { rejectUnauthorized: false }
  })

  const client = await pool.connect()
  try {
    const q = `SELECT COUNT(*)::int AS cnt FROM products WHERE description ILIKE '%Official%Product%of%Glo%Gang%'`
    const r = await client.query(q)
    console.log('Remaining with phrase:', r.rows[0].cnt)
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})


