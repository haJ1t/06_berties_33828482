USE berties_books;

-- === CREATE TABLES SAFETY ===
DROP TABLE IF EXISTS audit_log;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    price DECIMAL(5,2)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    hashedPassword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    status VARCHAR(10),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === BOOKS TEST DATA ===
INSERT INTO books (name, price) VALUES
('Database Systems', 45.00),
('Brighton Rock', 20.25),
('Brave New World', 18.50),
('Atlas of the World', 22.00);

-- === DEFAULT GOLD USER ===
INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES (
    'gold',
    'Default',
    'User',
    'gold@example.com',
    '$2b$10$Ju1pBqVQqKqS1Ts6ZFOD9u7vAzl18fJl0qECIZT0z0Dg54I5s2Msy'
);