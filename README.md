# Ticket-Booking-System
Ticket Booking System — Backend project created as part of an assignment for Unthinkable.  Includes user authentication (signup/login), booking management, and secure API endpoints  integrated with a database. Built to demonstrate backend design, API structuring, and  security best practices.


# 🎟️ Ticket Booking System

This project is a **backend ticket booking system** developed as part of an assignment for **Unthinkable**.  
It demonstrates backend design, authentication, and booking management using a structured database.

---

## 📌 Features
- **Authentication**
  - User signup with validation
  - Secure login with JWT/session-based authentication
  - Password hashing and reset functionality

- **Bookings**
  - Create, read, update, delete bookings
  - Associate bookings with authenticated users
  - Prevent double-booking conflicts
  - Booking status management (pending, confirmed, cancelled)

- **User Management**
  - Profile storage (name, email, phone, etc.)
  - Profile update functionality
  - Unique email constraint

- **API**
  - RESTful endpoints for all modules
  - Input validation and error handling
  - Consistent JSON responses

- **Security**
  - Authentication middleware for protected routes
  - Input sanitization
  - CORS configuration for frontend integration

---

## 🛠️ Tech Stack
- **Backend Framework:** Node.js + Express (or Flask/Django if applicable)
- **Database:** (Insert your DB here, e.g., MongoDB / PostgreSQL / MySQL)
- **Authentication:** JWT / Sessions
- **Other:** bcrypt for password hashing, dotenv for environment variables

---

## ⚙️ Setup Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/ticket-booking-system.git
   cd ticket-booking-system

2. Install dependencies:
   ```bash
   npm install
   
3. Configure environment variables in .env:
   ```Code
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASS=your_db_password
   JWT_SECRET=your_secret_key
   Run migrations or sync schema (if applicable).

4.Start the server:
  ```bash
  npm run dev
