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
