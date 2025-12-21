CREATE DATABASE IF NOT EXISTS bookvami;

use bookvami;

CREATE TABLE IF NOT EXISTS products (
    productId VARCHAR(36) PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    author VARCHAR(100) NOT NULL,
    imgurl VARCHAR(100),
    category_id INT(11),
    stars DECIMAL(2, 1),
    reviews INT(11),
    price DECIMAL(15, 2),
    isbestseller TINYINT(1) DEFAULT 0,
    publisheddate DATE,
    itemadded TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    quantity INT(11) DEFAULT 0
);

INSERT INTO
    products (
        productId,
        title,
        author,
        imgurl,
        category_id,
        stars,
        reviews,
        price,
        isbestseller,
        publisheddate,
        itemadded,
        quantity
    )
VALUES (
        'B003H4VYWY',
        'To Know as We Are Known: A Spirituality of Education',
        'Parker J. Palmer',
        'https://m.media-amazon.com/images/I/51r4WMJEuML._AC_UY218_.jpg',
        3,
        4.6,
        194,
        12.99,
        0,
        '2010-06-22',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        'B0C9S85WMF',
        'His Daddy Omega (Sweet Alps Mates Book 5)',
        'Raiven Matthews',
        'https://m.media-amazon.com/images/I/91X9ued9TTL._AC_UY218_.jpg',
        5,
        4.7,
        124,
        5.99,
        0,
        '1900-01-01',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        'B0BM51RQR8',
        'All the Skills: A Deck Building LitRPG: All the Skills Book 1',
        'Honour Rae',
        'https://m.media-amazon.com/images/I/91n8v-ror0L._AC_UY218_.jpg',
        5,
        4.8,
        6427,
        4.99,
        0,
        '1900-01-01',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        'B09M7PD26H',
        'The Big Keto Cookbook for Beginners: 1500 Recipes',
        'Rockridge Press',
        'https://m.media-amazon.com/images/I/91pBGuwpOHL._AC_UY218_.jpg',
        18,
        4.4,
        0,
        6.99,
        0,
        '2021-12-07',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        'B000Z7FHII',
        'First Test: Book 1 of the Protector of the Small Quartet',
        'Tamora Pierce',
        'https://m.media-amazon.com/images/I/91gwW55hOXL._AC_UY218_.jpg',
        25,
        4.7,
        0,
        0.00,
        0,
        '1900-01-01',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        'B00FJ6C3KK',
        'Connecting Chords with Linear Harmony (GUITARE)',
        'Hal Leonard',
        'https://m.media-amazon.com/images/I/91G071IfquL._AC_UY218_.jpg',
        1,
        4.6,
        175,
        19.25,
        0,
        '1996-05-01',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        '148470732X',
        'A Whole New World-A Twisted Tale',
        'Liz Braswell',
        'https://m.media-amazon.com/images/I/91lah7PcRGL._AC_UY218_.jpg',
        25,
        4.5,
        0,
        7.29,
        0,
        '2016-07-26',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        'B09KP4XWDW',
        'The Narrative Gym for Law: Introducing the ABT Framework for Persuasive Advocacy',
        'Randy Olson',
        'https://m.media-amazon.com/images/I/81emJJbNJeL._AC_UY218_.jpg',
        20,
        5.0,
        0,
        6.99,
        0,
        '2021-12-15',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        'B00VKI3TJ0',
        'Sovereignty: The Origin and Future of a Political and Legal Concept',
        'Dieter Grimm',
        'https://m.media-amazon.com/images/I/617TFsFlUbL._AC_UY218_.jpg',
        20,
        4.7,
        0,
        15.39,
        0,
        '1900-01-01',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    ),
    (
        'B09Q8DDC54',
        'A Contractor''s Guide to Planning  Scheduling  and Control',
        'Len Holm',
        'https://m.media-amazon.com/images/I/51gDUB4l6DL._AC_UY218_.jpg',
        11,
        5.0,
        0,
        79.00,
        0,
        '2022-01-10',
        '2025-08-04',
        FLOOR(1 + RAND() * 10)
    );

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    category_id INT(11) AUTO_INCREMENT PRIMARY KEY,
    categoryName VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO
    categories (category_id, categoryName)
