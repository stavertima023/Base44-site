import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const { Client } = pg

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function run() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    console.error('DATABASE_URL is not set')
    process.exit(1)
  }

  const migrationsDir = path.resolve(__dirname, '../migrations')
  const files = fs.readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort()

  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } })
  await client.connect()

  try {
    await client.query('BEGIN')
    await client.query('CREATE TABLE IF NOT EXISTS _migrations (id serial PRIMARY KEY, name text UNIQUE NOT NULL, run_at timestamptz NOT NULL DEFAULT now())')

    const { rows } = await client.query('SELECT name FROM _migrations')
    const applied = new Set(rows.map((r) => r.name))

    for (const file of files) {
      if (applied.has(file)) continue
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
      console.log(`Applying migration: ${file}`)
      await client.query(sql)
      await client.query('INSERT INTO _migrations(name) VALUES($1)', [file])
    }

    await client.query('COMMIT')
    console.log('Migrations applied successfully')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('Migration failed:', err)
    process.exit(1)
  } finally {
    await client.end()
  }
}

run()



