# 📚 Bertie's Books - Online Bookstore Web Application

A Node.js web application for managing and browsing an online bookstore, built with Express.js, MySQL, and EJS templating.

---

## 🎯 Project Overview

**Bertie's Books** is a full-stack web application that allows users to:
- Browse a collection of books
- Search for books by title (with advanced partial matching)
- Add new books to the database
- View bargain books priced under £20
- Update and delete book records

This project was developed as part of the **Web Development** module coursework.

---

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Templating Engine:** EJS (Embedded JavaScript)
- **Process Manager:** Forever (for deployment)
- **Version Control:** Git & GitHub

---

## 📂 Project Structure

06_berties_12345678/
│
├── index.js                 # Main application entry point
├── package.json             # Project dependencies
├── links.txt                # Deployment URL
│
├── routes/
│   ├── main.js              # Main routes (home, about)
│   └── books.js             # Book-related routes
│
├── views/
│   ├── index.ejs            # Homepage
│   ├── about.ejs            # About page
│   ├── list.ejs             # List all books
│   ├── addbook.ejs          # Add new book form
│   ├── bookadded.ejs        # Book added confirmation
│   ├── search.ejs           # Search form
│   ├── searchresult.ejs     # Search results
│   └── bargainbooks.ejs     # Bargain books page
│
└── create_db.sql            # Database schema

Copy

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/06_berties_12345678.git
cd 06_berties_12345678
Step 2: Install Dependencies
Copy
npm install
Step 3: Set Up the Database
Start MySQL server
Create the database and table:
Copy
mysql -u root -p < create_db.sql
Or manually:

Copy
CREATE DATABASE berties_books;
USE berties_books;

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO books (name, price) VALUES
('Database Systems', 45.00),
('Brighton Rock', 20.25),
('Brave New World', 18.50),
('Atlas of the World', 22.00);
Step 4: Configure Database Connection
Update database credentials in index.js:

Copy
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'berties_books'
});
Step 5: Run the Application
Copy
node index.js
The application will be available at: http://localhost:8000

### Available Routes
Route	Method	Description
/	GET	Homepage
/about	GET	About page
/books/list	GET	List all books
/books/addbook	GET	Add book form
/books/bookadded	POST	Process new book
/books/search	GET	Search form
/books/search-result	GET	Search results (advanced)
/books/bargainbooks	GET	Books under £20
✨ Key Features
1. Browse Books
View all books in the database with their names and prices in a formatted table.

2. Add New Books
Simple form to add new books to the database with validation.

3. Advanced Search
Basic Search: Exact match for book titles
Advanced Search: Partial matching using SQL LIKE operator
Example: Searching "World" returns "Brave New World" and "Atlas of the World"
4. Bargain Books
Automatically filters and displays books priced under £20.

5. Responsive Design
Clean, simple interface with easy navigation between pages.

###Deployment
Deploy with Forever (on VM)
Install Forever globally:
Copy
npm install -g forever
Start the application:
Copy
forever start index.js
Check running processes:
Copy
forever list
Stop the application:
Copy
forever stop index.js
📊 Database Schema
Books Table
Column	Type	Constraints
id	INT	PRIMARY KEY, AUTO_INCREMENT
name	VARCHAR(255)	NOT NULL
price	DECIMAL(10,2)	NOT NULL
🧪 Testing
Test Scenarios
Homepage: Navigate to http://localhost:8000/
View Books: Click "View all books" or go to /books/list
Add Book: Fill form at /books/addbook and submit
Search Books:
Search "Brighton Rock" (exact match)
Search "World" (partial match - should return multiple results)
Bargain Books: Visit /books/bargainbooks (shows books < £20)
