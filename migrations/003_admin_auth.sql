-- Create admin user with hashed password
-- Password: admin123 (you can change this)
INSERT INTO admin_users (email, password_hash, role)
VALUES (
  'admin@base44.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin123
  'admin'
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role;

-- Clear existing products and orders for fresh start
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM customers;

-- Keep categories but clear them
DELETE FROM categories;
