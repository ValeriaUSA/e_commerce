USE bookvami;

SELECT * from categories;

ALTER TABLE products 
ADD COLUMN category_name VARCHAR(100);

UPDATE products
SET category_name = CASE category_id
    WHEN 1 THEN 'Arts & Photography'
    WHEN 2 THEN 'Comics'
    WHEN 3 THEN 'Education & Teaching'
    WHEN 4 THEN 'History'
    WHEN 5 THEN 'Literature & Fiction'
    WHEN 6 THEN 'Parenting & Relationships'
    WHEN 7 THEN 'Romance'
    WHEN 8 THEN 'Sports & Outdoors'
    WHEN 9 THEN 'Biographies & Memoirs'
    WHEN 10 THEN 'Computers & Technology'
    WHEN 11 THEN 'Engineering & Transportation'
    WHEN 12 THEN 'Humor & Entertainment'
    WHEN 13 THEN 'Medical'
    WHEN 14 THEN 'Politics & Social Sciences'
    WHEN 15 THEN 'Science & Math'
    WHEN 16 THEN 'Teen & Young Adult'
    WHEN 17 THEN 'Business & Money'
    WHEN 18 THEN 'Cookbooks Food & Wine'
    WHEN 19 THEN 'Foreign Language'
    WHEN 20 THEN 'Law'
    WHEN 21 THEN 'Mystery Thriller & Suspense'
    WHEN 22 THEN 'Reference'
    WHEN 23 THEN 'Science Fiction & Fantasy'
    WHEN 24 THEN 'Travel'
    WHEN 25 THEN 'Children''s eBooks'
    WHEN 26 THEN 'Crafts Hobbies & Home'
    WHEN 27 THEN 'Health Fitness & Dieting'
    WHEN 29 THEN 'Nonfiction'
    WHEN 30 THEN 'Religion & Spirituality'
    WHEN 31 THEN 'Self-Help'
    ELSE 'Unknown'
END
WHERE category_id IS NOT NULL;



ALTER TABLE products
DROP COLUMN category_name;

-- adding qnty column

ALTER TABLE products 
ADD COLUMN quantity INT;

UPDATE products
SET quantity = FLOOR(1 + (RAND() * 101))
WHERE title IS NOT NULL;

-- ALTER THE 'carts' TABLE

-- 1. Add the 'status' 
ALTER TABLE carts
ADD COLUMN status ENUM('Active', 'Completed', 'Abandoned') NOT NULL DEFAULT 'Active';

-- 2. Add 'createdAt' column to record when the cart was created.

ALTER TABLE carts
ADD COLUMN createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

---

-- 3. Add 'updatedAt' column to record the last modification time.
-- The ON UPDATE CURRENT_TIMESTAMP ensures the timestamp is updated automatically on modification.
ALTER TABLE carts
ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

INSERT INTO product_carts (cartId, productId, qnty)
VALUES (2, 'B000FC1K34', 7)
