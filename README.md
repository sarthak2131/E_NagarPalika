# ई-Nagarpalika: User ID Creation & Authorization Portal

A fullstack web application for Nagar Nigam IT Department to manage user ID creation, authorization changes, and approval workflows. Built with React (Vite) frontend and Express/MongoDB backend.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [User Roles](#user-roles)
- [API Endpoints](#api-endpoints)
- [Sample Users](#sample-users)
- [License](#license)

---

## Features
- User ID creation and authorization change requests
- Multi-level approval workflow (IT Assistant → IT Officer → IT Head)
- Role-based dashboards for Employees and Officers
- Track application status by ticket number or email
- Email notifications for application submission and status updates
- Dark/light mode UI
- Secure authentication with JWT

---

## Tech Stack
- **Frontend:** React 19, Vite, TailwindCSS, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Other:** JWT, Nodemailer, ESLint, Helmet, CORS

---

## Project Structure
```
project-root/
  client/    # React frontend
  server/    # Express backend
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### 1. Clone the repository
```bash
git clone <repo-url>
cd project-root
```

### 2. Setup Backend
```bash
cd server
cp sample.env .env   # Fill in your MongoDB URI, SMTP credentials, etc.
npm install
npm run seed         # (Optional) Seed sample users
npm run dev          # Start backend (nodemon)
```

### 3. Setup Frontend
```bash
cd ../client
npm install
npm run dev          # Start frontend (Vite)
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:5000

---

## Environment Variables
Backend (`server/.env`):
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_password
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

---

## Usage
- **Employee:** Login, fill request form, track status
- **IT Assistant/Officer/Head:** Login, view dashboard, approve/reject requests
- **Anyone:** Track status by ticket number/email (no login required)

---

## User Roles
- **Employee:** Submit requests, view own requests
- **IT Assistant:** Approve/forward requests at first level
- **IT Officer:** Approve/forward requests at second level
- **IT Head:** Final approval

---

## API Endpoints (Backend)
- `POST   /api/auth/login`         – Login
- `GET    /api/auth/me`            – Get current user info
- `POST   /api/applications`       – Create new application (auth required)
- `GET    /api/applications`       – List applications (role-based, auth required)
- `GET    /api/applications/track` – Track application by ticket/email
- `PUT    /api/applications/:id`   – Approve/reject application (auth required)

---

