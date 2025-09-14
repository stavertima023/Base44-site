-- Seed categories
INSERT INTO categories (id, slug, name)
VALUES
  (gen_random_uuid(), 'new', 'New Arrivals'),
  (gen_random_uuid(), 'shirts', 'Shirts'),
  (gen_random_uuid(), 'hoodies', 'Hoodies'),
  (gen_random_uuid(), 'bottoms', 'Bottoms'),
  (gen_random_uuid(), 'womens', 'Womens')
ON CONFLICT (slug) DO NOTHING;

-- Pick some category ids for reference
WITH c AS (
  SELECT slug, id FROM categories WHERE slug IN ('new','shirts','hoodies')
)
-- Seed products
INSERT INTO products (id, sku, title, description, price_cents, currency, stock, is_active, category_id, images, attributes)
VALUES
  (gen_random_uuid(), 'TEE-BLACK-001', 'Worldwide Tee Black/Blue', 'Comfort tee', 3500, 'USD', 25, TRUE, (SELECT id FROM c WHERE slug='shirts'),
   '["https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/902d7d645_Worldwide-Tee-BlackBlue-01.jpeg?quality=100&width=800"]'::jsonb,
   '{"size":["S","M","L","XL"],"color":"Black"}'::jsonb),
  (gen_random_uuid(), 'HOODIE-CRM-001', 'Cream Sage Hoodie', 'Soft hoodie', 6900, 'USD', 15, TRUE, (SELECT id FROM c WHERE slug='hoodies'),
   '["https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/657b5cb95_Cream-Sage-Hoodie-01.jpeg?quality=100&width=800"]'::jsonb,
   '{"size":["S","M","L"],"color":"Cream"}'::jsonb),
  (gen_random_uuid(), 'TEE-BLACK-002', 'Revenge Your Love Tee Black', 'Graphic tee', 4200, 'USD', 30, TRUE, (SELECT id FROM c WHERE slug='new'),
   '["https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68b6e81653b652782bf609ad/da9bda531_Revenge-Your-Love-Tee-Black-02.jpeg?quality=100&width=800"]'::jsonb,
   '{"size":["S","M","L","XL"],"color":"Black"}'::jsonb)
ON CONFLICT (sku) DO UPDATE SET
  title=EXCLUDED.title,
  description=EXCLUDED.description,
  price_cents=EXCLUDED.price_cents,
  currency=EXCLUDED.currency,
  stock=EXCLUDED.stock,
  is_active=EXCLUDED.is_active,
  images=EXCLUDED.images,
  attributes=EXCLUDED.attributes,
  category_id=EXCLUDED.category_id,
  updated_at=now();

-- Seed a demo customer
INSERT INTO customers (id, email, name, phone, address)
VALUES (
  gen_random_uuid(),
  'demo@example.com',
  'Demo Customer',
  '+1-555-0100',
  '{"line1":"123 Demo St","city":"Demo City","country":"US"}'::jsonb
)
ON CONFLICT (email) DO NOTHING;

-- Create a demo order with one item
WITH p AS (
  SELECT id, title, sku, price_cents FROM products WHERE sku='TEE-BLACK-001' LIMIT 1
), cust AS (
  SELECT id AS customer_id FROM customers WHERE email='demo@example.com' LIMIT 1
), new_order AS (
  INSERT INTO orders (id, customer_id, status, total_cents, currency, meta)
  SELECT gen_random_uuid(), cust.customer_id, 'paid', p.price_cents, 'USD', '{"note":"Test order"}'::jsonb
  FROM p, cust
  RETURNING id
)
INSERT INTO order_items (id, order_id, product_id, title, sku, quantity, unit_price_cents, currency, attributes)
SELECT gen_random_uuid(), new_order.id, p.id, p.title, p.sku, 1, p.price_cents, 'USD', '{}'::jsonb
FROM p, new_order
ON CONFLICT DO NOTHING;



