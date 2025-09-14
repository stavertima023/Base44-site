-- Seed fixed categories and clean mock remnants

-- Categories: New, Shirts, Hoodies, Bottoms, Womens, Sale
INSERT INTO categories (slug, name)
VALUES 
  ('new', 'New'),
  ('shirts', 'Shirts'),
  ('hoodies', 'Hoodies'),
  ('bottoms', 'Bottoms'),
  ('womens', 'Womens'),
  ('sale', 'Sale')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, updated_at = now();

-- Ensure all mock/local data removed
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
-- Optional: keep customers

-- Add sizes attribute default for future products
ALTER TABLE products 
  ALTER COLUMN attributes SET DEFAULT jsonb_build_object('sizes', array['XS','S','M','L','XL']);
