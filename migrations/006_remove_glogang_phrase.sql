-- Remove specific phrase from all product descriptions
-- Idempotent: running multiple times is safe

UPDATE products
SET description = regexp_replace(COALESCE(description, ''), 'Official\s+Product\s+of\s+Glo\s+Gang\.?', '', 'gi')
WHERE description ILIKE '%Official%Product%of%Glo%Gang%';

-- Trim extra spaces that might result from removal
UPDATE products
SET description = trim(regexp_replace(description, '\s{2,}', ' ', 'g'))
WHERE description IS NOT NULL;