VALUES (1, 'Arts & Photography'),
    (9, 'Biographies & Memoirs'),
    (17, 'Business & Money'),
    (25, 'Children''s eBooks'),
    (2, 'Comics'),
    (10, 'Computers & Technology'),
    (18, 'Cookbooks  Food & Wine'),
    (26, 'Crafts Hobbies & Home'),
    (3, 'Education & Teaching'),
    (
        11,
        'Engineering & Transportation'
    ),
    (19, 'Foreign Language'),
    (
        27,
        'Health  Fitness & Dieting'
    ),
    (4, 'History'),
    (12, 'Humor & Entertainment'),
    (20, 'Law'),
    (5, 'Literature & Fiction'),
    (13, 'Medical'),
    (
        21,
        'Mystery Thriller & Suspense'
    ),
    (29, 'Nonfiction'),
    (
        6,
        'Parenting & Relationships'
    ),
    (
        14,
        'Politics & Social Sciences'
    ),
    (22, 'Reference'),
    (30, 'Religion & Spirituality'),
    (7, 'Romance'),
    (15, 'Science & Math'),
    (
        23,
        'Science Fiction & Fantasy'
    ),
    (31, 'Self-Help'),
    (8, 'Sports & Outdoors'),
    (16, 'Teen & Young Adult'),
    (24, 'Travel');

--- USER--
CREATE TABLE IF NOT EXISTS users (
    customerId INT AUTO_INCREMENT UNIQUE,
    email VARCHAR(100) PRIMARY KEY,
    familyname VARCHAR(100) NULL,
    gender ENUM('male', 'female', 'other') NULL,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user'
);

--CARTS--
CREATE TABLE IF NOT EXISTS carts (
    cartId INT AUTO_INCREMENT PRIMARY KEY,
    customerId INT NOT NULL,
    status ENUM(
        'Active',
        'Completed',
        'Abandoned'
    ) NOT NULL DEFAULT 'Active',
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES users (customerId)
);

-- ALTER THE 'carts' TABLE

-- 1. Add the 'status'
ALTER TABLE carts
ADD COLUMN status ENUM(
    'Active',
    'Completed',
    'Abandoned'
) NOT NULL DEFAULT 'Active';

-- 2. Add 'createdAt' column to record when the cart was created.

ALTER TABLE carts
ADD COLUMN createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

---

-- 3. Add 'updatedAt' column to record the last modification time.
-- The ON UPDATE CURRENT_TIMESTAMP ensures the timestamp is updated automatically on modification.
ALTER TABLE carts
ADD COLUMN updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

---CART PRODUCT--

CREATE TABLE IF NOT EXISTS cart_products (
    cartId INT NOT NULL,
    productId VARCHAR(36) NOT NULL,
    quantity INT DEFAULT 1,

    PRIMARY KEY (cartId, productId),

    FOREIGN KEY (cartId) REFERENCES carts(cartId) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(productId)
);

RENAME TABLE cart_products TO product_carts;

---DEBUGGING

DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;

UPDATE carts SET status='Abandoned' WHERE cartId=3;

-- Drop the table if it already exists
DROP TABLE IF EXISTS product_carts;

-- Create the table with the correct name and columns
CREATE TABLE product_carts (
    cartId INT NOT NULL,
    productId VARCHAR(36) NOT NULL,
    qnty INT NOT NULL,  -- matches backend expectation

    PRIMARY KEY (cartId, productId),

    FOREIGN KEY (cartId) REFERENCES carts(cartId) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(productId)
);

UPDATE users
SET role = 'admin'
WHERE customerId = 2;
