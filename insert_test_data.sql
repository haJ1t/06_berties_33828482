-- --------------------------------------------------
-- INSERT TEST DATA FOR BERTIE'S BOOKS APPLICATION
-- --------------------------------------------------

USE berties_books;

-- Clean existing data (only for testing)
DELETE FROM audit_log;
DELETE FROM users;
DELETE FROM books;

-- --------------------------------------------------
-- Insert Sample Users
-- --------------------------------------------------

-- ADMIN TEST USER (Task 7 requirement)
INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES 
('gold', 'Gold', 'User', 'gold@example.com',
'$2b$10$2Uki5qBg3MQS1dCQGe96MeY0nGZrN1iJPoGmEdwXt0SuMfLj/N7Ne');
-- Password = smiths

-- Additional example users (optional)
INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES
('alice', 'Alice', 'Wonder', 'alice@example.com',
'$2b$10$sF9v4nWb8HPylrYuqmLmGOxTtHbjWjPmZcYsquDrsdCy7hlbBz2bW'); 
-- Password = test123

INSERT INTO users (username, first_name, last_name, email, hashedPassword)
VALUES
('bob', 'Bob', 'Builder', 'bob@example.com',
'$2b$10$mqqi3w7N5I9nZzGzLCLG0ewuHn1RnzWCYpzX9p15vLSkGdu9StD0G');
-- Password = builder


-- --------------------------------------------------
-- Insert Sample Books
-- --------------------------------------------------

INSERT INTO books (title, author, category, price)
VALUES 
('The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 10.99),
('To Kill a Mockingbird', 'Harper Lee', 'Classic', 8.99),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', 12.50),
('1984', 'George Orwell', 'Dystopian', 9.99),
('The Catcher in the Rye', 'J.D. Salinger', 'Classic', 7.50),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', 11.99),
('A Game of Thrones', 'George R.R. Martin', 'Fantasy', 14.50),
('The Alchemist', 'Paulo Coelho', 'Philosophy', 10.50);


-- --------------------------------------------------
-- Insert Sample Audit Log Data
-- --------------------------------------------------

INSERT INTO audit_log (username, status)
VALUES
('gold', 'success'),
('alice', 'fail'),
('bob', 'success'),
('gold', 'fail'),
('alice', 'success');

-- --------------------------------------------------
-- END OF TEST DATA
-- --------------------------------------------------