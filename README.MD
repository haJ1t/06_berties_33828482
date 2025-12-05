# 📚 Bertie's Books - Full Stack Bookstore Web Application

A complete Node.js + Express + MySQL web application developed for the Web Development coursework.  
The system implements full CRUD book management, a secure user registration & login system, audit logging, environment variable protection, and deployment using Forever.

---

# ✅ Table of Contents
1. [Project Overview](#project-overview)  
2. [Features](#features)  
3. [Technology Stack](#technology-stack)  
4. [Project Structure](#project-structure)  
5. [Installation & Setup](#installation--setup)  
6. [Database Setup](#database-setup)  
7. [User Authentication System](#user-authentication-system)  
8. [Audit Logging](#audit-logging)  
9. [Security with dotenv](#security-with-dotenv)  
10. [Default Login User (for marking)](#default-login-user-for-marking)  
11. [Deployment](#deployment)  
12. [Testing](#testing)  

---

# 🎯 Project Overview
**Bertie’s Books** is an online bookstore where users can:

- Browse books  
- Add new books  
- Search books (exact + partial match)  
- View bargain books (< £20)  
- Register an account  
- Log in securely using hashed passwords (bcrypt)  
- View login history in the Audit Log  
- Authenticate using a default user created for assessment  

This is the fully extended version of the coursework, implementing all tasks from A to D.

---

# ✨ Features

### 📘 **Books**
- List all books  
- Add books  
- Search books (SQL LIKE)  
- Bargain books page  
- Fully styled EJS views  

### 👤 **User System**
- User registration with hashed passwords  
- Secure login  
- Prevents login with incorrect credentials  
- Login success/fail audit logging  

### 📊 **Audit System**
- Stores every login attempt  
- Shows: username, status, timestamp  
- Accessible at  /users/audit

### 🔐 **Security Enhancements**
- MySQL credentials stored in `.env` file  
- Not included in GitHub (added to .gitignore)  
- Uses bcrypt with salt for password hashing  

### 🧪 **Includes Default Assessor Account**
Created automatically using `insert_test_data.sql`:username: gold
password: smiths
---

# 🛠️ Technology Stack

| Component | Technology |
|----------|------------|
| Backend | Node.js (Express.js) |
| Frontend | EJS templates, CSS |
| Database | MySQL (mysql2 driver) |
| Security | bcrypt, dotenv |
| Deployment | Forever on Ubuntu VM |
| Version Control | Git + GitHub |

---

# 📂 Project Structure
project/
│── index.js
│── db.js
│── package.json
│── .env
│── insert_test_data.sql
│
├── routes/
│   ├── main.js
│   ├── books.js
│   └── users.js
│
├── views/
│   ├── index.ejs
│   ├── about.ejs
│   ├── login.ejs
│   ├── register.ejs
│   ├── audit.ejs
│   ├── listusers.ejs
│   ├── addbook.ejs
│   ├── list.ejs
│   ├── search.ejs
│   └── searchresult.ejs
│
└── public/
└── main.css
---

# 🚀 Installation & Setup

## 1. Install dependencies
```bash
npm install
2. Create .env file
DB_HOST=localhost
DB_USER=berties_books_app
DB_PASSWORD=qwertyuiop
DB_NAME=berties_books

3. Run the SQL setup
mysql -u root -p < create_tables.sql
mysql -u root -p < insert_test_data.sql

4. Start the server
node index.js
Application runs at:http://localhost:8000

 Database Setup

✔ Tables included:
	•	users
	•	books
	•	audit_log

✔ Password hashing

All passwords are stored using bcrypt with saltRounds = 10.

⸻

🔐 User Authentication System

✔ Registration
	•	Saves username, first name, last name, email, hashed password
	•	Rejects missing fields
	•	Shows confirmation message

✔ Login
	•	Selects hashed password from DB
	•	Compares using:bcrypt.compare(password, hashedPassword)
    •	On success: friendly welcome
	•	On failure: warning message


    📊 Audit Logging

Every login attempt is logged:
Column
Description
username
typed username
status
success / fail
timestamp
auto-filled

Security With dotenv

Why?

Database credentials must not be visible in GitHub.

How it works:
	1.	Installed dependency:npm install dotenv
    2.	Added to index.js:require('dotenv').config();
    3.	Moved credentials to .env
	4.	.env added to .gitignore



     Testing Checklist

🔹 Books
	•	Add a book
	•	View book list
	•	Search:
	•	exact
	•	partial
	•	Bargain books (< £20)

🔹 Users
	•	Register new user
	•	Login with correct password
	•	Fail login intentionally

🔹 Audit
	•	Confirm login attempts appear in /users/audit

🔹 Default User
	•	Login using gold / smiths

🔐 Access Control & Protected Routes (Task 5)

As part of Lab 8 – Authorisation, I added access control using the redirectLogin middleware.
This middleware checks if a user session exists and redirects unauthenticated users to the login page.

//const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    next();
};//


Below is a summary of which routes are restricted and which remain publicly accessible.

⸻

✔ Protected Routes (Login Required)

🧑‍💼 Users
	•	/users/list
	•	/users/audit
	•	/logout

These routes contain sensitive information such as user details or audit logs, so they are only accessible to authenticated users.

⸻

📚 Books
	•	/books/list
	•	/books/addbook
	•	/books/bookadded

These pages allow management of the book database and therefore require the user to be logged in.

⸻

🌐 Public Routes (No Login Required)

🏠 Main
	•	/ (Home)
	•	/about

👤 Users
	•	/users/register
	•	/users/registered
	•	/users/login
	•	/users/loggedin

📚 Books
	•	/books/search
	•	/books/search-result
	•	/books/bargainbooks

These pages do not expose sensitive information and can safely be accessed without signing in.

⸻

🔍 Testing Notes

I tested the application both logged in and logged out:

When not logged in
	•	Attempting to visit any protected route correctly redirects to /users/login.
	•	Public pages load normally.

When logged in
	•	All protected pages are accessible.
	•	Session remains active until the user logs out.
	•	After logout, access to protected routes is removed again.

XSS Demonstration 

To demonstrate Cross-Site Scripting (XSS), I entered the following value into the First Name field on the registration page:
Henry <script>alert("Gotcha!")</script>

When I submitted the form, the following popup appeared in my browser:

Gotcha!

⚠ Why did this happen?

The vulnerability occurs because:
	1.	User input is not sanitised or escaped.
The <script> tag entered by the user is stored and processed without any filtering.
	2.	The unsanitised value is printed directly into the HTML response, for example:
	let resultMessage = 'Hello ' + req.body.first + ' you are registered!';
	3.	When the browser receives this HTML, it interprets the <script> tag as actual JavaScript:
	Hello Henry <script>alert("Gotcha!")</script>
	4.	The browser executes the script, causing the popup.
This proves the application is vulnerable to XSS attacks.

This vulnerability will later be fixed using proper sanitisation (e.g., express-validator, escape(), or DOM encoding).

!!!!VALIDATION!!!!

✔ Server-Side Validation 

I added validation checks using the express-validator module.
The following fields are validated on the registration form:
	•	Email → must be a valid email format
	•	Username → must be between 5–20 characters
	•	Password → minimum 8 characters to ensure stronger security
	•	First Name → cannot be empty
	•	Last Name → cannot be empty

If any validation fails, the registration page reloads and displays error messages.
This prevents invalid or incomplete form submissions.

I chose these validations because:
	•	Email format is frequently mistyped
	•	Username length prevents extremely short or long values
	•	Password length increases security
	•	First/Last name empty submissions cause poor data quality


!!!!SANITISATION!!!!

✔ Input Sanitisation & XSS Protection 

To protect against Cross-Site Scripting (XSS) attacks, I installed and enabled the express-sanitizer module:
const expressSanitizer = require('express-sanitizer');
app.use(expressSanitizer());

I then sanitised all user inputs on the registration form:

req.body.first = req.sanitize(req.body.first);
req.body.last = req.sanitize(req.body.last);
req.body.username = req.sanitize(req.body.username);
req.body.email = req.sanitize(req.body.email);
req.body.password = req.sanitize(req.body.password);

This removes dangerous code such as:
<script>alert("Gotcha!")</script>
Before sanitisation, the above payload caused a JavaScript popup (demonstrating XSS).
After sanitisation, the script tags are stripped and treated as harmless text.

I also sanitised additional form fields in the application where user input is saved:
	•	Registration page (all text fields)
	•	Login page (username)
	•	Book pages (book name, book price)

Fields that do NOT accept user input (e.g., dropdowns, static values) were not sanitised because they cannot contain injected code.


Bertie’s Books – API & Weather Features

This project extends the Bertie’s Books application by adding:
	•	A custom REST API that provides book data
	•	Search, price filtering, and sorting features (Part C extensions)
	•	A weather forecast page using the OpenWeatherMap API

📌 Weather Feature (Lab 9A)

Route:/weather

Description:

Displays current weather information for any city using the OpenWeatherMap API.

Features:
	•	User can enter a city name in a form
	•	Temperature, humidity, wind speed, “feels like” value displayed
	•	Weather icon shown visually
	•	Friendly error handling if city is not found

Example URL: http://localhost:8000/weather?city=London

📌 Books API

All API routes begin with:/api
### 1. Get all books
GET /api/books


 2. Search books
 Search by name : GET /api/books?search=keyword
 Example : /api/books?search=world


 3. Filter by price range
 GET /api/books?minprice=X&maxprice=Y
 /api/books?minprice=5&maxprice=15


 4. Sorting books

 By name : /api/books?sort=name
 By Price : /api/books?sort=price
 /api/books?minprice=0&maxprice=50&sort=price



 ✔️ Error Handling

The API returns meaningful messages if:
	•	A city is not found (weather endpoint)
	•	No books match search or filters
