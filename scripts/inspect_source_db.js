import pg from "pg";

const { Pool } = pg;
const SOURCE_DB_URL = process.env.SOURCE_DB_URL;
if (!SOURCE_DB_URL) {
  console.error("Set SOURCE_DB_URL env var");
  process.exit(1);
}

const cfg = {
  connectionString: SOURCE_DB_URL,
  ssl: SOURCE_DB_URL.includes("proxy.rlwy.net") ? false : { rejectUnauthorized: false },
};

async function listTables(client) {
  const q = `select table_name from information_schema.tables where table_schema='public' order by table_name`;
  const r = await client.query(q);
  return r.rows.map((x) => x.table_name);
}

async function listColumns(client, table) {
  const q = `select column_name from information_schema.columns where table_schema='public' and table_name=$1 order by ordinal_position`;
  const r = await client.query(q, [table]);
  return r.rows.map((x) => x.column_name);
}

async function tryFindGlo(client, table, columns) {
  const textLike = columns.find((c) => ["title", "name", "product_name"].includes(c)) || null;
  const brandLike = columns.find((c) => ["brand", "brand_name"].includes(c)) || null;
  if (!textLike && !brandLike) return null;

  const where = [];
  if (textLike) where.push(`lower(${textLike}) like '%glo%'`);
  if (brandLike) where.push(`lower(${brandLike}) like '%glo%'`);
  const q = `select * from ${table} where ${where.join(" or ")} limit 5`;
  try {
    const r = await client.query(q);
    if (r.rowCount) return { table, columns, rows: r.rows };
  } catch {}
  return null;
}

async function main() {
  const pool = new Pool(cfg);
  const client = await pool.connect();
  try {
    const tables = await listTables(client);
    console.log("Tables:", tables.join(", "));
    const interesting = ["Product", "Brand", "Category", "ProductImage", "ProductVariant"];    
    for (const t of interesting) {
      if (!tables.includes(t)) continue;
      const cols = await listColumns(client, t);
      console.log(`\nColumns of ${t}:`, cols.join(", "));
      try {
        const sample = await client.query(`select * from "${t}" limit 3`);
        console.log(`Sample of ${t}:`);
        console.log(JSON.stringify(sample.rows, null, 2));
      } catch (e) {
        console.log(`Sample of ${t} failed:`, e.message);
      }
    }
    for (const t of tables) {
      const cols = await listColumns(client, t);
      const found = await tryFindGlo(client, t, cols);
      if (found) {
        console.log("\nFOUND in table:", found.table);
        console.log("Columns:", found.columns.join(", "));
        console.log("Sample rows:");
        console.log(JSON.stringify(found.rows, null, 2));
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


