/*
  Copy Glo Gang products from a source Railway Postgres to our site via Admin API.
  Usage (Windows PowerShell example):
    $env:SOURCE_DB_URL="postgresql://..."; $env:TARGET_API_BASE="https://base44-site-production.up.railway.app"; node scripts/migrate_glogang.js

  Required env:
    - SOURCE_DB_URL: Source Postgres (public/proxy URL is fine)
    - TARGET_API_BASE: Target site base URL (default http://localhost:8787)
    - ADMIN_EMAIL (default: admin@base44.com)
    - ADMIN_PASSWORD (default: admin123)
*/

import pg from "pg";

const { Pool } = pg;

const SOURCE_DB_URL = process.env.SOURCE_DB_URL;
const TARGET_API_BASE = process.env.TARGET_API_BASE || "http://localhost:8787";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@base44.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

if (!SOURCE_DB_URL) {
  console.error("SOURCE_DB_URL is required");
  process.exit(1);
}

function buildPgConfig(url) {
  return {
    connectionString: url,
    ssl: url.includes("proxy.rlwy.net") ? false : { rejectUnauthorized: false },
  };
}

async function loginAdmin() {
  const res = await fetch(`${TARGET_API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Admin login failed: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data.token;
}

async function getTargetCategories(token) {
  const res = await fetch(`${TARGET_API_BASE}/admin/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch target categories`);
  const cats = await res.json();
  const bySlug = new Map();
  const byNameLower = new Map();
  cats.forEach((c) => {
    bySlug.set(c.slug, c);
    byNameLower.set(String(c.name).toLowerCase(), c);
  });
  return { list: cats, bySlug, byNameLower };
}

function mapCategory(rawName, categories) {
  if (!rawName) return null;
  const name = String(rawName).toLowerCase();
  // direct matches
  if (categories.byNameLower.has(name)) return categories.byNameLower.get(name).id;
  // heuristics
  if (name.includes("tee") || name.includes("t-shirt") || name.includes("shirt")) return categories.bySlug.get("shirts")?.id || null;
  if (name.includes("hood") || name.includes("hoodie")) return categories.bySlug.get("hoodies")?.id || null;
  if (name.includes("bottom") || name.includes("pant") || name.includes("short") || name.includes("jean")) return categories.bySlug.get("bottoms")?.id || null;
  if (name.includes("women") || name.includes("woman") || name.includes("girl")) return categories.bySlug.get("womens")?.id || null;
  if (name.includes("sale")) return categories.bySlug.get("sale")?.id || null;
  if (name.includes("new")) return categories.bySlug.get("new")?.id || null;
  return null; // fall back to All (no category)
}

async function fetchExistingTitles() {
  try {
    const res = await fetch(`${TARGET_API_BASE}/api/products?sort=alpha`);
    if (!res.ok) return new Set();
    const list = await res.json();
    return new Set(list.map((p) => String(p.title).trim().toLowerCase()));
  } catch {
    return new Set();
  }
}

async function insertProduct(token, categories, product) {
  const payload = {
    title: product.title,
    description: product.description || "",
    price_rub: product.priceRub,
    is_active: true,
    category_id: product.categoryId || null,
    images: product.images || [],
    attributes: { sizes: ["XS", "S", "M", "L", "XL"] },
  };

  const res = await fetch(`${TARGET_API_BASE}/admin/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to insert product ${product.title}: ${res.status} ${txt}`);
  }
}

async function sourceHasTable(client, tableName) {
  const q = `select 1 from information_schema.tables where table_schema='public' and table_name=$1`;
  const r = await client.query(q, [tableName]);
  return r.rowCount > 0;
}

async function getColumns(client, tableName) {
  const q = `select column_name from information_schema.columns where table_schema='public' and table_name=$1`;
  const r = await client.query(q, [tableName]);
  return r.rows.map((x) => x.column_name);
}

async function getGloGangRows(client) {
  // Handle PascalCase Prisma-style tables
  if (await sourceHasTable(client, "Product") && await sourceHasTable(client, "Brand")) {
    const r = await client.query(
      `select p.*, b.name as brand_name, c.slug as category_slug, c.name as category_name
       from "Product" p
       left join "Brand" b on b.id = p."brandId"
       left join "Category" c on c.id = p."categoryId"
       where lower(b.name) like '%glo gang%' or lower(b.name) like '%glo%'`
    );
    if (r.rowCount) return { rows: r.rows, productsCols: [] };
  }

  // Lowercase fallback path retained
  if (await sourceHasTable(client, "products")) {
    const cols = await getColumns(client, "products");
    const colList = cols.join(", ");
    const r = await client.query(`select ${colList} from products where lower(brand) like '%glo%'`);
    if (r.rowCount) return { rows: r.rows, productsCols: cols };
  }

  throw new Error("Could not locate Glo Gang products in source database (checked Product/Brand and products tables).");
}

async function getProductImages(client, productId) {
  // Try ProductImage (Prisma-style)
  if (await sourceHasTable(client, "ProductImage")) {
    const cols = await getColumns(client, "ProductImage");
    if (cols.includes("productId") && cols.includes("url")) {
      const r = await client.query(`select url from "ProductImage" where "productId" = $1 order by coalesce(index,0) asc`, [productId]);
      return r.rows.map((x) => x.url).filter(Boolean);
    }
  }

  // Try product_images(product_id, url)
  if (await sourceHasTable(client, "product_images")) {
    const cols = await getColumns(client, "product_images");
    const pid = cols.includes("product_id") ? "product_id" : cols.includes("productId") ? "productId" : null;
    const urlCol = cols.includes("url") ? "url" : cols.includes("image_url") ? "image_url" : null;
    if (pid && urlCol) {
      const r = await client.query(`select ${urlCol} as url from product_images where ${pid} = $1 order by 1 asc`, [productId]);
      return r.rows.map((x) => x.url).filter(Boolean);
    }
  }
  return [];
}

function coercePriceRub(row) {
  const cand = row.price_rub ?? row.priceRub ?? row.price_rur ?? row.price_rubles ?? row.price_cents ?? row.price ?? null;
  if (cand == null) return 0;
  // If cents, convert
  if (String(cand).match(/^\d+$/) && Number(cand) > 10000) {
    return Math.round(Number(cand) / 100);
  }
  return Number(cand);
}

function pickTitle(row) {
  return String(row.title ?? row.name ?? row.product_name ?? "Untitled").trim();
}

function pickDescription(row) {
  return String(row.description ?? row.details ?? row.long_description ?? row.short_description ?? "").trim();
}

function pickCategoryName(row) {
  return (
    row.category_slug ?? row.category_name ?? row.category ?? row.category_title ?? row.collection ?? row.type ?? null
  );
}

async function run() {
  console.log("Connecting to source DB...");
  const sourcePool = new Pool(buildPgConfig(SOURCE_DB_URL));
  const client = await sourcePool.connect();
  try {
    const { rows } = await client.query("select version() as v");
    console.log("Source DB:", rows[0].v);

    const found = await getGloGangRows(client);
    console.log(`Found ${found.rows.length} candidate Glo Gang products`);

    const token = await loginAdmin();
    const categories = await getTargetCategories(token);
    const existingTitles = await fetchExistingTitles();

    let created = 0; let skipped = 0; let failed = 0;
    for (const row of found.rows) {
      const title = pickTitle(row);
      if (existingTitles.has(title.toLowerCase())) { skipped++; continue; }

      const desc = pickDescription(row);
      const priceRub = coercePriceRub(row);

      // images priority: row.image_url/main_image/images array -> product_images join
      let images = [];
      if (row.image_url) images.push(row.image_url);
      if (row.main_image && !images.length) images.push(row.main_image);
      if (Array.isArray(row.images) && row.images.length) images = row.images;
      if (!images.length && (row.id || row.product_id)) {
        const pid = row.id ?? row.product_id;
        try {
          const extra = await getProductImages(client, pid);
          if (extra.length) images = extra;
        } catch {}
      }

      const rawCategoryName = pickCategoryName(row);
      const categoryId = mapCategory(rawCategoryName, categories) || categories.bySlug.get("new")?.id || null;

      try {
        await insertProduct(token, categories, {
          title,
          description: desc,
          priceRub,
          images,
          categoryId,
        });
        created++;
        console.log(`✔ Created: ${title}`);
      } catch (e) {
        failed++;
        console.warn(`✖ Failed: ${title} → ${e.message}`);
      }
    }

    console.log(`Done. Created=${created}, Skipped=${skipped}, Failed=${failed}`);
  } finally {
    client.release();
    await sourcePool.end();
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});


